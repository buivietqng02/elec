define([
    'app/enviroment', 
    'shared/data',
    'shared/api',
    'shared/alert',
    'shared/functions'
], (
    BASE_URL, 
    GLOBAL,
    API,
    ALERT,
    functions
) => {
    const { getAvatar } = functions;
    let interval;
    let atLeastAttend;
    let isInit;
    let isOwnerRoom;
    let isGroupGlobal;
    let listCaller;
    let listenOnlyOne;
    let roomId;
    let roomInfo;
    let $imgSender;
    let $nameSender;
    let $callAnimation;
    let $micBtn;
    let $videoCloseBtn;
    let $hangupBtn;
    let $acceptBtn;
    let $cameraBtn; 
    let $phoneBtn;
    let $videoSettings; 
    let $videoSelf;
    let $videoCallerWrap;
    let $videoSelfWrap;
    let $modalDialog;
    let $modal;
    let toggleCameraClick = 0;
    let toggleMicClick = 0;
    let togglePhoneClick = 0;
    let isModalRendered = false;
    const hide = 'hidden';
    const selfVideoId = 'selfVideo';
    const btnClassClicked = 'btn-slash';
    const renderTemplate = `
        <div class="modal fade" id="modalPhoneRequest" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" id="video_close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                        <div class="video-call-notify-form">
                            <h2>Incoming video call...</h2>
                            <img class="vcnf-image" />
                            <h3 class="vcnf-name">Bonnie</h3>
                            <div class="vcnf-group clearfix">
                                <button class="vcnf-hangup">
                                    <i class="xm xm-phone"></i>
                                </button>
                                <button class="vcnf-accept">
                                    <i class="xm xm-phone"></i>
                                </button>
                            </div>
                        </div>

                        <div class="video-call-modal-body">
                            <div class="video-call-wrapper">
                                <div class="video-caller hidden">
                                    <div class="call-animation hidden">
                                        <i class="xm xm-phone"></i>
                                    </div>
                                </div>
                                <div class="video-self">
                                    <video autoplay="" playsinline="playsinline" id="selfVideo" muted="" volume="0"></video>
                                </div>
                            </div>
                            <div class="video-call-setting">
                                <button id="video-mic-btn">
                                    <span></span>
                                    <i class="xm xm-microphone"></i>
                                </button>
                                <button id="video-camera-btn">
                                    <span></span>
                                    <i class="xm xm-video-camera"></i>
                                </button>
                                <button id="video-phone-btn">
                                    <i class="xm xm-phone"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const postCall = () => API.post(`chats/${roomInfo.id}/call/place`);

    const endCall = () => API.post(`chats/${roomInfo.id}/call/end`);

    const onClose = () => {
        easyrtc.leaveRoom(roomId, null, null);
        easyrtc.setRoomOccupantListener(null);
        easyrtc.disconnect();

        if (isOwnerRoom && !atLeastAttend) {
            endCall();
        }

        setTimeout(() => {
            easyrtc.getLocalStream().getTracks().forEach(track => track.stop());
            $videoCallerWrap.addClass(hide);
            $videoSelfWrap.removeClass('calling');
            $phoneBtn.removeClass('btn-calling');
            listenOnlyOne = false;
            isOwnerRoom = false;
            togglePhoneClick = false;
            $cameraBtn.off();
            $micBtn.off();
            $phoneBtn.off();
        }, 500);
    };

    const onCameraClick = () => {
        if (toggleCameraClick) {
            $cameraBtn.removeClass(btnClassClicked);
            $videoSelf.get(0).srcObject.getTracks()[1].enabled = true;
        } else {
            $cameraBtn.addClass(btnClassClicked);
            $videoSelf.get(0).srcObject.getTracks()[1].enabled = false;
        }
      
        toggleCameraClick = !toggleCameraClick;
    };
      
    const onMicClick = () => {
        if (toggleMicClick) {
            $micBtn.removeClass(btnClassClicked);
            $videoSelf.get(0).srcObject.getTracks()[0].enabled = true;
        } else {
            $micBtn.addClass(btnClassClicked);
            $videoSelf.get(0).srcObject.getTracks()[0].enabled = false;
        }
      
        toggleMicClick = !toggleMicClick;
    };

    const convertListToButtons = (roomName, data) => {
        // prevent members of default room can attend.
        if (roomName === 'default') {
            return;
        }
      
        const isLengthData = JSON.stringify(data).length;
      
        // Owner room video chat leave, it should hang up all, Only aply to group
        // if (listenOnlyOne && !data[ownerRoomId] && !isOwnerRoom && isGroupGlobal) {
            // $videoCloseBtn.click();
            // easyrtc.showError(null, 'Call was ended');
        // }
      
        // Once someone attend the call, calling animation should be removed
        if (isLengthData > 2 && roomName === roomId) {
            atLeastAttend = true;
            $callAnimation.addClass(hide);
        }
      
        // Check if remote user hang up. Automatic end the call. Only aply to direct
        if (listenOnlyOne && isLengthData < 3 && !isGroupGlobal) {
            endCall();
            $videoCloseBtn.click();
            // easyrtc.showError(null, 'Call was ended');
        }
        
        // so we're only called once and prevent members of default room can attend.
        if (listenOnlyOne || roomName !== roomId) {
            return;
        }
        
        listenOnlyOne = true;
        const list = [];
        let connectCount = 0;
        let min = 0;

        Object.keys(data).forEach((easyrtcid) => {
            if (Object.prototype.hasOwnProperty.call(data, easyrtcid)) {
                if (!min) {
                    min = data[easyrtcid].roomJoinTime;
                    // ownerRoomId = easyrtcid;
                }
        
                // Find owner room id base on time join
                if (min > data[easyrtcid].roomJoinTime) {
                    min = data[easyrtcid].roomJoinTime;
                    // ownerRoomId = easyrtcid;
                }
                
                list.push(easyrtcid);
            }
        });
      
        const establishConnection = (position) => {
            const callSuccess = () => {
                connectCount += 1;
                if (connectCount < listCaller.length && position > 0) {
                    establishConnection(position - 1);
                }
            };

            const callFailure = () => {
                if (connectCount < listCaller.length && position > 0) {
                    establishConnection(position - 1);
                }
            };
      
            easyrtc.call(list[position], callSuccess, callFailure);
        };
      
        if (list.length > 0) {
            establishConnection(list.length - 1);
        } else {
            // Check if you are the owner of the room then show incoming call animation.
            postCall();
            isOwnerRoom = true;
            $callAnimation.removeClass(hide);
        }
    };
      
    const onPhoneClick = () => {
        if (togglePhoneClick) {
            $videoCloseBtn.click();
            return;
        }
      
        togglePhoneClick = !togglePhoneClick;
        $phoneBtn.addClass('btn-calling');
        $videoSelfWrap.addClass('calling');
        $videoCallerWrap.removeClass(hide);
        
        easyrtc.joinRoom(roomId, '', null, null);
        easyrtc.setRoomOccupantListener(convertListToButtons);
        easyrtc.setAcceptChecker((caller, cb) => {
            if (togglePhoneClick) {
                cb(true);
            }
        });
    };

    const onInit = () => {  
        isInit = true;
        $videoSettings.show();
        $videoSettings.removeClass(hide);
        $videoSelfWrap.removeClass(hide);
        $callAnimation.addClass(hide);

        $cameraBtn.click(onCameraClick);
        $micBtn.click(onMicClick);
        $phoneBtn.click(onPhoneClick);
    };

    const setupWebrtc = () => {
        if (roomInfo.group) {
            return;
        }

        const idVideo = 'callerVideo';
        roomId = roomInfo.id;
        isGroupGlobal = roomInfo.group;
        listCaller = [idVideo];
        isInit = false;
        $videoCallerWrap.find('video').remove();
        $videoCallerWrap.append(`<video autoplay="autoplay" playsinline="playsinline" id="${idVideo}"></video>`);

        switch (listCaller.length) {
            case 1:
                $videoCallerWrap.attr('class', '').addClass('video-caller');
                break;
            case 2: 
                $videoCallerWrap.addClass('total-num-2');
                break;
            default:
                $videoCallerWrap.addClass('total-num-3');
        }

        easyrtc.initMediaSource(() => {
            easyrtc.dontAddCloseButtons(true);
            easyrtc.easyApp('easyrtc.videoChatHd', selfVideoId, listCaller, onInit);
        }, (err) => {
            ALERT.show('Browser does not support calls or you have locked mic and camera');
            console.log(err);
        });
    };

    const onAccept = () => {
        $modalDialog.removeClass('accept-state');

        setupWebrtc();
        interval = setInterval(() => {
            if (isInit) {
                $phoneBtn.click();
                clearInterval(interval);
            }
        }, 100);
    };

    const onHangup = () => {        
        $modal.modal('hide');
        if (!roomInfo.group) {
            endCall();
        }
    };

    const onDeclareDom = () => {
        $modal = $('#modalPhoneRequest');
        $modalDialog = $modal.find('.modal-dialog');
        $videoSettings = $('.video-call-setting');
        $videoSelf = $(`#${selfVideoId}`);
        $videoCallerWrap = $('.video-caller');
        $videoSelfWrap = $('.video-self');
        $callAnimation = $('.call-animation');
        $micBtn = $('#video-mic-btn');
        $cameraBtn = $('#video-camera-btn');
        $phoneBtn = $('#video-phone-btn');
        $videoCloseBtn = $('#video_close');
        $imgSender = $('.vcnf-image');
        $nameSender = $('.vcnf-name');
        $acceptBtn = $('.vcnf-accept');
        $hangupBtn = $('.vcnf-hangup');

        $videoCloseBtn.click(onClose);
        $hangupBtn.click(onHangup);
        $acceptBtn.click(onAccept);
    };

    return {
        onInit: (sender, rid) => {
            if (listenOnlyOne) {
                return;
            }

            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(renderTemplate);
                easyrtc.setSocketUrl('https://xm.iptp.dev');
                onDeclareDom();
            }

            if (sender) {
                const userName = GLOBAL.getRoomInfoWasEdited()[sender.id]?.user_name || sender.name;
                [roomInfo] = GLOBAL.getRooms().filter(room => (room.id === rid));
                $modalDialog.addClass('accept-state');
                $nameSender.html(userName);
                if (roomInfo.group) {
                    $imgSender.attr('src', getAvatar(roomInfo.id, true));
                } else {
                    $imgSender.attr('src', getAvatar(sender.id));
                }

                if (isInit) {
                    isInit = false;
                    onClose();
                }
            } else {
                [roomInfo] = GLOBAL.getRooms().filter(r => (r.id === GLOBAL.getCurrentRoomId()));
                $modalDialog.removeClass('accept-state');
                setupWebrtc();
            }

            atLeastAttend = false;
            $videoSettings.hide();
            $callAnimation.addClass(hide);
            $modal.modal('show');
        },

        onEndCall: (sender, rid) => {
            if (rid === roomInfo.id && isOwnerRoom && togglePhoneClick) {
                atLeastAttend = true;
                $phoneBtn.click();
            }

            if ($modal.hasClass('show') && !isOwnerRoom && !togglePhoneClick) {
                if (interval) {
                    clearInterval(interval);
                }

                $modal.modal('hide');
            }
        }
    };
});
