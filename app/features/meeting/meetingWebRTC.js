define([

], (

) => {
    console.log('cmm');
    return {
        onInit: () => {
            easyrtc.setSocketUrl('http://localhost:8081');
            easyrtc.dontAddCloseButtons(true);
            easyrtc.initMediaSource(() => {
                $('.xm-page-loading').remove();
                easyrtc.easyApp('easyrtc.videoChatHd', 'mvww-user-0', [], () => {});
            }, (err) => {
                console.log(err);
            });
        }
    };
});
