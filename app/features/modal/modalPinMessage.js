define([
    'app/constant',
    'shared/data'
    // 'shared/api',
    // 'shared/alert',
    // 'features/chatbox/chatboxContentFunctions'
], (
    constant,
    GLOBAL
    // API,  
    // ALERT,
    // contentFunc
) => {
    let unpinMessBtn;
    let scrollToOriginBtn;
    let pinMessBtn;
    let pulsePinMessBtn;
    let messageId;
    let pinMessBar;
    // let currentRoomId;
    // let $pinnedMessage;
    // let isPinned;

    // const isDesktop = () => mainRightContent.classList.contains('desktop');

    const { PINNED_MESS_ID, PINNED_SEQUENCE } = constant;

    const removePinnedmess = (e) => {
        const selectedPinEle = e.currentTarget.parentElement.previousElementSibling;
        const messId = selectedPinEle.getAttribute(PINNED_MESS_ID);
        console.log(messId);
    };

    const scrollToOriginMess = (e) => {
        // const chatboxContentComp = require('features/chatbox/chatboxContent');
        const selectedPinEle = e.currentTarget.parentElement;
        const messId = selectedPinEle.getAttribute(PINNED_MESS_ID);
        const sequence = selectedPinEle.getAttribute(PINNED_SEQUENCE);
        console.log(messId, sequence);
        // setTimeout(() => {
        //     chatboxContentComp.onShowExactOriginMessage(messId, sequence);
        // }, 500);
    };

    const addEventToClosePinBtn = () => {
        unpinMessBtn = pinMessBar.querySelector('.unpin-mess-btn');
        unpinMessBtn.addEventListener('click', (evt) => removePinnedmess(evt));
    };

    const addEventToscrollOriginMess = () => {
        scrollToOriginBtn = pinMessBar.querySelector('.latest-pinned-message');
        scrollToOriginBtn.addEventListener('click', scrollToOriginMess);
    };  

    const removePinBar = () => {
        pinMessBar.innerHTML = '';
        pinMessBar.classList.add('hidden');
    };

    const renderPinnedMess = ({ 
        messId, 
        name, 
        message, 
        sequence 
    }) => {
        removePinBar();
        if (!messId || !name || !message || !sequence) return;

        pinMessBar.classList.remove('hidden');

        const pinnedMessHTML = `
        <div class="pin-mess-details" pinned-message-id="${messId}" pinned-sequence="${sequence}">
            <div>
                <i class="icon-pin"></i>
            </div>
            <div class="latest-pinned-message">
                <div><lang data-language="">${GLOBAL.getLangJson().PINNED_MESSAGE}</lang></div>
            
                <span class="pin-name">${name}</span>:
                <span class="pin-text">${message}</span>
            </div>
         </div>

        <div class="pin-mess-action">
            <button class="btn btn-secondary unpin-mess-btn" data-toggle="tooltip" data-placement="bottom" title="Unpin message">
                <i class="icon-close"></i>
            </button>
        </div>
        `;

        pinMessBar.innerHTML = pinnedMessHTML;
        addEventToClosePinBtn();
        addEventToscrollOriginMess();
    };

    console.log('test modal');
    return {
        onInit: () => {
            pinMessBar = document.querySelector('.pin-message-status-bar');
            pinMessBtn = document.querySelector('.js-menu-messages-pinmess');
            pulsePinMessBtn = pinMessBtn.querySelector('.pulse');
        },

        onPinMess: (message) => {
            pulsePinMessBtn.classList.remove('hidden');
            pinMessBtn.disabled = true;
            
            messageId = message[0].dataset.chatId;
            // currentRoomId = getCurrentRoomId();
            // $pinnedMessage = message;

            // isPinned = $pinnedMessage.hasClass('pinned');

            console.log(messageId);
           
            // API.post(`chats/${currentRoomId}/messages/${messageId}/star`).then(() => {
            //     if(isPinned) {
            //         // Remove Bookmark 
            //         ALERT.show(GLOBAL.getLangJson().ALREADY_REMOVE_BOOKMARK, 'danger');
            //     } else {
            //         // Add Bookmark 
            //         ALERT.show(GLOBAL.getLangJson().ALREADY_ADD_BOOKMARK, 'success');
            //     }
            // }).catch((err) => {
            //     console.log(err);
            // });
        },

        renderPinnedMess
    };
});
