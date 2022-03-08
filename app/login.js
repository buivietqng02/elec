define([
    'features/language/language',
    'app/constant',
    'shared/functions',
    'shared/data',
    'features/modal/modalChangeLanguage',
    'features/login/loginForm',
    'features/login/resetPasswordForm'
], (
    languageComp,
    constant,
    functions,
    GLOBAL,
    modalChangeLanguageComp,
    loginFormComp,
    resetPasswordFormComp
) => {
    const ob = {};

    const initCurrentVersion = (version, langJson) => {
        const xmVersionTemplate = `
            <p>
                <lang data-language="WEB_VERSION">${langJson.WEB_VERSION}</lang>: #XM_VERSION 
            </p>
            <p>
                <lang data-language="SERVER_VERSION">${langJson.SERVER_VERSION}</lang>: ${version}
            </p>
            `;

        $('.xm-current-version').html(xmVersionTemplate);
    };

    const onGetVersion = () => {
        $.ajax({
            type: 'GET',
            url: `${constant.BASE_URL}/version`,
            success: (res) => { 
                initCurrentVersion(res, GLOBAL.getLangJson());
            }
        });
    };
    
   

    ob.onInit = () => {
        onGetVersion()

        $('.xm-page-loading').hide();
        $('[data-toggle="tooltip"]').tooltip();
        $('#change-lang-btn').click(modalChangeLanguageComp.onInit);
        $('.login__btn-signup').off().click(() => {
            functions.navigate(constant.ROUTE.signup);
        });
        $('.login__btn-forgot').off().click(() => {
            $('.js-login').removeClass('active');
            $('.js-forget').addClass('active');
            resetPasswordFormComp.onInit();
        });
        $('.js-forget .js-btn-cancel').off().click(() => {
            $('.js-login').addClass('active');
            $('.js-forget').removeClass('active');
            loginFormComp.onInit();
        });

        languageComp.onInit();
        loginFormComp.onInit();
    };
    
    return ob;
});
