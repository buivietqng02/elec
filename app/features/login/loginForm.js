define([
    'shared/api',
    'shared/functions',
    'shared/data',
    'app/constant'
], (
    API,
    functions,
    GLOBAL,
    constant
) => {
    const { setDataToLocalApplication, navigate } = functions;
    const {
        TOKEN,
        SESSION_ID,
        USER_ID,
        ROUTE
    } = constant;
    let $loginForm;
    let $passwordField;
    let $emailField;
    let $errMess;
    let $loader;
    let loading = false;
    const ob = {};

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const { password, email } = functions.getFormData($loginForm);
        loading = true;
        $errMess.html('');
        $loader.show();

        API.postForm('login', `password=${password}&email=${email}`).then(res => {
            loading = false;
            $loader.hide();
            if (res?.data) {
                setDataToLocalApplication(SESSION_ID, res.data.sessionId);
                setDataToLocalApplication(USER_ID, res.data.userId);
                setDataToLocalApplication(TOKEN, res.data.token);
                navigate(ROUTE.index);
            }
        }).catch(() => {
            loading = false;
            $loader.hide();
            $passwordField.val('');
            $emailField.val('');
            $emailField.focus();
            $errMess.html(`
                <lang data-language="INCORRECT_EMAIL_OR_PASSWORD">${GLOBAL.getLangJson().INCORRECT_EMAIL_OR_PASSWORD}</lang>
            `);
        });
    };

    ob.onInit = () => {
        $loginForm = $('.js_login__form');
        $loginForm.off('submit').on('submit', onSubmit);
        $emailField = $loginForm.find('[name="email"]');
        $passwordField = $loginForm.find('[name="password"]');
        $errMess = $loginForm.find('.mess');
        $loader = $loginForm.find('.js-btn-spin .--spin');
    };
    
    return ob;
});
