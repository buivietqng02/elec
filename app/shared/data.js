define(() => {
    let isNetworkStatus = true;
    let infomation = {};
    let rooms = [];
    let currentRoomId = '';
    let currentGroupMembers = null;
    let version = '';
    let bodyBgTheme = '';
    let bodyFontSize = '';
    let roomInfo = {};
    
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

        getCurrentRoomId: () => currentRoomId,
        setCurrentRoomId: (value) => {
            currentRoomId = value;
        },

        getCurrentGroupMembers: () => currentGroupMembers,
        setCurrentGroupMembers: (value) => {
            currentGroupMembers = value;
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
