define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions',
    'shared/offlineData',
    'features/chatbox/chatboxContentChatList',
    'features/chatbox/chatboxContentFunctions',
    'features/chatbox/chatboxContentTemplate',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/messageSettingsSlide'
], (
    constant,
    API, 
    GLOBAL, 
    functions,
    offlineData,
    chatboxContentChatListComp,
    contentFunc,
    template,
    chatboxTopbarComp,
    messageSettingsSlideComp
) => {
    const IMAGE_CLASS = '.--click-show-popup-up-img';
    const { 
        ATTRIBUTE_SIDEBAR_ROOM, 
        ATTRIBUTE_MESSAGE_ID 
    } = constant;
    const {
        transformLinkTextToHTML,
        highlightText,
        decodeStringBase64
    } = functions;
    const {
        getChatById,
        setChatsById
    } = offlineData;
    const { 
        renderMessage,
        renderUnread,
        renderRangeDate,
        onErrNetWork,
        onHandleRoomWasDeleted
    } = contentFunc;
    const { 
        getRoomById,
        storeRoomById
    } = chatboxContentChatListComp;
    let lastOffset = 0;
    let unreadScrollNum = 0;
    let processing = false;
    let isTouchLastMess = false;
    let isTouchFirstMess = true;
    let isInit = false;
    const $btnScrollToBottom = $('.scroll-to__bottom');
    const $messageList = $('.messages__list');
    const $wrapper = $('.js_con_list_mess');
    const $loadingOfNew = $('.--load-mess');
    const $unreadScroll = $('.unread-message-scroll');

    const onWrapperScroll = () => {
        // Show scroll to bottom button
        if ($wrapper.scrollTop() + $wrapper.height() < $wrapper[0].scrollHeight - 400) {
            $btnScrollToBottom.show();
        } else {
            if (isTouchFirstMess) {
                unreadScrollNum = 0;
                $unreadScroll.text(0);
                $unreadScroll.hide();
                $btnScrollToBottom.hide();
            }
        }

        if (!isTouchFirstMess && !processing && $wrapper.scrollTop() + $wrapper.height() > $wrapper[0].scrollHeight - 700) {
            onGetMoreMessageByScrollingUp();
        }

        // condition 1 : When the request is being processed, this action will skip, prevent user spam
        // condition 2: If message number gets from API have length small than 20, this action will skip
        // condition 3: When scroll to near bottom, get more messages
        if (processing || isTouchLastMess || $wrapper.scrollTop() > 700) {
            return;
        }

        onGetMoreMessageByScrolling();
    };

    const onLoadImage = () => {
        const wrapperHtml = $wrapper.get(0);
        $wrapper.scrollTop(wrapperHtml.scrollHeight);
    };

    const onScrollToBottom = () => {
        if (!isTouchFirstMess) {
            isTouchFirstMess = true;
            messages = GLOBAL.getCurrentMessages();
            lastOffset = messages[0]?.sequence;
            messagesHtml = messages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, true) + renderMessage(mess, search))).join('');
            $messageList.html(messagesHtml);
            setTimeout(() => {
                isTouchLastMess = false;
            }, 200);
            $wrapper.animate({ scrollTop: $wrapper[0].scrollHeight }, 200);
        } else {
            $wrapper.animate({ scrollTop: $wrapper[0].scrollHeight }, 200);
        }
    };

    const updateRoomInfo = (roomInfo, positionRoom) => {
        const rooms = GLOBAL.getRooms();

        // Mark unread of active room to zero
        $(`[${ATTRIBUTE_SIDEBAR_ROOM}="${roomInfo.id}"]`).find('.badge').html('');
        roomInfo.unreadMessages = 0;
        rooms[positionRoom] = roomInfo;
        GLOBAL.setRooms(rooms);
    };

    const handleScrollToUnreadMessage = (idMess) => {
        const $messageUnread = $(`[${ATTRIBUTE_MESSAGE_ID}="${idMess}"]`);

        if (!$messageUnread.length) {
            return;
        }

        const topPos = $messageUnread.offset().top;
        const topParent = $wrapper.offset().top;
        const posScrollParent = $wrapper.scrollTop();

        $wrapper.scrollTop((topPos + posScrollParent) - (topParent + 200));
    };

    const onGetMoreMessageByScrollingUp = () => {
        let id = GLOBAL.getCurrentRoomId();
        let messages = getRoomById(id);
        let currentMessages = GLOBAL.getCurrentMessages();
        let firstOffset = messages[messages.length - 1]?.sequence;
        let newestMessOffset = currentMessages[currentMessages.length - 1]?.sequence;

        const params = {
            chatId: id,
            offset: firstOffset + 20
        };
        processing = true;

        API.get('messages', params).then(res => {
            if (firstOffset !== messages[messages.length - 1]?.sequence || params.chatId !== id || res.status !== 0) {
                processing = false;
                return;
            }

            let moreMessages = res.data.messages.filter(mess => mess.sequence > firstOffset).reverse();
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'up') + renderMessage(mess))).join('');
            messages = [...messages, ...moreMessages];
            $wrapper.scrollTop($wrapper.scrollTop() - 1);
            $messageList.append(messagesHtml);
            
            if (newestMessOffset <= moreMessages[moreMessages.length - 1]?.sequence) {
                isTouchFirstMess = true;
            }

            setTimeout(() => {
                processing = false;
            }, 50);
        });
    };

    const onGetMoreMessageByScrolling = () => {
        let id = GLOBAL.getCurrentRoomId();
        let messages = getRoomById(id);

        const params = {
            chatId: id,
            offset: lastOffset
        };
        processing = true;

        API.get('messages', params).then(res => {
            if (params.offset !== lastOffset || params.chatId !== id || res.status !== 0) {
                processing = false;
                return;
            }

            let messagesHtml = '';
            let moreMessages = [];

            if (res?.data?.messages?.length < 20) {
                isTouchLastMess = true;
            }

            moreMessages = moreMessages.concat(res?.data?.messages || []).reverse();
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join('');
            lastOffset = moreMessages[0]?.sequence;

            storeRoomById(id, [...moreMessages, ...messages]);
            $wrapper.scrollTop($wrapper.scrollTop() + 1);
            $messageList.prepend(messagesHtml);
            setTimeout(() => {
                processing = false;
            }, 50);
        });
    };

    const handleDataFromGetMess = (messages, roomInfo, positionRoom) => {
        let messagesHtml = '';
        let isShowUnread = roomInfo.unreadMessages > 0 && roomInfo.unreadMessages < 16;
        let idUnread = null;

        // Mark when got all messages in this chat room
        if (messages.length < 20) {
            isTouchLastMess = true;
        }

        // Mark unread message position
        if (isShowUnread && messages.length) {
            const index = messages.length - roomInfo.unreadMessages;

            if (messages[index]) {
                messages[index].posUnread = true; 
                idUnread = messages[index].id.messageId;
            } else {
                isShowUnread = false;
            }
        }

        lastOffset = messages[0]?.sequence;
        messagesHtml = messages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))).join('');
        $messageList.html(messagesHtml);

        // Handle scroll if message list have an unread message
        if (isShowUnread) {
            handleScrollToUnreadMessage(idUnread);
        } else {
            $wrapper.scrollTop($wrapper[0].scrollHeight);
        }

        $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
        $loadingOfNew.hide();
        
        setTimeout(() => {
            updateRoomInfo(roomInfo, positionRoom);
            processing = false;
        }, 50);
    };

    const onGetMessage = (roomInfo, positionRoom) => API.get('messages', { chatId: roomInfo.id, offset: 0 }).then(res => {
        // Handle when user switch room but the request has not finished yet
        if (roomInfo.id !== GLOBAL.getCurrentRoomId()) {
            return;
        }

        if (res.status !== 0) {
            // Handle when room was deleted
            if (res.status === 2) {
                onHandleRoomWasDeleted();
            }
            
            return;
        }

        // Update time activity to top bar
        chatboxTopbarComp.onRenderTimeActivity(res?.data?.partnerLastTimeActivity);

        let messages = (res?.data?.messages || []).reverse();

        // Assign message to store
        setChatsById(roomInfo.id, messages);
        storeRoomById(roomInfo.id, messages);

        handleDataFromGetMess(messages, roomInfo, positionRoom);
    }).catch(onErrNetWork);

    const onGetMessageFromCache = (roomInfo, positionRoom) => {
        handleDataFromGetMess(getRoomById(roomInfo.id), roomInfo, positionRoom);
    };

    const onRefresh = () => {
        $loadingOfNew.show();
        $messageList.html('');
        $unreadScroll.text(0);
        $unreadScroll.hide();
        unreadScrollNum = 0;
        processing = true;
        isTouchFirstMess = true;
        isTouchLastMess = false;
    };
    
    return {
        onInit: () => {
            $unreadScroll.hide();
            messageSettingsSlideComp.onInit();
            $wrapper.off('scroll').scroll(onWrapperScroll);
            $btnScrollToBottom.off('click').click(onScrollToBottom);
            $(document).off('.btnMessageSettings').on('click.btnMessageSettings', '.btn-message-settings', (e) => messageSettingsSlideComp.onShow(e));
        },

        onLoadMessage: async (roomInfo, positionRoom) => {
            onRefresh();

            if (getRoomById(roomInfo.id) && isInit) {
                onGetMessageFromCache(roomInfo, positionRoom);
                return;
            }

            if (GLOBAL.getNetworkStatus()) {
                isInit = true;
                onGetMessage(roomInfo, positionRoom);
            } else {
                const messagesChat = await getChatById(roomInfo.id);
                if (!messagesChat) {
                    onErrNetWork('');
                    return;
                }

                let messagesHtml = messagesChat.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))).join('');
                $messageList.html(messagesHtml);
                $loadingOfNew.hide();
                $(`[${ATTRIBUTE_SIDEBAR_ROOM}="${roomInfo.id}"]`).find('.badge').html('');
                $wrapper.scrollTop($wrapper[0].scrollHeight);
            }
        },

        onSync: (messList = []) => {
            const mess = messList[0];
            let id = GLOBAL.getCurrentRoomId();
            // Prevent duplicate message
            if ($(`[${ATTRIBUTE_MESSAGE_ID}="${mess?.id?.messageId}"]`).length) {
                return false;
            }
            
            let messages = getRoomById(id);

            // up unread message when scrollbar does not set at bottom 
            if (
                $wrapper.scrollTop() + $wrapper.height() < $wrapper[0].scrollHeight - 400 
                && GLOBAL.getInfomation().id !== mess.sender.id
            ) {
                unreadScrollNum += 1;
                $unreadScroll.text(unreadScrollNum);
                $unreadScroll.show();
            }

            if (isTouchFirstMess) {
                const wrapperHtml = $wrapper.get(0);
                const isBottom = wrapperHtml.scrollHeight - wrapperHtml.scrollTop <= wrapperHtml.clientHeight;
                const messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);

                // Render new message
                $messageList.append(messagesHtml);

                // Check if chatbox scrolled to the bottom
                if (isBottom) {
                    $wrapper.scrollTop(wrapperHtml.scrollHeight);
                    $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
                }
            }
        },

        onSyncRemove: (id) => {
            const $message = $(`[${ATTRIBUTE_MESSAGE_ID}="${id}"]`);
            const $prevMessage = $message.prev();
            const $prevMessageTwo = $prevMessage.prev();

            $prevMessage.hasClass('not-mess-li') && $prevMessage.remove();
            $prevMessageTwo.hasClass('not-mess-li') && $prevMessageTwo.remove();
            $message.remove();
        },

        onSyncUpdate: (message) => {
            const id = message.id.messageId;
            const $message = $(`[${ATTRIBUTE_MESSAGE_ID}="${id}"]`);

            $message.find('.--mess').html(transformLinkTextToHTML(decodeStringBase64(message.message)));       
        },

        onSearch: (search, messExist) => {
            let currentMessages = GLOBAL.getCurrentMessages();
            let firstOffset = currentMessages[currentMessages.length - 1]?.id?.messageId;

            if (!messExist) {
                isTouchLastMess = false;
                messages = GLOBAL.getCurrentSearchMessages();
                lastOffset = messages[0]?.id?.messageId;
                messagesHtml = messages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess, search))).join('');
                $messageList.html(messagesHtml);
            } else {
                $(`[${ATTRIBUTE_MESSAGE_ID}="${search.offset}"] .--mess`).html(highlightText(messExist.message, search.value));
            }
            
            if ($(`[${ATTRIBUTE_MESSAGE_ID}="${firstOffset}"]`).length) {
                isTouchFirstMess = true;
            } else {
                isTouchFirstMess = false;
            }

            handleScrollToUnreadMessage(search.offset);
        },

        onFinishPostMessage: (data) => {
            const $mess = $(`[data-id-local="${data.idLocal}"]`);
            const messages = getRoomById(data.chatId);

            storeRoomById(data.chatId, messages.map(mess => {
                if (data.idLocal === mess.idLocal) {
                    mess.idLocal = null;
                    mess.id = {
                        chatId: data.chatId,
                        messageId: data.messageId
                    }
                }

                return mess;
            }));

            if (!$mess.length) {
                return false;
            }

            $mess.attr(ATTRIBUTE_MESSAGE_ID, data.messageId);
            $mess.removeClass('js_li_mess_local');
        },

        onAddLocal: async (data) => {
            const rid = data.chatId;
            const info =  GLOBAL.getInfomation();
            const wrapperHtml = $wrapper.get(0);
            let messages = getRoomById(rid);
            let messagesHtml = '';
            const mess = {
                deleted: false,
                forwarded: false,
                file: null,
                quotedMessage: null,
                idLocal: data.idLocal,
                type: 1,
                updated: false,
                internal: data.params.internal,
                message: data.params.message,
                msgDate: data.idLocal,
                sender: {
                    email: info.email,
                    id: info.id,
                    name: info.name
                }
            };

            if (!isInit) {
                messages = await getChatById(rid) || [];
            }

            if (messages.length) {
                messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);
            } else {
                messagesHtml = renderMessage(mess);
            }

            storeRoomById(rid, messages.concat(mess));
            $messageList.append(messagesHtml);
            $wrapper.scrollTop(wrapperHtml.scrollHeight);
            $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
        },
    };
});
