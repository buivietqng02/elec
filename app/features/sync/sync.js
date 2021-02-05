define([
    'app/constant', 
    'shared/api', 
    'shared/data', 
    'shared/functions',
    'features/sidebar/sidebarRoomList',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxTopbar',
    'features/notification/notification',
    'features/modal/modalPhoneRequest'
], (
    constant, 
    API, 
    GLOBAL, 
    functions,
    sidebarRoomListComp,
    chatboxContentComp,
    chatboxTopbarComp,
    notificationComp,
    modalPhoneRequest
) => {
    const { SESSION_ID } = constant;
    const data = {
        timeout: 10000,
        onBackground: false
    };

    const updateRoom = (room, messages) => {
        const currentUserId = GLOBAL.getInfomation().id;
        const currentRoomId = GLOBAL.getCurrentRoomId();
        const newRoom = { ...room };
        const lastNum = messages.length - 1;

        if (!messages[lastNum].updated && !messages[lastNum].deleted) {
            newRoom.lastmessage = messages[messages.length - 1].message;
        }

        if (currentRoomId !== room.id) {
            let unReadNum = newRoom.member.messagecounter;
            messages.forEach(message => {
                if (message.deleted || message.updated) {
                    return;
                }

                if (currentUserId === message.sender.id) {
                    unReadNum = 0;
                } else {
                    unReadNum += 1;
                }
            });

            newRoom.member.messagecounter = unReadNum;
        } else {
            newRoom.member.messagecounter = 0;
        }

        return newRoom;
    };

    const handleMoveRoomUp = (room) => {
        const html = sidebarRoomListComp.onRenderRoom(room);

        $(`[data-room-id="${room.id}"]`).remove();
        sidebarRoomListComp.onPrepend(html);
    };

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
        let isNotMoveRoomUp = false;
        const isCurrentRoom = GLOBAL.getCurrentRoomId() === roomId;
        messages.forEach(message => {
            // Handle with message was deleted
            if (message.deleted) {
                isNotMoveRoomUp = true;
                if (isCurrentRoom) {
                    chatboxContentComp.onSyncRemove(message.id.messageId);
                }

                return;
            }

            // Handle with message was updated
            if (message.updated) {
                isNotMoveRoomUp = true;
                if (isCurrentRoom) {
                    chatboxContentComp.onSyncUpdate(message);
                }

                return;
            }

            isNotMoveRoomUp = false;

            // Not update when someone left
            if (message.type === 7) {
                isNotMoveRoomUp = true;
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

    const getNewGroup = (message) => API.get('chats').then(res => {
        try {
            const { chats } = res.data;
            const { length } = chats;

            for (let i = 0; i < length; i += 1) {
                if (chats[i].id === message.id.chatId) {
                    const html = sidebarRoomListComp.onRenderRoom(chats[i]);
                    GLOBAL.setRooms([chats[i], ...GLOBAL.getRooms()]);
                    sidebarRoomListComp.onPrepend(html);
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

    const onSync = () => {
        const currentRoomId = GLOBAL.getCurrentRoomId();
        data[SESSION_ID] = functions.getDataToLocalApplication(SESSION_ID);
        if (currentRoomId) {
            data.chatId = currentRoomId;
        }
        data.onBackground = document.hidden;

        API.get('sync', data).then(res => {
            if (res?.data?.messages?.length) {
                const messages = functions.sortBy(res.data.messages, 'msgDate');
                handleRealTimeMessage(messages);
            }

            if (currentRoomId === GLOBAL.getCurrentRoomId()) {
                chatboxTopbarComp.onRenderTimeActivity(res?.data?.partnerLastTimeActivity);
            }

            onSync();
        }).catch(() => setTimeout(onSync, 5000));
    };

    return {
        onInit: () => {
            onSync();
        }
    };
});
