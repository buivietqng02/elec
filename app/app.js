define([
    'shared/api',
    'shared/data',
    'shared/functions',
    'shared/alert',
    'shared/offlineData',
    'app/constant',
    'features/language/language',
    'features/sync/sync',
    'features/sidebar/sidebarProfile',
    'features/sidebar/sidebarRoomList',
    'features/sidebar/sidebarSearch',
    'features/sidebar/sidebarCollapse',
    'features/sidebar/sidebarOptions',
    'features/sidebar/sidebarLeftBar',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxInput',
    'features/chatbox/chatboxAttach',
    'features/chatbox/chatboxSearch',
    'features/chatbox/emoji',
    'features/modal/modalShowImageFull',
    'features/modal/modalUpdateVersion',
    'features/notification/notification'
], (
    API,
    GLOBAL,
    functions,
    ALERT,
    offlineData,
    constant,
    languageComp,
    syncComp,
    sidebarProfileComp,
    sidebarRoomListComp,
    sidebarSearchComp,
    sidebarCollapseComp,
    sidebarOptionsComp,
    sidebarLeftBarComp,
    chatboxTopbarComp,
    chatboxContentComp,
    chatboxInputComp,
    chatboxAttachComp,
    chatboxSearchComp,
    emojiComp,
    modalShowImageFullComp,
    modalUpdateVersionComp,
    notificationComp
) => {
    const { 
        setCookie,
        setDataToLocalApplication, 
        getDataToLocalApplication 
    } = functions;
    const { 
        ATTRIBUE_SIDEBAR_ROOM,
        BODY_BG_THEME,
        BODY_FZ,
        ENTER_KEY_PREFERENCE,
        THEMES,
        FONTSIZES,
        ENTER_KEY_PREFERENCES,
        TOKEN,
        USER_ID
    } = constant;
    const { setGeneral, getGeneral, clear } = offlineData;
    let isRunFristTime = false;
    let $notiBoard;

    // const onSetUpWebSocket = (userId) => {
    //     const client = new Stomp.Client({
    //         brokerURL: 'ws://xm.iptp.dev/xm/api/ws',
    //         connectHeaders: {
    //             userId
    //         },
    //         debug: (str) => {
    //             console.log(str);
    //         },
    //         reconnectDelay: 5000,
    //         heartbeatIncoming: 4000,
    //         heartbeatOutgoing: 4000
    //     });

    //     client.onConnect = function (frame) {
    //         console.log(frame);
    //         client.subscribe('/topic/2e4df4cd22dd', (mess) => {
    //             console.log(mess);
    //         }, {
    //             userId,
    //             chatId: '2e4df4cd22dd'
    //         });
    //     };

    //     client.onStompError = function (frame) {
    //         console.log(frame);
    //     };

    //     client.activate();
    // };

    const onAssignDataToStore = (data) => {
        setGeneral(data);
    };

    const onRegisterSW = () => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                modalUpdateVersionComp.onInit();
            });

            navigator.serviceWorker.register('sw.js').then(reg => {
                setInterval(() => {
                    reg.update();
                }, 100000);
            });
        }
    };

    const onAssignAdvanceThemeBody = () => {
        const body = $('body');
        const bodyBg = getDataToLocalApplication(BODY_BG_THEME) || THEMES[0].name;
        const bodySize = getDataToLocalApplication(BODY_FZ) || FONTSIZES[2];

        THEMES.forEach(theme => body.removeClass(theme.name));

        body.addClass(bodyBg);
        body.css('font-size', bodySize);
    };

    const onGetRoomList = (chats) => GLOBAL.setRoomsWithAdapter(chats);

    const onGetUserInfo = (obj) => GLOBAL.setInfomation(obj);

    const onInitEventComponent = () => {
        setCookie(getDataToLocalApplication(TOKEN), 3650);

        // Initialize sidebar DOM and register event
        sidebarProfileComp.onInit();
        sidebarRoomListComp.onInit();
        sidebarOptionsComp.onInit();
        sidebarSearchComp.onInit();
        sidebarCollapseComp.onInit();
        sidebarLeftBarComp.onInit();
        
        // Initialize chatbox DOM and register event
        chatboxTopbarComp.onInit();
        chatboxContentComp.onInit();
        chatboxInputComp.onInit();
        chatboxAttachComp.onInit();
        chatboxSearchComp.onInit();
        emojiComp.onInit();

        // Initialize show image full modal
        modalShowImageFullComp.onInit();

        // Initialize realtime for getting messages
        syncComp.onInit();

        // Request permission for notification
        notificationComp.onInit();
    };

    const onGetVersion = () => API.get('version').then(res => GLOBAL.setVersion(res));

    const onGetPrefrences = (res) => {
        const theme = res?.body_bg_theme || THEMES[0].name;
        const fontsize = res?.body_fz || FONTSIZES[2];
        const enterKeyPreference = res?.enter_key_preference || ENTER_KEY_PREFERENCES[0].value;
        const roomInfo = res?.user_chat_info || {};

        GLOBAL.setRoomInfoWasEdited(roomInfo);
        GLOBAL.setBodyBgTheme(theme);
        GLOBAL.setBodyFontSize(fontsize);
        GLOBAL.setEnterKeyPreference(enterKeyPreference);
        setDataToLocalApplication(BODY_BG_THEME, theme);
        setDataToLocalApplication(BODY_FZ, fontsize);
        setDataToLocalApplication(ENTER_KEY_PREFERENCE, enterKeyPreference);

        onAssignAdvanceThemeBody();
    };

    const initInformationFromAPI = () => {
        const userId = functions.getDataToLocalApplication(USER_ID) || '';

        // Get server version
        onGetVersion();
        // Get information about chat list and current user
        // Get information about the chat list what user changed (name, description).
        Promise.all([API.get('chats'), API.get(`users/${userId}`), API.get('users/preferences')]).then(data => {
            onAssignDataToStore(data);
            onGetPrefrences(data[2]);
            onGetRoomList(data[0]);
            onGetUserInfo(data[1]);
            onInitEventComponent();
            $notiBoard.removeClass('run');
            // onSetUpWebSocket(data[0].data.user.id);
        }).catch((err) => {
            if (err === 19940402) {
                setTimeout(() => {
                    if (!isRunFristTime && GLOBAL.getNetworkStatus()) {
                        isRunFristTime = true;
                        const id = GLOBAL.getCurrentRoomId();
                        if (id) {
                            const $activeRoom = $(`[${ATTRIBUE_SIDEBAR_ROOM}="${id}"]`);
                            GLOBAL.setCurrentRoomId(null);
                            $activeRoom.click();
                            GLOBAL.setCurrentRoomId(id);
                        }
        
                        setTimeout(initInformationFromAPI, 1000); 
                    } else {
                        initInformationFromAPI();
                    }
                }, 2500);
            }
        });
    };

    const onInitGeneralEvents = () => {
        // copy input value
        $(document).off('.appCopyEvent').on('click.appCopyEvent', '.input-only-view', (event) => {
            const $input = $(event.currentTarget).prev();

            $input.get(0).select();
            $input.get(0).setSelectionRange(0, 99999);
            document.execCommand('copy');
            ALERT.show(GLOBAL.getLangJson().COPIED_TO_CLIPBOARD, 'success');
            if (window.getSelection) {
                if (window.getSelection().empty) { 
                    // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) { 
                    // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) { 
                // IE?
                document.selection.empty();
            }
        });
    };

    const onInit = async () => {
        isRunFristTime = false;
        $('.xm-page-loading').hide();
        $notiBoard = $('.notify-update-info');
        $notiBoard.addClass('run');
        languageComp.onInit();
        syncComp.onInitAgain();
        onRegisterSW();
        onInitGeneralEvents();
        onAssignAdvanceThemeBody();

        if (!window.navigator.onLine) {
            GLOBAL.setNetworkStatus(false);
        }

        const data = await getGeneral();

        if (data && data.length && data.length === 3) {
            try {
                onGetPrefrences(data[2]);
                onGetRoomList(data[0]);
                onGetUserInfo(data[1]);
                onInitEventComponent();
            } catch (err) {
                console.log(err);
                clear();
            }
        }

        initInformationFromAPI();
    };
    
    return {
        onInit
    };
});
