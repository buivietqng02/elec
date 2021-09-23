define([
    'axios',
    'shared/functions',
    'app/constant'
], (
    axios,
    functions,
    constant
) => {
    const ob = {};
    const { setDataToLocalApplication, navigate, getFormData } = functions;
    const {
        BASE_URL,
        ACCESS_TOKEN,
        REFRESH_TOKEN,
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

        axios.post(`${BASE_URL}/auth/login-erp`, `password=${password}&login=${login}&token=${token}`).then(res => {
            if (res) {
                setDataToLocalApplication(SESSION_ID, res.sessionId);
                setDataToLocalApplication(USER_ID, res.userId);
                setDataToLocalApplication(ACCESS_TOKEN, res.access_token);
                setDataToLocalApplication(REFRESH_TOKEN, res.refresh_token);
                navigate(ROUTE.index);
            }
        }).catch(err => {
            loading = false;
            $loader.hide();
            $password.val('');
            $username.val('');
            $username.focus();
            $errMess.html(err?.response?.data?.details || 'Something went wrong');
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
