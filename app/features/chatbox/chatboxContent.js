define([
    'idb-keyval',
    'moment',
    'app/constant',
    'shared/alert', 
    'shared/api', 
    'shared/data', 
    'shared/functions',
    'features/chatbox/chatboxContentTemplate',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/messageSettingsSlide'
], (
    idbKeyval,
    moment,
    constant, 
    ALERT,
    API, 
    GLOBAL, 
    functions,
    template,
    chatboxTopbarComp,
    messageSettingsSlideComp
) => {
    const { API_URL, ATTRIBUE_SIDEBAR_ROOM } = constant;
    const { set, get } = idbKeyval;
    const {
        render, 
        getAvatar, 
        convertMessagetime, 
        humanFileSize, 
        transformLinkTextToHTML,
        highlightText,
        htmlEncode,
        decodeStringBase64
    } = functions;
    let messages = [];
    let lastOffset = 0;
    let unreadScrollNum = 0;
    let processing = false;
    let isTouchLastMess = false;
    let isTouchFirstMess = true;
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
            lastOffset = messages[0]?.id?.messageId;
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
        const activeRoom = { ...roomInfo };
        const rooms = [...GLOBAL.getRooms()];

        // Mark unread of active room to zero
        $(`[data-room-id="${activeRoom.id}"]`).find('.badge').html('');
        activeRoom.unreadMessages = 0;
        rooms[positionRoom] = { ...activeRoom };
        GLOBAL.setRooms(rooms);
    };

    const handleScrollToUnreadMessage = (idMess) => {
        const $messageUnread = $(`[data-chat-id="${idMess}"]`);
        const topPos = $messageUnread.offset().top;
        const topParent = $wrapper.offset().top;
        const posScrollParent = $wrapper.scrollTop();

        $wrapper.scrollTop((topPos + posScrollParent) - (topParent + 200));
    };

    const handleMessCointainFile = (file) => {
        const { type } = file;
        const data = {};

        switch (type) {
            case 2:
                data.src = `${API_URL}/image?id=${file.id}&small=1`;
                return render(template.image, data);
                break;
            case 3:
                data.src = `${API_URL}/audio?id=${file.id}`;
                return render(template.audio, data);
                break;
            case 4:
                data.src = `${API_URL}/stream?id=${file.id}`;
                return render(template.video, data);
                break;
            default:
                data.src = `${API_URL}/file?id=${file.id}`;
                data.fileName = file.filename;
                data.fileSize = humanFileSize(file.size);
                return render(template.file, data);
        }
    };

    const renderUnread = (mess) => {
        if (mess.posUnread) {
            mess.posUnread = false;
            return render(template.unread, {});
        }
       
        return '';
    };

    const renderRangeDate = (mess, i, messArr, isLoadMore) => {
        const momentMessDate = moment(mess.msgDate);
        const data = {};
        let mementPreviousMessDate = {};

        if (i === 0 && isLoadMore !== 'up') {
            data.date = momentMessDate.format('MMMM DD, YYYY');
            data.dateCode = momentMessDate.format('MMDDYYYY');
            return render(template.rangeDate, data);
        }

        if (i === 0 && isLoadMore === 'up') {
            mementPreviousMessDate = moment(messages[messages.length - 1].msgDate);
            if (!mementPreviousMessDate.isSame(momentMessDate, 'date')) {
                data.date = momentMessDate.format('MMMM DD, YYYY');
                data.dateCode = momentMessDate.format('MMDDYYYY');
                return render(template.rangeDate, data);
            }

            return '';
        }

        mementPreviousMessDate = moment(messArr[i - 1].msgDate);

        if (i === messArr.length - 1 && isLoadMore === 'down') {
            const momentNextMessDate = moment(messages[0].msgDate);
            if (momentNextMessDate.isSame(momentMessDate, 'date')) {
                $(`[data-mess-date-code='${momentMessDate.format('MMDDYYYY')}']`).remove();
            }
        }

        if (!mementPreviousMessDate.isSame(momentMessDate, 'date')) {
            data.date = momentMessDate.format('MMMM DD, YYYY');
            data.dateCode = momentMessDate.format('MMDDYYYY');
            return render(template.rangeDate, data);
        }

        return '';
    };

    const renderComment = (quotedMessage) => {
        const roomEdited = GLOBAL.getRoomInfoWasEdited();
        const sender = htmlEncode(roomEdited[quotedMessage?.sender?.id]?.user_name || quotedMessage?.sender?.name);
        const message = transformLinkTextToHTML(decodeStringBase64(quotedMessage.message));

        if (quotedMessage.file) {
            message = handleMessCointainFile(mess.file);
        }

        return `<div class="comment-box-inline" style="margin-left: 0;">${sender}: ${message}</div>`;
    }

    const renderMessage = (mess, search) => {
        const info = GLOBAL.getInfomation();
        const roomEdited = GLOBAL.getRoomInfoWasEdited();
        let message = decodeStringBase64(mess.message);
        const data = {
            id: mess.id.messageId,
            chatType: mess.type
        };

        try {
            // render with case of left the room
            if (mess.type === 7) {
                data.who = message;
                return render(template.leftGroup, data);
            }

            // render with case of join the room
            if (mess.type === 5) {
                data.who = message;
                return render(template.joinGroup, data);
            }

            // render with calling
            if (mess.type === 21 || mess.type === 24) {
                data.mess = message;
                return render(template.call, data);
            }

            if (search && search.offset && search.offset === mess.id.messageId) {
                message = highlightText(message, search.value);
            }

            data.src = getAvatar(mess.sender.id);
            data.name = htmlEncode(roomEdited[mess.sender.id]?.user_name || mess.sender.name);
            data.officially_name = htmlEncode(mess.sender.name);
            data.userId = mess.sender.id;
            data.show_internal = mess.internal ? '' : 'hidden';
            data.who = info.id === mess.sender.id ? 'you' : '';
            data.date = convertMessagetime(mess.msgDate, GLOBAL.getLangJson());
            data.forward = mess.forwarded ? 'fwme' : '';

            // render with case of comment
            if (message.indexOf('"></c>') > -1 && message.indexOf('<div class="col-xs-12 comment-box-inline" style="margin-left: 0;">') === -1 && !message.quotedMessage) {
                try {
                    splitMess = message.split('<c style="display:none" ob="');
                    const commentInfo = JSON.parse(splitMess[1].replace('"></c>', ''));
                    data.comment = `<div class="comment-box-inline" style="margin-left: 0;">${htmlEncode(roomEdited[commentInfo?.userId]?.user_name || commentInfo?.name)}: ${commentInfo.mess}</div>`;
                    data.mess = transformLinkTextToHTML(splitMess[0]);
                } catch(e) {
                    data.mess = transformLinkTextToHTML(message);
                }
            } else {
                if (mess.quotedMessage) {
                    data.comment = renderComment(mess.quotedMessage);
                }

                data.mess = transformLinkTextToHTML(message);
            }

            if (mess.file) {
                data.isFile = 'have-file';
                data.mess = handleMessCointainFile(mess.file);
            }

            return render(template.mess, data);
        } catch (e) {
            console.log('Bug render message');
            console.log(e);
            console.log(mess);
            console.log(messages);
            return '';
        }
    };

    const onGetMoreMessageByScrollingUp = () => {
        let currentMessages = GLOBAL.getCurrentMessages();
        let firstOffset = messages[messages.length - 1]?.id?.messageId;
        let newestMessOffset = currentMessages[currentMessages.length - 1]?.id?.messageId;

        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: firstOffset + 20
        };
        processing = true;

        API.get('messages', params).then(res => {
            if (firstOffset !== messages[messages.length - 1]?.id?.messageId || params.chatId !== GLOBAL.getCurrentRoomId() || res.status !== 0) {
                processing = false;
                return;
            }

            let moreMessages = res.data.messages.filter(mess => mess.id.messageId > firstOffset).reverse();
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'up') + renderMessage(mess))).join('');
            messages = [...messages, ...moreMessages];
            $wrapper.scrollTop($wrapper.scrollTop() - 1);
            $messageList.append(messagesHtml);
            
            if (newestMessOffset <= moreMessages[moreMessages.length - 1]?.id?.messageId) {
                isTouchFirstMess = true;
            }

            setTimeout(() => {
                processing = false;
            }, 50);
        });
    };

    const onGetMoreMessageByScrolling = () => {
        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: lastOffset
        };
        processing = true;

        API.get('messages', params).then(res => {
            if (params.offset !== lastOffset || params.chatId !== GLOBAL.getCurrentRoomId() || res.status !== 0) {
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
            messages = [...moreMessages, ...messages];
            lastOffset = moreMessages[0]?.id?.messageId;
            $wrapper.scrollTop($wrapper.scrollTop() + 10);
            $messageList.prepend(messagesHtml);
            setTimeout(() => {
                processing = false;
            }, 50);
        });
    };

    const onHandleRoomWasDeleted = () => {
        const id = GLOBAL.getCurrentRoomId();
        const rooms = GLOBAL.getRooms().filter((room) => (room.id !== id));

        $('.js_caption').show();
        $('.js_wrap_mess').hide();
        $(`[${constant.ATTRIBUE_SIDEBAR_ROOM}="${id}"]`).remove();
        GLOBAL.setRooms(rooms);
        GLOBAL.setCurrentRoomId(null);
        ALERT.show('This chat room no longer exists');
    };

    const onErrNetWork = (err) => {
        console.log(err);
        ALERT.show('Unable to connect to the Internet');
        GLOBAL.setCurrentRoomId(null);
        $('.js_caption').show();
        $('.js_wrap_mess').hide();
        $(`[${constant.ATTRIBUE_SIDEBAR_ROOM}]`).removeClass('active');
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

        let messagesHtml = '';
        let isShowUnread = roomInfo.unreadMessages > 0 && roomInfo.unreadMessages < 16;
        let idUnread = null;

        // Mark when got all messages in this chat room
        if (res?.data?.messages?.length < 20) {
            isTouchLastMess = true;
        }

        // Update time activity to top bar
        chatboxTopbarComp.onRenderTimeActivity(res?.data?.partnerLastTimeActivity);

        // Mark unread message position
        if (isShowUnread && res?.data?.messages?.length) {
            const index = roomInfo.unreadMessages - 1;

            if (res.data.messages[index]) {
                res.data.messages[index].posUnread = true; 
                idUnread = res.data.messages[index].id.messageId;
            } else {
                isShowUnread = false;
            }
        }

        messages = messages.concat((res?.data?.messages || []).reverse());
        GLOBAL.setCurrentMessages(messages);
        lastOffset = messages[0]?.id?.messageId;
        messagesHtml = messages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))).join('');
        $messageList.html(messagesHtml);
        $loadingOfNew.hide();

        // Assign message to store
        get('chats').then((chats) => {
            let tempChats;

            if (!chats) {
                tempChats = {};
            } else {
                tempChats = chats;
            }

            tempChats[roomInfo.id] = messages;
            set('chats', tempChats);
        });

        // Handle scroll if message list have an unread message
        if (isShowUnread) {
            handleScrollToUnreadMessage(idUnread);
        } else {
            $wrapper.scrollTop($wrapper[0].scrollHeight);
        }

        $messageList.find('.--click-show-popup-up-img').on('load', onLoadImage);
        
        setTimeout(() => {
            updateRoomInfo(roomInfo, positionRoom);
            processing = false;
        }, 50);
    }).catch(onErrNetWork);

    const onRefresh = () => {
        $loadingOfNew.show();
        $messageList.html('');
        $unreadScroll.text(0);
        $unreadScroll.hide();
        unreadScrollNum = 0;
        processing = true;
        isTouchFirstMess = true;
        isTouchLastMess = false;
        messages = [];
        GLOBAL.setCurrentMessages([]);
    };
    
    return {
        onInit: () => {
            $unreadScroll.hide();
            messageSettingsSlideComp.onInit();
            $wrapper.off('scroll').scroll(onWrapperScroll);
            $btnScrollToBottom.off('click').click(onScrollToBottom);
            $(document).off('.btnMessageSettings').on('click.btnMessageSettings', '.btn-message-settings', (e) => messageSettingsSlideComp.onShow(e));
        },

        onLoadMessage: (roomInfo, positionRoom) => {
            onRefresh();
            if (GLOBAL.getNetworkStatus()) {
                onGetMessage({ ...roomInfo }, positionRoom);
            } else {
                get('chats').then((chats) => {  
                    if (!chats || !chats[roomInfo.id]) {
                        onErrNetWork('');
                    } else {
                        let messagesHtml = chats[roomInfo.id].map((mess, i, messArr) => (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))).join('');
                        $messageList.html(messagesHtml);
                        $loadingOfNew.hide();
                        $(`[data-room-id="${roomInfo.id}"]`).find('.badge').html('');
                        $wrapper.scrollTop($wrapper[0].scrollHeight);
                    }
                });
            }
        },

        onSync: (messList = []) => {
            // Prevent duplicate message
            if ($(`[data-chat-id="${messList[0]?.id?.messageId}"]`).length) {
                return false;
            }

            // up unread message when scrollbar does not set at bottom 
            if ($wrapper.scrollTop() + $wrapper.height() < $wrapper[0].scrollHeight - 400 && GLOBAL.getInfomation().id !== messList[0].sender.id) {
                unreadScrollNum += 1;
                $unreadScroll.text(unreadScrollNum);
                $unreadScroll.show();
            }

            if (isTouchFirstMess) {
                const wrapperHtml = $wrapper.get(0);
                const isBottom = wrapperHtml.scrollHeight - wrapperHtml.scrollTop <= wrapperHtml.clientHeight;
                const messagesHtml = messList.map((mess, i) => {
                    if (i === 0 && messages.length) {
                        return renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);
                    }

                    return renderMessage(mess);
                }).join('');

                // Render new message
                messages = messages.concat(messList);
                $messageList.append(messagesHtml);

                // Check if chatbox scrolled to the bottom
                if (isBottom) {
                    $wrapper.scrollTop(wrapperHtml.scrollHeight);
                    $messageList.find('.--click-show-popup-up-img').on('load', onLoadImage);
                }
            }

            if (GLOBAL.getCurrentMessages().length === 20) {
                GLOBAL.setCurrentMessages([ ...GLOBAL.getCurrentMessages().slice(1, 20), messList[0] ]);
            } else {
                GLOBAL.setCurrentMessages([ ...GLOBAL.getCurrentMessages(), messList[0] ]);
            }
        },

        onSyncRemove: (id) => {
            const $message = $(`[data-chat-id="${id}"]`);
            const $prevMessage = $message.prev();
            const $prevMessageTwo = $prevMessage.prev();

            $prevMessage.hasClass('not-mess-li') && $prevMessage.remove();
            $prevMessageTwo.hasClass('not-mess-li') && $prevMessageTwo.remove();
            $message.remove();

            // messages = messages.filter(message => (message.id.messageId !== id));
            GLOBAL.setCurrentMessages(GLOBAL.getCurrentMessages().filter(message => (message.id.messageId !== id)));
        },

        onSyncUpdate: (message) => {
            const id = message.id.messageId;
            const $message = $(`[data-chat-id="${id}"]`);

            $message.find('.--mess').html(transformLinkTextToHTML(decodeStringBase64(message.message)));
            // messages = messages.map(mess => {
            //     if (mess.id.messageId === id) {
            //         mess.message = message.message;
            //     }

            //     return mess;
            // });
            
            GLOBAL.setCurrentMessages(GLOBAL.getCurrentMessages().map(mess => {
                if (mess.id.messageId === id) {
                    mess.message = message.message;
                }

                return mess;
            }));
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
                $(`[data-chat-id="${search.offset}"] .--mess`).html(highlightText(messExist.message, search.value));
            }
            
            if ($(`[data-chat-id="${firstOffset}"]`).length) {
                isTouchFirstMess = true;
            } else {
                isTouchFirstMess = false;
            }

            handleScrollToUnreadMessage(search.offset);
        }
    };
});
