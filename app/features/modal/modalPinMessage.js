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
    let isLoading = false;
    let $confirmUnpin;
    let $btnCancel;
    let $spinner;

    const { PINNED_MESS_ID, PINNED_SEQUENCE, ATTRIBUTE_MESSAGE_ID } = constant;
    const {
        transformLinkTextToHTML,
        htmlEncode,
        decodeStringBase64,
        getAvatar
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

    const unpinMessAPIFromMenu = () => {
        const currRoomId = GLOBAL.getCurrentRoomId();
        API.delete(`chats/${currRoomId}/messages/unpin`).then(() => {
            ALERT.show(GLOBAL.getLangJson().UNPINNED_MESSAGE, 'dark');
        }).catch((err) => {
            console.log(err);
        });
    };

    const unpinMessAPIFromModalConfirm = () => {
        const currRoomId = GLOBAL.getCurrentRoomId();
        $confirmUnpin.prop('disabled', true);
        $spinner.show();

        API.delete(`chats/${currRoomId}/messages/unpin`).then(() => {
            $confirmUnpin.prop('disabled', false);
            $btnCancel.click();
            $spinner.hide();

            ALERT.show(GLOBAL.getLangJson().UNPINNED_MESSAGE, 'dark');
        }).catch((err) => {
            console.log(err);
        });
    };

    const modalConfirmUnpinMessage = (langJson) => `
        <div class="modal fade" id="unpinMessModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h5 data-language="ARE_YOU_SURE_UNPIN_MESSAGE">
                            ${langJson.ARE_YOU_SURE_UNPIN_MESSAGE}
                        </h5>
                        <p data-language="ARE_YOU_SURE_UNPIN_MESSAGE_DETAILS">
                            ${langJson.ARE_YOU_SURE_UNPIN_MESSAGE_DETAILS}
                        </p>
                        <br />
                        <button type="button" class="confirm-unpin-btn btn btn-secondary btn-small float-right" disabled>
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <lang data-language="UNPIN_MESSAGE">${langJson.UNPIN_MESSAGE}</lang>
                        </button>
                        <button data-language="CANCEL" type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right mr-1">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    const popupModalConfirmUnpin = () => {
        let $modal = $('#unpinMessModal');
        if (!$modal.length) {
            $('body').append(modalConfirmUnpinMessage(GLOBAL.getLangJson()));
            $modal = $('#unpinMessModal');
        }
        $confirmUnpin = $modal.find('.confirm-unpin-btn');
        $btnCancel = $modal.find('.btn-outline-secondary');
        $spinner = $modal.find('.spinner-grow');

        $modal.modal('show');

        $spinner.hide();
        $confirmUnpin.prop('disabled', false);
        $confirmUnpin.off().click(unpinMessAPIFromModalConfirm);
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

    const addEventToUnpinTopbarBtn = () => {
        unpinMessBtn = pinMessBar.querySelector('.unpin-mess-btn');
        unpinMessBtn.addEventListener('click', popupModalConfirmUnpin);
    };

    const addEventToscrollOriginMess = () => {
        scrollToOriginBtn = pinMessBar.querySelector('.pin-mess-details');
        scrollToOriginBtn.addEventListener('click', scrollToOriginMess);
    };  

    const removePinBar = () => {
        pinMessBar.innerHTML = '';
        if (!pinMessBar.classList.contains('hidden')) pinMessBar.classList.add('hidden');
    };

    const topBarPinTemplate = (messId, pinSequence, pinname, message, avatar) => (
        `<div class="pin-mess-details" pinned-message-id="${messId}" pinned-sequence="${pinSequence}">
            <i class="icon-pin"></i>
           
            <div class="latest-pinned-message">
                <div>
                    <img class="--img avatar" src="${avatar}"></img>
                    <span class="pin-name">${pinname}</span>:
                </div>
            
                <span class="pin-text">${message}</span>
            </div>
        </div>

        <div class="pin-mess-action">
            <button class="btn btn-secondary unpin-mess-btn" data-toggle="tooltip" data-placement="bottom" title="${GLOBAL.getLangJson().UNPIN_MESSAGE}">
                <i class="icon-close"></i>
            </button>
        </div>
        `);

    const renderPinnedMess = (pinnedObj, isSync) => {
        let messId;
        let pinname;
        let message;
        let pinSequence;
        let avatar;
        removePinBar();
        if (!pinnedObj) return;

        if (isSync) {
            ({ 
                messId, 
                pinname, 
                message, 
                pinSequence,
                avatar
            } = pinnedObj);
        } else {
            messId = pinnedObj.id.messageId;
            pinname = pinnedObj.sender.name;
            message = transformLinkTextToHTML(htmlEncode(decodeStringBase64(pinnedObj.message)));
            pinSequence = pinnedObj.sequence;
            avatar = getAvatar(pinnedObj.sender.id);
        }

        pinMessBar.classList.remove('hidden');

        pinMessBar.innerHTML = topBarPinTemplate(messId, pinSequence, pinname, message, avatar);
        addEventToUnpinTopbarBtn();
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

    const updateToStoreRoomById = (roomId, pinMessObj) => {
        // update to storeRoomById
        const currentRoomList = getRoomById(roomId);
        if (currentRoomList) {
            const updatedRoomList = currentRoomList.map((item) => {
                const ite = { ...item };
                if (ite.id.messageId === pinMessObj.id.messageId) {
                    ite.pinned = pinMessObj.pinned;
                }
                
                return ite;
            });
            storeRoomById(roomId, updatedRoomList);
        }
    };

    const pinMess = (pinEventsList, indx) => {
        const pinMessObj = pinEventsList[indx]?.message;
        const pinnedObj = {
            messId: pinMessObj.id.messageId,
            pinname: pinMessObj.sender.name, 
            message: htmlEncode(decodeStringBase64(pinMessObj.message)),
            pinSequence: pinMessObj.sequence,
            avatar: getAvatar(pinMessObj.sender.id)
        };
        renderPinnedMess(pinnedObj, true);

        storePinnedMessRoomsById(pinMessObj.id.chatId, pinnedObj);
        updateToStoreRoomById(pinMessObj.id.chatId, pinMessObj);

        pinMessElement = listMessWraper.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${pinMessObj.id.messageId}"]`);

        if (pinMessElement) pinMessElement.classList.add('pinned');
    };

    const unpinMess = (pinEventsList, indx) => {
        const pinMessObj = pinEventsList[indx]?.message;
        renderPinnedMess();

        storePinnedMessRoomsById(pinMessObj.id.chatId, null);
        updateToStoreRoomById(pinMessObj.id.chatId, pinMessObj);

        pinMessElement = listMessWraper.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${pinMessObj.id.messageId}"]`);
        
        if (pinMessElement) pinMessElement.classList.remove('pinned');
    };

    const handlePinMessageOnSync = (syncRes) => {
        console.log(syncRes);
        const currRoomId = GLOBAL.getCurrentRoomId();
        const roomOnSyncId = syncRes?.pinEvents[0]?.message?.id?.chatId;

        if (roomOnSyncId !== currRoomId) return;

        const messageSettingsSlideComp = require('features/chatbox/messageSettingsSlide');
        const pinEventsList = syncRes.pinEvents;
        isLoading = false;

        enableBtn();
        messageSettingsSlideComp.offEventClickOutside();

        if (pinEventsList.length === 1) {
            if (pinEventsList[0].pinned) {
                // Pin
                pinMess(pinEventsList, 0);
            } else {
                // Unpin
                unpinMess(pinEventsList, 0);
            }
        }

        if (pinEventsList.length === 2) {
            // Unpin
            unpinMess(pinEventsList, 0);
            // Pin
            pinMess(pinEventsList, 1);
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
                unpinMessAPIFromMenu();
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
