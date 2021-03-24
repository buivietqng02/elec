define([
    'shared/functions',
    'shared/alert',
    'shared/data',
    'features/meeting/meetingWebRTC'
], (
    functions,
    ALERT,
    GLOBAL,
    meetingWebRTCComp
) => {
    const $micBtn = $('.mvwmb-btn-mic');
    const $cameraBtn = $('.mvwmb-btn-camera');
    const $url = $('.mvwmb-url');
    const $urlText = $('.mvwmb-copy');
    const $videoSelf = $('#mvww-user-0');

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
            onCreateId();

            $('.mvwmb-join-btn').click(() => {
                $('.mvw-wrapper').addClass('joining');
                $('.mvw-meetform').hide();
                $('.mvwm-settings').show();
                meetingWebRTCComp.onJoinRoom();
            });

            $url.click(() => {
                const searchParams = new URLSearchParams(window.location.search);
                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
                ALERT.show('Link copied to clipboard', 'success');
            });

            $micBtn.click(() => {
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

            $cameraBtn.click(() => {
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
