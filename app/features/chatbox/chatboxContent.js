define([
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
    let messages = [];
    let processing = false;
    let isTouchLastMess = false;
    const {
        render, 
        getAvatar, 
        convertMessagetime, 
        humanFileSize, 
        transformLinkTextToHTML,
        htmlEncode
    } = functions;

    const $btnScrollToBottom = $('.scroll-to__bottom');
    const $messageList = $('.messages__list');
    const $wrapper = $('.js_con_list_mess');
    const $loadingOfNew = $('.--load-mess');

    const onWrapperScroll = () => {
        // Show scroll to bottom button
        if ($wrapper.scrollTop() + $wrapper.height() < $wrapper[0].scrollHeight - 400) {
            $btnScrollToBottom.show();
        } else {
            $btnScrollToBottom.hide();
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

    const onScrollToBottom = () => $wrapper.animate({ scrollTop: $wrapper[0].scrollHeight }, 200);

    const updateRoomInfo = (roomInfo, positionRoom) => {
        const activeRoom = { ...roomInfo };
        const rooms = [...GLOBAL.getRooms()];

        // Mark unread of active room to zero
        $(`[data-room-id="${activeRoom.id}"]`).find('.badge').html('');
        activeRoom.member.messagecounter = 0;
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

        if (i === 0) {
            data.date = momentMessDate.format('MMMM DD, YYYY');
            data.dateCode = momentMessDate.format('MMDDYYYY');
            return render(template.rangeDate, data);
        }

        mementPreviousMessDate = moment(messArr[i - 1].msgDate);

        if (i === messArr.length - 1 && isLoadMore) {
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

    const renderMessage = (mess) => {
        const info = GLOBAL.getInfomation();
        const roomEdited = GLOBAL.getRoomInfoWasEdited();
        const data = {
            id: mess.id.messageId,
            chatType: mess.type
        };

        try {
            // render with case of left the room
            if (mess.type === 7) {
                data.who = mess.message;
                return render(template.leftGroup, data);
            }

            // render with case of join the room
            if (mess.type === 5) {
                data.who = mess.message;
                return render(template.joinGroup, data);
            }

            // render with calling
            if (mess.type === 21 || mess.type === 24) {
                data.mess = mess.message;
                return render(template.call, data);
            }

            data.src = getAvatar(mess.sender.id);
            data.name = htmlEncode(roomEdited[mess.sender.id]?.user_name || mess.sender.name);
            data.officially_name = htmlEncode(mess.sender.name);
            data.userId = mess.sender.id;
            data.show_internal = mess.internal ? '' : 'hidden';
            data.who = info.id === mess.sender.id ? 'you' : '';
            data.date = convertMessagetime(mess.msgDate);

            // render with case of comment
            if (mess.message.indexOf('"></c>') > -1 && mess.message.indexOf('<div class="col-xs-12 comment-box-inline" style="margin-left: 0;">') === -1) {
                try {
                    splitMess = mess.message.split('<c style="display:none" ob="');
                    const commentInfo = JSON.parse(splitMess[1].replace('"></c>', ''));
                    data.comment = `<div class="comment-box-inline" style="margin-left: 0;">${htmlEncode(roomEdited[commentInfo?.userId]?.user_name || commentInfo?.name)}: ${commentInfo.mess}</div>`;
                    data.mess = transformLinkTextToHTML(splitMess[0]);
                } catch(e) {
                    console.log(e);
                    data.mess = transformLinkTextToHTML(mess.message);
                }
            } else {
                data.mess = transformLinkTextToHTML(mess.message);
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

    const onGetMoreMessageByScrolling = () => {
        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: messages[0]?.id?.messageId
        };
        processing = true;

        API.get('messages', params).then(res => {
            let messagesHtml = '';
            let moreMessages = [];
            if (res.status !== 0) {
                return;
            }

            if (res?.data?.messages?.length < 20) {
                isTouchLastMess = true;
            }

            moreMessages = moreMessages.concat(res?.data?.messages || []).reverse();
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, true) + renderMessage(mess))).join('');
            messages = [...moreMessages, ...messages];
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
        if (roomInfo.id !== GLOBAL.getCurrentRoomId() || res.status !== 0) {
            return;
        }

        // Handle when room was deleted
        if (res.status === 2) {
            onHandleRoomWasDeleted();
            return;
        }

        let messagesHtml = '';
        let isShowUnread = roomInfo.member.messagecounter > 0 && roomInfo.member.messagecounter < 16;
        let idUnread = null;

        // Mark when got all messages in this chat room
        if (res?.data?.messages?.length < 20) {
            isTouchLastMess = true;
        }

        // Update time activity to top bar
        chatboxTopbarComp.onRenderTimeActivity(res?.data?.partnerLastTimeActivity);

        // Get members of group
        if (roomInfo.group && res.data.members) {
            GLOBAL.setCurrentGroupMembers(res.data.members);
        } else {
            GLOBAL.setCurrentGroupMembers(null);
        }

        // Mark unread message position
        if (isShowUnread && res?.data?.messages?.length) {
            const index = roomInfo.member.messagecounter - 1;

            if (res.data.messages[index]) {
                res.data.messages[index].posUnread = true; 
                idUnread = res.data.messages[index].id.messageId;
            } else {
                isShowUnread = false;
            }
        }

        messages = messages.concat((res?.data?.messages || []).reverse());
        messagesHtml = messages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))).join('');
        $messageList.html(messagesHtml);
        $loadingOfNew.hide();

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
        GLOBAL.setCurrentGroupMembers(null);
        $loadingOfNew.show();
        $messageList.html('');
        processing = true;
        isTouchLastMess = false;
        messages = [];
    };
    
    return {
        onInit: () => {
            messageSettingsSlideComp.onInit();
            $wrapper.scroll(onWrapperScroll);
            $btnScrollToBottom.click(onScrollToBottom);
            $(document).on('click', '.btn-message-settings', (e) => messageSettingsSlideComp.onShow(e));
        },

        onLoadMessage: (roomInfo, positionRoom) => {
            onRefresh();
            onGetMessage({ ...roomInfo }, positionRoom);
        },

        onSync: (messList = []) => {
            // Prevent duplicate message
            if ($(`[data-chat-id="${messList[0]?.id?.messageId}"]`).length) {
                return false;
            }

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
        },

        onSyncRemove: (id) => {
            const $message = $(`[data-chat-id="${id}"]`);
            const $prevMessage = $message.prev();
            const $prevMessageTwo = $prevMessage.prev();

            $prevMessage.hasClass('not-mess-li') && $prevMessage.remove();
            $prevMessageTwo.hasClass('not-mess-li') && $prevMessageTwo.remove();
            $message.remove();

            messages = messages.filter(message => (message.id.messageId !== id));
        },

        onSyncUpdate: (message) => {
            const id = message.id.messageId;
            const $message = $(`[data-chat-id="${id}"]`);

            $message.find('.--mess').html(transformLinkTextToHTML(message.message));
            messages = messages.map(mess => {
                if (mess.id.messageId === id) {
                    mess.message = message.message;
                }

                return mess;
            });
        }
    };
});
