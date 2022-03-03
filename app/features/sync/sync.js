define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions',
    'features/sidebar/sidebarService',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxContentChatList',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/messageSettingsSlide',
    'features/notification/notification',
    'features/modal/modalPhoneRequest',
    'shared/alert',
    'features/modal/modalLogout',
    'features/modal/modalPinMessage',
    'features/modal/modalTagPerson'
], (
    constant,
    API,
    GLOBAL,
    functions,
    sidebarService,
    chatboxContentComp,
    chatboxContentChatListComp,
    chatboxTopbarComp,
    messageSettingsSlideComp,
    notificationComp,
    modalPhoneRequest,
    ALERT,
    modalLogout,
    modalPinMessage,
    modalTagPerson
) => {
    let timeout;
    let isInit = false;
    let isBlinkTitleBrowser = false;
    const {
        SESSION_ID, ACCESS_TOKEN, USER_ID, ATTRIBUTE_MESSAGE_ID, ATTRIBUTE_SIDEBAR_ROOM,
        LAST_SYNCED_AT
    } = constant;
    const { handleSyncData } = chatboxContentChatListComp;
    const data = {
        timeout: 10000,
        onBackground: false
    };
    const {
        getRoomById, storeRoomById
    } = chatboxContentChatListComp;

    const {
        stripTags,
        htmlEncode,
        decodeStringBase64
    } = functions;

    const isLogin = () => {
        const sessionId = functions.getDataToLocalApplication(SESSION_ID) || '';
        const token = functions.getDataToLocalApplication(ACCESS_TOKEN) || '';
        const userId = functions.getDataToLocalApplication(USER_ID) || '';

        return !!(sessionId && token && userId);
    };

    const blinkTitle = () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        if (document.hasFocus()) {
            document.title = 'Messenger';
            $('#favicon').attr('href', '/assets/images/favicon.ico');
            return;
        }

        if (!isBlinkTitleBrowser) {
            document.title = 'Messenger';
            $('#favicon').attr('href', '/assets/images/favicon1.ico');
        } else {
            document.title = 'New Message!';
            $('#favicon').attr('href', '/assets/images/favicon2.ico');
        }

        isBlinkTitleBrowser = !isBlinkTitleBrowser;
        timeout = setTimeout(blinkTitle, 1000);
    };

    const updateRoom = (room, messages) => {
        const currentUserId = GLOBAL.getInfomation().id;
        const currentRoomId = GLOBAL.getCurrentRoomId();
        const newRoom = { ...room };
        const lastNum = messages.length - 1;

        if (!messages[lastNum].updated && !messages[lastNum].deleted) {
            newRoom.lastMessage = messages[messages.length - 1].message;
            newRoom.type = messages[messages.length - 1].type;
        }

        if (currentRoomId !== room.id) {
            let unReadNum = newRoom.unreadMessages;
            messages.forEach(message => {
                if (message.deleted || message.updated) {
                    return;
                }
                if (currentUserId !== message.sender.id && message.msgDate > room.updated
                    && message.unread === true) {
                    unReadNum += 1;
                }
            });

            newRoom.unreadMessages = unReadNum;
        } else {
            newRoom.unreadMessages = 0;
        }

        return newRoom;
    };

    const handleMoveRoomUp = (room) => sidebarService.moveRoomUp(room);

    const handleWithCalling = (isAudioOnly, message, roomId) => {
        const currentUserId = GLOBAL.getInfomation().id;
        if (currentUserId !== message.sender.id) {
            modalPhoneRequest.onInit(isAudioOnly, message.sender, roomId);
        }
    };

    const handleWithAcceptCall = (message) => {
        const currentUserId = GLOBAL.getInfomation().id;
        if (currentUserId === message.sender.id) {
            modalPhoneRequest.onAcceptCall();
        }
    };

    const handleWithEndCall = (message, roomId) => {
        const currentUserId = GLOBAL.getInfomation().id;
        if (currentUserId !== message.sender.id) {
            modalPhoneRequest.onEndCall(roomId);
        }
    };

    const handleWithCancelCall = (message) => {
        const currentUserId = GLOBAL.getInfomation().id;
        if (currentUserId !== message.sender.id) {
            modalPhoneRequest.onCancelCall();
        }
    };

    const handleUpdateRemoveMessOnSidebar = (message) => {
        let lastMessage;
        let roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(message.id.chatId)) {
                return true;
            }

            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));

        const renderLastMessSideBar = () => {
            if (message.id.messageId === lastMessage) {
                const sidebarItem = document.querySelectorAll(`[${ATTRIBUTE_SIDEBAR_ROOM}="${message.id.chatId}"]`);
                const text = htmlEncode(stripTags(decodeStringBase64(message.message)));
                sidebarItem[0].querySelector('.preview').textContent = text;
            } 
        };

        // If the "getRoomById()" is undefined (user has not click to the room), init onLoadMessage
        if (!roomInfo?.owner && !getRoomById(message.id.chatId)) {
            roomInfo.isUpdateOrRemoveMessBeforeGetRoomById = true;
            chatboxContentComp.onLoadMessage(roomInfo).then((res) => {
                lastMessage = res[res.length - 1].id.messageId;

                renderLastMessSideBar();

                delete roomInfo.isUpdateOrRemoveMessBeforeGetRoomById;
            });
        } else {
            const listMess = getRoomById(message.id.chatId);
            lastMessage = listMess[listMess.length - 1].id.messageId;
            renderLastMessSideBar();
        }
    };

    const renderMessageForActiveRoom = (messages, roomId) => {
        let isNotMoveRoomUp = true;
        const isCurrentRoom = GLOBAL.getCurrentRoomId() === roomId;
        messages.forEach(message => {
            handleSyncData(message, roomId);
            // Handle with message was deleted

            if (message.deleted) {
                if (isCurrentRoom) {
                    chatboxContentComp.onSyncRemove(message);
                }

                // Handle with deleted message in sidebar room
                handleUpdateRemoveMessOnSidebar(message);

                return;
            }

            // Handle with message was updated
            if (message.updated) {
                if (isCurrentRoom) {
                    chatboxContentComp.onSyncUpdate(message);
                }

                // Handle with updated message in sidebar room
                handleUpdateRemoveMessOnSidebar(message);

                return;
            }

            // Not update when someone left
            if (message.type !== 6 && message.type !== 7) {
                isNotMoveRoomUp = false;
            }

            // Handle with message is calling audio only
            if (message.type === 21) {
                handleWithCalling(true, message, roomId);
            }

            // Handle with message is canceled
            if (message.type === 22) {
                handleWithCancelCall(message);
            }

            // Handle with message is accept call
            if (message.type === 23) {
                handleWithAcceptCall(message);
            }

            // Handle with message is end call
            if (message.type === 24) {
                handleWithEndCall(message, roomId);
            }

            // Handle with message is reject call
            if (message.type === 25) {
                handleWithCancelCall(message);
            }

            // Handle with message is calling with video
            if (message.type === 27) {
                handleWithCalling(false, message, roomId);
            }

            if (isCurrentRoom) {
                chatboxContentComp.onSync([message]);
            }
        });

        return isNotMoveRoomUp;
    };

    const getNewGroup = (message) => API.get('chats').then(chats => {
        try {
            const { length } = chats;

            for (let i = 0; i < length; i += 1) {
                if (chats[i].id === message.id.chatId) {
                    GLOBAL.setRooms([GLOBAL.setRoomWithAdapter(chats[i]), ...GLOBAL.getRooms()]);
                    sidebarService.newRoomUp(chats[i]);
                    notificationComp.pushNotificationForMessage(message);
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        }
    });

    const handleRealTimeMessage = (messages) => {
        let rooms = GLOBAL.getRooms();
        let roomsMove = [];
        let isPushNotification = false;
        const objRooms = {};

        messages.forEach(mess => {
            (objRooms[mess.id.chatId] = (objRooms[mess.id.chatId] || []).concat(mess));
        });

        rooms = rooms.filter((room) => {
            if (objRooms[room.id]) {
                const messagesResponse = objRooms[room.id];

                // Handle push notification
                if (!isPushNotification) {
                    isPushNotification = true;
                    if (messages[messages.length - 1].type !== 6
                        && messages[messages.length - 1].type !== 7) {
                        notificationComp.pushNotificationForMessage(messagesResponse[0], room);

                        if (messagesResponse.length === 2) {
                            notificationComp.pushNotificationForMessage(messagesResponse[1], room);
                        } 
                    }
                }

                const isNotMoveRoomUp = renderMessageForActiveRoom(objRooms[room.id], room.id);

                if (!isNotMoveRoomUp) {
                    const newRoom = updateRoom(room, messagesResponse);
                    blinkTitle();
                    roomsMove = roomsMove.concat(newRoom);

                    // If init first time (open or reload), ignore move room up
                    if (isInit) {
                        handleMoveRoomUp(newRoom);
                    }
                }

                return isNotMoveRoomUp;
            }

            return true;
        });

        if (!isPushNotification) {
            getNewGroup(messages[0]);
        }

        GLOBAL.setRooms(roomsMove.concat(rooms));
    };

    const handleTypingEvents = (typingEvents) => {
        const currentRoomId = GLOBAL.getCurrentRoomId();
        const currentUserId = GLOBAL.getInfomation().id;

        // filter only events from partners in current room
        const typingEventsFromPartnersInCurrentRoom = typingEvents
            .filter(typingEvent => typingEvent.chatId === currentRoomId
                && typingEvent.user.id !== currentUserId);

        if (typingEventsFromPartnersInCurrentRoom.length) {
            // get the latest typing event
            const lastTypingEvent = typingEventsFromPartnersInCurrentRoom
                .reduce((p, c) => (p.timestamp > c.timestamp ? p : c));

            // show latest typing event on chat box top bar
            chatboxTopbarComp.onRenderTyping(lastTypingEvent);
        }
    };

    /**
     * Method to mark all messages from chat 'chatId' before 'lastReadTime' as 'read'
     * @param {*} readChatEvents 
     */
    const handleUserReadChatEvents = (readChatEvents) => {
        readChatEvents.forEach(readChatEvent => {
            // get cached messages from the chat of the event
            const messages = getRoomById(readChatEvent.chatId);

            // only necessary to mark messages as read if messages are cached
            // messages that aren't cached, will be retrieved from database with 'read' information
            if (messages != null) {
                // if reads events are from current room, then update rendered messages
                const isCurrentRoom = GLOBAL.getCurrentRoomId() === readChatEvent.chatId;
                if (isCurrentRoom) {
                    messages
                        .filter(message => message.msgDate <= readChatEvent.lastReadTime)
                        .forEach(message => {
                            const $message = $(`[${ATTRIBUTE_MESSAGE_ID}="${message.id.messageId}"]`);
                            // mark message as 'read' for all chat members
                            $message.find('.--double-check').addClass('--read');
                        });
                }
                // update cached messages
                const newMessages = messages
                    .map(message => {
                        if (message.msgDate <= readChatEvent.lastReadTime) {
                            const newItem = { ...message };
                            newItem.readByAllPartners = true; // mark message as 'read' for all
                            return newItem;
                        }
                        return message;
                    });
                storeRoomById(readChatEvent.chatId, newMessages);
            }
        });
    };

    /**
     * Method to add new invite to chat list
     * @param {*} newInviteEvents 
     */
    const handleNewInviteEvents = (newInviteEvents) => {
        newInviteEvents.forEach(newInviteEvent => {
            const { chat } = newInviteEvent;
            GLOBAL.setRooms([GLOBAL.setRoomWithAdapter(chat), ...GLOBAL.getRooms()]);
            sidebarService.newRoomUp(chat);
            // send alert if user is invitation receiver
            if (!chat.sender) {
                ALERT.show(`${chat.partner.name} has sent you an invitation`, 'success');
            }
        });
    };

    /**
     * Method to mark as accepted an invite
     * @param {*} acceptInviteEvents 
     */
    const handleAcceptInviteEvents = (acceptInviteEvents) => {
        acceptInviteEvents.forEach(acceptInviteEvent => {
            const { chat } = acceptInviteEvent;
            const { partner } = chat;
            const chatItemHtml = $(`[${constant.ATTRIBUTE_INVITE_ID}="${partner.id}"]`);
            chatItemHtml.removeClass('p_disabled');
            chatItemHtml.find('.preview').text('');
            chatItemHtml.attr(constant.ATTRIBUTE_SIDEBAR_ROOM, chat.id);
            chatItemHtml.removeAttr(constant.ATTRIBUTE_INVITE_ID);

            GLOBAL.setRooms(GLOBAL.getRooms().map(room => {
                const tempRoom = { ...room };
                if (room.partner?.email === partner.email) {
                    tempRoom.id = chat.id;
                }
                return tempRoom;
            }));

            if (chat.sender) {
                ALERT.show(`${chat.partner.name} has accepted your invitation`, 'success');
            }
        });
    };

    /**
     * Method to mute/unmute a chat
     * @param {*} muteChatEvents 
     */
    const handleMuteChatEvents = (muteChatEvents) => {
        muteChatEvents.forEach(muteChatEvent => {
            const roomId = muteChatEvent.chatId;
            const $room = $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${roomId}"]`);

            if (muteChatEvent.muted) {
                $room.addClass('mute');
            } else {
                $room.removeClass('mute');
            }

            if (roomId === GLOBAL.getCurrentRoomId()) {
                const $textNotiBtn = $('#chatbox-group-option').find('.--disabled').find('span');
                if (muteChatEvent.muted) {
                    $textNotiBtn.html(GLOBAL.getLangJson().ENABLE_NOTIFICATIONS);
                } else {
                    $textNotiBtn.html(GLOBAL.getLangJson().DISABLE_NOTIFICATIONS);
                }
            }

            GLOBAL.setRooms(GLOBAL.getRooms().map(room => {
                const tempRoom = { ...room };
                if (room.id === roomId) {
                    tempRoom.muted = muteChatEvent.muted;
                }
                return tempRoom;
            }));
        });
    };

    /**
     * Method to reactionEvents (bookmark a chat)
     * @param {*} reactionEvents 
     */
    const handleReactionMessageEvent = (reactionEvents) => {
        reactionEvents.forEach(reactionEvent => {
            const roomId = reactionEvent.chatId;
            const messId = reactionEvent.messageId;
            const $message = $(`[${constant.ATTRIBUTE_MESSAGE_ID}="${messId}"]`);

            // Bookmark message
            if (roomId === GLOBAL.getCurrentRoomId()) {
                const currentRoomList = getRoomById(roomId);
                const bookmarkBtn = document.querySelector('.js-menu-messages-bookmark');
                const pulseBookmarkBtn = bookmarkBtn.querySelector('.pulse');

                if (reactionEvent.starred) {
                    $message.addClass('bookmark');
                } else {
                    $message.removeClass('bookmark');
                }

                pulseBookmarkBtn.classList.add('hidden');
                bookmarkBtn.disabled = false;
                messageSettingsSlideComp.offEventClickOutside();

                // update to storeRoomById
                const updatedRoomList = currentRoomList.map((item) => {
                    if (item.id.messageId === messId) {
                        const tempItem = { ...item };
                        tempItem.starred = reactionEvent.starred;
                        return tempItem;
                    } 
                    return item;
                });
                storeRoomById(roomId, updatedRoomList);
            }
        });
    };

    const onSync = () => {
        const currentRoomId = GLOBAL.getCurrentRoomId();
        data[SESSION_ID] = functions.getDataToLocalApplication(SESSION_ID);
        if (currentRoomId) {
            data.chatId = currentRoomId;
        }
        data.onBackground = document.hidden;

        if (!data.lastSyncedAt) {
            data.lastSyncedAt = functions.getDataToLocalApplication(LAST_SYNCED_AT) ?? 0;
        }
        if (data[SESSION_ID]) {
            API.get('sync', data).then(res => {
                if (!isLogin()) {
                    return;
                }

                if ((functions.getRouter()?.current || [])[0]?.url) {
                    return;
                }

                if (res?.lastSyncedAt) {
                    data.lastSyncedAt = res?.lastSyncedAt;
                    functions.setDataToLocalApplication(LAST_SYNCED_AT, res?.lastSyncedAt);
                }

                onSync();
                
                if (res?.messages?.length) {
                    const messages = functions.sortBy(res.messages, 'msgDate');
                    handleRealTimeMessage(messages);
                }

                if (res?.userTypingEvents?.length) {
                    handleTypingEvents(res.userTypingEvents);
                }

                if (res?.userReadChatEvents?.length) {
                    handleUserReadChatEvents(res.userReadChatEvents);
                }

                if (res?.newInviteEvents?.length) {
                    handleNewInviteEvents(res.newInviteEvents);
                }

                if (res?.acceptInviteEvents?.length) {
                    handleAcceptInviteEvents(res.acceptInviteEvents);
                }

                if (res?.muteChatEvents?.length) {
                    handleMuteChatEvents(res.muteChatEvents);
                }

                if (currentRoomId === GLOBAL.getCurrentRoomId()) {
                    chatboxTopbarComp.onRenderTimeActivity(res?.partnerLastTimeActivity);
                }

                if (res?.reactionEvents?.length) {
                    handleReactionMessageEvent(res.reactionEvents);
                }

                if (res?.pinEvents?.length) {
                    modalPinMessage.handlePinMessageOnSync(res);
                }

                // Tag event
                if (res?.tagEvents?.length) {
                    modalTagPerson.onSyncTag(res.tagEvents);
                }

                isInit = true;
            }).catch((err) => {
                console.log(err);
                if (err.message !== 'Error refreshing token') {
                    // console.log(isLogin(), err.response?.status);
                    if (err.response?.status === 404 && isLogin()) {
                        // API returns 404 if session_id is not found
                        // Logout because onSync() won't work anymore without a valid session_id
                        // modalLogout.onInit(err?.response?.data?.details);
                        modalLogout.onInit('sync problem');
                    } else {
                        console.error(err.response?.data?.details || 'Something went wrong');
                        setTimeout(onSync, 5000);
                    }
                }

                isInit = true;
            });
        }
    };

    return {
        onInit: () => {
            if (!isInit) {
                onSync();
            }
        },

        onInitAgain: () => {
            isInit = false;
        }
    };
});
