define([

], (

) => {
    let userList = [];
    const $videpWrapper = $('.mvw-wrapper');

    for (let i = 0; i < 8; i += 1) {
        userList = userList.concat(`mvww-user-${i + 1}`);
        $videpWrapper.append(`
            <div class="mvww-div">
                <video id="mvww-user-${i + 1}" autoplay="" playsinline="playsinline" muted="" volume="0" class="mvww-normal"></video>
            </div>
        `);
    }

    const initWepRTC = () => {
        $('.xm-page-loading').remove();
    };

    const convertListToButtons = (roomName, data) => {
        // prevent members of default room can attend.
        if (roomName === 'default') {
            return;
        }

        easyrtc.setRoomOccupantListener(null);
        const list = [];
        let connectCount = 0;
        let min = 0;

        Object.keys(data).forEach((easyrtcid) => {
            if (Object.prototype.hasOwnProperty.call(data, easyrtcid)) {
                if (!min) {
                    min = data[easyrtcid].roomJoinTime;
                }
                
                list.push(easyrtcid);
            }
        });
      
        const establishConnection = (position) => {
            const callSuccess = () => {
                connectCount += 1;
                if (connectCount < userList.length && position > 0) {
                    establishConnection(position - 1);
                }
            };

            const callFailure = () => {
                if (connectCount < userList.length && position > 0) {
                    establishConnection(position - 1);
                }
            };
      
            easyrtc.call(list[position], callSuccess, callFailure);
        };
      
        if (list.length > 0) {
            establishConnection(list.length - 1);
        }
    };

    const setWidthVideo = () => {
        const numConnect = easyrtc.getConnectionCount() + 1;

        $videpWrapper.removeClass('shape-one');
        $videpWrapper.removeClass('shape-two');

        if (numConnect < 5 && numConnect > 1) {
            $videpWrapper.addClass('shape-one');
        }

        if (numConnect < 10 && numConnect > 4) {
            $videpWrapper.addClass('shape-two');
        }
    };

    const onCall = (easyrtcid, slot) => {
        window.easyrtcIds = (window.easyrtcIds || []).concat(easyrtcid);
        const $video = $(`#mvww-user-${slot + 1}`);
        const $videoWrap = $video.parent();
        $videoWrap.show();
        setWidthVideo();
    };

    const onHangup = (easyrtcid, slot) => {
        window.easyrtcIds = (window.easyrtcIds || []).filter(id => (id !== easyrtcid));
        const $video = $(`#mvww-user-${slot + 1}`);
        const $videoWrap = $video.parent();
        $videoWrap.hide();
        setWidthVideo();
    };

    const onJoinRoom = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const roomId = searchParams.get('id');

        easyrtc.joinRoom(roomId, '', null, null);
        easyrtc.setRoomOccupantListener(convertListToButtons);
        easyrtc.setAcceptChecker((caller, cb) => {
            cb(true);
        });
        easyrtc.setOnCall(onCall);
        easyrtc.setOnHangup(onHangup);
    };

    return {
        onInit: () => {
            easyrtc.setSocketUrl('http://172.16.5.177:8081');
            easyrtc.dontAddCloseButtons(true);
            easyrtc.initMediaSource(() => {
                easyrtc.easyApp('easyrtc.videoChatHd', 'mvww-user-0', userList, initWepRTC);
            }, (err) => {
                console.log(err);
            });
        },

        onJoinRoom
    };
});
