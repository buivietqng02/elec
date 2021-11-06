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
    let toggleFullScreen;
    let conferenceContent;
    let isFullScreen;
    let hoverArea;
    let closeAlert;

    let domain;
    let options;
    let jitsiApi;
    let roomId;
    let sharedRoomId;

    const conferenceBtnGroupTemplate = `
    <div class="hover-toggle-area">
        <div class="conference-content-iframe-buttons text-center">
            <div class="share-roomid-wrap">
                <span class="share-roomid"></span>
                <button class="btn btn-info share-roomid-btn" data-toggle="tooltip" data-placement="left" title="COPY_TO_CLIPBOARD" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD">Invite</button>
            </div>

            <div class="full-screen-wrap">
                <button class="btn btn-success toggle-full-screen" data-toggle="tooltip" data-placement="right" title="FULL_SCREEN" data-lang-type="tooltip" data-language="FULL_SCREEN"><i class="icon-fullscreen"></i></button>
            </div>
        </div>
    </div>
    `;

    const closeAlertFunc = (body, divAlert) => {
        closeAlert.addEventListener('click', () => {
            body.removeChild(divAlert);
        });
    };

    const copyToClipBoard = () => {
        const body = document.querySelector('body');
        const div = document.createElement('div');
        div.setAttribute('class', 'alert__invite alert alert-success');
        div.innerHTML = '<span>Paste RoomID in chat section to invite team to the conference call</span><button class="btn btn-outline-primary close-alert"><i class="icon-close"></i></button>';

        copyAndShareBtn.addEventListener('click', () => {
            const link = `${constant.BASE_URL.substring(0, constant.BASE_URL.length - 3)}${constant.ROUTE.meeting}/${roomId}`;
            navigator.clipboard.writeText(link);

            copyAndShareBtn.textContent = 'Copied!';

            setTimeout(() => {
                sidebarLeftBarComp.onSwitchToChat();
                body.append(div);
                copyAndShareBtn.textContent = 'Invite';

                closeAlert = document.querySelector('.close-alert');

                if (document.querySelector('.alert__invite')) { 
                    closeAlertFunc(body, div);
                }
            }, 1000);

            setTimeout(() => {
                if (document.querySelector('.alert__invite')) {
                    body.removeChild(div);
                }
            }, 12000);
        });
    };

    const mouseEnter = () => {
        confContentIframeBtnGroup.style.top = '10px';  
    };
    const mouseLeave = () => {
        confContentIframeBtnGroup.style.top = '-100px'; 
    };

    const toggleFullScreenFunc = () => {
        toggleFullScreen.addEventListener('click', () => {
            if (isFullScreen) {
                conferenceContent.classList.remove('fullScreen');
                hoverArea.removeEventListener('mouseover', mouseEnter);
                hoverArea.removeEventListener('mouseout', mouseLeave);
                confContentIframeBtnGroup.style.padding = '0px';
                confContentIframeBtnGroup.style.top = '10px';  
            } else {
                conferenceContent.classList.add('fullScreen');
                confContentIframeBtnGroup.style.top = '-100px';  

                setTimeout(() => {
                    confContentIframeBtnGroup.style.padding = '15px';
                    hoverArea.addEventListener('mouseover', mouseEnter);
                    hoverArea.addEventListener('mouseout', mouseLeave);
                }, 500);
            }
            
            isFullScreen = !isFullScreen;
        });
    };

    const initJitsiConference = (inviteID) => {
        while (iframeConferenceWraper.firstChild) {
            iframeConferenceWraper.removeChild(iframeConferenceWraper.firstChild);
        }
        const divTemplate = document.createElement('div');
        divTemplate.innerHTML = conferenceBtnGroupTemplate;

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
               
                iframeConferenceWraper.style.display = 'block';

                conferenceContent.append(divTemplate);
               
                sharedRoomId = document.querySelector('.share-roomid');
                sharedRoomId.textContent = roomId;

                confContentIframeBtnGroup = document.querySelector('.conference-content-iframe-buttons');
                copyAndShareBtn = confContentIframeBtnGroup.querySelector('.share-roomid-btn');
                toggleFullScreen = confContentIframeBtnGroup.querySelector('.toggle-full-screen');
                hoverArea = document.querySelector('.hover-toggle-area');

                copyToClipBoard();
                toggleFullScreenFunc();
            }, true);
            jitsiApi.addListener('readyToClose', () => {
                jitsiApi._frame.remove();
                startConfContainer.style.display = 'block';
                iframeConferenceWraper.style.display = 'none';

                conferenceContent.removeChild(divTemplate);

                conferenceContent.classList.remove('fullScreen');
                confContentIframeBtnGroup.style.padding = '0px';
                confContentIframeBtnGroup.style.top = '10px';  

                isFullScreen = false;
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
            isFullScreen = false;

            conferenceContent = document.querySelector('#conference-content');

            conferenceBtn = document.querySelector('#conference-content__startBtn');

            iframeConferenceWraper = document.querySelector('.conference-content-iframe');

            startConfContainer = document.querySelector('.start-conference-container');

            xmConferenceLoading = document.querySelector('.xm-meeting-loading');

            initConferencePage();
        },

        onInitConferencePage: (inviteID) => initJitsiConference(inviteID)
    };
});
