define(() => {
    let isNetworkStatus = true;
    let idShareScreen = null;
    let isEnabelCamera = true;
    let isEnabelMic = true;
    let infomation = {};
    let rooms = [];
    let currentRoomId = '';
    let currentSearchMessages = [];
    let version = '';
    let bodyBgTheme = '';
    let bodyFontSize = '';
    let roomInfo = {};
    let easyrtcIds = [];
    let language = '';
    let langJson = {};
    let roomDraft = {};

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

    const refresh = () => {
        isNetworkStatus = true;
        idShareScreen = null;
        isEnabelCamera = true;
        isEnabelMic = true;
        infomation = {};
        rooms = [];
        currentRoomId = '';
        currentSearchMessages = [];
        version = '';
        bodyBgTheme = '';
        bodyFontSize = '';
        roomInfo = {};
        easyrtcIds = [];
        language = '';
        langJson = {};
        roomDraft = {};
    };
    
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

        getCurrentSearchMessages: () => currentSearchMessages,
        setCurrentSearchMessages: (value) => {
            currentSearchMessages = value;
        },

        getRoomInfoWasEdited: () => roomInfo,
        setRoomInfoWasEdited: (value) => {
            roomInfo = value;
        },

        getNetworkStatus: () => isNetworkStatus,
        setNetworkStatus: (value) => {
            isNetworkStatus = value;
        },

        getEasyrtcIds: () => easyrtcIds,
        setEasyrtcIds: (value) => {
            easyrtcIds = value;
        },

        getIdShareScreen: () => idShareScreen,
        setIdShareScreen: (value) => {
            idShareScreen = value;
        },

        getIsEnabelCamera: () => isEnabelCamera,
        setIsEnabelCamera: (value) => {
            isEnabelCamera = value;
        },

        getIsEnabelMic: () => isEnabelMic,
        setIsEnabelMic: (value) => {
            isEnabelMic = value;
        },

        getLanguage: () => language,
        setLanguage: (value) => {
            language = value;
        },

        getLangJson: () => langJson,
        setLangJson: (value) => {
            langJson = value;
        },

        getRoomDraft: () => roomDraft,
        setRoomDraft: (value) => {
            roomDraft = value;
        },
        
        refresh
    };
});
