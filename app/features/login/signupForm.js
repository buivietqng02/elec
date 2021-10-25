define([
    'axios',
    'shared/functions',
    'app/constant',
    'features/language/language',
    'features/modal/modalChangeLanguage'
], (
    axios,
    functions,
    constant,
    languageComp,
    modalChangeLanguageComp
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
    let $registerForm;
    let $errMess;
    let $loader;
    let $formItem;
    let loading = false;
    let stage = 1;
    let inviteKey;
    let invitedEmail;
    let $emailInput;
    const ob = {};

    const validate = (params) => {
        const {
            email,
            name,
            password,
            password2,
            code
        } = params;

        if (!name) {
            $errMess.html('Name is required');
            return false;
        }

        if (name.length < 3 || name.length > 32) {
            $errMess.html('Name must be between 3 and 32 characters in length');
            return false;
        }

        if (!email) {
            $errMess.html('Email is required');
            return false;
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase())) {
            $errMess.html('Email is invalid');
            return false;
        }

        if (!password) {
            $errMess.html('Password is required');
            return false;
        }

        if (password.length < 8) {
            $errMess.html('Password must be at least 8 characters in length');
            return false;
        }

        if (password !== password2) {
            $errMess.html('Password and Confirm Password does not match');
            return false;
        }

        if (stage === 2 && !code) {
            $errMess.html('Code is required');
            return false;
        }

        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const params = getFormData($registerForm);
        const {
            email,
            name,
            password,
            password2
        } = params;

        if (!validate(params)) {
            return;
        }

        loading = true;
        $errMess.html('');
        $loader.show();

        if (stage === 2) {
            axios.post(`${BASE_URL}/signup${inviteKey ? `?invite=${inviteKey}` : ''}`, params).then((res) => {
                if (res) {
                    setDataToLocalApplication(SESSION_ID, res.sessionId);
                    setDataToLocalApplication(USER_ID, res.userId);
                    setDataToLocalApplication(ACCESS_TOKEN, res.access_token);
                    setDataToLocalApplication(REFRESH_TOKEN, res.refresh_token);
                    navigate(ROUTE.index);
                }
            }).catch(err => {
                $errMess.html(err?.response?.data?.details || 'Invalid registration code');
                $loader.hide();
                loading = false;
            });

            return;
        }

        axios.post(`${BASE_URL}/signup/validate-email`, `password=${password}&email=${email}&name=${name}&password2=${password2}`).then(() => {
            stage = 2;
            loading = false;
            $loader.hide();
            $errMess.html(`Please enter code we sent to email ${email}`);
            $formItem.each(i => {
                if (i !== 4) {
                    $formItem.eq(i).hide();
                } else {
                    $formItem.eq(i).show();
                }
            });
        }).catch((err) => {
            $errMess.html(err?.response?.data?.details || 'Something went wrong');
            loading = false;
            $loader.hide();
        });
    };

    ob.onInit = (inviteKeyParam, emailParam) => {
        inviteKey = inviteKeyParam;
        invitedEmail = emailParam;
        languageComp.onInit();
        $('.xm-page-loading').hide();
        $('#change-lang-btn').click(modalChangeLanguageComp.onInit);
        loading = false;
        stage = 1;
        $registerForm = $('.js_register__form');
        $registerForm.off('submit').on('submit', onSubmit);
        $errMess = $registerForm.find('.mess');
        $loader = $registerForm.find('.js-btn-spin .--spin');
        $formItem = $registerForm.find('.form__line');
        $emailInput = $registerForm.find("[name='email']");

        $('.js-signup .js-btn-cancel').off().click(() => {
            navigate(ROUTE.login);
        });

        $errMess.html('');
        $loader.hide();
        $formItem.each(i => {
            const $this = $formItem.eq(i);
            $this.children().val('');

            if (i !== 4) {
                $formItem.eq(i).show();
            } else {
                $formItem.eq(i).hide();
            }
        });

        if (invitedEmail) {
            $emailInput.val(invitedEmail);
            $emailInput.prop('readonly', true);
        } else {
            $emailInput.prop('readonly', false);
        }
    };

    return ob;
});
