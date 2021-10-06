define(['app/enviroment', 'app/webrtc'], (enviroment, webrtc) => {
    const obj = {
        BASE_URL: `${enviroment}`,
        API_URL: `${enviroment}/api`,
        SESSION_ID: 'sessionId',
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER_ID: 'userId',
        BODY_BG_THEME: 'body_bg_theme',
        BODY_FZ: 'body_fz',
        ENTER_KEY_PREFERENCE: 'enter_key_preference',
        THEMES: [{
            name: 'body_theme_blue',
            color: '#3263d5'
        }, {
            name: 'body_theme_green',
            color: '#45d866'
        }, {
            name: 'body_theme_black',
            color: '#000'
        }, {
            name: 'body_theme_gray',
            color: '#808080'
        }],
        FONTSIZES: ['12px', '14px', '16px', '18px'],
        ENTER_KEY_PREFERENCES: [{
            name: 'Start a new line',
            value: 'new-line'
        }, {
            name: 'Send the message',
            value: 'send-msg'
        }],
        ATTRIBUTE_CHANGE_NAME: 'data-userid-name',
        ATTRIBUTE_CHANGE_GROUP_NAME: 'data-groupid-name',
        ATTRIBUTE_CHANGE_IMAGE: 'data-userid-image',
        ATTRIBUTE_CHANGE_IMAGE_GROUP: 'data-roomid-image',
        ATTRIBUTE_SIDEBAR_ROOM: 'data-room-id',
        ATTRIBUTE_MESSAGE_ID: 'data-chat-id',
        ATTRIBUTE_LANGUAGE: 'data-language',
        WEBRTC_URL: webrtc,
        LANGUAGE_KEY: 'lang',
        LANGUAGES: {
            english: 'en',
            russian: 'ru',
            vietnamese: 'vi',
            spanish: 'es',
            chinese_simplified: 'zh-cn',
            chinese_traditional: 'zh-tw',
            japanese: 'ja',
            portuguese: 'pt'
        },
        ROUTE: {
            login: '/login',
            meeting: '/meeting',
            index: '/',
            oauth2: '/oauth2',
            signup: '/signup'
        }
    };

    return Object.freeze(obj);
});
