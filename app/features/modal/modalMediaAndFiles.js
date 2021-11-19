define([
    'shared/data',
    'shared/api',
    'app/constant'
], (
    GLOBAL,
    API,
    constant
    ) => {
    const { API_URL } = constant;

    let mediaFilesWraper;
    let closeMediaFilesBtn;
    let listImagesGallery = [];
    let mediaList;
    let mediaListContainer;

    const renderImages = (imgagesArray) => {
        mediaListContainer = document.createElement('div');
        mediaListContainer.className = 'media-container';

        imgagesArray.forEach((mess) => {
            const div = document.createElement('div');
            div.innerHTML = `
                    <figure class="gallery__item" data-mess-id="${mess.id.messageId}" data-mess-sequence="${mess.sequence}">
                        <img src="${API_URL}/image?id=${mess.file.id}&small=1" class="gallery__img" alt="${mess.file.filename}">
                    </figure>
            `;
            mediaListContainer.appendChild(div.lastElementChild);
        });

        mediaList.appendChild(mediaListContainer);
    };

    const getImageListAPI = () => {
        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: 0,
            type: 2
        };
        
        API.get('messages', params).then((res) => {
            listImagesGallery = [...listImagesGallery, ...res.messages];
            console.log(listImagesGallery);

            renderImages(listImagesGallery);
        });
    };

    const closeModal = () => {
        while (mediaList.firstChild) {
            mediaList.removeChild(mediaList.firstChild);
        }
        listImagesGallery = [];

        if (!mediaFilesWraper.classList.contains('hidden')) {
            mediaFilesWraper.classList.remove('slideIn');
            mediaFilesWraper.classList.add('slideOut');

            setTimeout(() => mediaFilesWraper.classList.add('hidden'), 500);
        }
    };

    const openModal = () => {
        if (mediaFilesWraper.classList.contains('hidden')) {
            mediaFilesWraper.classList.remove('hidden');
            mediaFilesWraper.classList.remove('slideOut');
            mediaFilesWraper.classList.add('slideIn');

            getImageListAPI();
        }
        
        closeMediaFilesBtn.addEventListener('click', closeModal);
    };

    return {
        onInit: () => {
            mediaFilesWraper = document.querySelector('.view-media-files-wraper');
            closeMediaFilesBtn = document.querySelector('.media-files-close');
            mediaList = document.querySelector('.view-media-list');

            openModal();
        }
    };
});
