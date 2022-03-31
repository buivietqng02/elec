define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/alert',
    'features/chatbox/chatboxContentFunctions'
], (
    constant,
    GLOBAL,
    API,  
    ALERT,
    contentFunc
) => {
    let wrapper;
    let messageList;
    let $bookmarkMessage;
    let messageId;
    let currentRoomId;
    let viewingBookmarksStatusBar;
    let viewingBookmarkStatusBarText;
    let isBookmark = false;
    let isViewingBookmark = false;

    let lastOffset = 0;
    let isTouchLastMess = false;
    let isToPosition = false;
    let processing = false;

    let isShowingPinbar = false;
    let pinMessStatusBar;

    const { ATTRIBUTE_MESSAGE_ID } = constant;
    const { getCurrentRoomId } = GLOBAL;
    const { renderMessage, renderRangeDate } = contentFunc;
    
    const onCloseViewBookmarks = () => {
        isViewingBookmark = false;
        messageList.classList.remove('viewingBookmark')
        wrapper.removeEventListener('scroll', onWrapperScroll);
        viewingBookmarksStatusBar.classList.add('hidden');
    };

    const onCloseViewBookmarksAndReloadMess = () => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        onCloseViewBookmarks();

        if (isShowingPinbar) pinMessStatusBar.classList.remove('hidden');

        let roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(currentRoomId)) {
                return true;
            }
            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));
        chatboxContentComp.onLoadMessage(roomInfo);
        
    };

    const onShowOriginMessage = (id, sequence) => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        onCloseViewBookmarksAndReloadMess();

        setTimeout(() => {
            chatboxContentComp.onShowExactOriginMessage(id, sequence);
        }, 500)
    };

    const showOriginMessageEventListener = () => {
        document.querySelectorAll('.js_li_list_mess').forEach(item => {
            const showOriginMess = item.querySelector('.show_origin_mess');
            const showOriginMessBtn = item.querySelector('.show_origin_btn');
            const sequence = showOriginMessBtn.getAttribute('sequence_number');
            const id = item.getAttribute(ATTRIBUTE_MESSAGE_ID);

            showOriginMess.classList.remove('hidden');
            showOriginMess.addEventListener('click',() => onShowOriginMessage(id, sequence))
        })
    }

    const onGetMoreMessageByScrolling = () => {
        callAPIListBookmarkMess(lastOffset).then(res => {
            let messagesHtml = '';
            let moreMessages = [];

            const pos = wrapper.scrollHeight + wrapper.scrollTop;       
            moreMessages = moreMessages.concat(res?.messages || []).reverse();
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess) + '<hr style="width:100%">')).join('');     

            messageList.innerHTML = messagesHtml +  messageList.innerHTML;
            wrapper.scrollTop = wrapper.scrollHeight - pos;     
            processing = false;

            showOriginMessageEventListener();
        })
    };

    const onWrapperScroll = () => {
        if (wrapper.scrollTop < 100) {
            isToPosition = true;
        } else {
            isToPosition = false;
        }

        if (processing || isTouchLastMess || !isToPosition) {
            return;
        }
        onGetMoreMessageByScrolling();
    };

    const callAPIListBookmarkMess = async (lastOffsetParam) => {
        processing = true;
        const params = {
            chatId: currentRoomId,
            offset: lastOffsetParam,
            starred: true
            
        };
        const res =  await API.get('messages', params) 
        lastOffset = res.messages[res.messages.length - 1]?.sequence;
        if (res.messages.length < 20) isTouchLastMess = true;

        return res;
    }

    const onClickViewBookmarks = () => {
        const chatboxTopbarComp = require('features/chatbox/chatboxTopbar');
        const viewBookmarksBtn = document.querySelector('#chatbox-group-option .--viewBookmark');
        const pulseViewBookmark = viewBookmarksBtn.querySelector('.pulse');
        pinMessStatusBar = document.querySelector('.pin-message-status-bar');

        if (!pinMessStatusBar.classList.contains('hidden')) {
            isShowingPinbar = true;
            pinMessStatusBar.classList.add('hidden');
        }

        viewBookmarksBtn.disabled = true;
        currentRoomId = getCurrentRoomId()
        lastOffset = 0;
        isTouchLastMess = false;

        pulseViewBookmark.classList.remove('hidden');

        messageList = document.querySelector('.messages__list');
        wrapper = document.querySelector('.js_con_list_mess');
        viewingBookmarksStatusBar = document.querySelector('.view-bookmark-status-bar');
        viewingBookmarkStatusBarText = viewingBookmarksStatusBar.querySelector('lang');
        viewingBookmarksStatusBar.addEventListener('click', onCloseViewBookmarksAndReloadMess, {once: true})

        callAPIListBookmarkMess(lastOffset).then((res) => {
            let messagesHtml = ''
            pulseViewBookmark.classList.add('hidden');
            viewingBookmarksStatusBar.classList.remove('hidden');
            chatboxTopbarComp.onOffEventClickOutside();

            if(res.messages.length <= 0) {
                viewingBookmarkStatusBarText.textContent = GLOBAL.getLangJson().NO_BOOKMARKS_FOUND;
            } else {
                viewingBookmarkStatusBarText.textContent = GLOBAL.getLangJson().IS_VIEWING_BOOKMARK_LIST;
            }

            isViewingBookmark = true;
            processing = false;
            viewBookmarksBtn.disabled = false;
            messageList.classList.add('viewingBookmark')
            
            res.messages.reverse().map(mess => {
                messagesHtml += `${renderMessage(mess)} <hr style="width:100%">`
            });
            
            messageList.innerHTML = messagesHtml;

            wrapper.scrollTo(0, wrapper.scrollHeight);

            showOriginMessageEventListener();
            wrapper.addEventListener('scroll', onWrapperScroll);
        }).catch((err) => {
            console.log(err);
        });
    };

    return {
        onClickViewBookmarks,

        onInit: (message) => {
            const bookmarkBtn = document.querySelector('.js-menu-messages-bookmark');
            const pulseBookmarkBtn = bookmarkBtn.querySelector('.pulse');
            pulseBookmarkBtn.classList.remove('hidden');
            bookmarkBtn.disabled = true;
            $('.js-menu-messages-bookmark lang').html(GLOBAL.getLangJson().LOADING);
            
            messageId = message[0].dataset.chatId;
            currentRoomId = getCurrentRoomId()
            $bookmarkMessage = message;

            isBookmark = $bookmarkMessage.hasClass('bookmark');
           
            API.post(`chats/${currentRoomId}/messages/${messageId}/star`).then(() => {
                if(isBookmark) {
                    // Remove Bookmark 
                    ALERT.show(GLOBAL.getLangJson().ALREADY_REMOVE_BOOKMARK, 'danger');
                } else {
                    // Add Bookmark 
                    ALERT.show(GLOBAL.getLangJson().ALREADY_ADD_BOOKMARK, 'success');
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        onGetIsViewingBookmark: () => isViewingBookmark,

        onCloseViewBookmarks,

        onCloseViewBookmarksAndReloadMess
    }
})
