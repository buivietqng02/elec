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
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/style.css');
    require('assets/css/meeting.css');
    jsrender($);

    const $langBtn = $('#change-lang-btn');

    const onInit = () => {
        meetingPreviewFormComp.onInit();
        meetingWebRTCComp.onInit();
        meetingUtilityComp.onInit();
        languageComp.onInit();
        $('[data-toggle="tooltip"]').tooltip();
        $langBtn.click(modalChangeLanguageComp.onInit);
    };
    
    onInit();
});
