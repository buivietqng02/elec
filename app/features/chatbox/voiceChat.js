define([
    'app/constant',
    'shared/data',
    'shared/alert',
    'shared/functions',
    'features/modal/modalPhoneRequest'
], (
    constant,
    GLOBAL,
    ALERT,
    functions
) => {
    const { API_URL, ACCESS_TOKEN } = constant;

    let isVoiceInit = false;
    let initVoiceChat;
    let initVoiceButton;
    let btnVoiceChatPic;
    let stream = null;
    let chunks = [];
    let recorder;

    let pulseRing;

    let notiStatus;
    let notiMessage;
    let startRecordBtn;

    let secondCount;
    let holdTime;
    let $percentProgress;
    let $pathCircle;
    let $progressWrapper;

    let inputTextChat;
    let btnEmoji;

    let btnVoiceChatDescription;

    // const getDuration = (src) => {
    //     return new Promise(function (resolve) {
    //         let audio = new Audio();
    //         audio.addEventListener("loadedmetadata", () => {
    //             resolve(audio.duration);
    //         });
    //         audio.src = src;
    //     });
    // }

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
            secondCount++;

            btnVoiceChatDescription.innerHTML = 'Release button to send'

            if (recorder.state === 'inactive' && secondCount >= 1) {
                recorder.start();
                startRecordBtn.style.background = 'red';
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
        }, 1000);
    };

    const releaseRecord = (event) => {
        pulseRing.classList.remove('active');

        // console.log(recorder.state, secondCount)
        clearInterval(holdTime);

        if (event === 'mouseup') {
            notiStatus.innerHTML = '';

            btnVoiceChatDescription.innerHTML = 'Hold to speak'

            if (secondCount < 2) {
                console.log('Too short message');

                notiMessage.innerHTML = `<p class="voice-statusMessage__details">Too short message 💬 </p>`;

                setTimeout(() => {
                    notiMessage.innerHTML = '';
                }, 3000);
            }
        }

        if (event === 'mouseleave') {
            notiStatus.innerHTML = '';
            btnVoiceChatDescription.innerHTML = 'Hold to speak'
        }

        // If the record less than 1 second will not display 
        if (recorder.state === 'recording') {
            recorder.stop();
            startRecordBtn.style.background = '';
        }
    };

    const callAPI = (file, namefile) => {
        const fd = new FormData();
        $progressWrapper.show();
        fd.append('file', file, namefile);
        fd.append('chat_id', GLOBAL.getCurrentRoomId());
        console.log(fd)
        $.ajax({
            type: 'POST',
            url: `${API_URL}/audioupload`,
            data: fd,
            headers: {
                Authorization: `Bearer ${(functions.getDataToLocalApplication(ACCESS_TOKEN) || '')}`
            },
            xhr() {
                const myXhr = $.ajaxSettings.xhr();

                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', progressUpload, false);
                }

                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            success: hideProcess,
            error: hideProcess
        });
    };

    // async function postData(file) {
    //     // Default options are marked with *
    //     const fd = new FormData();
    //     fd.append('file', file);
    //     fd.append('chat_id', GLOBAL.getCurrentRoomId());

    //     const response = await fetch(`${API_URL}/audioupload`, {
    //         method: 'POST',
    //         headers: {
    //             Authorization: `Bearer ${(functions.getDataToLocalApplication(ACCESS_TOKEN) || '')}`
    //         },
    //         body: fd

    //     });

    //     return response.json(); // parses JSON response into native JavaScript objects
    // }

    const initRecordFunc = async (comment) => {
        if (comment === 'start') {
            let mimeTypeBrowser = 'audio/webm';
            if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
                mimeTypeBrowser = 'audio/mp4'
            } else {
                mimeTypeBrowser = 'audio/webm'
            }

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

                try {
                    recorder = new MediaRecorder(stream, { mimeType: mimeTypeBrowser });

                    startRecordBtn.addEventListener('mousedown', () => {
                        console.log("holding");
                        holdRecord();
                    });
                    startRecordBtn.addEventListener('mouseup', () => releaseRecord('mouseup'));
                    startRecordBtn.addEventListener('mouseleave', () => releaseRecord('mouseleave'));

                    startRecordBtn.addEventListener('touchstart', holdRecord);
                    startRecordBtn.addEventListener('touchend', releaseRecord);

                    recorder.ondataavailable = e => {
                        chunks.push(e.data);
                        console.log(e.data);
                    };

                    recorder.onstop = e => {
                        if (recorder.state === 'inactive' && secondCount >= 1) {
                            const blob = new Blob(chunks, { 'type': mimeTypeBrowser });
                            //  ===  call API ====
                            // postData(blob).then(response => {
                            //     console.log(response);
                            // });
                            chunks = [];

                            // Get audio duration of the files
                            let reader = new FileReader();
                            reader.onload = function (event) {
                                let audioContext = new (window.AudioContext || window.webkitAudioContext)();
                                // Asynchronously decode audio file data contained in an ArrayBuffer.
                                audioContext.decodeAudioData(event.target.result, function (buffer) {
                                    let duration = buffer.duration;
                                    console.log("Duration test: " + duration + " seconds");
                                    callAPI(blob, duration)
                                });
                            };
                            // In case that the file couldn't be read
                            reader.onerror = function (event) {
                                console.error("An error ocurred reading the file: ", event);
                            };
                            // Read file as an ArrayBuffer
                            reader.readAsArrayBuffer(blob);
                        }
                    };
                } catch (err) {
                    console.log('The following error occurred: ' + err);
                }
            } else {
                console.log('getUserMedia not supported on your browser!');
            }
        }

        if (comment === 'stop') {
            if (stream) stream.getTracks().forEach(function (track) { track.stop() });
        }
    };

    const toggleVoiceChat = () => {
        if (!isVoiceInit) {
            initRecordFunc('start');
            btnVoiceChatPic.src = "/assets/images/keyboard.png";
            initVoiceButton.style.display = 'block';
            btnVoiceChatDescription.style.display = 'block';
            inputTextChat.style.display = 'none';
            btnEmoji.style.display = 'none';
            isVoiceInit = true;
        } else {
            btnVoiceChatPic.src = "/assets/images/microphone.svg";
            initVoiceButton.style.display = 'none';
            btnVoiceChatDescription.style.display = 'none';
            inputTextChat.style.display = 'block';
            btnEmoji.style.display = 'block';
            initRecordFunc('stop');
            isVoiceInit = false;
        }
    };

    return {
        onInit: () => {
            console.log('voice chat');
            $progressWrapper = $('.chatbox-progress-upload');
            $pathCircle = $progressWrapper.find('path');
            $percentProgress = $progressWrapper.find('span');

            initVoiceChat = document.querySelector('#init-voiceChat');
            initVoiceButton = document.querySelector('.voice-button-group');

            pulseRing = document.querySelector('.record__start-stop-pulse-ring');

            notiStatus = document.querySelector('#voice-statusRecording');
            notiMessage = document.querySelector('#voice-statusMessage');
            startRecordBtn = document.querySelector('#record__start-stop__btn');

            inputTextChat = document.querySelector('.messages__input');
            btnEmoji = document.querySelector('.btn__emoji')

            btnVoiceChatDescription = document.querySelector('.btn-voice-chat-description')
            btnVoiceChatPic = document.querySelector('.btn__voice-chat-picture')

            initVoiceChat.addEventListener('click', toggleVoiceChat);
        }
    };
})
