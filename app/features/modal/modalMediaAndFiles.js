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
    
    const TYPE_IMG = 'images';
    const TYPE_FILES = 'files';
    const TYPE_VIDEOS = 'videos';

    let curenType = TYPE_IMG;
    let imagesTab;
    let filesTab;
    let videosTab;

    let mediaFilesWraper;
    let closeMediaFilesBtn;
    let listImagesFiles = { [TYPE_IMG]: [], [TYPE_FILES]: [], [TYPE_VIDEOS]: [] };

    let imagesList;
    let filesList;
    let videosList;

    let imagesListContainer;
    let filesListContainer;
    let videosListContainer;

    let mediaFileScrollWrap;

    let imagesSpiner;
    let filesSpiner;
    let videosSpiner;

    let showOriginIMGmessBtn;
    let showOriginFILEmessBtn;
    let showOriginVIDmessBtn;
   
    let lastOffset = { [TYPE_IMG]: 0, [TYPE_FILES]: 0, [TYPE_VIDEOS]: 0 };
    let isTouchLastMess = { [TYPE_IMG]: false, [TYPE_FILES]: false, [TYPE_VIDEOS]: false };
    let isProcessing = { [TYPE_IMG]: false, [TYPE_FILES]: false, [TYPE_VIDEOS]: false };
    
    const resetScroll = () => {
        lastOffset = { [TYPE_IMG]: 0, [TYPE_FILES]: 0, [TYPE_VIDEOS]: 0 };
        isTouchLastMess = { [TYPE_IMG]: false, [TYPE_FILES]: false, [TYPE_VIDEOS]: false };
        isProcessing = { [TYPE_IMG]: false, [TYPE_FILES]: false, [TYPE_VIDEOS]: false };
    }; 

    const renderImages = (imgagesArray, loadMoreOnScroll) => {
        if (imgagesArray.length === 0 && !loadMoreOnScroll) {
            imagesListContainer.innerHTML = '<div class="media__not__found">No image found</div>';
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
                imagesListContainer.appendChild(div.lastElementChild);
            });
        }
     
        imagesList.prepend(imagesListContainer);
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

    const renderVideos = (videosArray, loadMoreOnScroll) => {
        if (videosArray.length === 0 && !loadMoreOnScroll) {
            videosListContainer.innerHTML = '<div class="videos__not__found">No video found</div>';
        } else {
            videosArray.forEach((mess) => {
                const div = document.createElement('div');
                div.innerHTML = `
                        <figure class="video__item" data-mess-id="${mess.id.messageId}" data-mess-sequence="${mess.sequence}">
                            <video class="video__item__box" controls><source src="${API_URL}/stream?id=${mess.file.id}" type="video/mp4" data-chat-id="${mess.id.messageId}">Your browser does not support HTML video.</video>
                                          
                            <div class="video__item__features">
                                <button type="button" class="ite__video__showMess btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Show message">
                                    <i class="icon-comment-o"></i>
                                </button>

                                <div class="ite__video__uploadDate" data-toggle="tooltip" data-placement="top" title="Upload date: ${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}">
                                    <i class="icon-info-circle"></i>
                                    <span class="hovertext">${convertMessagetime(mess.msgDate, GLOBAL.getLangJson())}</span>
                                </div>
                            </div>
                        </figure>
                `;
                videosListContainer.appendChild(div.lastElementChild);
            });
        }
     
        videosList.prepend(videosListContainer);
    };

    const getMediaFilesListAPI = async (type) => {
        let typeAPI;
        if (type === TYPE_IMG) typeAPI = 2;
        if (type === TYPE_FILES) typeAPI = 20;
        if (type === TYPE_VIDEOS) typeAPI = 4;

        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: lastOffset[type],
            type: typeAPI
        };
        
        const res = await API.get(`chats/${params.chatId}/messages?offset=${params.offset}&type=${params.type}`);

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

        if (curenType === TYPE_IMG) {
            totalSrcHei = imagesListContainer.scrollHeight;
        }

        if (curenType === TYPE_VIDEOS) {
            totalSrcHei = videosListContainer.scrollHeight;
        }

        if (curenType === TYPE_FILES) {
            totalSrcHei = filesListContainer.scrollHeight;
        }

        if (curScrolHei >= totalSrcHei && !isProcessing[curenType] && !isTouchLastMess[curenType]) {
            isProcessing[curenType] = true;

            if (curenType === TYPE_IMG) imagesSpiner.classList.remove('hidden');
            if (curenType === TYPE_FILES) filesSpiner.classList.remove('hidden');
            if (curenType === TYPE_VIDEOS) videosSpiner.classList.remove('hidden');

            getMediaFilesListAPI(curenType).then(res => {
                isProcessing[curenType] = false;

                if (curenType === TYPE_IMG) {
                    renderImages(res.messages, true);
                    imagesSpiner.classList.add('hidden');
                }
        
                if (curenType === TYPE_FILES) {
                    renderFiles(res.messages, true);
                    filesSpiner.classList.add('hidden');
                }

                if (curenType === TYPE_VIDEOS) {
                    renderVideos(res.messages, true);
                    videosSpiner.classList.add('hidden');
                }

                if (res.messages.length > 0) {
                    res.messages.forEach(item => {
                        const elementItem = document.querySelector(`[data-mess-id="${item.id.messageId}"]`);

                        if (curenType === TYPE_IMG) {
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

    const openImagesTab = () => {
        curenType = TYPE_IMG;
        mediaFileScrollWrap.scrollTop = 0;
    };
    const openFilesTab = () => {
        curenType = TYPE_FILES;
        mediaFileScrollWrap.scrollTop = 0;
    };
    const openVideosTab = () => {
        curenType = TYPE_VIDEOS;
        mediaFileScrollWrap.scrollTop = 0;
    };

    function closeModal() {    
        imagesList.removeChild(imagesList.firstChild);
        filesList.removeChild(filesList.firstChild);
        videosList.removeChild(videosList.firstChild);

        listImagesFiles = { [TYPE_IMG]: [], [TYPE_FILES]: [], [TYPE_VIDEOS]: [] };

        if (!mediaFilesWraper.classList.contains('hidden')) {
            mediaFilesWraper.classList.remove('slideIn');
            mediaFilesWraper.classList.add('slideOut');

            setTimeout(() => mediaFilesWraper.classList.add('hidden'), 500);
        }

        resetScroll();
        mediaFileScrollWrap.removeEventListener('scroll', loadMoreOnScroll);
        closeMediaFilesBtn.removeEventListener('click', closeModal);

        imagesTab.removeEventListener('click', openImagesTab);
        filesTab.removeEventListener('click', openFilesTab);
        videosTab.removeEventListener('click', openVideosTab);
    }

    const openModal = () => {
        if (mediaFilesWraper.classList.contains('hidden')) {
            mediaFilesWraper.classList.remove('hidden');
            mediaFilesWraper.classList.remove('slideOut');
            mediaFilesWraper.classList.add('slideIn');

            imagesSpiner.classList.remove('hidden');
            filesSpiner.classList.remove('hidden');
            videosSpiner.classList.remove('hidden');

            // fetch images
            getMediaFilesListAPI(TYPE_IMG).then(img => {
                renderImages(img.messages);
                imagesSpiner.classList.add('hidden');

                showOriginIMGmessBtn = document.querySelectorAll('.ite__img__showMess');
                showOriginIMGmessBtn.forEach(item => item.addEventListener('click', () => {
                    const dataMessageId = item.parentNode.parentNode.getAttribute('data-mess-id');
                    const sequence = item.parentNode.parentNode.getAttribute('data-mess-sequence');
                    showMessagesPosition(dataMessageId, sequence);
                }));

                document.querySelectorAll('.ite__img__download').forEach(item => item.addEventListener('click', downloadImage));
            }); 

            // fetch videos
            getMediaFilesListAPI(TYPE_VIDEOS).then(vid => {
                renderVideos(vid.messages);
                videosSpiner.classList.add('hidden');

                showOriginVIDmessBtn = document.querySelectorAll('.ite__video__showMess');
                showOriginVIDmessBtn.forEach(item => item.addEventListener('click', () => {
                    const dataMessageId = item.parentNode.parentNode.getAttribute('data-mess-id');
                    const sequence = item.parentNode.parentNode.getAttribute('data-mess-sequence');
                    showMessagesPosition(dataMessageId, sequence);
                }));
            }); 

            // fetch files
            getMediaFilesListAPI(TYPE_FILES).then(file => {
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
            imagesTab.addEventListener('click', openImagesTab);
            filesTab.addEventListener('click', openFilesTab);
            videosTab.addEventListener('click', openVideosTab);
        }
    };

    return {
        onInit: () => {
            mediaFilesWraper = document.querySelector('.view-media-files-wraper');
            closeMediaFilesBtn = document.querySelector('.media-files-close');
            imagesTab = document.querySelector('#images-tab');
            filesTab = document.querySelector('#files-tab');
            videosTab = document.querySelector('#videos-tab');

            mediaFileScrollWrap = document.querySelector('.media-files-content');

            imagesList = document.querySelector('.view-images-list');
            filesList = document.querySelector('.view-files-list');
            videosList = document.querySelector('.view-videos-list');

            imagesSpiner = document.querySelector('.images__spiner');
            filesSpiner = document.querySelector('.files__spiner');
            videosSpiner = document.querySelector('.videos__spiner');

            imagesListContainer = document.createElement('div');
            imagesListContainer.className = 'images-container';

            filesListContainer = document.createElement('div');
            filesListContainer.className = 'files-container';

            videosListContainer = document.createElement('div');
            videosListContainer.className = 'videos-container';

            openModal();
        },

        closeMediaAndFilesModal: () => closeModal()
    };
});
