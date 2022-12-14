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
    // 'features/sidebar/sidebarLagBlaster',
    'features/sidebar/sidebarConference',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxInput',
    'features/chatbox/chatboxAttach',
    'features/chatbox/emoji',
    'features/chatbox/emojiCode',
    'features/chatbox/voiceChat',
    'features/modal/modalShowImageFull',
    'features/notification/notification',
    'features/modal/modalLogout',

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
    // sidebarLagBlasterComp,
    sidebarConferenceComp,
    chatboxTopbarComp,
    chatboxContentComp,
    chatboxInputComp,
    chatboxAttachComp,
    emojiComp,
    emojiCodeComp,
    voiceChatComp,
    modalShowImageFullComp,
    notificationComp,
    modalLogout
) => {
    const {
        setCookie,
        setDataToLocalApplication,
        getDataToLocalApplication
    } = functions;
    const {
        ATTRIBUE_SIDEBAR_ROOM,
        BASE_URL,
        BODY_BG_THEME,
        BODY_FZ,
        ENTER_KEY_PREFERENCE,
        THEMES,
        FONTSIZES,
        ENTER_KEY_PREFERENCES,
        ACCESS_TOKEN,
        USER_ID
    } = constant;
    const { setGeneral, getGeneral, clear } = offlineData;
    let isRunFristTime = false;
    let $notiBoard;
    let $sidebar;
    let $mainRight;
    let failCounter = 0;

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

    const onInitEventComponent = (route) => {
        setCookie(getDataToLocalApplication(ACCESS_TOKEN), 3650);

        // Initialize sidebar DOM and register event
        sidebarProfileComp.onInit();
        sidebarRoomListComp.onInit();
        sidebarOptionsComp.onInit();
        sidebarSearchComp.onInit();
        sidebarCollapseComp.onInit();
        sidebarLeftBarComp.onInit(route);

        // Lag Blaster Intergrate
        // sidebarLagBlasterComp.onInit();

        // Conference
        sidebarConferenceComp.onInit();

        // Initialize chatbox DOM and register event
        chatboxTopbarComp.onInit();
        chatboxContentComp.onInit();
        chatboxInputComp.onInit();
        chatboxAttachComp.onInit();
        emojiComp.onInit();
        emojiCodeComp.onInit();

        // Voice message
        voiceChatComp.onInit();
        // Initialize show image full modal
        modalShowImageFullComp.onInit();

        // Initialize realtime for getting messages
        syncComp.onInit();

        // Request permission for notification
        notificationComp.onInit();
    };

    const onGetVersion = () => {
        $.ajax({
            type: 'GET',
            url: `${BASE_URL}/version`,
            success: (res) => { GLOBAL.setVersion(res) }
        });
    };

    const onGetPrefrences = (res) => {
        const theme = res?.body_bg_theme || THEMES[0].name;
        const fontsize = res?.body_fz || FONTSIZES[2];
        const enterKeyPreference = res?.enter_key_preference || ENTER_KEY_PREFERENCES[0].value;
        const roomInfo = res?.user_chat_info || {};
        const favouritesRooms = res?.favourites_rooms || [];
        const manageLabels = res?.manage_labels;
        const DEFAULT_LABEL_LIST = GLOBAL.getDefaultLabelList();
        const defaultLabelMapping = GLOBAL.getDefaultLabelMapping();

        GLOBAL.setRoomInfoWasEdited(roomInfo);
        GLOBAL.setBodyBgTheme(theme);
        GLOBAL.setBodyFontSize(fontsize);
        GLOBAL.setEnterKeyPreference(enterKeyPreference);
        GLOBAL.setFavouritesRooms(favouritesRooms);

        if (manageLabels?.flagList && manageLabels?.labelMapping) {
            GLOBAL.setLabelsList(manageLabels?.flagList);
            GLOBAL.setDefaultLabelMapping(manageLabels?.labelMapping);

        } else {
            // If not have labels, set as default
            const manageLabels = {
                flagList: [...DEFAULT_LABEL_LIST],
                labelMapping: {...defaultLabelMapping}
            }

            API.put('users/preferences', { manage_labels: manageLabels }).then(() => {
                GLOBAL.setLabelsList(DEFAULT_LABEL_LIST);
                GLOBAL.setDefaultLabelMapping(defaultLabelMapping);
            }).catch(err => {
                console.log(err);
            });
        }

        setDataToLocalApplication(BODY_BG_THEME, theme);
        setDataToLocalApplication(BODY_FZ, fontsize);
        setDataToLocalApplication(ENTER_KEY_PREFERENCE, enterKeyPreference);
        onAssignAdvanceThemeBody();
    };

    const initInformationFromAPI = (route) => {
        const userId = functions.getDataToLocalApplication(USER_ID) || '';

        // Get server version
        onGetVersion();
        // Get information about chat list and current user
        // Get information about the chat list what user changed (name, description).
        Promise.all([API.get('chats'), API.get(`users/${userId}`), API.get('users/preferences')]).then(data => {
            // console.log(data);
            onAssignDataToStore(data);
            onGetPrefrences(data[2]);
            onGetRoomList(data[0]);
            onGetUserInfo(data[1]);
            onInitEventComponent(route);
            $notiBoard.removeClass('run');
            // onSetUpWebSocket(data[0].data.user.id);
            failCounter = 0;

        }).catch((err) => {
            console.log(err);
            if (err === 19940402) {
                if (failCounter > 2) {
                    modalLogout.onInit('Somethings went wrong!');
                    return
                };
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

                        setTimeout(() => initInformationFromAPI(route), 1000);
                    } else {
                        initInformationFromAPI(route);
                    }
                    failCounter++;
                }, 2500);
            }
        });
    }

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

        // Set view for mobile and desktop
        const widthBrowser = window.innerWidth;
        if (widthBrowser < 768) {
            $sidebar.removeClass('desktop');
            $mainRight.removeClass('desktop');
            $sidebar.addClass('mobile');
            $mainRight.addClass('mobile');
        } else {
            $sidebar.removeClass('mobile');
            $mainRight.removeClass('mobile');
            $sidebar.addClass('desktop');
            $mainRight.addClass('desktop');
        }
    };

    const onInit = async (route) => {
        failCounter = 0;
        isRunFristTime = false;
        $('.xm-page-loading').hide();
        $notiBoard = $('.notify-update-info');
        $sidebar = $('.sidebar');
        $mainRight = $('.main-right');
        $notiBoard.addClass('run');
        languageComp.onInit();
        syncComp.onInitAgain();
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
                // onInitEventComponent(route);
            } catch (err) {
                clear();
            }
        }

        initInformationFromAPI(route);
    };

    return {
        onInit
    };
});
