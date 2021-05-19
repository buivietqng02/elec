define([
    'features/language/language',
    'features/modal/modalChangeLanguage',
    'features/login/loginForm'
], (
    languageComp,
    modalChangeLanguageComp,
    loginFormComp
) => {
    const ob = {};

    ob.onInit = () => {
        $('.xm-page-loading').remove();
        $('[data-toggle="tooltip"]').tooltip();
        $('#change-lang-btn').click(modalChangeLanguageComp.onInit);

        languageComp.onInit();
        loginFormComp.onInit();
    };
    
    return ob;
});
