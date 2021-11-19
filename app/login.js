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
