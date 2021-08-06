define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions',
    'features/sidebar/sidebarService',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxContentChatList',
    'features/chatbox/chatboxTopbar',
    'features/notification/notification',
    'features/modal/modalPhoneRequest'
], (
    constant,
    API,
    GLOBAL,
    functions,
    sidebarService,
    chatboxContentComp,
    chatboxContentChatListComp,
    chatboxTopbarComp,
    notificationComp,
    modalPhoneRequest
) => {
    let timeout;
    let isInit = false;
    let isBlinkTitleBrowser = false;
    const { SESSION_ID, TOKEN, USER_ID } = constant;
    const { handleSyncData } = chatboxContentChatListComp;
    const data = {
        timeout: 10000,
        onBackground: false
    };

    const isLogin = () => {
        const sessionId = functions.getDataToLocalApplication(SESSION_ID) || '';
        const token = functions.getDataToLocalApplication(TOKEN) || '';
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

    const handleWithCalling = (message, roomId) => {
        const currentUserId = GLOBAL.getInfomation().id;
        if (currentUserId !== message.sender.id) {
            modalPhoneRequest.onInit(message.sender, roomId);
        }
    };

    const handleWithEndCall = (message, roomId) => {
        const currentUserId = GLOBAL.getInfomation().id;
        if (currentUserId !== message.sender.id) {
            modalPhoneRequest.onEndCall(message.sender, roomId);
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

                return;
            }

            // Handle with message was updated
            if (message.updated) {
                if (isCurrentRoom) {
                    chatboxContentComp.onSyncUpdate(message);
                }

                return;
            }

            // Not update when someone left
            if (message.type !== 7) {
                isNotMoveRoomUp = false;
            }

            // Handle with message is calling
            if (message.type === 21) {
                handleWithCalling(message, roomId);
            }

            // Handle with message is end call
            if (message.type === 24) {
                handleWithEndCall(message, roomId);
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
                    if (!(room.isLiveAssistance && messages[messages.length - 1].type === 7)) {
                        notificationComp.pushNotificationForMessage(messagesResponse[0]);
                    }
                }

                const isNotMoveRoomUp = renderMessageForActiveRoom(objRooms[room.id], room.id);

                if (!isNotMoveRoomUp) {
                    const newRoom = updateRoom(room, messagesResponse);
                    blinkTitle();
                    handleMoveRoomUp(newRoom);
                    roomsMove = roomsMove.concat(newRoom);
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

        // filter events from partners in current room
        const typingEventsFromPartnersInCurrentRoom = typingEvents
            .filter(typingEvent => typingEvent.chatId === currentRoomId 
                && typingEvent.user.id !== currentUserId);
        
        if (typingEventsFromPartnersInCurrentRoom.length) {
            // get the latest typing event
            const lastTypingEvent = typingEventsFromPartnersInCurrentRoom
                .reduce((p, c) => (p.timestamp > c.timestamp ? p : c));
            
            chatboxTopbarComp.onRenderTyping(lastTypingEvent);

            console.log(lastTypingEvent);
        }
    };

    const onSync = () => {
        const currentRoomId = GLOBAL.getCurrentRoomId();
        data[SESSION_ID] = functions.getDataToLocalApplication(SESSION_ID);
        if (currentRoomId) {
            data.chatId = currentRoomId;
        }
        data.onBackground = document.hidden;

        API.get('sync', data).then(res => {
            if (!isLogin() || !!(functions.getRouter()?.current || [])[0]?.url) {
                return;
            }

            onSync();

            if (res?.messages?.length) {
                const messages = functions.sortBy(res.messages, 'msgDate');
                handleRealTimeMessage(messages);
            }

            if (res?.userTypingEvents?.length) {
                handleTypingEvents(res.userTypingEvents);
            }

            if (currentRoomId === GLOBAL.getCurrentRoomId()) {
                chatboxTopbarComp.onRenderTimeActivity(res?.partnerLastTimeActivity);
            }
        }).catch((err) => {
            console.log(err);
            setTimeout(onSync, 5000);
        });
    };

    return {
        onInit: () => {
            if (!isInit) {
                isInit = true;
                onSync();
            }
        },

        onInitAgain: () => {
            isInit = false;
        }
    };
});
