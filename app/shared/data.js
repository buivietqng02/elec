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
    let enterKeyPreference = '';
    let roomInfo = {};
    let easyrtcIds = [];
    let language = '';
    let langJson = {};
    let roomDraft = {};
    let favouritesRooms = [];
    let labelsList = [];
    const DEFAULT_LABEL_LIST = [
        { color: 1, descript: 'Default' },
        { color: 2, descript: 'Important' },
        { color: 3, descript: 'To do' }
    ];

    let defaultLabelMapping = {
        1: 'color-1',
        2: 'color-2',
        3: 'color-3',
        4: 'color-4',
        5: 'color-5',
        6: 'color-6',
        7: 'color-7',
        8: 'color-8',
        9: 'color-9',
        10: 'color-10'
    };

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
        sender: room.sender,
        owner: room.owner,
        muted: room.muted,
        taggedUsers: room.taggedUsers
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

        getEnterKeyPreference: () => enterKeyPreference,
        setEnterKeyPreference: (value) => {
            enterKeyPreference = value;
        },

        getRooms: () => rooms,
        setRooms: (value) => {
            rooms = value;
        },

        getFavouritesRooms: () => favouritesRooms,
        setFavouritesRooms: (value) => {
            favouritesRooms = value;
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

        getLabelsList: () => labelsList,
        setLabelsList: (value) => {
            labelsList = value;
        },

        getDefaultLabelList: () => DEFAULT_LABEL_LIST,

        getDefaultLabelMapping: () => defaultLabelMapping,

        setDefaultLabelMapping: (value) => {
            defaultLabelMapping = value;
        },

        refresh
    };
});
