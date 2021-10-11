define([
    'features/language/language',
    'app/constant',
    'shared/functions',
    'features/modal/modalChangeLanguage',
    'features/login/loginForm',
    'features/login/resetPasswordForm'
], (
    languageComp,
    constant,
    functions,
    modalChangeLanguageComp,
    loginFormComp,
    resetPasswordFormComp
) => {
    const ob = {};

    const initDownloadLinkApp = () => {
        if (!(typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1)) {
            const appDownloadContent = `
                <a class="download-app__link"
                    href="https://play.google.com/store/apps/details?id=net.iptp.chat&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                    target="_blank" rel="nofollow">
                    <img class="download-app__img" src="assets/images/google-play-badge.png" alt="Download Cross Messenger for Android">
                </a>
                <a class="download-app__link" href="https://apps.apple.com/us/app/cross-messenger/id1498791933?ls=1"
                    target="_blank" rel="nofollow">
                    <img class="download-app__img" src="assets/images/appstore-badge2.png"
                    alt="Download Cross Messenger for iOS">
                </a>
                <a class="download-app__link apk" href="https://fstor.iptp.net/files/xm.apk" target="_blank" rel="nofollow">
                    Download Android APK
                </a>
            `;
        
            $('.download-app').html(appDownloadContent);
        }
    };

    ob.onInit = () => {
        initDownloadLinkApp();
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
