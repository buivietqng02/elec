define([
    'features/meeting/meetingWebRTC',
    'features/meeting/meetingPreviewForm'
], (
    meetingWebRTCComp,
    meetingPreviewFormComp
) => {
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/meeting.css');
    jsrender($);

    const onInit = () => {
        meetingWebRTCComp.onInit();
        meetingPreviewFormComp.onInit();
    };
    
    onInit();
});
