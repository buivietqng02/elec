/* eslint no-underscore-dangle: ["error", { "allow": ["_frame"] }] */
define([
    'app/constant',
    'shared/api',
    'shared/data',
    'assets/js/jitsi_external_api',
    'features/sidebar/sidebarLeftBar'
], (
    constant,
    API,
    GLOBAL,
    JitsiMeetExternalAPI,
    sidebarLeftBarComp
) => {
    let conferenceBtn;
    let iframeConferenceWraper;
    let startConfContainer;
    let xmConferenceLoading;
    let confContentIframeBtnGroup;
    let copyAndShareBtn;

    let domain;
    let options;
    let jitsiApi;
    let roomId;
    let sharedRoomId;

    const copyToClipBoard = () => {
        const body = document.querySelector('body');
        const div = document.createElement('div');
        div.setAttribute('class', 'alert__invite alert alert-success');
        div.textContent = 'Paste Room ID in chat section to invite team to the conference call';

        copyAndShareBtn.addEventListener('click', () => {
            const link = `${constant.BASE_URL.substring(0, constant.BASE_URL.length - 3)}${constant.ROUTE.meeting}/${roomId}`;
            navigator.clipboard.writeText(link);

            copyAndShareBtn.textContent = 'Copied!';

            setTimeout(() => {
                sidebarLeftBarComp.onSwitchToChat();
                body.append(div);
                copyAndShareBtn.textContent = 'Invite';
            }, 1000);

            setTimeout(() => {
                body.removeChild(div);
            }, 12000);
        });
    };

    const initJitsiConference = (inviteID) => {
        while (iframeConferenceWraper.firstChild) {
            iframeConferenceWraper.removeChild(iframeConferenceWraper.firstChild);
        }

        startConfContainer.style.display = 'none';
        xmConferenceLoading.style.display = 'block';

        API.get('conference').then((res) => {
            domain = constant.BASE_URL.replace('https://', '').replace('/xm', '') + constant.ROUTE.meeting;

            if (inviteID === undefined || inviteID === null || inviteID === '') {
                roomId = (+new Date()).toString(16).toUpperCase();
            } else {
                roomId = inviteID;
            }

            options = {
                roomName: roomId,
                width: '100%',
                height: '100%',
                jwt: res,
                parentNode: iframeConferenceWraper,
                userInfo: {
                    displayName: GLOBAL.getInfomation().name
                },
                configOverwrite: {
                    disableDeepLinking: true,
                    startWithAudioMuted: true,
                    startWithVideoMuted: true,
                    toolbarButtons: [
                        'camera',
                        //    'chat',
                        'closedcaptions',
                        'desktop',
                        'download',
                        //    'embedmeeting',
                        'etherpad',
                        'feedback',
                        'filmstrip',
                        'fullscreen',
                        'hangup',
                        'help',
                        'invite',
                        'livestreaming',
                        'microphone',
                        'mute-everyone',
                        'mute-video-everyone',
                        'participants-pane',
                        'profile',
                        'raisehand',
                        'recording',
                        'security',
                        'select-background',
                        'settings',
                        'shareaudio',
                        'sharedvideo',
                        'shortcuts',
                        'stats',
                        'tileview',
                        'toggle-camera',
                        'videoquality',
                        '__end'
                    ],
                    prejoinPageEnabled: false
                }
            };

            jitsiApi = new JitsiMeetExternalAPI(domain, options);
            jitsiApi._frame.addEventListener('load', () => {
                xmConferenceLoading.style.display = 'none';
                confContentIframeBtnGroup.style.display = 'block';
                sharedRoomId.textContent = roomId;
                iframeConferenceWraper.classList.add('iframeActive');
                copyToClipBoard();
            }, true);
            jitsiApi.addListener('readyToClose', () => {
                jitsiApi._frame.remove();
                startConfContainer.style.display = 'block';
                confContentIframeBtnGroup.style.display = 'none';
                iframeConferenceWraper.classList.remove('iframeActive');
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    const initConferencePage = (inviteID) => {
        conferenceBtn.addEventListener('click', () => {
            initJitsiConference(inviteID);
        });
    };

    return {
        onInit: () => {
            conferenceBtn = document.querySelector('#conference-content__startBtn');

            iframeConferenceWraper = document.querySelector('.conference-content-iframe');

            startConfContainer = document.querySelector('.start-conference-container');

            xmConferenceLoading = document.querySelector('.xm-meeting-loading');

            sharedRoomId = document.querySelector('.share-roomid');

            confContentIframeBtnGroup = document.querySelector('.conference-content-iframe-buttons');

            copyAndShareBtn = confContentIframeBtnGroup.querySelector('.share-roomid-btn');

            initConferencePage();
        },

        onInitConferencePage: (inviteID) => initJitsiConference(inviteID)
    };
});
