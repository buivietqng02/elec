define([
    'idb-keyval',
    'shared/api',
    'shared/data',
    'shared/functions',
    'app/constant',
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
    'features/chatbox/emoji',
    'features/modal/modalShowImageFull',
    'features/notification/notification'
], (
    idbKeyval,
    API,
    GLOBAL,
    functions,
    constant,
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
    emojiComp,
    modalShowImageFullComp,
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

    const { set, get } = idbKeyval;

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
        set('general', data);
    };

    const onRegisterSW = () => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker.register('sw.js');
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
        if (res.status !== 0) {
            return;
        }

        setCookie(getDataToLocalApplication(TOKEN), 3650);

        // Store information of logging user
        GLOBAL.setInfomation({
            ...res.data.user,
            email: res?.data?.email,
            erp_url: res?.data?.erp_url
        });

        // Store chat room list
        GLOBAL.setRooms(res.data.chats);
        
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

    const onInitGeneralEvents = () => {
        // copy input value
        $(document).on('click', '.input-only-view', (event) => {
            const $input = $(event.currentTarget).prev();

            $input.get(0).select();
            $input.get(0).setSelectionRange(0, 99999);
            document.execCommand('copy');
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

        window.addEventListener('offline', () => GLOBAL.setNetworkStatus(false));

        window.addEventListener('online', () => {
            GLOBAL.setNetworkStatus(true);

            if (GLOBAL.getCurrentRoomId()) {
                const $activeRoom = $(`[${ATTRIBUE_SIDEBAR_ROOM}="${GLOBAL.getCurrentRoomId()}"]`);
                GLOBAL.setCurrentRoomId(null);
                $activeRoom.click();
            }

            setTimeout(() => {
                onGetVersion();

                // Get information about chat list and current user
                // Get information about the chat list what user changed (name, description).
                Promise.all([API.post('validate'), API.get('users/preferences')]).then(data => {
                    $('.xm-page-loading').remove();
                    onAssignDataToStore(data);
                    onGetPrefrences(data[1]);
                    onGetValidate(data[0]);
                    // onSetUpWebSocket(data[0].data.user.id);
                });
            }, 1000);
        });
    };

    const onInit = () => {
        onRegisterSW();
        onInitGeneralEvents();
        onAssignAdvanceThemeBody();

        if (!window.navigator.onLine) {
            GLOBAL.setNetworkStatus(false);
            get('general').then((data) => {
                $('.xm-page-loading').remove();
                onGetPrefrences(data[1]);
                onGetValidate(data[0]);
            });

            return;
        }

        // Get server version
        onGetVersion();

        // Get information about chat list and current user
        // Get information about the chat list what user changed (name, description).
        Promise.all([API.post('validate'), API.get('users/preferences')]).then(data => {
            $('.xm-page-loading').remove();
            onAssignDataToStore(data);
            onGetPrefrences(data[1]);
            onGetValidate(data[0]);
            // onSetUpWebSocket(data[0].data.user.id);
        });
    };
    
    onInit();
});
