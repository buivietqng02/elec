define(['idb-keyval'], (idbKeyval) => {
    const CHATS = 'chats';
    const GENERAL = 'general';
    const { set, get } = idbKeyval;
    const ob = {};

    ob.getChatById = (id) => get(CHATS).then((chats) => chats[id]);

    ob.getChats = () => get(CHATS).then((chats) => chats);

    ob.setChats = value => set(CHATS, value);

    ob.setChatsById = (id, value) => get(CHATS).then((chats) => {
        let tempChats;

        if (!chats) {
            tempChats = {};
        } else {
            tempChats = chats;
        }

        tempChats[id] = value;
        ob.setChats(tempChats);
    });

    ob.getGeneral = () => get(GENERAL).then(data => data);

    ob.setGeneral = (value) => set(GENERAL, value);

    return ob;
});
