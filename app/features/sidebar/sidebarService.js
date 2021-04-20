define([
    'app/constant',
    'shared/data',
    'shared/functions'
], (
    constant,
    GLOBAL,
    functions
) => {
    const {
        render,
        getAvatar,
        stripTags,
        htmlEncode,
        decodeStringBase64
    } = functions;
    const {
        ATTRIBUTE_SIDEBAR_ROOM,
        ATTRIBUTE_CHANGE_IMAGE_GROUP,
        ATTRIBUTE_CHANGE_GROUP_NAME,
        ATTRIBUTE_CHANGE_NAME,
    } = constant;
    const $wrapper = $('#sidebar_room_list');
    const $scroll = $wrapper.parent();
    const ob = {};
    const offset = 10;
    let range = [0, offset];
    let process = false;
    let search = '';
    let filter = 1;
    const template = `
        <li class="js_li_list_user contact-list__item p-cur {status} {live} {mute}" ${ATTRIBUTE_SIDEBAR_ROOM}="{id}" {isGroup}>
            <img ${ATTRIBUTE_CHANGE_IMAGE_GROUP}="{id}" class="--img avatar {classImg}" src="{src}" {handleImageErr} />
            <div class="badge badge-orange">{unread}</div>
            <div class="p-pl-10 meta">
                <div class="--name contact__name p-1-line">
                    <i class="xm xm-volume-mute" aria-hidden="true"></i>
                    <span ${ATTRIBUTE_CHANGE_GROUP_NAME}="{id}" ${ATTRIBUTE_CHANGE_NAME}="{userId}">{name}</span>
                </div>
                <div class="p-1-line preview">{mess}</div>
            </div>
        </li>
    `;

    $scroll.scroll(() => {
        if ($scroll.scrollTop() + $scroll.height() < $scroll[0].scrollHeight - 100 || process) {
            return;
        }

        range = [range[1], range[1] + offset];
        ob.appendRoom();
    });

    const getRoomsHtml = (rooms, range) => rooms.slice(range[0], range[1]).map(ob.renderRoom);
    
    const getRooms = () => {
        let rooms = GLOBAL.getRooms();

        if (search) {
            rooms = rooms.filter(room => {
                const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
                const {
                    id,
                    partner,
                    unreadMessages,
                    group,
                    subject,
                    sender,
                    lastMessage
                } = room;
                const groupName = subject || '';
                const name = group ? '' : (partner?.name || '');
                const editName = group ? '' : (obRoomEdited[partner?.id]?.user_name || '');

                if (String(name).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                if (String(groupName).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                if (String(editName).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                return false;
            });
        }

        // Unread
        if (filter === 2) {
            rooms = rooms.filter(room => {
                if (room.unreadMessages) {
                    return true;
                }

                return false;
            });
        }

        // Group
        if (filter === 3) {
            rooms = rooms.filter(room => {
                if (room.group) {
                    return true;
                }

                return false;
            });
        }

        // Direct
        if (filter === 4) {
            rooms = rooms.filter(room => {
                if (!room.group) {
                    return true;
                }

                return false;
            });
        }

        return rooms;
    };

    const checkRoom = (rid, range) => getRooms().some(room => (room.id === rid));

    ob.renderRoom = (room) => {
        console.log(getRooms().map(r => {
            const {
                partner
            } = r;

            if (r.group) {
                return r.subject;
            }

            return GLOBAL.getRoomInfoWasEdited()[partner?.id]?.user_name || partner?.name;
        }));

        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const {
            id,
            partner,
            unreadMessages,
            group,
            subject,
            sender,
            lastMessage
        } = room;
        let data = {};
        let src = '';
        let status = !id ? 'p_disabled' : '';
        const numUnRead = unreadMessages || '';
        let name = group ? subject : (obRoomEdited[partner?.id]?.user_name || partner?.name);
        let mess = lastMessage ? htmlEncode(stripTags(decodeStringBase64(lastMessage))) : '';
        const live = (GLOBAL.getCurrentRoomId() === id) ? 'active' : '';
        const userId = group ? '' : partner?.id;

        // data error during processing
        if (group && !name) {
            return '';
        }

        // group chat
        if (group) {
            src = getAvatar(id, true);
        }

        // direct chat
        if (!group) {
            src = getAvatar(partner?.id);
        }

        // direct chat but cross user has not accepted the invitation yet
        if (!group && !partner) {
            src = '/assets/images/user.svg';
        }

        // waiting cross user accept the invitation
        if (!id && sender) {
            name = partner?.name;
            mess = 'Invite: pending';
            src = getAvatar(partner?.id);
        }

        // have not accepted the invitation yet
        if (!id && !sender) {
            name = partner?.name;
            mess = 'Invite: not accepted';
            src = getAvatar(partner?.id);
            status = '';
        }

        data = {
            id: id,
            isGroup: group ? 'data-is-group="true"' : 'data-is-group="false"',
            status,
            live,
            unread: numUnRead,
            handleImageErr: `onerror="this.src='${group ? '/assets/images/group.svg' : '/assets/images/user.jpg'}'"`,
            classImg: group ? 'hagr' : '',
            src,
            name: htmlEncode(name),
            mess,
            userId,
            mute: obRoomEdited[id]?.notification_mess === false ? 'mute' : ''
        };

        return render(template, data);
    };

    ob.getRooms = () => {
        range = [0, offset];
        
        $wrapper.html(getRoomsHtml(getRooms(), range));
    };
    
    ob.appendRoom = () => {
        process = true;
        $wrapper.append(getRoomsHtml(getRooms(), range));

        setTimeout(() => {
            process = false;
        }, 100);
    };

    ob.moveRoomUp = (room) => {
        $room = $(`[${ATTRIBUTE_SIDEBAR_ROOM}="${room.id}"]`);

        if (!$room.length && checkRoom(room.id)) {
            range = [range[0] + 1, range[1] + 1];
            $wrapper.prepend(ob.renderRoom(room));
        }

        if ($room.length) {
            $room.remove();
            $wrapper.prepend(ob.renderRoom(room));
        }
    };

    ob.newRoomUp = (room) => {
        if (checkRoom(room.id)) {
            range = [range[0] + 1, range[1] + 1];
            $wrapper.prepend(ob.renderRoom(room));
        }
    };

    ob.lostRoom = (rid) => {
        $room = $(`[${ATTRIBUTE_SIDEBAR_ROOM}="${rid}"]`);

        if ($room.length) {
            $room.remove();
            range = [range[0] - 1, range[1] - 1];
        }
    };

    ob.onChangeSearch = (value) => {
        search = value;
        ob.getRooms();
    }

    ob.onChangeFilter = (value) => {
        filter = value;
        ob.getRooms();
    }

    return ob;
});
