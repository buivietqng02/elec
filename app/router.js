define([
    'app/constant',
    'shared/functions',
    'shared/data',
    'shared/api',
    'app/app',
    'app/login',
    'app/meeting',
    'shared/template',
    'shared/registerSW',
    'features/login/signupForm'
], (
    constant,
    functions,
    GLOBAL,
    API,
    App,
    Login,
    Meeting,
    template,
    registerSW,
    signupFormComp
) => {
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/icon.css');
    require('assets/css/login.css');
    require('assets/css/meeting.css');
    require('assets/css/style.css');
    require('assets/css/index.less');
    jsrender($);

    // if (process.env.NODE_ENV === 'production') {
    if (window.location.hostname !== 'localhost') {
        registerSW.onInit();
    }
    // }

    const {
        ACCESS_TOKEN,
        REFRESH_TOKEN,
        SESSION_ID,
        USER_ID,
        ROUTE
    } = constant;
    const {
        getDataToLocalApplication,
        setDataToLocalApplication,
        getRouter,
        navigate
    } = functions;

    const $wrapper = $('#xm-app');

    const isLogin = () => {
        const sessionId = getDataToLocalApplication(SESSION_ID) || '';
        const token = getDataToLocalApplication(ACCESS_TOKEN) || '';
        const userId = getDataToLocalApplication(USER_ID) || '';

        return !!(sessionId && token && userId);
    };

    const initAgain = () => {
        GLOBAL.refresh();
        $('.modal').remove();
    };
    
    getRouter().on(ROUTE.index, () => {
        if (!isLogin()) {
            navigate(ROUTE.login);
        } else {
            initAgain();
            $wrapper.html(template.main);
            App.onInit(ROUTE.index);
        }
    });

    // Route for lag blaster
    getRouter().on(ROUTE.lagblaster, () => {
        // If login with LB credentail =>
        initAgain();
        $wrapper.html(template.main);
        App.onInit(ROUTE.lagblaster);
    });

    getRouter().on(ROUTE.meeting, () => {
        // initAgain();
        // $wrapper.html(template.meeting);
        // Meeting.onInit();
        if (!isLogin()) {
            navigate(ROUTE.login);
        } else {
            API.get('conference').then((res) => {
                const id = (+new Date()).toString(16).toUpperCase();
                const url = `${constant.ROUTE.meeting}/${id}?jwt=${res}`;
                window.location.replace(url);
            }).catch((err) => {
                console.log(err);
            });
        }
    });

    getRouter().on(ROUTE.login, () => {
        if (isLogin()) {
            navigate(ROUTE.index);
        } else {
            initAgain();
            $wrapper.html(template.login);
            Login.onInit();
        }
    });

    getRouter().on(ROUTE.signup, () => {
        if (isLogin()) {
            navigate(ROUTE.index);
        } else {
            const params = new URLSearchParams(window.location.search);
            const inviteKey = params.get('invite_key') || '';
            const email = params.get('email') || '';

            initAgain();
            $wrapper.html(template.signup);
            signupFormComp.onInit(inviteKey, email);
        }
    });

    getRouter().on(ROUTE.oauth2, () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token') || '';
        const sessionId = params.get('sessionId') || '';
        const userId = params.get('userId') || '';
        const refreshToken = params.get('refresh_token') || '';

        if (token && sessionId && userId && refreshToken) {
            setDataToLocalApplication(SESSION_ID, sessionId);
            setDataToLocalApplication(USER_ID, userId);
            setDataToLocalApplication(ACCESS_TOKEN, token);
            setDataToLocalApplication(REFRESH_TOKEN, refreshToken);

            navigate(ROUTE.index);
        } else {
            navigate(ROUTE.login);
        }
    });

    getRouter().resolve();
});
