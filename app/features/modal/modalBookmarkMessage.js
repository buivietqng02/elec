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
    
    let $bookmarkMessage;
    let messageId;
    let currentRoomId;
   
    let isBookmark = false;
    let viewingBookmarksStatusBar;

    let isViewingBookmark = false;

    let isLoadingBookmark = false;
    let isLoadingViewBookmark = false;

    let lastOffset = 0;

    let isTouchLastMess = false;
    let isToPosition = false;
    let processing = false;

    let wrapper;
    let messageList;

    const { ATTRIBUTE_MESSAGE_ID } = constant;
    const { getCurrentRoomId } = GLOBAL;
    const { renderMessage, renderRangeDate } = contentFunc;
    
    const onCloseViewBookmarks = () => {
        isViewingBookmark = false;
        wrapper.removeEventListener('scroll', onWrapperScroll);
        console.log('close');
        viewingBookmarksStatusBar.classList.add('hidden');
    };

    const onCloseViewBookmarksAndReloadMess = () => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        onCloseViewBookmarks();

        let roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(currentRoomId)) {
                return true;
            }
            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));
        chatboxContentComp.onLoadMessage(roomInfo);
        
    };

    const onGetMoreMessageByScrolling = () => {

        callAPIListBookmarkMess(lastOffset).then(res => {
            let messagesHtml = '';
            let moreMessages = [];

            const pos = wrapper.scrollHeight + wrapper.scrollTop;
            
            moreMessages = moreMessages.concat(res?.messages || []).reverse();

            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join('');
          
            messageList.innerHTML = messagesHtml +  messageList.innerHTML;

            wrapper.scrollTop = wrapper.scrollHeight - pos;
            
            processing = false;
        })
    };

    const onWrapperScroll = () => {
        console.log(`Slide position: ${wrapper.scrollTop}`)
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
        console.log(res);
        lastOffset = res.messages[res.messages.length - 1]?.sequence;
        console.log(`Last offset: ${lastOffset}`);

        if (res.messages.length < 20) isTouchLastMess = true;
        console.log(`Is touch last mess ${isTouchLastMess}`);

        return res;
    }

    const onClickViewBookmarks = () => {
        currentRoomId = getCurrentRoomId()
        lastOffset = 0;
        isTouchLastMess = false;

        messageList = document.querySelector('.messages__list');

        wrapper = document.querySelector('.js_con_list_mess');
        viewingBookmarksStatusBar = document.querySelector('.view-bookmark-status-bar')
        viewingBookmarksStatusBar.addEventListener('click', onCloseViewBookmarksAndReloadMess, {once: true})

        callAPIListBookmarkMess(lastOffset).then((res) => {
            const messagesHtml = res.messages.reverse().map(mess => renderMessage(mess));
            isSearchMode = true;
            messageList.innerHTML = messagesHtml;

            isViewingBookmark = true;
            viewingBookmarksStatusBar.classList.remove('hidden');

            processing = false;

            wrapper.addEventListener('scroll', onWrapperScroll);
        }).catch((err) => {
            console.log(err);
        });
    };

    return {
        onClickViewBookmarks,

        onInit: (message) => {
            isLoadingBookmark = true;
            
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
                isLoadingBookmark = false;

            }).catch((err) => {
                console.log(err);
                isLoadingBookmark = false;
            });
        },

        onGetIsViewingBookmark: () => isViewingBookmark,

        onCloseViewBookmarks,

        onCloseViewBookmarksAndReloadMess
    }
})
