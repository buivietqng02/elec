define([
    'shared/functions',
    'features/meeting/meetingInviteModal'
], (
    functions,
    meetingInviteModalComp
) => {
    const $shareBtn = $('.mvwmss-btn-share-screen');
    const $inviteBtn = $('.mvwmss-btn-add-people');
    const $video = $('#mvww-user-0');
    const $settings = $('.mvwm-settings');
    const constraints = {
        audio: true,
        video: true
    };
    const constraintsShare = {
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
            const id = functions.generateId();
            $settings.css('pointer-events', 'visible');
            $video.get(0).srcObject = stream;
            easyrtc.register3rdPartyLocalMediaStream(stream, id);
            window.idShareScreen = null;
            (window.easyrtcIds || []).forEach((easyrtcId) => {
                easyrtc.addStreamToCall(easyrtcId, id);
            });
        });
    };

    const onShare = () => navigator.mediaDevices.getDisplayMedia(constraintsShare).then(stream => {
        const id = functions.generateId();

        $settings.css('pointer-events', 'none');
        // stream.oninactive = onStop; // eslint-disable-line no-param-reassign
        stream.getVideoTracks()[0].addEventListener('ended', onStop);
        $video.get(0).srcObject = stream;
        easyrtc.register3rdPartyLocalMediaStream(stream, id);
        window.idShareScreen = id;
        (window.easyrtcIds || []).forEach((easyrtcId) => {
            easyrtc.addStreamToCall(easyrtcId, id);
        });
    });

    return {
        onInit: () => {
            $shareBtn.click(onShare);
            $inviteBtn.click(meetingInviteModalComp.onInit);
        }
    };
});
