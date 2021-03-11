/* eslint-disable */
define([
    'shared/functions'
], (
    functions
) => {
    const $shareBtn = $('.mvwmss-btn-share-screen');
    const $inviteBtn = $('.mvwmss-btn-add-people');
    const $video = $('#mvww-user-0');
    const $settings = $('.mvwm-settings');
    const constraints = {
        audio: true,
        video: true
    };
    const displayMediaOptions = {
        video: {
          cursor: 'always'
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
        }
    };

    const onStop = () => {
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            let id = functions.generateId();
            $settings.css('pointer-events', 'visible');
            $video.get(0).srcObject = stream;
            easyrtc.register3rdPartyLocalMediaStream(stream, id);
            (window.easyrtcIds || []).forEach((easyrtcId) => {
                easyrtc.addStreamToCall(easyrtcId, id);
            });
        });
    };

    const onShare = () => {
        navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(function (stream) {
            let id = functions.generateId();

            $settings.css('pointer-events', 'none');
            stream.oninactive = onStop;
            $video.get(0).srcObject = stream;
            easyrtc.register3rdPartyLocalMediaStream(stream, id);
            (window.easyrtcIds || []).forEach((easyrtcId) => {
                easyrtc.addStreamToCall(easyrtcId, id);
            });
        })
    };

    const onInvite = () => {
        
    };

    return {
        onInit: () => {
            $shareBtn.click(onShare);
            $inviteBtn.click(onInvite);
        }
    };
});
