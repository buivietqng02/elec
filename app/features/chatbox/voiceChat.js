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
    const { API_URL, TOKEN } = constant;
    const token = functions.getDataToLocalApplication(TOKEN) || '';

    let isVoiceInit = false;
    let initVoiceChat;
    let initVoiceButton;
    let stream = null;
    let chunks = [];
    let recorder;

    let pulseRing;

    let notiStatus;
    let notiMessage;
    let startRecordBtn;

    let secondCount = 0;
    let holdTime;
    let $percentProgress;
    let $pathCircle;
    let $progressWrapper;

    // const getDuration = (url, next) => {
    //     let audio = new Audio(url);
    //     audio.addEventListener("durationchange", function (e) {
    //         if (this.duration !== Infinity) {
    //             let duration = this.duration
    //             audio.remove();
    //             next(duration);
    //         };
    //     }, false);
    //     audio.load();
    //     audio.currentTime = 24 * 60 * 60; //fake big time
    // };

    // const timeConvert = (time) => {
    //     // Calculate the time left and the total duration
    //     let currentMinutes = Math.floor(time / 60);
    //     let currentSeconds = Math.floor(time - currentMinutes * 60);

    //     // Add a zero to the single digit time values
    //     if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
    //     if (currentMinutes < 10) { currentMinutes = `0${currentMinutes}`; }

    //     return `${currentMinutes}:${currentSeconds}`;
    // };

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

        // Have to hold at least 0.5s to start the record
        holdTime = setInterval(() => {
            secondCount++;

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
        }, 500);
    };

    const releaseRecord = (event) => {
        pulseRing.classList.remove('active');

        // console.log(recorder.state, secondCount)
        clearInterval(holdTime);

        if (event === 'mouseup') {
            notiStatus.innerHTML = '';

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
        }

        // If the record less than 1 second will not display 
        if (recorder.state === 'recording') {
            recorder.stop();
            startRecordBtn.style.background = '';
        }
    };

    const callAPI = (file) => {
        console.log(token);
        const fd = new FormData();
        $progressWrapper.show();
        fd.append('file', file);
        fd.append('chat_id', GLOBAL.getCurrentRoomId());

        $.ajax({
            type: 'POST',
            url: `${API_URL}/audioupload`,
            data: fd,
            headers: {
                'X-Authorization-Token': token
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
    //             'X-Authorization-Token': token
    //         },
    //         body: fd

    //     });

    //     return response.json(); // parses JSON response into native JavaScript objects
    // }

    const initRecordFunc = async (comment) => {
        if (comment === 'start') {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

                try {
                    console.log(stream);
                    recorder = new MediaRecorder(stream);

                    console.log(recorder);

                    startRecordBtn.addEventListener('mousedown', holdRecord);
                    startRecordBtn.addEventListener('mouseup', () => releaseRecord('mouseup'));
                    startRecordBtn.addEventListener('mouseleave', () => releaseRecord('mouseleave'));

                    startRecordBtn.addEventListener('touchstart', holdRecord);
                    startRecordBtn.addEventListener('touchend', releaseRecord);

                    recorder.ondataavailable = e => {
                        chunks.push(e.data);
                        console.log("chunks", chunks, chunks.length);
                    };

                    recorder.onstop = e => {
                        if (recorder.state === 'inactive' && secondCount >= 2) {
                            const blob = new Blob(chunks, { 'type': 'audio/webm' });

                            console.log(blob);
                            //  ===  call API ====
                            // postData(blob).then(response => {
                            //     console.log(response);
                            // });

                            callAPI(blob)
                            // ==================================
                            chunks = [];
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
            stream.getTracks().forEach(function (track) { track.stop() });
        }
    };

    const toggleVoiceChat = () => {
        console.log('click');

        if (!isVoiceInit) {
            initRecordFunc('start');
            initVoiceChat.innerHTML = `📣`;
            initVoiceButton.style.display = 'block';
            isVoiceInit = true;
        } else {
            initVoiceChat.innerHTML = `💬`;
            initVoiceButton.style.display = 'none';

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

            initVoiceChat.addEventListener('click', toggleVoiceChat);
        }
    };
})
