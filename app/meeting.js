define([
    'features/meeting/meetingPreviewForm',
    'features/meeting/meetingWebRTC',
    'features/meeting/meetingUtility',
    'features/language/language',
    'features/modal/modalChangeLanguage'
], (
    meetingPreviewFormComp,
    meetingWebRTCComp,
    meetingUtilityComp,
    languageComp,
    modalChangeLanguageComp
) => {
    const ob = {};

    ob.onInit = () => {
        const $langBtn = $('#change-lang-btn');
        $('.xm-page-loading').show();
        setTimeout(() => {
            meetingPreviewFormComp.onInit();
            meetingWebRTCComp.onInit();
            meetingUtilityComp.onInit();
            languageComp.onInit();
            $('[data-toggle="tooltip"]').tooltip();
            $langBtn.click(modalChangeLanguageComp.onInit);
        }, 200);
    };
    
    return ob;
});
