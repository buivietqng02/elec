define([
    'axios',
    'shared/functions',
    'app/constant'
], (
    axios,
    functions,
    constant
) => {
    const { getFormData } = functions;
    const { BASE_URL } = constant;
    const ob = {};
    let captchaId = null;
    let loading = false;
    let loadingCaptcha = false;
    let stage = 1;
    let $foregetForm;
    let $loadingCaptche;
    let $loadingReset;
    let $loadingRequest;
    let $btnReset;
    let $btnRequest;
    let $formItem;
    let $errMess;
    let $captchaWrapper;
    let $captchaImg;

    const requestCaptcha = () => {
        if (loadingCaptcha) {
            return;
        }

        $captchaImg.hide();
        $loadingCaptche.show();
        loadingCaptcha = true;
        axios.get(`${BASE_URL}/captcha`).then((res) => {
            loadingCaptcha = false;
            $loadingCaptche.hide();
            $captchaImg.show();
            captchaId = res.captchaId;
            $captchaImg.attr('src', `data:image/jpeg;base64,${res.captchaImage}`);
        }).catch(err => {
            $errMess.html(err?.response?.data?.details || 'Something went wrong');
            loadingCaptcha = false;
        });
    };

    const validate = (params) => {
        const {
            email,
            captcha,
            code,
            password,
            confirmpassword
        } = params;

        if (!email) {
            $errMess.html('Email is required');
            return false;
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase())) {
            $errMess.html('Email is invalid');
            return false;
        }

        if (!captcha) {
            $errMess.html('Captcha is required');
            return false;
        }

        if (!code && stage === 2) {
            $errMess.html('Code is required');
            return false;
        }

        if (!password && stage === 2) {
            $errMess.html('Password is required');
            return false;
        }

        if (password.length < 8 && stage === 2) {
            $errMess.html('Password must be at least 8 characters in length');
            return false;
        }

        if (password !== confirmpassword && stage === 2) {
            $errMess.html('Password and Confirm Password does not match');
            return false;
        }

        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const params = getFormData($foregetForm);
        const {
            email,
            captcha,
            code,
            password
        } = params;

        if (!validate(params)) {
            return;
        }

        loading = true;
        $errMess.html('');

        if (stage === 1) {
            $loadingRequest.show();
            axios.post(`${BASE_URL}/password/code`, `email=${email}&captchaId=${captchaId}&captcha=${captcha}`).then(() => {
                stage = 2;
                loading = false;
                $loadingRequest.hide();
                $btnRequest.hide();
                $btnReset.show();
                $errMess.html(`Please enter code we sent to email ${email}`);
                $captchaWrapper.hide();
                $formItem.each(i => {
                    if (i < 2) {
                        $formItem.eq(i).hide();
                    } else {
                        $formItem.eq(i).show();
                    }
                });
            }).catch((err) => {
                $errMess.html(err?.response?.data?.details || 'Something went wrong');
                loading = false;
                $loadingRequest.hide();
                requestCaptcha();
            });
        } else {
            $loadingReset.show();
            axios.post(`${BASE_URL}/password/reset`, `email=${email}&code=${code}&password=${password}`).then(() => {
                $loadingReset.hide();
                $errMess.html('Your password has been changed successfully.');
                setTimeout(() => {
                    $foregetForm.find('.js-btn-cancel').click();
                }, 1000);
            }).catch((err) => {
                $errMess.html(err?.response?.data?.details || 'Something went wrong');
                loading = false;
                $loadingReset.hide();
            });
        }
    };

    ob.onInit = () => {
        loading = false;
        captchaId = null;
        loadingCaptcha = false;
        stage = 1;
        $foregetForm = $('.js_forgot__form_code');
        $captchaImg = $foregetForm.find('[name="captcha-img"]');
        $errMess = $foregetForm.find('.mess');
        $formItem = $foregetForm.find('.form__line');
        $btnReset = $foregetForm.find('.js-btn-reset-code');
        $loadingReset = $btnReset.find('.--spin');
        $btnRequest = $foregetForm.find('.js-btn-send-code');
        $loadingRequest = $btnRequest.find('.--spin');
        $captchaWrapper = $foregetForm.find('.captcha-wrapper');
        $loadingCaptche = $foregetForm.find('.captcha-wrapper .pulse');

        $errMess.html('');
        $btnReset.hide();
        $loadingReset.hide();
        $loadingRequest.hide();
        $btnRequest.show();
        $captchaWrapper.show();
        $formItem.each(i => {
            const $this = $formItem.eq(i);
            $this.children().val('');

            if (i < 2) {
                $formItem.eq(i).show();
            } else {
                $formItem.eq(i).hide();
            }
        });

        requestCaptcha();
        $foregetForm.off('submit').on('submit', onSubmit);
        $foregetForm.find('.captcha-wrapper .btn').off('click').click(requestCaptcha);
    };

    return ob;
});
