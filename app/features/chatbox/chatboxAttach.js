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
    functions,
    modalPhoneRequestComp
) => {
    const { API_URL, TOKEN } = constant;
    const token = functions.getDataToLocalApplication(TOKEN) || '';
    let $attachButton;
    let $inputFile;
    let $inputImage;
    let $wrapper;
    let $callBtn;
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
        const fd = new FormData();
        $progressWrapper.show();
        fd.append('file', file);
        fd.append('chat_id', GLOBAL.getCurrentRoomId());

        console.log(GLOBAL.getCurrentRoomId(), file)

        $.ajax({
            type: 'POST',
            url: `${API_URL}/${endpoint}`,
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

    const checkFile = (file, isMedia) => {
        if (file.size > 500000000) {
            ALERT.show('Maximum file size is 400MB!');
            hideProcess();
            return;
        }

        if ((/(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(file.type)) {
            callAPI('imageupload', file);
            return;
        }

        if ((/(mp4)$/i).test(file.type)) {
            callAPI('videoupload', file);
            return;
        }

        if ((/audio/i).test(file.type)) {
            callAPI('audioupload', file);
            return;
        }

        if (isMedia && (/video/i).test(file.type)) {
            ALERT.show('Only MP4 files supported');
            return;
        }

        callAPI('fileupload', file);
    };

    const uploadFile = (endpoint) => {
        if (endpoint === 'fileupload') {
            console.log($inputFile.get(0).files);
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

        return false
    };

    const showPhoneModal = () => {
        modalPhoneRequestComp.onInit();
        offEventClickOutside();
    };

    return {
        onInit: () => {
            isShow = false;
            counter = 0;
            $attachButton = $('.btn__attach');
            $inputFile = $('.--input-up-file');
            $inputImage = $('.--input-up-media');
            $wrapper = $('#media-menu');
            $callBtn = $wrapper.find('.js-up-phone');
            $progressWrapper = $('.chatbox-progress-upload');
            $pathCircle = $progressWrapper.find('path');
            $percentProgress = $progressWrapper.find('span');
            $dropzone = $('.dropzone');

            $attachButton.off().click(showSlide);
            $callBtn.off().click(showPhoneModal);
            $inputFile.off().change(() => {
                offEventClickOutside();
                uploadFile('fileupload')
            });
            $inputImage.off().change(() => {
                offEventClickOutside();
                uploadFile('imageupload')
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
                document.addEventListener('drop', e => {
                    counter = 0;
                    $dropzone.hide();
                });
                document.onpaste = (e) => {
                    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
                    for (index in items) {
                        const item = items[index];
                        if (item.kind === 'file' && GLOBAL.getCurrentRoomId()) {
                            const file = item.getAsFile();
                            checkFile(file);
                        }
                    }
                };
            }
        },

        markPhone: (isGroup) => {
            if (isGroup) {
                $callBtn.hide();
            } else {
                $callBtn.show();
            }
        }
    };
});
