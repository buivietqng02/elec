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
    const ob = {};
    const { setDataToLocalApplication, navigate, getFormData } = functions;
    const {
        TOKEN,
        SESSION_ID,
        USER_ID,
        ROUTE
    } = constant;
    let $loginForm;
    let $errMess;
    let $password;
    let $username;
    let $loader;
    let token;
    let loading;

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        loading = true;
        loading = true;
        $errMess.html('');
        $loader.show();
        const { password, login } = getFormData($loginForm);

        API.postForm('erp/login', `password=${password}&login=${login}&token=${token}`).then(res => {
            if (res?.token && res?.sessionId && res?.userId) {
                setDataToLocalApplication(SESSION_ID, res.sessionId);
                setDataToLocalApplication(USER_ID, res.userId);
                setDataToLocalApplication(TOKEN, res.token);
                navigate(ROUTE.index);
            }
        }).catch(err => {
            console.log(err);
            loading = false;
            $loader.hide();
            if (err?.response?.status === 401) {
                $password.val('');
                $username.val('');
                $username.focus();
                $errMess.html('Username or password is incorrect');
            }
        });
    };

    ob.onInit = (t) => {
        $loginForm = $('.erp-login-form');
        $username = $loginForm.find('[name=login]');
        $password = $loginForm.find('[name=password]');
        $errMess = $loginForm.find('.mess');
        $loader = $loginForm.find('.login__btn-submit .--spin');
        token = t;
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
