define([
    'app/constant', 
    'shared/functions',
    'app/app',
    'app/login',
    'shared/template'
], (
    constant,
    functions,
    App,
    Login,
    template
) => {
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/login.css');
    require('assets/css/style.css');
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

    getRouter().on(ROUTE.index, () => {
        if (!isLogin()) {
            navigate(ROUTE.login);
        } else {
            $wrapper.html(template.main);
            App.onInit();
        }
    });

    getRouter().on(ROUTE.meeting, () => {
        console.log('meeting');
    });

    getRouter().on(ROUTE.login, () => {
        if (isLogin()) {
            navigate(ROUTE.index);
        } else {
            $wrapper.html(template.login);
            Login.onInit();
        }
    });

    getRouter().resolve();
});
