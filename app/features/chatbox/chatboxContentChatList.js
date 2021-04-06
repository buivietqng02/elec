define([
    'shared/data'
], (
    GLOBAL
) => {
    const ob = {};
    const rooms = {};

    ob.getRoomById = (id) => rooms[id];

    ob.storeRoomById = (id, value) => {
        rooms[id] = value;
    };

    ob.handleSyncData = (messObject, id) => {
        try {
            const room = rooms[id];
            const info = GLOBAL.getInfomation();
            if (!room) {
                return;
            }

            if (messObject.deleted) {
                rooms[id] = room.filter(mess => messObject.id.messageId !== mess.id.messageId);
                return;
            }

            if (messObject.updated) {
                rooms[id] = room.map(mess => {
                    if (messObject.id.messageId === mess.id.messageId) {
                        return messObject;
                    }

                    return mess;
                });

                return;
            }

            if (messObject.sender.id === info.id) {
                const { length } = room;
                let isCheck = false;
                for (let i = length - 1; i >= 0; i -= 1) {
                    const mess = room[i];
                    if (mess?.id?.messageId === messObject.id.messageId) {
                        isCheck = true;
                        room[i] = messObject;
                        rooms[id] = room;
                        break;
                    }
                }

                if (!isCheck) {
                    rooms[id] = room.concat(messObject);
                }
            } else {
                rooms[id] = room.concat(messObject);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return Object.freeze(ob);
});
