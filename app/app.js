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
    'features/sidebar/sidebarOptions',
    'features/sidebar/sidebarSearch',
    'features/sidebar/sidebarCollapse',
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
    sidbarCollapseComp,
    sidebarOptionsComp,
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
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/style.css');
    jsrender($);

    const { 
        setCookie,
        setDataToLocalApplication, 
        getDataToLocalApplication 
    } = functions;

    const { 
        ATTRIBUE_SIDEBAR_ROOM,
        BODY_BG_THEME,
        BODY_FZ,
        THEMES,
        FONTSIZES,
        TOKEN 
    } = constant;

    const { setGeneral, getGeneral, clear } = offlineData;
    let isRunFristTime = false;

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

    const onGetValidate = (res) => {
        setCookie(getDataToLocalApplication(TOKEN), 3650);

        // Store information of logging user
        GLOBAL.setInfomation({
            ...res.user,
            erp_url: res?.erp_url
        });

        // Store chat room list
        GLOBAL.setRoomsWithAdapter(res.chats);
        // Initialize sidebar DOM and register event
        sidebarProfileComp.onInit();
        sidebarRoomListComp.onInit();
        sidebarOptionsComp.onInit();
        sidebarSearchComp.onInit();
        sidbarCollapseComp.onInit();
        
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
        const roomInfo = res?.user_chat_info || {};

        GLOBAL.setRoomInfoWasEdited(roomInfo);
        GLOBAL.setBodyBgTheme(theme);
        GLOBAL.setBodyFontSize(fontsize);
        setDataToLocalApplication(BODY_BG_THEME, theme);
        setDataToLocalApplication(BODY_FZ, fontsize);

        onAssignAdvanceThemeBody();
    };

    const initInformationFromAPI = () => {
        // Get server version
        onGetVersion();

        // Get information about chat list and current user
        // Get information about the chat list what user changed (name, description).
        Promise.all([API.post('validate'), API.get('users/preferences')]).then(data => {
            onAssignDataToStore(data);
            onGetPrefrences(data[1]);
            onGetValidate(data[0]);
            // onSetUpWebSocket(data[0].data.user.id);
        });
    };

    const onInitGeneralEvents = () => {
        // copy input value
        $(document).on('click', '.input-only-view', (event) => {
            const $input = $(event.currentTarget).prev();

            $input.get(0).select();
            $input.get(0).setSelectionRange(0, 99999);
            document.execCommand('copy');
            ALERT.show('Link copied to clipboard', 'success');
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

        window.addEventListener('offline', () => {
            GLOBAL.setNetworkStatus(false);
        });

        window.addEventListener('online', () => {
            GLOBAL.setNetworkStatus(true);

            if (!isRunFristTime) {
                isRunFristTime = true;
                const id = GLOBAL.getCurrentRoomId();
                if (id) {
                    const $activeRoom = $(`[${ATTRIBUE_SIDEBAR_ROOM}="${id}"]`);
                    GLOBAL.setCurrentRoomId(null);
                    $activeRoom.click();
                    GLOBAL.setCurrentRoomId(id);
                }

                setTimeout(initInformationFromAPI, 1000); 
            }
        });
    };

    const onInit = async () => {
        $('.xm-page-loading').remove();
        languageComp.onInit();
        onRegisterSW();
        onInitGeneralEvents();
        onAssignAdvanceThemeBody();

        if (!window.navigator.onLine) {
            GLOBAL.setNetworkStatus(false);
        }

        const data = await getGeneral();

        if (data && data.length) {
            try {
                onGetPrefrences(data[1]);
                onGetValidate(data[0]);
            } catch (err) {
                console.log(err);
                clear();
            }
        }

        initInformationFromAPI();
    };
    
    onInit();
});
