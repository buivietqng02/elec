define([
    'app/constant',
    'shared/functions',
    'shared/data',
    'app/app',
    'app/login',
    'app/meeting',
    'shared/template'
], (
    constant,
    functions,
    GLOBAL,
    App,
    Login,
    Meeting,
    template
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

    const {
        TOKEN,
        SESSION_ID,
        USER_ID,
        ROUTE
    } = constant;
    const {
        getDataToLocalApplication,
        getRouter,
        navigate
    } = functions;
    const $wrapper = $('#xm-app');

    const isLogin = () => {
        const sessionId = getDataToLocalApplication(SESSION_ID) || '';
        const token = getDataToLocalApplication(TOKEN) || '';
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
            App.onInit();
        }
    });

    getRouter().on(ROUTE.meeting, () => {
        initAgain();
        $wrapper.html(template.meeting);
        Meeting.onInit();
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

    getRouter().resolve();
});
