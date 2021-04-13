define(['idb-keyval'], (idbKeyval) => {
    const CHATS = 'chats';
    const GENERAL = 'general';
    const {
        set,
        get,
        createStore,
        clear
    } = idbKeyval;
    const ob = {};
    const store = createStore('xm', 'xm');

    ob.getChatById = (id) => get(CHATS, store).then((chats) => chats[id]).catch(() => null);

    ob.getChats = () => get(CHATS, store).then((chats) => chats).catch(() => null);

    ob.setChats = value => set(CHATS, value, store);

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

    ob.getGeneral = () => get(GENERAL, store).then(data => data).catch(() => null);

    ob.setGeneral = (value) => set(GENERAL, value, store);

    ob.clear = () => clear(store);

    return ob;
});
