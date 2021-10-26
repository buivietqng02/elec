define([
    'axios',
    'shared/functions',
    'app/constant',
    'features/login/loginERP',
    'features/login/loginLagblaster'
], (
    axios,
    functions,
    constant,
    loginERPComp,
    loginLagblasterComp
) => {
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
    let $passwordField;
    let $emailField;
    let $errMess;
    let $loader;
    let $loaderErp;
    let $loginERPForm;
    let $loginLBForm;
    let loading = false;
    const ob = {};

    const leaveERPLoginForm = () => ob.onInit();
    const leaveLBLoginForm = () => ob.onInit();

    // const checkLBAccountIsExist = (email) => {
    //     const data = new window.FormData();
    //     data.append('email', email);

    //     const config = {
    //         method: 'post',
    //         url: `${LAGBLASTER_API_BASE}action=p_advanced_user_register_check`,
    //         data
    //     };

    //     axios(config)
    //         .then((response) => {
    //             console.log(response);
    //             if (response.message === 'Email is already in use') {
    //                 setDataToLocalApplication(IS_REGISTERED_LB, 'true');
    //             } else {
    //                 setDataToLocalApplication(IS_REGISTERED_LB, 'false');
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             alert(error);
    //         });
    // };

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const { password, email } = getFormData($loginForm);
        loading = true;
        $errMess.html('');
        $loader.show();

        axios.post(`${BASE_URL}/auth/login`, `password=${password}&email=${email}`).then(res => {
            if (res) {
                // checkLBAccountIsExist(email);
                setDataToLocalApplication(SESSION_ID, res.sessionId);
                setDataToLocalApplication(USER_ID, res.userId);
                setDataToLocalApplication(ACCESS_TOKEN, res.access_token);
                setDataToLocalApplication(REFRESH_TOKEN, res.refresh_token);
                navigate(ROUTE.index);
            }
        }).catch((err) => {
            loading = false;
            $loader.hide();
            $passwordField.val('');
            $emailField.val('');
            $emailField.focus();
            $errMess.html(err?.response?.data?.details || 'Something went wrong');
        });
    };

    const loginERP = () => {
        if (loading) {
            return;
        }

        loading = true;
        $loaderErp.show();

        axios.get(`${BASE_URL}/erp/token`).then(token => {
            loading = false;
            $loginForm.hide();
            $loaderErp.hide();
            $loginERPForm.show();
            loginERPComp.onInit(token);
        }).catch(err => {
            console.log(err);
            ob.onInit();
        });
    };

    const loginLagblaster = () => {
        console.log('login with LB');
        $loginForm.hide();
        $loginERPForm.hide();
        $loginLBForm.show();

        loginLagblasterComp.onInit('token lagblaster test');
    };

    const loginGoogle = () => {
        const redirectUri = `${window.location.protocol}//${window.location.host}`;
        window.location.assign(`xm/oauth2/authorize/google?redirect_uri=${redirectUri}/oauth2`);
    };

    ob.onInit = () => {
        loading = false;
        $loginERPForm = $('.erp-login-form');
        $loginLBForm = $('.lagblaster-login-form');

        $loginForm = $('.js_login__form');
        $loginForm.off('submit').on('submit', onSubmit);

        $loginForm.find('.erp').off('.loginERP').on('click.loginERP', loginERP);
        $loginForm.find('.lagblaster').off('.loginLagblaster').on('click.loginLagblaster', loginLagblaster);
        $loginForm.find('.google').off('.loginGoogle').on('click.loginGoogle', loginGoogle);

        $loginERPForm.find('.erp-cancel-btn').off('.cancelERP').on('click.cancelERP', leaveERPLoginForm);
        $loginLBForm.find('.lagblaster-cancel-btn').off('.cancelLBlogin').on('click.cancelLBlogin', leaveLBLoginForm);

        $emailField = $loginForm.find('[name="email"]');
        $passwordField = $loginForm.find('[name="password"]');
        $errMess = $loginForm.find('.mess');
        $loader = $loginForm.find('.login__btn-submit .--spin');
        $loaderErp = $loginForm.find('.login-erp-btn .--spin');

        $passwordField.val('');
        $emailField.val('');
        $errMess.html('');
        $loader.hide();
        $loaderErp.hide();
        $loginERPForm.hide();
        $loginLBForm.hide();
        $loginForm.show();
    };

    return ob;
});
