define([
    'shared/data',
    'shared/api',
    'app/constant',
    'shared/functions',
    'assets/js/slick.min.js'
], (
    GLOBAL,
    API,
    constant,
    functions
    ) => {
    require('bootstrap/js/dist/tab');
    
    const { API_URL } = constant;
    const {
        humanFileSize,
        convertMessagetime,
        downloadImage,
        downloadFile
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

    const renderImages = (imgagesArray, loadMoreOnScroll) => {
        if (imgagesArray.length === 0 && !loadMoreOnScroll) {
            mediaListContainer.innerHTML = '<div class="media__not__found">No image found</div>';
        } else {
            imgagesArray.forEach((mess) => {
                const div = document.createElement('div');
                div.innerHTML = `
                        <figure class="gallery__item" data-mess-id="${mess.id.messageId}" data-mess-sequence="${mess.sequence}">
                            
                            <img class="gallery__img showFullImage --click-show-popup-up-img" src="${API_URL}/image?id=${mess.file.id}&small=1" alt="${mess.file.filename}" data-chat-id="${mess.id.messageId}">
                                          
                            <div class="gallery__item__features">
                                <button type="button" class="ite__img__showMess btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Show message">
                                    <i class="icon-comment-o"></i>
                                </button>

                                <div class="ite__img__uploadDate" data-toggle="tooltip" data-placement="top" title="Upload date: ${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}">
                                    <i class="icon-info-circle"></i>
                                    <span class="hovertext">${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}</span>
                                </div>

                                <div data-toggle="tooltip" data-placement="top" title="Download image">
                                    <button class="ite__img__download" src="${API_URL}/image?id=${mess.file.id}&small=1" alt="${mess.file.filename}">
                                        <i class="icon-download"></i>
                                    </button>
                                </div>
                            </div>
                        </figure>
                `;
                mediaListContainer.appendChild(div.lastElementChild);
            });
        }
     
        mediaList.prepend(mediaListContainer);
    };

    const renderFiles = (filesArray, loadMoreOnScroll) => {
        // console.log(filesArray);
        if (filesArray.length === 0 && !loadMoreOnScroll) {
            filesListContainer.innerHTML = '<div class="files__not__found">No files found</div>';
        } else {
            filesArray.forEach((mess) => {
                const fileSize = humanFileSize(mess.file.size);
                const div = document.createElement('div');
                div.innerHTML = `
                        <div class="files__item" data-mess-id="${mess.id.messageId}" data-mess-sequence="${mess.sequence}">
                            <div class="files__item__link">
                                <i class="xm icon-download"></i>
                                <span class="ite__file__download" href="${API_URL}/file?id=${mess.file.id}">${mess.file.filename}</span> ${fileSize}
                            </div>
                            
                            <div class="files__item__features">
                                <button class="ite__file__showMess btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Show message">
                                    <i class="icon-comment-o"></i>
                                </button>

                                <div class="ite__file__uploadDate" data-toggle="tooltip" data-placement="top" title="Upload date: ${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}">
                                    <i class="icon-info-circle">
                                    </i>
                                    <span class="hovertext">${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}</span>
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
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        closeModal();
        chatboxContentComp.onShowExactOriginMessage(id, sequence);
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
                    renderImages(res.messages, true);
                    mediaSpiner.classList.add('hidden');
                }
        
                if (curenType === TYPE_FILES) {
                    renderFiles(res.messages, true);
                    filesSpiner.classList.add('hidden');
                }

                if (res.messages.length > 0) {
                    res.messages.forEach(item => {
                        const elementItem = document.querySelector(`[data-mess-id="${item.id.messageId}"]`);

                        if (curenType === TYPE_MEDIA) {
                            elementItem.querySelector('.ite__img__showMess').addEventListener('click', () => showMessagesPosition(item.id.messageId, item.sequence));

                            elementItem.querySelectorAll('.ite__img__download').forEach(ite => ite.addEventListener('click', downloadImage));
                        }
                
                        if (curenType === TYPE_FILES) {
                            elementItem.querySelector('.ite__file__showMess').addEventListener('click', () => showMessagesPosition(item.id.messageId, item.sequence));

                            elementItem.querySelectorAll('.ite__file__download').forEach(ite => ite.addEventListener('click', downloadFile));
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

                showOriginIMGmessBtn = document.querySelectorAll('.ite__img__showMess');
                showOriginIMGmessBtn.forEach(item => item.addEventListener('click', () => {
                    const dataMessageId = item.parentNode.parentNode.getAttribute('data-mess-id');
                    const sequence = item.parentNode.parentNode.getAttribute('data-mess-sequence');
                    showMessagesPosition(dataMessageId, sequence);
                }));

                document.querySelectorAll('.ite__img__download').forEach(item => item.addEventListener('click', downloadImage));
            }); 

            getImageFilesListAPI(TYPE_FILES).then(file => {
                renderFiles(file.messages);
                filesSpiner.classList.add('hidden');

                showOriginFILEmessBtn = document.querySelectorAll('.ite__file__showMess');
                showOriginFILEmessBtn.forEach(item => item.addEventListener('click', () => {
                    const dataMessageId = item.parentNode.parentNode.getAttribute('data-mess-id');
                    const sequence = item.parentNode.parentNode.getAttribute('data-mess-sequence');
                    showMessagesPosition(dataMessageId, sequence);
                }));

                document.querySelectorAll('.ite__file__download').forEach(item => item.addEventListener('click', downloadFile));
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
