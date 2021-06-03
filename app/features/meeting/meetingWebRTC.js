define([
    'app/webrtc',
    'shared/data'
], (
    URL,
    GLOBAL
) => {
    let userList = [];
    let onlyRun = false;
    let $videpWrapper;
    let $collapseBtn;
    let $micBtn;
    let $cameraBtn;

    const onExpand = (e) => {
        const $this = $(e.currentTarget);
        if ($this.hasClass('expand')) {
            return;
        }

        $collapseBtn.show();
        $this.addClass('expand');
    };

    const onCollapse = () => {
        $('.mvww-div').removeClass('expand');
        $collapseBtn.hide();
    };

    const initWepRTC = () => {
        $('.xm-page-loading').remove();
        $('.mvww-div').click(onExpand);
        $collapseBtn.click(onCollapse);
    };

    const convertListToButtons = (roomName, data) => {
        // prevent members of default room can attend.
        // limit number of members
        if (roomName === 'default' || Object.keys(data).length > 8) {
            return;
        }

        const easyrtcIds = GLOBAL.getEasyrtcIds() || [];

        Object.keys(data).forEach((easyrtcid) => {
            if (!easyrtcIds.filter(id => id === easyrtcid).length) {
                GLOBAL.setEasyrtcIds(easyrtcIds.concat(easyrtcid));
            }
        });

        if (onlyRun) {
            return;
        }

        onlyRun = true;
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

    const setWidthVideo = (isHang) => {
        const numConnect = easyrtc.getConnectionCount() + (isHang ? 0 : 1);

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
        const easyrtcIds = GLOBAL.getEasyrtcIds() || [];
        const idShareScreen = GLOBAL.getIdShareScreen();

        if (idShareScreen) {
            easyrtc.addStreamToCall(easyrtcid, idShareScreen);
        }

        if (!easyrtcIds.filter(id => id === easyrtcid).length) {
            GLOBAL.setEasyrtcIds(easyrtcIds.concat(easyrtcid));
        }
        
        const $video = $(`#mvww-user-${slot + 1}`);
        const $videoWrap = $video.parent();
        $videoWrap.show();
        setWidthVideo();
    };

    const onHangup = (easyrtcid, slot) => {
        GLOBAL.setEasyrtcIds((GLOBAL.getEasyrtcIds() || []).filter(id => (id !== easyrtcid)));
        const $video = $(`#mvww-user-${slot + 1}`);
        const $videoWrap = $video.parent();
        $videoWrap.hide();

        if ($videoWrap.hasClass('expand')) {
            $videoWrap.removeClass('expand');
            $collapseBtn.hide();
        }
        
        setWidthVideo(true);
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

    const initMediaSource = (num) => {
        if (num === 1) {
            easyrtc.enableAudio(false);
        }
        
        if (num === 2) {
            easyrtc.enableAudio(true);
            easyrtc.enableVideo(false);
        }
        
        easyrtc.initMediaSource(() => {
            easyrtc.easyApp('easyrtc.videoChatHd', 'mvww-user-0', userList, initWepRTC);
        }, () => {
            if (!num) {
                $micBtn.addClass('turn-off');
                GLOBAL.setIsEnabelMic(false);
                initMediaSource(1);
            }

            if (num === 1) {
                $micBtn.removeClass('turn-off');
                $cameraBtn.addClass('turn-off');
                GLOBAL.setIsEnabelMic(true);
                GLOBAL.setIsEnabelCamera(false);
                initMediaSource(2);
            }

            if (num === 2) {
                $micBtn.addClass('turn-off');
                GLOBAL.setIsEnabelMic(false);
    
                window.despiteNotHaveDevice = true;
                
                easyrtc.initMediaSource(() => {
                    easyrtc.easyApp(`easyrtc.${new Date().getTime()}`, 'mvww-user-0', userList, initWepRTC);
                });
            }
        });
    };

    return {
        onInit: () => {
            userList = [];
            onlyRun = false;
            $videpWrapper = $('.mvw-wrapper');
            $collapseBtn = $('.mvw-collapse-btn');
            $micBtn = $('.mvwmb-btn-mic');
            $cameraBtn = $('.mvwmb-btn-camera');

            for (let i = 0; i < 8; i += 1) {
                userList = userList.concat(`mvww-user-${i + 1}`);
                $videpWrapper.append(`
                    <div class="mvww-div">
                        <video id="mvww-user-${i + 1}" autoplay="" playsinline="playsinline" class="mvww-normal"></video>
                    </div>
                `);
            }

            easyrtc.setSocketUrl(URL);
            easyrtc.dontAddCloseButtons(true);
            initMediaSource();
        },

        onJoinRoom
    };
});
