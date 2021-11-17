/* eslint no-underscore-dangle: ["error", { "allow": ["_frame"] }] */
define([
    'shared/data',
    'shared/api',
    'shared/functions',
    'app/constant',
    'assets/js/jitsi_external_api',
    'assets/js/jquery-ui.min.js'
], (
    GLOBAL,
    API,
    functions,
    constant,
    JitsiMeetExternalAPI,
    jqueryUi
) => {
    const { getAvatar } = functions;
    const { draggable } = jqueryUi;
    let isInit;
    let listenOnlyOne;
    let roomId;
    let roomInfo;
    let $imgSender;
    let $nameSender;
    let $callAnimation;
    let $hangupBtn;
    let $acceptBtn;
    let $videoCallerWrap;
    let $modalDialog;
    let $modalBody;
    let $iframeWrapper;
    let $btnModalStateSwitch;
    let $btnModalStateSwitchIcon;
    let $modalDrag;
    let $modal;
    let $audio;
    let $notifyForm;
    let optionsCall;
    let jitsiApi;
    let timeout = false;
    let lastPosition = { top: '7rem', right: '1rem' };

    // const audioConnecting = '';
    const audioCall = 'assets/sounds/call.mp3';
    const audioCallEnd = 'assets/sounds/call-end.mp3';
    const audioIncomingCall = 'assets/sounds/incoming-call.mp3';
    const domain = constant.BASE_URL.replace('https://', '').replace('/xm', '') + constant.ROUTE.meeting;

    const hide = 'hidden';
    const renderTemplate = `
        <div class="modal maximize" id="modalPhoneRequest" role="dialog" data-backdrop="false" data-keyboard="false">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="modal-drag" id="modal-drag" style="display: none;">
                            <i class="icon-drag-window"></i>
                        </div>
                        <div class="modal-state-switch" id="modal-state-switch" style="display: none;">
                            <i class="icon-minimize-window"></i>
                        </div>
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

                        <div class="video-call-modal-body" style="display: none">
                            <div class="video-call-wrapper">
                                <div class="video-caller hidden">
                                </div>
                            </div>
                        </div>

                        <audio id="video-call-audio" style="display: none;">
                        </audio>
                    </div>
                </div>
            </div>
        </div>
    `;

    const postCall = (audioOnly) => API.post(`chats/${roomInfo.id}/call/place?audioOnly=${audioOnly}`);

    const acceptCall = () => API.post(`chats/${roomInfo.id}/call/accept`);

    const endCall = () => API.post(`chats/${roomInfo.id}/call/end`);

    const cancelCall = () => API.post(`chats/${roomInfo.id}/call/cancel`);

    const onClose = () => {
        window.onbeforeunload = null;
        $audio[0].pause();
        $audio[0].src = audioCallEnd;
        $audio[0].loop = false;
        $audio[0].play();
        $videoCallerWrap.find('iframe').remove();
        $modal.remove();
    };
    const onHangup = () => {   
        $audio[0].pause();
        $audio[0].src = audioCallEnd;
        $audio[0].loop = false;
        $audio[0].play();     
        $modal.modal('hide');
        if (!roomInfo.group) {
            endCall();
        }
    };

    const onCancel = () => {
        onClose();
        cancelCall();
    }

    const modalStateSwitch = (event) => {
        if ($modal.hasClass('maximize')) {
            $modal.css(lastPosition);
            $modal.attr('class', 'modal show minimize');
            $btnModalStateSwitchIcon.attr('class', 'icon-maximize-window');
            jitsiApi.executeCommand('overwriteConfig', {
                toolbarButtons: [
                    event.data.audioOnly ? '' : 'camera',
                    'hangup',
                    'microphone'
                ]
            });
            $modalDrag.show();
            $modal.off();
            $modal.draggable({
                handle: $modalDrag,
                iframeFix: true
              });
        } else if ($modal.hasClass('minimize')) {
            $modal.draggable( "destroy" );
            lastPosition = { top: `${$modal.offset().top}px`, left: `${$modal.offset().left}px` };
            $modal.css({ top: 0, left: 0 });
            $modal.attr('class', 'modal show maximize');
            $btnModalStateSwitchIcon.attr('class', 'icon-minimize-window');
            jitsiApi.executeCommand('overwriteConfig', {
                toolbarButtons: [
                    event.data.audioOnly ? '' : 'camera',
                    event.data.audioOnly ? '' : 'desktop',
                    'hangup',
                    'microphone',
                    event.data.audioOnly ? '' : 'select-background',
                    event.data.audioOnly ? '' : 'shareaudio',
                    event.data.audioOnly ? '' : 'sharedvideo',
                    event.data.audioOnly ? '' : 'toggle-camera'
                ]
            });
            $modalDrag.hide();
            setTimeout(() => {
                $modal.click({ audioOnly: event.data.audioOnly }, modalStateSwitch);
            }, 300);
        }
    };
    
    const switchState = (isAccept) => {
        if (isAccept) {
            $modalDialog.removeClass('accept-state');
            $modalBody.show();
            $iframeWrapper.show();
            $btnModalStateSwitch.show();
            $modal.attr('class', 'modal show maximize');
            $btnModalStateSwitchIcon.attr('class', 'icon-minimize-window');
            $videoCallerWrap.show();
        } else {
            $notifyForm.show();
            $notifyForm.find('h2').html('Connecting...');
            $imgSender.attr('src', getAvatar(roomInfo.partner.id));
            $nameSender.html(roomInfo.partner.name);
            $acceptBtn.remove();
            $notifyForm.find('.vcnf-group').css({padding: "0 90px"});
            $hangupBtn.off().click(onCancel);
        }
    }

    const setupWebrtc = (isAudioOnly, isAccept) => {
        if (roomInfo.group) {
            return;
        }

        switchState(isAccept);
        roomId = roomInfo.id;
        isInit = false;
        const userInfo = GLOBAL.getInfomation();
        API.get('conference').then((res) => {
            optionsCall = {
                roomName: roomId,
                width: '100%',
                height: '100%',
                jwt: res,
                parentNode: document.getElementsByClassName('video-caller')[0],
                userInfo: {
                    displayName: userInfo.name
                },
                configOverwrite: {
                    disableDeepLinking: true,
                    startAudioOnly: isAudioOnly,
                    toolbarButtons: [
                        isAudioOnly ? '' : 'camera',
                        isAudioOnly ? '' : 'desktop',
                        'hangup',
                        'microphone',
                        isAudioOnly ? '' : 'select-background',
                        isAudioOnly ? '' : 'shareaudio',
                        isAudioOnly ? '' : 'sharedvideo',
                        isAudioOnly ? '' : 'toggle-camera'
                    ],
                    prejoinPageEnabled: false,
                    notifications: [
                        'connection.CONNFAIL', // shown when the connection fails,
                        'dialog.cameraNotSendingData', // shown when there's no feed from user's camera
                        'dialog.kickTitle', // shown when user has been kicked
                        'dialog.liveStreaming', // livestreaming notifications (pending, on, off, limits)
                        'dialog.lockTitle', // shown when setting conference password fails
                        'dialog.maxUsersLimitReached', // shown when maximmum users limit has been reached
                        'dialog.micNotSendingData', // shown when user's mic is not sending any audio
                        'dialog.passwordNotSupportedTitle', // shown when setting conference password fails due to password format
                        'dialog.recording', // recording notifications (pending, on, off, limits)
                        'dialog.remoteControlTitle', // remote control notifications (allowed, denied, start, stop, error)
                        'dialog.reservationError',
                        'dialog.serviceUnavailable', // shown when server is not reachable
                        'dialog.sessTerminated', // shown when there is a failed conference session
                        'dialog.sessionRestarted', // show when a client reload is initiated because of bridge migration
                        'dialog.tokenAuthFailed', // show when an invalid jwt is used
                        'dialog.transcribing', // transcribing notifications (pending, off)
                        'dialOut.statusMessage', // shown when dial out status is updated.
                        'liveStreaming.busy', // shown when livestreaming service is busy
                        'liveStreaming.failedToStart', // shown when livestreaming fails to start
                        'liveStreaming.unavailableTitle', // shown when livestreaming service is not reachable
                        'lobby.joinRejectedMessage', // shown when while in a lobby, user's request to join is rejected
                        'lobby.notificationTitle', // shown when lobby is toggled and when join requests are allowed / denied
                        'localRecording.localRecording', // shown when a local recording is started
                        'notify.disconnected', // shown when a participant has left
                        'notify.invitedOneMember', // shown when 1 participant has been invited
                        'notify.invitedThreePlusMembers', // shown when 3+ participants have been invited
                        'notify.invitedTwoMembers', // shown when 2 participants have been invited
                        'notify.kickParticipant', // shown when a participant is kicked
                        'notify.mutedRemotelyTitle', // shown when user is muted by a remote party
                        'notify.mutedTitle', // shown when user has been muted upon joining,
                        'notify.newDeviceAudioTitle', // prompts the user to use a newly detected audio device
                        'notify.newDeviceCameraTitle', // prompts the user to use a newly detected camera
                        'notify.passwordRemovedRemotely', // shown when a password has been removed remotely
                        'notify.passwordSetRemotely', // shown when a password has been set remotely
                        'notify.raisedHand', // shown when a partcipant used raise hand,
                        'notify.startSilentTitle', // shown when user joined with no audio
                        'prejoin.errorDialOut',
                        'prejoin.errorDialOutDisconnected',
                        'prejoin.errorDialOutFailed',
                        'prejoin.errorDialOutStatus',
                        'prejoin.errorStatusCode',
                        'prejoin.errorValidation',
                        'recording.busy', // shown when recording service is busy
                        'recording.failedToStart', // shown when recording fails to start
                        'recording.unavailableTitle', // shown when recording service is not reachable
                        'toolbar.noAudioSignalTitle', // shown when a broken mic is detected
                        'toolbar.noisyAudioInputTitle', // shown when noise is detected for the current microphone
                        'toolbar.talkWhileMutedPopup', // shown when user tries to speak while muted
                        'transcribing.failedToStart' // shown when transcribing fails to start
                    ],
                    remoteVideoMenu: {
                        disableKick: true,
                        disableGrantModerator: true
                    },
                    disableRemoteMute: true,
                    disableInviteFunctions: true
                },
                interfaceConfigOverwrite: {
                    LANG_DETECTION: false,
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }
            };
            jitsiApi = new JitsiMeetExternalAPI(domain, optionsCall);
            jitsiApi.executeCommand('avatarUrl', getAvatar(userInfo.id));
            jitsiApi.addListener('readyToClose', () => {
                onClose();
                onHangup();
            });
            jitsiApi.addEventListener('participantJoined', () => {
                window.onbeforeunload = null;
                $modal.click({ audioOnly: isAudioOnly }, modalStateSwitch);
                if (!isAccept) {
                    clearTimeout(timeout);
                    $notifyForm.hide();
                    switchState(true);
                }
                $audio[0].pause();
            });
            jitsiApi._frame.addEventListener('load', () => {
                if (!isAccept) {
                    window.onbeforeunload = cancelCall;
                    $notifyForm.find('h2').html('Calling...');
                    $audio[0].pause();
                    $audio[0].src = audioCall;
                    $audio[0].loop = 'loop';
                    $audio[0].play();
                    postCall(isAudioOnly);
                }
            });
        }).catch((err) => {
            console.error(err);
            $modal.remove();
        });
        $videoCallerWrap.attr('class', '').addClass('video-caller');
    };

    const onAccept = (event) => {
        $modalDialog.removeClass('accept-state');

        $audio[0].pause();
        acceptCall();
        setupWebrtc(event.data.audioOnly, true);
    };

    const onDeclareDom = (isAudioOnly) => {
        $modal = $('#modalPhoneRequest');
        $modalDialog = $modal.find('.modal-dialog');
        $modalBody = $modal.find('.modal-body');
        $iframeWrapper = $modalBody.find('.video-call-modal-body');
        $btnModalStateSwitch = $modal.find('#modal-state-switch');
        $btnModalStateSwitchIcon = $modal.find('#modal-state-switch i');
        $modalDrag = $modal.find('#modal-drag');
        $videoCallerWrap = $('.video-caller');
        $callAnimation = $('.call-animation');
        $imgSender = $('.vcnf-image');
        $nameSender = $('.vcnf-name');
        $acceptBtn = $('.vcnf-accept');
        $hangupBtn = $('.vcnf-hangup');
        $audio = $('#video-call-audio');
        $notifyForm = $('.video-call-notify-form');

        $hangupBtn.off().click(onHangup);
        $acceptBtn.off().click({ audioOnly: isAudioOnly }, onAccept);
        $btnModalStateSwitch.off().click({ audioOnly: isAudioOnly }, modalStateSwitch);
    };

    return {
        onInit: (isAudioOnly, sender, rid) => {
            if (listenOnlyOne) {
                return;
            }

            if (!$('#modalPhoneRequest').length) {
                $('body').append(renderTemplate);
            }
            onDeclareDom(isAudioOnly);
            $modalDialog.addClass('accept-state');
            if (sender) {
                $modal.attr('class', 'modal show maximize');
                $btnModalStateSwitchIcon.attr('class', 'icon-minimize-window');
                $audio[0].src = audioIncomingCall;
                $audio[0].loop = 'loop';
                $audio[0].play();
                $btnModalStateSwitch.hide();
                const userName = GLOBAL.getRoomInfoWasEdited()[sender.id]?.user_name || sender.name;
                [roomInfo] = GLOBAL.getRooms().filter(room => (room.id === rid));
                if (isAudioOnly === true) {
                    $notifyForm.find('h2').html('Incoming audio call...');
                }
                $nameSender.html(userName);
                if (roomInfo.group) {
                    $imgSender.attr('src', getAvatar(roomInfo.id, true));
                } else {
                    $imgSender.attr('src', getAvatar(sender.id));
                }

                if (isInit) {
                    isInit = false;
                    $audio[0].pause();
                    onClose();
                }
            } else {
                [roomInfo] = GLOBAL.getRooms().filter(r => (r.id === GLOBAL.getCurrentRoomId()));
                // $audio[0].src = audioConnecting;
                // $audio[0].loop = 'loop';
                // $audio[0].play();
                timeout = setTimeout(onCancel, 60000);
                setupWebrtc(isAudioOnly);
            }

            $callAnimation.addClass(hide);
            $modal.modal('show');
        },
        onEndCall: () => {
            if (!$modalDialog.hasClass('accept-state')) {
                onClose();
            } else {
                $audio[0].pause();
                $modal.remove();
            }
        },
        onAcceptCall: () => {
            if ($modalDialog.hasClass('accept-state')) {
                $audio[0].pause();
                $modal.remove();
            }
        }
    };
});
