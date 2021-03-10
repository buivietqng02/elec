define([
    'shared/functions',
    'shared/alert'
], (
    functions,
    ALERT
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
            insertUrlParam('id', functions.generateId());
        } else {
            $urlText.text(`${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
        }
    };

    return {
        onInit: () => {
            onCreateId();

            $url.click(() => {
                const searchParams = new URLSearchParams(window.location.search);
                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
                ALERT.show('Link copied to clipboard', 'success');
            });

            $micBtn.click(() => {
                if ($micBtn.hasClass('turn-off')) {
                    $videoSelf.get(0).srcObject.getTracks()[0].enabled = true;
                    $micBtn.removeClass('turn-off');
                } else {
                    $videoSelf.get(0).srcObject.getTracks()[0].enabled = false;
                    $micBtn.addClass('turn-off');
                }
            });

            $cameraBtn.click(() => {
                if ($cameraBtn.hasClass('turn-off')) {
                    $videoSelf.get(0).srcObject.getTracks()[1].enabled = true;
                    $cameraBtn.removeClass('turn-off');
                } else {
                    $videoSelf.get(0).srcObject.getTracks()[1].enabled = false;
                    $cameraBtn.addClass('turn-off');
                }
            });
        }
    };
});
