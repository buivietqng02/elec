define([
    'app/constant',
    'shared/data', 
    'shared/functions', 
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxInput',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/chatboxAttach',
    'features/modal/modalAcceptInvitation'
], (
    constant,
    GLOBAL, 
    functions, 
    chatboxContentComp,
    chatboxInputComp,
    chatboxTopbarComp,
    chatboxAttachComp,
    modalAcceptInvitationComp
) => {
    const { render, getAvatar, stripTags, htmlEncode } = functions;
    const $wrapper = $('#sidebar_room_list');
    const $caption = $('.js_caption');
    const $chatbox = $('.js_wrap_mess');
    const sidebarToggle = '<a class="sidebar__toggle"><i class="xm xm-search --icon p-cur"></i></a>';
    const template = `
        <li class="js_li_list_user contact-list__item p-cur {status} {live} {mute}" ${constant.ATTRIBUE_SIDEBAR_ROOM}="{id}" {isGroup}>
            <img ${constant.ATTRIBUTE_CHANGE_IMAGE_GROUP}="{id}" class="--img avatar {classImg}" src="{src}" {handleImageErr} />
            <div class="badge badge-orange">{unread}</div>
            <div class="p-pl-10 meta">
                <div class="--name contact__name p-1-line">
                    <i class="xm xm-volume-mute" aria-hidden="true"></i>
                    <span ${constant.ATTRIBUTE_CHANGE_NAME}="{userId}">{name}</span>
                </div>
                <div class="p-1-line preview">{mess}</div>
            </div>
        </li>
    `;

    const onInit = () => {
        const rooms = GLOBAL.getRooms();
        const dataArr = rooms.map(renderRoom).join('');

        $wrapper.html(`${sidebarToggle}${dataArr}`);
        $(document).off('.sidebarRoomList');
        $(document).on('click.sidebarRoomList', `[${constant.ATTRIBUE_SIDEBAR_ROOM}]`, onRoomClick);
    };

    const onRoomClick = (e) => {
        let positionRoom = 0;
        const $this = $(e.currentTarget);
        const { roomId } = $this.data();
        const roomInfo = GLOBAL.getRooms().filter((room, index) => {
            if (String(room.id) === String(roomId)) {
                positionRoom = index;
                return true;
            }

            return false;
        })[0] || {};

        if (!roomInfo || $this.hasClass('p_disabled') || roomId === GLOBAL.getCurrentRoomId()) {
            return;
        }

        // Handle when the user has not accepted the invitation yet
        if (!roomId) {
            $caption.show();
            $chatbox.hide();
            GLOBAL.setCurrentRoomId(null);
            $(`[${constant.ATTRIBUE_SIDEBAR_ROOM}]`).removeClass('active');
            modalAcceptInvitationComp.onInit($this);
            return;
        }

        // Hide chat input if this room is xm channel
        if (roomInfo?.channel) {
            $('.messages-input-wrap').hide();
        } else {
            $('.messages-input-wrap').show();
        }
        
        // Update new room
        GLOBAL.setCurrentRoomId(roomId);
        // Hide background what express the active state of the room
        $(`[${constant.ATTRIBUE_SIDEBAR_ROOM}]`).removeClass('active');
        // Hide the caption when user start entering the room
        $caption.hide();
        $chatbox.show();
        // Show background for new room 
        $this.addClass('active');

        chatboxInputComp.onClear();
        chatboxAttachComp.markPhone(roomInfo.group);
        chatboxTopbarComp.onRenderInfomation(roomInfo);
        chatboxContentComp.onLoadMessage(roomInfo, positionRoom);
    };

    const renderRoom = (room) => {
        if (!room.members) {
            return '';
        }

        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        let data = {};
        let src = '';
        const firstMember = room.members[0];
        let status = !room.id ? 'p_disabled' : '';
        const numUnRead = room.member.messagecounter || '';
        let name = room.group ? room.subject : (obRoomEdited[firstMember?.user?.id]?.user_name || firstMember?.user?.name);
        let mess = room.lastmessage ? htmlEncode(stripTags(room.lastmessage)) : '';
        const live = (GLOBAL.getCurrentRoomId() === room.id) ? 'active' : '';
        const userId = room.group ? '' : firstMember?.user?.id;

        // data error during processing
        if (room.group && !name) {
            return '';
        }

        // group chat
        if (room.group) {
            src = getAvatar(room.id, true);
        }

        // direct chat
        if (!room.group) {
            src = getAvatar(firstMember?.user?.id);
        }

        // direct chat but cross user has not accepted the invitation yet
        if (!room.group && !firstMember) {
            src = '/assets/images/user.svg';
        }

        // waiting cross user accept the invitation
        if (!room.id && room.sender) {
            name = room.member.user.name;
            mess = 'Invite: pending';
            src = getAvatar(room.member.user.id);
        }

        // have not accepted the invitation yet
        if (!room.id && !room.sender) {
            name = room.member.user.name;
            mess = 'Invite: not accepted';
            src = getAvatar(room.member.user.id);
            status = '';
        }

        data = {
            id: room.id,
            isGroup: room.group ? 'data-is-group="true"' : 'data-is-group="false"',
            status,
            live,
            unread: numUnRead,
            handleImageErr: `onerror="this.src='${room.group ? '/assets/images/group.svg' : '/assets/images/user.jpg'}'"`,
            classImg: room.group ? 'hagr' : '',
            src,
            name: htmlEncode(name),
            mess,
            userId,
            mute: obRoomEdited[room.id]?.notification_mess === false ? 'mute' : ''
        };

        return render(template, data);
    };

    return {
        onInit,
        
        onRenderRoom: renderRoom,

        onPrepend: (html) => $wrapper.prepend(html),

        onUpdateRoomName: (id, name) => $(`[data-room-id="${id}"]`).find('.--name.contact__name span').text(name)
    };
});
