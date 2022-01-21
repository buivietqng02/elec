define([
    'axios',
    'app/constant',
    'shared/data',
    'shared/alert',
    'shared/functions',
    'features/modal/modalPhoneRequest'
], (
    axios,
    constant,
    GLOBAL
) => {
    const { API_URL } = constant;

    let isVoiceInit = false;
    let initVoiceChat;
    let initVoiceButton;
    // let btnVoiceChatPic;
    let stream = null;
    let chunks = [];
    let recorder;

    let pulseRing;

    let notiStatus;
    // let notiMessage;
    let startRecordBtn;

    let secondCount;
    let holdTime;
    let $percentProgress;
    let $pathCircle;
    let $progressWrapper;

    let inputTextChat;
    let attachBtn;

    let btnVoiceChatDescription;

    // Play stop audio
    const timeConvert = (time) => {
        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(time / 60);
        let currentSeconds = Math.floor(time - currentMinutes * 60);

        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
        if (currentMinutes < 10) { currentMinutes = `0${currentMinutes}`; }

        return `${currentMinutes}:${currentSeconds}`;
    };

    const getAudioID = (string) => {
        let stringValue;
        if (string.includes('audio-')) {
            stringValue = string.substring(6, string.length);
        }

        if (string.includes('btn-')) {
            stringValue = string.substring(4, string.length);
        }

        return stringValue;
    };

    const addEventListenerToAudioRecorder = (id) => {
        const audio = document.querySelector(`#audio-${id}`);
        const playStopBtn = document.querySelector(`#btn-${id}`);

        let countDownTimmer;
        const audioMicroPic = document.querySelector(`#btn-${id} .icon-mic-js`);
        const isPlaying = playStopBtn.getAttribute('isPlaying');
        const audioTime = document.querySelector(`#btn-${id} .audio-timeIndicate`);
        const audioBar = document.querySelectorAll(`#btn-${id} .audio-bar`);

        let audioProgress = document.querySelectorAll(`#btn-${id} .audio-progress`);

        if (!audioProgress || audioProgress.length === 0) {
            audioBar[0].innerHTML = '<div class="audio-progress"></div>';
            audioBar[1].innerHTML = '<div class="audio-progress"></div>';

            audioProgress = document.querySelectorAll(`#btn-${id} .audio-progress`);
        }

        const durationAudio = parseFloat(audio.getAttribute('duration'));

        if (isPlaying === 'true') {
            playStopBtn.setAttribute('isPlaying', false);
            audio.pause();
            audioMicroPic.classList.replace('icon-microphoneVoiceBlue', 'icon-microphoneVoice');
            clearInterval(countDownTimmer);

            audioProgress[0].style.animationPlayState = 'paused';
            audioProgress[1].style.animationPlayState = 'paused';
        }

        if (isPlaying === 'false') {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioMicroPic.classList.replace('icon-microphoneVoice', 'icon-microphoneVoiceBlue');
                    // console.log(audio.getAttribute('duration'))
                    countDownTimmer = setInterval(() => {
                        audioTime.textContent = timeConvert(durationAudio - audio.currentTime);
                    }, 1000);

                    audioProgress[0].style.animationName = 'left';
                    audioProgress[1].style.animationName = 'right';

                    audioProgress[0].style.animationPlayState = 'running';
                    audioProgress[1].style.animationPlayState = 'running';

                    audioProgress[0].style.animationDuration = `${durationAudio / 2}s`;
                    audioProgress[1].style.animationDuration = `${durationAudio / 2}s`;
                    audioProgress[1].style.animationDelay = `${durationAudio / 2}s`;

                    playStopBtn.setAttribute('isPlaying', true);
                })
                    .catch(error => {
                        console.log(error);
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }

        audio.addEventListener('ended', () => {
            audioMicroPic.classList.replace('icon-microphoneVoiceBlue', 'icon-microphoneVoice');
            playStopBtn.setAttribute('isPlaying', false);
            clearInterval(countDownTimmer);

            audioTime.textContent = timeConvert(durationAudio);

            audioBar[0].innerHTML = '';
            audioBar[1].innerHTML = '';
        });
    };

    const audioPlayStopFunc = (e) => {
        e.target.setAttribute('isPlaying', false);
        addEventListenerToAudioRecorder(getAudioID(e.target.id));
    };

    // End Play stop audio

    const percentCircle = (numberPercent) => {
        let percent = numberPercent;
        if (numberPercent < 0) {
            percent = 0;
        }

        if (numberPercent > 100) {
            percent = 100;
        }

        return ((100 - percent) / 100) * Math.PI * (9 * 2);
    };

    const progressUpload = (e) => {
        if (e.lengthComputable) {
            const max = e.total;
            const current = e.loaded;
            const percentage = (current * 100) / max;
            const strokeDashoffset = percentCircle(percentage);

            $percentProgress.html(Math.round(percentage));
            $pathCircle.attr('stroke-dashoffset', strokeDashoffset);
        }
    };

    const hideProcess = () => {
        $progressWrapper.hide();
        $percentProgress.html(Math.round(0));
        $pathCircle.attr('stroke-dashoffset', percentCircle(0));
    };

    const holdRecord = () => {
        pulseRing.classList.add('active');
        secondCount = 0;
        // Have to hold at least 1s to start the record
        holdTime = setInterval(() => {
            secondCount += 1;
        }, 1000);

        btnVoiceChatDescription.innerHTML = `<div><lang data-language="RELEASE_TO_SEND">${GLOBAL.getLangJson().RELEASE_TO_SEND}</lang></div>`;
        btnVoiceChatDescription.style.bottom = '160px';

        // cancelRecord = document.querySelector('.cancel-voice-record');
        if (recorder.state === 'inactive') {
            recorder.start();
            startRecordBtn.style.background = 'white';
            notiStatus.innerHTML = `
            <div id="bars">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>`;
        }
    };

    const releaseRecord = (event) => {
        pulseRing.classList.remove('active');
        // console.log(recorder.state, secondCount);

        if (event === 'mouseup') {
            notiStatus.innerHTML = '';
            notiStatus.textContent = '';
            btnVoiceChatDescription.innerHTML = `<div><lang data-language="HOLD_TO_SPEAK">${GLOBAL.getLangJson().HOLD_TO_SPEAK}</lang></div>`;
            btnVoiceChatDescription.style.bottom = '10px';
        }

        if (event === 'mouseleave') {
            notiStatus.innerHTML = '';
            btnVoiceChatDescription.innerHTML = `<div><lang data-language="HOLD_TO_SPEAK">${GLOBAL.getLangJson().HOLD_TO_SPEAK}</lang></div>`;
            btnVoiceChatDescription.style.bottom = '10px';
        }
        clearInterval(holdTime);
        // If the record less than 1 second will not display 
        if (recorder.state === 'recording') {
            setTimeout(() => {
                recorder.stop();
                startRecordBtn.style.background = '';
            }, 1000);
        }
    };

    const callAPI = (file, namefile) => {
        const formData = new window.FormData();
        $progressWrapper.show();
        formData.append('file', file, namefile);

        axios.post(`${API_URL}/chats/${GLOBAL.getCurrentRoomId()}/audio`,
            formData,
            {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => progressUpload(progressEvent)
            })
            .then(() => {
                hideProcess();
                const $wrapper = $('.js_con_list_mess');
                $wrapper.animate({ scrollTop: $wrapper[0].scrollHeight }, 200);
            })
            .catch(() => hideProcess());
    };

    const setMouseUPEvent = () => {
        releaseRecord('mouseup');
        // window.removeEventListener('mousemove', getMousePosition);
        window.removeEventListener('mouseup', setMouseUPEvent);
        // window.removeEventListener('touchmove', touchPosition);
        window.removeEventListener('touchend', setMouseUPEvent);
    };

    const initRecordFunc = async (comment) => {
        if (comment === 'start') {
            let mimeTypeBrowser = 'audio/webm';

            if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
                mimeTypeBrowser = 'audio/mp4';
            } else {
                mimeTypeBrowser = 'audio/webm';
            }

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

                try {
                    recorder = new window.MediaRecorder(stream, { mimeType: mimeTypeBrowser });
                    // Click event for pc
                    startRecordBtn.addEventListener('mousedown', () => {
                        holdRecord();
                        // mouseMoved = false;
                        // window.addEventListener('mousemove', getMousePosition);
                        window.addEventListener('mouseup', setMouseUPEvent);
                    });

                    // Touch event for mobile
                    startRecordBtn.addEventListener('touchstart', () => {
                        holdRecord();
                        // mouseMoved = false;
                        // window.addEventListener('touchmove', touchPosition);
                    });
                    startRecordBtn.addEventListener('touchend', setMouseUPEvent);

                    recorder.ondataavailable = e => {
                        chunks.push(e.data);
                        // console.log(e.data);
                    };

                    recorder.onstop = () => {
                        console.log(secondCount);

                        if (recorder.state === 'inactive') {
                            // Remove && !isCanceled
                            const blob = new window.Blob(chunks, { type: mimeTypeBrowser });
                            //  ===  call API ====
                            chunks = [];

                            // Get audio duration of the files
                            const reader = new window.FileReader();
                            reader.onload = (event) => {
                                const audioContext = new (window.AudioContext
                                    || window.webkitAudioContext)();
                                // Asynchronously decode audio file data contained
                                // in an ArrayBuffer.
                                audioContext.decodeAudioData(event.target.result, (buffer) => {
                                    const { duration } = buffer;

                                    // Call API
                                    callAPI(blob, duration);
                                });
                            };
                            // In case that the file couldn't be read
                            reader.onerror = (event) => {
                                console.error('An error ocurred reading the file: ', event);
                            };
                            // Read file as an ArrayBuffer
                            reader.readAsArrayBuffer(blob);
                        }
                    };
                } catch (err) {
                    console.log('The following error occurred: ', err);
                }
            } else {
                console.log('getUserMedia not supported on your browser!');
                startRecordBtn.style.background = 'yellow';
            }
        }

        if (comment === 'stop') {
            if (stream) stream.getTracks().forEach((track) => { track.stop(); });
        }
    };

    const toggleVoiceChat = () => {
        if (!isVoiceInit) {
            initRecordFunc('start');
            if (GLOBAL.getBodyBgTheme() === 'body_theme_black') {
                initVoiceChat.innerHTML = '<i class="icon-keyboard-dark"></i>';
                btnVoiceChatDescription.style.color = '#80C9FF';
            } else {
                initVoiceChat.innerHTML = '<i class="icon-keyboard"></i>';
                btnVoiceChatDescription.style.color = '#111';
            }

            initVoiceButton.style.display = 'block';
            btnVoiceChatDescription.style.display = 'block';
            inputTextChat.classList.add('de-active');
            attachBtn.style.display = 'none';
            isVoiceInit = true;
            initVoiceChat.setAttribute('isUsingVoiceMess', true);
        } else {
            initRecordFunc('stop');
            initVoiceChat.innerHTML = '<i class="icon-microphoneVoice"></i>';
            initVoiceButton.style.display = 'none';
            btnVoiceChatDescription.style.display = 'none';
            inputTextChat.classList.remove('de-active');
            inputTextChat.style.height = '43px';
            attachBtn.style.display = 'block';
            isVoiceInit = false;
            initVoiceChat.setAttribute('isUsingVoiceMess', false);
        }
    };

    return {
        onInit: () => {
            // console.log('voice chat');
            $progressWrapper = $('.chatbox-progress-upload');
            $pathCircle = $progressWrapper.find('path');
            $percentProgress = $progressWrapper.find('span');

            initVoiceChat = document.querySelector('#init-voiceChat');
            initVoiceButton = document.querySelector('.voice-button-group');

            pulseRing = document.querySelector('.record__start-stop-pulse-ring');

            notiStatus = document.querySelector('#voice-statusRecording');
            // notiMessage = document.querySelector('#voice-statusMessage');
            startRecordBtn = document.querySelector('#record__start-stop__btn');

            inputTextChat = document.querySelector('.messages__input');
            attachBtn = document.querySelector('.btn__attach');

            btnVoiceChatDescription = document.querySelector('.btn-voice-chat-description');
            // btnVoiceChatPic = document.querySelector('.btn__voice-chat-picture');

            initVoiceChat.addEventListener('click', toggleVoiceChat);
        },

        audioPlayStopFunc: (e) => audioPlayStopFunc(e)
    };
});
