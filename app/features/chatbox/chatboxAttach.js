define([
    'app/constant', 
    'shared/data', 
    'shared/functions',
    'features/modal/modalPhoneRequest'
], (
    constant, 
    GLOBAL, 
    functions,
    modalPhoneRequestComp
) => {
    const { API_URL, TOKEN } = constant;
    const token = functions.getDataToLocalApplication(TOKEN) || '';
    const $attachButton = $('.btn__attach');
    const $inputFile = $('.--input-up-file');
    const $inputImage = $('.--input-up-media');
    const $wrapper = $('#media-menu');
    const $callBtn = $wrapper.find('.js-up-phone');
    const $progressWrapper = $('.chatbox-progress-upload');
    const $pathCircle = $progressWrapper.find('path');
    const $percentProgress = $progressWrapper.find('span');
    const $dropzone = $('.dropzone');
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

    const uploadFile = (endpoint) => {
        const file = endpoint === 'fileupload' ? $inputFile.get(0).files[0] : $inputImage.get(0).files[0];

        if (!file) {
            return;
        }

        callAPI(endpoint, file);
    };

    const onDrop = e => {
        e.preventDefault();  
        e.stopPropagation();
        counter = 0;
        $dropzone.hide();

        if (e.originalEvent.dataTransfer.items && e.originalEvent.dataTransfer.items.length) {
            const item = e.originalEvent.dataTransfer.items[0];
            const file = item.getAsFile();
            
            if (!item.type) {
                return;
            }
;
            if ((/(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(item.type)) {
                callAPI('imageupload', file);
            } else {
                callAPI('fileupload', file);
            }
        }

        return false
    };

    const showPhoneModal = () => {
        modalPhoneRequestComp.onInit();
        offEventClickOutside();
    }
    
    return {
        onInit: () => {
            $attachButton.click(showSlide);
            $callBtn.click(showPhoneModal);
            $wrapper.find('.menu__item').click(offEventClickOutside);
            $inputFile.change(() => uploadFile('fileupload'));
            $inputImage.change(() => uploadFile('imageupload'));
            $dropzone.on('dragover', false).on('drop', onDrop);
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
        },

        markPhone: (isGroup) => {
            if (isGroup) {
                $callBtn.hide();
            } else {
                process.env.NODE_ENV === 'production' ? $callBtn.hide() : $callBtn.show();
            }
        }
    };
});
