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
    GLOBAL,
    ALERT,
    functions,
    modalPhoneRequestComp
) => {
    const { API_URL } = constant;
    let $attachButton;
    let $inputFile;
    let $inputImage;
    let $wrapper;
    let $callBtn;
    let $videoCallBtn;
    let $progressWrapper;
    let $pathCircle;
    let $percentProgress;
    let $dropzone;
    let initEventDoc = false;
    let isShow = false;
    let counter = 0;

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

    const offEventClickOutside = () => {
        isShow = false;
        $wrapper.hide();
        $(document).off('.hideAttachSlide');
    };

    const handleClickOutside = () => $(document).on('click.hideAttachSlide', (e) => {
        if (!$wrapper.is(e.target) && $wrapper.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isShow) {
            offEventClickOutside();
        } else {
            isShow = true;
            $wrapper.show();
            handleClickOutside();
        }
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
        $inputFile.get(0).value = '';
        $inputImage.get(0).value = '';
        $progressWrapper.hide();
        $percentProgress.html(Math.round(0));
        $pathCircle.attr('stroke-dashoffset', percentCircle(0));
    };

    const callAPI = (endpoint, file) => {
        const formData = new window.FormData();
        $progressWrapper.show();
        formData.append('file', file);
    
        axios.post(`${API_URL}/chats/${GLOBAL.getCurrentRoomId()}/${endpoint}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => progressUpload(progressEvent)
            })
            .then(() => hideProcess())
            .catch(() => hideProcess());
    };

    const checkFile = (file, isMedia) => {
        if (file.size > 500000000) {
            ALERT.show('Maximum file size is 400MB!');
            hideProcess();
            return;
        }

        if ((/(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(file.type)) {
            callAPI('image', file);
            return;
        }

        if ((/(mp4)$/i).test(file.type)) {
            callAPI('video', file);
            return;
        }

        if ((/audio/i).test(file.type)) {
            callAPI('audio', file);
            return;
        }

        if (isMedia && (/video/i).test(file.type)) {
            ALERT.show('Only MP4 files supported');
            return;
        }

        callAPI('file', file);
    };

    const uploadFile = (endpoint) => {
        if (endpoint === 'file') {
            callAPI(endpoint, $inputFile.get(0).files[0]);
        } else {
            checkFile($inputImage.get(0).files[0], true);
        }
    };

    const onDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        counter = 0;
        $dropzone.hide();

        if (e.originalEvent.dataTransfer.items && e.originalEvent.dataTransfer.items.length) {
            const item = e.originalEvent.dataTransfer.items[0];
            const file = item.getAsFile();
            const langJson = GLOBAL.getLangJson();

            if (!item.type) {
                return;
            }

            functions.confirm({
                title: langJson.ARE_YOU_SURE,
                textOk: langJson.OK,
                textCancel: langJson.CANCEL,
                des: langJson.ARE_YOU_SURE_SEND_FILE,
                onOk: () => checkFile(file)
            });
        }
    };

    const showPhoneModalAudioOnly = () => {
        if (!$('#modalPhoneRequest').hasClass('show')) {
            modalPhoneRequestComp.onInit(true);
        }
    };

    const showPhoneModalWithVideo = () => {
        if (!$('#modalPhoneRequest').hasClass('show')) {
            modalPhoneRequestComp.onInit(false);
        }
    };

    return {
        onInit: () => {
            isShow = false;
            counter = 0;
            $attachButton = $('.btn__attach');
            $inputFile = $('.--input-up-file');
            $inputImage = $('.--input-up-media');
            $wrapper = $('#media-menu');
            $callBtn = $('.--call-audio');
            $videoCallBtn = $('.--call-video');
            $progressWrapper = $('.chatbox-progress-upload');
            $pathCircle = $progressWrapper.find('path');
            $percentProgress = $progressWrapper.find('span');
            $dropzone = $('.dropzone');

            $attachButton.off().click(showSlide);
            $callBtn.off().click(showPhoneModalAudioOnly);
            $videoCallBtn.off().click(showPhoneModalWithVideo);
            $inputFile.off().change(() => {
                offEventClickOutside();
                uploadFile('file');
            });
            $inputImage.off().change(() => {
                offEventClickOutside();
                uploadFile('image');
            });
            $dropzone.off().on('dragover', false).on('drop', onDrop);

            if (!initEventDoc) {
                initEventDoc = true;
                document.addEventListener('dragover', e => {
                    e.preventDefault();
                });
                document.addEventListener('dragenter', e => {
                    e.preventDefault();
                    counter += 1;
                    $dropzone.show();
                }, false);
                document.addEventListener('dragleave', () => {
                    counter -= 1;
                    if (counter === 0) {
                        $dropzone.hide();
                    }
                }, false);
                document.addEventListener('drop', () => {
                    counter = 0;
                    $dropzone.hide();
                });
                document.onpaste = (event) => {
                    const { items } = (event.clipboardData || event.originalEvent.clipboardData);
                    console.log(items);
                    Object.keys(items).forEach((key) => {
                        const item = items[key];
                        if (item.kind === 'file' && GLOBAL.getCurrentRoomId()) {
                            const file = item.getAsFile();
                            console.log(file);
                            
                            checkFile(file);
                        }
                    });
                };
            }
        }
        // markPhone: (isGroup) => {
        //     if (isGroup) {
        //         $callBtn.hide();
        //     } else {
        //         $callBtn.show();
        //     }
        // }
    };
});
