define([
    'app/constant',
    'shared/functions',
    'shared/alert',
    'shared/data',
    'features/meeting/meetingWebRTC'
], (
    constant,
    functions,
    ALERT,
    GLOBAL,
    meetingWebRTCComp
) => {
    let $micBtn;
    let $cameraBtn;
    let $url;
    let $urlText;
    let $videoSelf;

    const insertUrlParam = (key, value) => {
        if (window.history.pushState) {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set(key, value);
            const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams.toString()}`;
            window.history.pushState({ path: newurl }, '', newurl);
        }
    };

    const onCreateId = () => {
        const searchParams = new URLSearchParams(window.location.search);
        
        if (!searchParams.get('id')) {
            let id = functions.generateId();
            insertUrlParam('id', id);
            $urlText.text(`${window.location.host}${window.location.pathname}?id=${id}`);
        } else {
            $urlText.text(`${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
        }
    };

    return {
        onInit: () => {
            $micBtn = $('.mvwmb-btn-mic');
            $cameraBtn = $('.mvwmb-btn-camera');
            $url = $('.mvwmb-url');
            $urlText = $('.mvwmb-copy');
            $videoSelf = $('#mvww-user-0');

            onCreateId();

            $('.mvwmb-join-btn').off('click').click(() => {
                $('.mvw-wrapper').addClass('joining');
                $('.mvw-meetform').hide();
                $('.mvwm-settings').show();
                meetingWebRTCComp.onJoinRoom();
            });

            $('.mvwmb-back-btn').off('click').click(() => {
                easyrtc.hangupAll();
                easyrtc.setRoomOccupantListener(null);
                easyrtc.disconnect();
                ((easyrtc.getLocalStream() || { getTracks: () => {} })
                .getTracks() || []).forEach(track => track.stop());
                functions.navigate(constant.ROUTE.index);
            });

            $url.off('click').click(() => {
                const searchParams = new URLSearchParams(window.location.search);
                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
                ALERT.show(GLOBAL.getLangJson().COPIED_TO_CLIPBOARD, 'success');
            });

            $micBtn.off('click').click(() => {
                if (!GLOBAL.getIsEnabelMic()) {
                    return;
                }

                if ($micBtn.hasClass('turn-off')) {
                    $videoSelf.get(0).srcObject.getTracks()[0].enabled = true;
                    $micBtn.removeClass('turn-off');
                } else {
                    $videoSelf.get(0).srcObject.getTracks()[0].enabled = false;
                    $micBtn.addClass('turn-off');
                }
            });

            $cameraBtn.off('click').click(() => {
                if (!GLOBAL.getIsEnabelCamera()) {
                    return;
                }

                let num = GLOBAL.getIsEnabelMic() ? 1 : 0;

                if ($cameraBtn.hasClass('turn-off')) {
                    $videoSelf.get(0).srcObject.getTracks()[num].enabled = true;
                    $cameraBtn.removeClass('turn-off');
                } else {
                    $videoSelf.get(0).srcObject.getTracks()[num].enabled = false;
                    $cameraBtn.addClass('turn-off');
                }
            });
        }
    };
});
