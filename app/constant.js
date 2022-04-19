define(['app/enviroment', 'app/webrtc'], (enviroment, webrtc) => {
    const obj = {
        BASE_URL: `${enviroment}`,
        API_URL: `${enviroment}/api`,
        LAGBLASTER_API_BASE: 'https://lagblaster.org/wp-admin/admin-ajax.php?',
        IS_REGISTERED_LB: 'is_registered_lagblaster',
        SESSION_ID: 'sessionId',
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        RANDOM_ID_REFRESH_TOKEN: 'random_id_refresh_token',
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
        ATTRIBUTE_INVITE_ID: 'data-invite-id',
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
            lagblaster: '/lagblaster',
            cart: '/cart',
            signup: '/signup'
        },
        FAVOURITES_ROOMS: 'favourites_rooms',
        LAST_SYNCED_AT: 'LAST_SYNCED_AT',
        PINNED_MESS_ID: 'pinned-message-id',
        PINNED_SEQUENCE: 'pinned-sequence',

        COLOR_NAME_GROUP: [
            {
                name: 'cl-violet',
            },
            {
                name: 'cl-brown',
            },
            {
                name: 'cl-blue',
            }, 
            {
                name: 'cl-green',
            }, 
            {
                name: 'cl-red',
            }, 
            {
                name: 'cl-yellow',
            },
            {
                name: 'cl-gray',
            },
            {
                name: 'cl-cyan',
            },
            {
                name: 'cl-cream',
            },
            {
                name: 'cl-min',
            },
            {
                name: 'cl-brick',
            },
            {
                name: 'cl-gold',
            },
            {
                name: 'cl-sea',
            },
            {
                name: 'cl-ice',
            },
            {
                name: 'cl-lime',
            }
        ],

        LABELS: {
           'color-1': '#ff0000',
           'color-2': '#ff9900',
           'color-3': '#3f70ff',
           'color-4': '#339933',
           'color-5': '#FFD93D',
           'color-6': '#cc33ff',
           'color-7': '#0099cc',
           'color-8': '#00ff00',
           'color-9': '#666699',
           'color-10': '#660033',
           'color-11': '#F55353',
           'color-12': '#247881',
           'color-13': '#F1DDBF',
           'color-14': '#9FC088',
           'color-15': '#06113C',
           'color-16': '#F900BF'
        },


        BM_CL_CODE: 'bm-cl-code',

        SEARCH_ALL_ROOM: 'SEARCH_ALL_ROOM',
    };

    return Object.freeze(obj);
});
