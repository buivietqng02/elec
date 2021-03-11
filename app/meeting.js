define([
    'features/meeting/meetingPreviewForm',
    'features/meeting/meetingWebRTC',
    'features/meeting/meetingUtility'
], (
    meetingPreviewFormComp,
    meetingWebRTCComp,
    meetingUtilityComp
) => {
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/meeting.css');
    jsrender($);

    const onInit = () => {
        meetingPreviewFormComp.onInit();
        meetingWebRTCComp.onInit();
        meetingUtilityComp.onInit();
        $('[data-toggle="tooltip"]').tooltip();
    };
    
    onInit();
});
