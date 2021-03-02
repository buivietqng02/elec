define(() => {
    let isNetworkStatus = true;
    let infomation = {};
    let rooms = [];
    let currentRoomId = '';
    let version = '';
    let bodyBgTheme = '';
    let bodyFontSize = '';
    let roomInfo = {};

    const useAdapterForRoom = (room) => ({
        channel: room.channel,
        group: room.group,
        groupAvatarType: room.groupAvatarType,
        id: room.id,
        isLiveAssistance: room.liveAssistance,
        lastMessage: room.lastMessage,
        partner: room.partner || {},
        subject: room.subject,
        ticket: room.ticket,
        unreadMessages: room.unreadMessages,
        updated: room.updated,
        sender: room.sender
    });
    
    return {
        getInfomation: () => infomation,
        setInfomation: (value) => {
            infomation = value;
        },

        getVersion: () => version,
        setVersion: (value) => {
            version = value;
        },

        getBodyBgTheme: () => bodyBgTheme,
        setBodyBgTheme: (value) => {
            bodyBgTheme = value;
        },

        getBodyFontSize: () => bodyFontSize,
        setBodyFontSize: (value) => {
            bodyFontSize = value;
        },

        getRooms: () => rooms,
        setRooms: (value) => {
            rooms = value;
        },
        setRoomWithAdapter: useAdapterForRoom,
        setRoomsWithAdapter: (value) => {
            rooms = value.map(useAdapterForRoom);
        },

        getCurrentRoomId: () => currentRoomId,
        setCurrentRoomId: (value) => {
            currentRoomId = value;
        },

        getRoomInfoWasEdited: () => roomInfo,
        setRoomInfoWasEdited: (value) => {
            roomInfo = value;
        },

        getNetworkStatus: () => isNetworkStatus,
        setNetworkStatus: (value) => {
            isNetworkStatus = value;
        }
    };
});
