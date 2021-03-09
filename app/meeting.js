define([
    'features/meeting/meetingWebRTC'
], (
    meetingWebRTCComp
) => {
    require('bootstrap/js/dist/modal');
    require('bootstrap/js/dist/tooltip');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('assets/css/p_style.css');
    require('assets/css/meeting.css');
    jsrender($);

    const onInit = () => {
        meetingWebRTCComp.onInit();
    };
    
    onInit();
});
