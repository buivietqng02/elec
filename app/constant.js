define(['app/enviroment', 'app/webrtc'], (enviroment, webrtc) => {
    const obj = {
        API_URL: `${enviroment}/api`,
        SESSION_ID: 'sessionId',
        TOKEN: 'token',
        BODY_BG_THEME: 'body_bg_theme',
        BODY_FZ: 'body_fz',
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
        ATTRIBUTE_CHANGE_NAME: 'data-userid-name',
        ATTRIBUTE_CHANGE_IMAGE: 'data-userid-image',
        ATTRIBUTE_CHANGE_IMAGE_GROUP: 'data-roomid-image',
        ATTRIBUE_SIDEBAR_ROOM: 'data-room-id',
        ATTRIBUTE_LANGUAGE: 'data-language',
        WEBRTC_URL: webrtc,
        LANGUAGE_KEY: 'lang',
        LANGUAGES: {
            english: 'en',
            russian: 'ru',
            vietnamese: 'vi'
        }
    };

    return Object.freeze(obj);
});
