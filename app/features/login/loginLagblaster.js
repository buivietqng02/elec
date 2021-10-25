define([

    'shared/functions'
], (
    functions
) => {
    const ob = {};
    const { getFormData } = functions;
    // const {
    //     BASE_URL,
    //     ACCESS_TOKEN,
    //     REFRESH_TOKEN,
    //     SESSION_ID,
    //     USER_ID,
    //     ROUTE
    // } = constant;
    let $loginForm;
    let $errMess;
    let $password;
    let $username;
    let $loader;
    let token;
    let loading = false;

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        loading = true;
        $errMess.html('');
        $loader.show();
        const { password, login } = getFormData($loginForm);
        console.log(password, login);
    };

    ob.onInit = (t) => {
        $loginForm = $('.lagblaster-login-form');
        $username = $loginForm.find('[name=login]');
        $password = $loginForm.find('[name=password]');
        $errMess = $loginForm.find('.mess');
        $loader = $loginForm.find('.login__btn-submit .--spin');
        token = t;
        console.log(token);
        loading = false;
        $loginForm.off('submit').on('submit', onSubmit);
        $loader.hide();
        $errMess.html('');
        $password.val('');
        $username.val('');
        $username.focus();
    };

    return ob;
});
