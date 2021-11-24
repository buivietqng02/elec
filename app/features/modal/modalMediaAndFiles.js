define([
    'shared/data',
    'shared/api',
    'app/constant',
    'shared/functions'
], (
    GLOBAL,
    API,
    constant,
    functions
    ) => {
    require('bootstrap/js/dist/tab');
    require('bootstrap/js/dist/tooltip');
    
    const { API_URL, ATTRIBUTE_MESSAGE_ID } = constant;
    const {
        humanFileSize,
        convertMessagetime
    } = functions;
    
    const TYPE_MEDIA = 'media';
    const TYPE_FILES = 'files';
    let curenType = TYPE_MEDIA;
    let mediaTab;
    let filesTab;

    let mediaFilesWraper;
    let closeMediaFilesBtn;
    let listImagesFiles = { media: [], files: [] };

    let mediaList;
    let filesList;

    let mediaListContainer;
    let filesListContainer;

    let mediaFileScrollWrap;

    let mediaSpiner;
    let filesSpiner;

    let showOriginIMGmessBtn;
    let showOriginFILEmessBtn;
   
    let lastOffset = { media: 0, files: 0 };
    let isTouchLastMess = { media: false, files: false };
    let isProcessing = { media: false, files: false };
    
    const resetScroll = () => {
        lastOffset = { media: 0, files: 0 };
        isTouchLastMess = { media: false, files: false };
        isProcessing = { media: false, files: false };
    }; 

    const renderImages = (imgagesArray) => {
        if (imgagesArray.length === 0) {
            mediaListContainer.innerHTML = '<div class="media__not__found">No image found</div>';
        } else {
            imgagesArray.forEach((mess) => {
                const div = document.createElement('div');
                div.innerHTML = `
                        <figure class="gallery__item" data-mess-id="${mess.id.messageId}" data-mess-sequence="${mess.sequence}">
                            <img src="${API_URL}/image?id=${mess.file.id}&small=1" class="gallery__img" alt="${mess.file.filename}">

                            <div class="gallery__item__features">
                                <button type="button" class="ite__img__showMess btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Show message">
                                    <i class="icon-comment-o"></i>
                                </button>

                                <div class="ite__img__uploadDate" data-toggle="tooltip" data-placement="top" title="Upload date: ${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}">
                                    <i class="icon-info-circle"></i>
                                </div>
                            </div>
                        </figure>
                `;
                mediaListContainer.appendChild(div.lastElementChild);
            });
        }
     
        mediaList.prepend(mediaListContainer);
    };

    const renderFiles = (filesArray) => {
        console.log(filesArray);
        if (filesArray.length === 0) {
            filesListContainer.innerHTML = '<div class="files__not__found">No files found</div>';
        } else {
            filesArray.forEach((mess) => {
                const fileSize = humanFileSize(mess.file.size);
                const div = document.createElement('div');
                div.innerHTML = `
                        <div class="files__item" data-mess-id="${mess.id.messageId}" data-mess-sequence="${mess.sequence}">
                            <div class="files__item__link">
                                <i class="xm xm-download"></i>
                                <a href="${API_URL}/audio?id=${mess.file.id}" target="_blank">${mess.file.filename}</a> ${fileSize}
                            </div>
                            
                            <div class="files__item__features">
                                <button class="ite__file__showMess btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Show message">
                                    <i class="icon-comment-o"></i>
                                </button>

                                <div class="ite__file__uploadDate" data-toggle="tooltip" data-placement="top" title="Upload date: ${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}">
                                    <i class="icon-info-circle"></i>
                                </div>
                            </div>
                        </div>
                `;
                filesListContainer.appendChild(div.lastElementChild);
            });
        }
     
        filesList.prepend(filesListContainer);
    };

    const getImageFilesListAPI = async (type) => {
        let typeAPI;
        if (type === TYPE_MEDIA) typeAPI = 2;
        if (type === TYPE_FILES) typeAPI = 20;

        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: lastOffset[type],
            type: typeAPI
        };
        
        const res = await API.get('messages', params);

        lastOffset[type] = res?.messages[res?.messages?.length - 1]?.sequence;
        
        if (res?.messages?.length < 20) {
            isTouchLastMess[type] = true;
        } else {
            isTouchLastMess[type] = false;
        }  

        listImagesFiles[type].push(...res.messages);
        return res;
    };

    /* eslint-disable no-use-before-define */
    const showMessagesPosition = (id, sequence) => {
        console.log(id);
        const originMessageEle = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${id}"]`);
        closeModal();
        if (originMessageEle) {
            originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
            originMessageEle.classList.add('activeScrollTo');

            setTimeout(() => {
                originMessageEle.classList.remove('activeScrollTo');
            }, 5000);
        } else {
            const chatboxContentComp = require('features/chatbox/chatboxContent');

            let roomInfo = GLOBAL.getRooms().filter((room) => {
                if (String(room.id) === String(GLOBAL.getCurrentRoomId())) {
                    return true;
                }
    
                return false;
            })[0] || {};
            roomInfo = JSON.parse(JSON.stringify(roomInfo));

            chatboxContentComp.onHandleViewMediaAndFiles(sequence, roomInfo, id);
        }
    };

    const loadMoreOnScroll = () => {
        const curScrolHei = mediaFileScrollWrap.scrollTop + mediaFileScrollWrap.offsetHeight;
        let totalSrcHei;

        if (curenType === TYPE_MEDIA) {
            totalSrcHei = mediaListContainer.scrollHeight;
        }

        if (curenType === TYPE_FILES) {
            totalSrcHei = filesListContainer.scrollHeight;
        }

        if (curScrolHei >= totalSrcHei && !isProcessing[curenType] && !isTouchLastMess[curenType]) {
            isProcessing[curenType] = true;

            if (curenType === TYPE_MEDIA) mediaSpiner.classList.remove('hidden');
            if (curenType === TYPE_FILES) filesSpiner.classList.remove('hidden');

            getImageFilesListAPI(curenType).then(res => {
                isProcessing[curenType] = false;

                if (curenType === TYPE_MEDIA) {
                    renderImages(res.messages);
                    mediaSpiner.classList.add('hidden');
                }
        
                if (curenType === TYPE_FILES) {
                    renderFiles(res.messages);
                    filesSpiner.classList.add('hidden');
                }

                 // Add bootstrap tool tip
                 $('[data-toggle="tooltip"]').tooltip();

                if (res.messages.length > 0) {
                    res.messages.forEach(item => {
                        const elementItem = document.querySelector(`[data-mess-id="${item.id.messageId}"]`);

                        if (curenType === TYPE_MEDIA) {
                            elementItem.querySelector('.ite__img__showMess').addEventListener('click', () => showMessagesPosition(item.id.messageId, item.sequence));
                        }
                
                        if (curenType === TYPE_FILES) {
                            elementItem.querySelector('.ite__file__showMess').addEventListener('click', () => showMessagesPosition(item.id.messageId, item.sequence));
                        }
                    });
                }
            });
        }
    };

    const openMediaTab = () => {
        curenType = TYPE_MEDIA;
        mediaFileScrollWrap.scrollTop = 0;
    };
    const openFilesTab = () => {
        curenType = TYPE_FILES;
        mediaFileScrollWrap.scrollTop = 0;
    };

    function closeModal() {
        // Remive ToolTip before close modal
        $('[data-toggle="tooltip"]').tooltip('disable');
        
        mediaList.removeChild(mediaList.firstChild);
        filesList.removeChild(filesList.firstChild);

        listImagesFiles = { media: [], files: [] };

        if (!mediaFilesWraper.classList.contains('hidden')) {
            mediaFilesWraper.classList.remove('slideIn');
            mediaFilesWraper.classList.add('slideOut');

            setTimeout(() => mediaFilesWraper.classList.add('hidden'), 500);
        }

        resetScroll();
        mediaFileScrollWrap.removeEventListener('scroll', loadMoreOnScroll);
        closeMediaFilesBtn.removeEventListener('click', closeModal);

        mediaTab.removeEventListener('click', openMediaTab);
        filesTab.removeEventListener('click', openFilesTab);
    }

    const openModal = () => {
        if (mediaFilesWraper.classList.contains('hidden')) {
            mediaFilesWraper.classList.remove('hidden');
            mediaFilesWraper.classList.remove('slideOut');
            mediaFilesWraper.classList.add('slideIn');

            mediaSpiner.classList.remove('hidden');
            filesSpiner.classList.remove('hidden');
            getImageFilesListAPI(TYPE_MEDIA).then(img => {
                renderImages(img.messages);
                mediaSpiner.classList.add('hidden');

                // Add bootstrap tool tip
                $('[data-toggle="tooltip"]').tooltip();

                showOriginIMGmessBtn = document.querySelectorAll('.ite__img__showMess');
                showOriginIMGmessBtn.forEach(item => item.addEventListener('click', () => {
                    const dataMessageId = item.parentNode.parentNode.getAttribute('data-mess-id');
                    const sequence = item.parentNode.parentNode.getAttribute('data-mess-sequence');
                    showMessagesPosition(dataMessageId, sequence);
                }));
            }); 

            getImageFilesListAPI(TYPE_FILES).then(file => {
                renderFiles(file.messages);
                filesSpiner.classList.add('hidden');

                // Add bootstrap tool tip
                $('[data-toggle="tooltip"]').tooltip();

                showOriginFILEmessBtn = document.querySelectorAll('.ite__file__showMess');
                showOriginFILEmessBtn.forEach(item => item.addEventListener('click', () => {
                    const dataMessageId = item.parentNode.parentNode.getAttribute('data-mess-id');
                    const sequence = item.parentNode.parentNode.getAttribute('data-mess-sequence');
                    showMessagesPosition(dataMessageId, sequence);
                }));
            }); 

            mediaFileScrollWrap.addEventListener('scroll', loadMoreOnScroll);

            closeMediaFilesBtn.addEventListener('click', closeModal);
            mediaTab.addEventListener('click', openMediaTab);
            filesTab.addEventListener('click', openFilesTab);
        }
    };

    return {
        onInit: () => {
            mediaFilesWraper = document.querySelector('.view-media-files-wraper');
            closeMediaFilesBtn = document.querySelector('.media-files-close');
            mediaTab = document.querySelector('#media-tab');
            filesTab = document.querySelector('#files-tab');

            mediaFileScrollWrap = document.querySelector('.media-files-content');

            mediaList = document.querySelector('.view-media-list');
            filesList = document.querySelector('.view-files-list');

            mediaSpiner = document.querySelector('.media__spiner');
            filesSpiner = document.querySelector('.files__spiner');

            mediaListContainer = document.createElement('div');
            mediaListContainer.className = 'media-container';

            filesListContainer = document.createElement('div');
            filesListContainer.className = 'files-container';

            openModal();
        },

        closeMediaAndFilesModal: () => closeModal()
    };
});
