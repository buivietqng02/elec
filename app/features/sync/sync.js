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

        newRoom.lastmessage = messages[messages.length - 1].message;

        if (currentRoomId !== room.id) {
            let unReadNum = newRoom.member.messagecounter;
            messages.forEach(message => {
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

    const renderMessageForActiveRoom = (messages, room) => {
        if (GLOBAL.getCurrentRoomId() === room.id) {
            chatboxContentComp.onSync(messages);
        }
    };

    const handleWithRemovingMessage = (messId, roomId) => {
        if (GLOBAL.getCurrentRoomId() === roomId) {
            chatboxContentComp.onSyncRemove(messId);
        } 
    };

    const handleWithUpdatingMessage = (message, roomId) => {
        if (GLOBAL.getCurrentRoomId() === roomId) {
            chatboxContentComp.onSyncUpdate(message);
        }
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
                    if (!(room.isLiveAssistance && messagesResponse[0].type === 7)) {
                        notificationComp.pushNotificationForMessage(messagesResponse[0]);
                    }
                }

                // Handle with message was deleted
                if (messagesResponse[0].deleted) {
                    handleWithRemovingMessage(messagesResponse[0].id.messageId, room.id);
                    return true;
                }

                // Handle with message was updated
                if (messagesResponse[0].updated) {
                    handleWithUpdatingMessage(messagesResponse[0], room.id);
                    return true;
                }

                // Handle with message is calling
                if (messagesResponse[0].type === 21) {
                    handleWithCalling(messagesResponse[0], room.id);
                }

                // Handle with message is end call
                if (messagesResponse[0].type === 24) {
                    handleWithEndCall(messagesResponse[0], room.id);
                }
                
                const newRoom = updateRoom(room, messagesResponse);
                handleMoveRoomUp(newRoom);
                renderMessageForActiveRoom(objRooms[room.id], room);
                roomsMove = roomsMove.concat(newRoom);
                return false;
            }

            return true;
        });

        GLOBAL.setRooms(roomsMove.concat(rooms));
    };

    const onSync = () => {
        const currentRoomId = GLOBAL.getCurrentRoomId();
        data[SESSION_ID] = functions.getDataToLocalApplication(SESSION_ID);
        if (currentRoomId) {
            data.chatId = currentRoomId;
        }

        API.get('sync', data).then(res => {
            if (res?.data?.messages?.length) {
                handleRealTimeMessage(res.data.messages);
            }

            if (currentRoomId) {
                chatboxTopbarComp.onRenderTimeActivity(res?.data?.partnerLastTimeActivity);
            }

            onSync();
        }).catch(() => setTimeout(onSync, 5000));
    };

    return {
        onInit: onSync
    };
});
