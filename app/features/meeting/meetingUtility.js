define([
    'app/constant',
    'shared/functions',
    'features/meeting/meetingInviteModal',
    'shared/data'
], (
    constant,
    functions,
    meetingInviteModalComp,
    GLOBAL
) => {
    let $shareBtn;
    let $inviteBtn;
    let $leftBtn;
    let $video;
    let $settings;
    const constraintsShare = {
        video: {
          cursor: 'always'
        }
    };

    const onLeft = () => {
        $('.tooltip.show').remove();
        easyrtc.hangupAll();
        easyrtc.setRoomOccupantListener(null);
        easyrtc.disconnect();
        ((easyrtc.getLocalStream() || { getTracks: () => {} })
        .getTracks() || []).forEach(track => track.stop());
        functions.navigate(constant.ROUTE.index);
    };

    const onStop = () => {
        if (GLOBAL.getIsEnabelMic() || GLOBAL.getIsEnabelCamera()) {
            navigator.mediaDevices.getUserMedia({
                audio: GLOBAL.getIsEnabelMic(),
                video: GLOBAL.getIsEnabelCamera()
            }).then((stream) => {
                const id = functions.generateId();

                $settings.css('pointer-events', 'visible');
                GLOBAL.setIdShareScreen(null);
                $video.get(0).srcObject = stream;
                easyrtc.register3rdPartyLocalMediaStream(stream, id);
                (GLOBAL.getEasyrtcIds() || []).forEach((easyrtcId) => {
                    easyrtc.addStreamToCall(easyrtcId, id);
                });
            });
        } else {
            const id = functions.generateId();

            $settings.css('pointer-events', 'visible');
            GLOBAL.setIdShareScreen(null);
            easyrtc.register3rdPartyLocalMediaStream(new MediaStream(), id); // eslint-disable-line
            (GLOBAL.getEasyrtcIds() || []).forEach((easyrtcId) => {
                easyrtc.addStreamToCall(easyrtcId, id);
            });
        }
    };

    const assignStream = (stream) => {
        const id = functions.generateId();
        
        stream.getVideoTracks()[0].addEventListener('ended', onStop);
        $video.get(0).srcObject = stream;
        easyrtc.register3rdPartyLocalMediaStream(stream, id);
        GLOBAL.setIdShareScreen(id);
        (GLOBAL.getEasyrtcIds() || []).forEach((easyrtcId) => {
            easyrtc.addStreamToCall(easyrtcId, id);
        });
    };

    const onShare = () => navigator.mediaDevices.getDisplayMedia(constraintsShare)
    .then(stream => {
        $settings.css('pointer-events', 'none');

        if (GLOBAL.getIsEnabelMic()) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(audioStream => {
                const [audioTrack] = audioStream.getAudioTracks();
                stream.addTrack(audioTrack);
                assignStream(stream);
            }).catch(() => {
                assignStream(stream);
            });
        } else {
            assignStream(stream);
        }
    });

    return {
        onInit: () => {
            $shareBtn = $('.mvwmss-btn-share-screen');
            $inviteBtn = $('.mvwmss-btn-add-people');
            $leftBtn = $('.mvwmss-btn-left-conference');
            $video = $('#mvww-user-0');
            $settings = $('.mvwm-settings');

            $shareBtn.off('click').click(onShare);
            $inviteBtn.off('click').click(meetingInviteModalComp.onInit);
            $leftBtn.off('click').click(onLeft);
        }
    };
});
