define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/alert',
    'shared/functions',
    'features/chatbox/chatboxContentChatList'
], (
    constant,
    GLOBAL,
    API, 
    ALERT,
    functions,
    chatboxContentChatListComp
) => {
    let listMessWraper;
    let pinMessElement;
    let unpinMessBtn;
    let scrollToOriginBtn;
    let pinMessBtn;
    let pulsePinMessBtn;
    let messageId;
    let pinMessBar;
    let $pinnedMessage;
    let isPinned;
    let pulseCancel;
    let isLoading = false;

    const { PINNED_MESS_ID, PINNED_SEQUENCE, ATTRIBUTE_MESSAGE_ID } = constant;
    const {
        transformLinkTextToHTML,
        htmlEncode,
        decodeStringBase64
    } = functions;

    const {
        getRoomById,
        storeRoomById,
        storePinnedMessRoomsById
    } = chatboxContentChatListComp;

    const pinMessAPI = (currRoomId, messId) => {
        API.post(`chats/${currRoomId}/messages/${messId}/pin`).then(() => {
            ALERT.show(GLOBAL.getLangJson().PINNED_MESSAGE, 'success');
        }).catch((err) => {
            console.log(err);
        });
    };

    const unpinMessAPI = (currRoomId) => {
        API.delete(`chats/${currRoomId}/messages/unpin`).then(() => {
            ALERT.show(GLOBAL.getLangJson().UNPIN_MESSAGE, 'alert');
        }).catch((err) => {
            console.log(err);
        });
    };

    const unpinTopbar = () => {
        pulseCancel = pinMessBar.querySelector('.pulse');
        pulseCancel.classList.remove('hidden');
        unpinMessBtn.disabled = true;

        unpinMessAPI(GLOBAL.getCurrentRoomId());
    };

    const scrollToOriginMess = (e) => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        const selectedPinEle = e.currentTarget;
        const messId = selectedPinEle.getAttribute(PINNED_MESS_ID);
        const sequence = selectedPinEle.getAttribute(PINNED_SEQUENCE);
        console.log(messId, sequence);
        setTimeout(() => {
            chatboxContentComp.onShowExactOriginMessage(messId, sequence);
        }, 200);
    };

    const addEventToClosePinBtn = () => {
        unpinMessBtn = pinMessBar.querySelector('.unpin-mess-btn');
        unpinMessBtn.addEventListener('click', unpinTopbar);
    };

    const addEventToscrollOriginMess = () => {
        scrollToOriginBtn = pinMessBar.querySelector('.pin-mess-details');
        scrollToOriginBtn.addEventListener('click', scrollToOriginMess);
    };  

    const removePinBar = () => {
        pinMessBar.innerHTML = '';
        if (!pinMessBar.classList.contains('hidden')) pinMessBar.classList.add('hidden');
    };

    const topBarPinTemplate = (messId, pinSequence, pinname, message) => (
        `<div class="pin-mess-details" pinned-message-id="${messId}" pinned-sequence="${pinSequence}">
            <div>
                <i class="icon-pin"></i>
            </div>
            <div class="latest-pinned-message">
                <div><lang data-language="">${GLOBAL.getLangJson().PINNED_MESSAGE}</lang></div>
            
                <span class="pin-name">${pinname}</span>:
                <span class="pin-text">"${message}"</span>
            </div>
        </div>

        <div class="pin-mess-action">
            <button class="btn btn-secondary unpin-mess-btn" data-toggle="tooltip" data-placement="bottom" title="${GLOBAL.getLangJson().UNPIN_MESSAGE}">
                <i class="icon-close"></i>
            </button>

            <div class="pulse hidden"></div>
        </div>
        `);

    const renderPinnedMess = (pinnedObj, isSync) => {
        let messId;
        let pinname;
        let message;
        let pinSequence;
        removePinBar();
        if (!pinnedObj) return;

        if (isSync) {
            ({ 
                messId, 
                pinname, 
                message, 
                pinSequence 
            } = pinnedObj);
        } else {
            messId = pinnedObj.id.messageId;
            pinname = pinnedObj.sender.name;
            message = transformLinkTextToHTML(htmlEncode(decodeStringBase64(pinnedObj.message)));
            pinSequence = pinnedObj.sequence;
        }

        pinMessBar.classList.remove('hidden');

        pinMessBar.innerHTML = topBarPinTemplate(messId, pinSequence, pinname, message);
        addEventToClosePinBtn();
        addEventToscrollOriginMess();
    };

    const enableBtn = () => {
        pulsePinMessBtn.classList.add('hidden');
        pinMessBtn.disabled = false;
    };

    const dissableBtn = () => {
        pulsePinMessBtn.classList.remove('hidden');
        pinMessBtn.disabled = true;
    };

    const updateToStoreRoomById = (roomId, pinEventsList, indx) => {
         // update to storeRoomById
         const currentRoomList = getRoomById(roomId);
         const updatedRoomList = currentRoomList.map((item) => {
            const ite = { ...item };
            if (ite.id.messageId === pinEventsList[indx].id.messageId) {
                ite.pinned = pinEventsList[indx].pinned;
            }
            
            return ite;
         });
        storeRoomById(roomId, updatedRoomList);
    };

    const handlePinMessageOnSync = (syncRes) => {
        console.log(syncRes);
        const messageSettingsSlideComp = require('features/chatbox/messageSettingsSlide');
        const messList = syncRes.messages;
        const pinEventsList = syncRes.pinEvents;
        isLoading = false;

        enableBtn();
        messageSettingsSlideComp.offEventClickOutside();
       
        const pinMess = (indx) => {
            const pinnedObj = {
                messId: pinEventsList[indx]?.id.messageId,
                pinname: messList[indx]?.sender.name, 
                message: htmlEncode(decodeStringBase64(messList[indx]?.message)),
                pinSequence: pinEventsList[indx]?.sequence
            };
            renderPinnedMess(pinnedObj, true);

            storePinnedMessRoomsById(pinEventsList[indx]?.id.chatId, pinnedObj);
            updateToStoreRoomById(pinEventsList[indx]?.id.chatId, pinEventsList, indx);

            pinMessElement = listMessWraper.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${pinEventsList[indx]?.id.messageId}"]`);
    
            if (pinMessElement) pinMessElement.classList.add('pinned');
        };

        const unpinMess = (indx) => {
            renderPinnedMess();

            storePinnedMessRoomsById(pinEventsList[indx]?.id.chatId, null);
            updateToStoreRoomById(pinEventsList[indx]?.id.chatId, pinEventsList, indx);

            pinMessElement = listMessWraper.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${pinEventsList[indx]?.id.messageId}"]`);
            
            if (pinMessElement) pinMessElement.classList.remove('pinned');
        };

        const replacePin = () => {
            unpinMess(0);
            pinMess(1);
        };

        const purelyPinUnpin = () => {
            if (messList[0].type === 8) unpinMess(0);
            if (messList[0].type === 9) pinMess(0);
        };

        // case 1: Purely pin/ unpin
        if (messList.length === 1) {
            purelyPinUnpin();
        }

        // case 2: replace pin 
        if (messList.length === 2) {
            replacePin();
        }
    };

    return {
        onInit: () => {
            listMessWraper = document.querySelector('.js_ul_list_mess');
            pinMessBar = document.querySelector('.pin-message-status-bar');
            pinMessBtn = document.querySelector('.js-menu-messages-pinmess');
            pulsePinMessBtn = pinMessBtn.querySelector('.pulse');
            isLoading = false;
        },

        onPinMess: (message) => {
            dissableBtn();
            
            if (isLoading) return;

            messageId = message[0].dataset.chatId;
           
            $pinnedMessage = message;

            isPinned = $pinnedMessage.hasClass('pinned');
            
            if (isPinned) {
                unpinMessAPI(GLOBAL.getCurrentRoomId());
            } else {
                pinMessAPI(GLOBAL.getCurrentRoomId(), messageId);
            }

            isLoading = true;
        },

        renderPinnedMess,

        handlePinMessageOnSync,

        removePinBar
    };
});
