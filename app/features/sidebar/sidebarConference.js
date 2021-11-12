/* eslint no-underscore-dangle: ["error", { "allow": ["_frame"] }] */
define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions',
    'assets/js/jitsi_external_api',
    'features/sidebar/sidebarLeftBar'
], (
    constant,
    API,
    GLOBAL,
    functions,
    JitsiMeetExternalAPI,
    sidebarLeftBarComp
) => {
    const { getAvatar } = functions;
    let conferenceBtn;
    let joinExistingRoomBtn;
    let joinExistingRoomInput;

    let iframeConferenceWraper;
    let startConfContainer;
    let xmConferenceLoading;
    let confContentIframeBtnGroup;
    let copyAndShareBtn;
    
    let conferenceContent;
  
    let isOpening;
    let hoverArea;
    let closeAlert;

    let domain;
    let options;
    let jitsiApi;
    let roomId;
    let sharedRoomId;

    const conferenceBtnGroupTemplate = (language) => `
    <div class="hover-toggle-area">
        <div class="conference-content-iframe-buttons text-center">
            <div class="share-roomid-wrap">
                <span class="share-roomid"></span>
                <button class="btn btn-info share-roomid-btn" data-toggle="tooltip" data-placement="left" title="CLICK_TO_COPY_AND_SHARE" data-lang-type="tooltip" data-language="CLICK_TO_COPY_AND_SHARE">${language.INVITE_PEOPLE}</button>
            </div>
        </div>
    </div>
    `;

    const alertTemplate = (text) => `<span data-language="PASTE_TO_SHARE">${text}</span><button class="btn btn-outline-primary close-alert"><i class="icon-close"></i></button>`;

    const closeAlertFunc = (body, divAlert) => {
        closeAlert.addEventListener('click', () => {
            body.removeChild(divAlert);
        });
    };

    const copyToClipBoard = () => {
        const body = document.querySelector('body');
        const div = document.createElement('div');
        div.setAttribute('class', 'alert__invite alert alert-success');

        div.innerHTML = alertTemplate(GLOBAL.getLangJson().PASTE_TO_SHARE);

        copyAndShareBtn.addEventListener('click', () => {
            const link = `${constant.BASE_URL.substring(0, constant.BASE_URL.length - 3)}${constant.ROUTE.meeting}/${roomId}`;
            navigator.clipboard.writeText(link);

            copyAndShareBtn.textContent = GLOBAL.getLangJson().COPIED_TO_CLIPBOARD;

            setTimeout(() => {
                sidebarLeftBarComp.onSwitchToChat();
                body.append(div);
                copyAndShareBtn.textContent = GLOBAL.getLangJson().INVITE_PEOPLE;

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

    const initJitsiConference = (inviteID) => {
        while (iframeConferenceWraper.firstChild) {
            iframeConferenceWraper.removeChild(iframeConferenceWraper.firstChild);
        }

        if (isOpening === true) { 
            const divTemp = document.querySelector('#divTemplate');
            iframeConferenceWraper.style.display = 'none';
            conferenceContent.removeChild(divTemp);
        }  

        const divTemplate = document.createElement('div');
        divTemplate.innerHTML = conferenceBtnGroupTemplate(GLOBAL.getLangJson());
        divTemplate.id = 'divTemplate';

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
            jitsiApi.executeCommand('avatarUrl', getAvatar(GLOBAL.getInfomation().id));
            jitsiApi._frame.addEventListener('load', () => {
                isOpening = true;

                xmConferenceLoading.style.display = 'none';
               
                iframeConferenceWraper.style.display = 'block';

                conferenceContent.append(divTemplate);
               
                sharedRoomId = document.querySelector('.share-roomid');
                sharedRoomId.textContent = roomId;

                confContentIframeBtnGroup = document.querySelector('.conference-content-iframe-buttons');
                copyAndShareBtn = confContentIframeBtnGroup.querySelector('.share-roomid-btn');
                hoverArea = document.querySelector('.hover-toggle-area');

                copyToClipBoard();
                hoverArea.addEventListener('mouseover', mouseEnter);
                hoverArea.addEventListener('mouseout', mouseLeave);
            }, true);
            jitsiApi.addListener('readyToClose', () => {
                jitsiApi._frame.remove();
                startConfContainer.style.display = 'block';
                iframeConferenceWraper.style.display = 'none';
                conferenceContent.removeChild(divTemplate);
                isOpening = false;
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    const initConferencePage = (inviteID) => {
        conferenceBtn.addEventListener('click', () => {
            initJitsiConference(inviteID);
        });

        joinExistingRoomInput.addEventListener('keyup', () => {
            if (joinExistingRoomInput.value.trim().length === 0) {
                joinExistingRoomBtn.disabled = true;
            } else {
                joinExistingRoomBtn.disabled = false;
            }
        });

        joinExistingRoomBtn.addEventListener('click', () => {
            const body = document.querySelector('body');
            const div = document.createElement('div');
            div.setAttribute('class', 'alert__joinExitingRoom alert alert-danger');

            const existingRoomId = joinExistingRoomInput.value;
            if (existingRoomId === '' || existingRoomId === undefined || existingRoomId.trim().length !== 11) {
                div.innerHTML = alertTemplate(GLOBAL.getLangJson().WRONG_ROOM_ID_FORMAT);

                body.append(div);
                closeAlert = document.querySelector('.close-alert');

                if (document.querySelector('.alert__joinExitingRoom')) { 
                    closeAlertFunc(body, div);
                }

                setTimeout(() => {
                    if (document.querySelector('.alert__joinExitingRoom')) {
                        body.removeChild(div);
                    }
                }, 5000);

                return;
            }
            initJitsiConference(existingRoomId);
        });
    };

    return {
        onInit: () => {
            isOpening = false;

            conferenceContent = document.querySelector('#conference-content');

            conferenceBtn = document.querySelector('#conference-content__startBtn');

            iframeConferenceWraper = document.querySelector('.conference-content-iframe');

            startConfContainer = document.querySelector('.start-conference-container');

            xmConferenceLoading = document.querySelector('.xm-meeting-loading');

            joinExistingRoomBtn = document.querySelector('#join-existing-room__btn');

            joinExistingRoomInput = document.querySelector('.join-existing-room__input');

            // style text orJointExistingRoomText
            const orJointExistingRoomText = document.querySelector('.or-joint-existing-room');
            if (GLOBAL.getLanguage() === constant.LANGUAGES.russian) {
                orJointExistingRoomText.classList.add('russialangStyle');
            } else {
                orJointExistingRoomText.classList.remove('russialangStyle');
            }

            initConferencePage();
        },

        onInitConferencePage: (inviteID) => initJitsiConference(inviteID)
    };
});
