define([
    'moment',
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/functions', 
    'features/modal/modalCreateGroup',
    'features/modal/modalEditRoom',
    'features/modal/modalRemoveGroup',
    'features/modal/modalLeaveGroup'
], (
    moment,
    constant,
    GLOBAL, 
    API,
    functions, 
    modalCreateGroupComp,
    modalEditRoomComp,
    modalRemoveGroupComp,
    modalLeaveGroupComp
) => {
    const { getAvatar } = functions;
    const $groupOptionsBtn = $('.js-group-option');
    const $slide = $('#chatbox-group-option');
    const $editBtn = $slide.find('.--edit-group');
    const $internalBtn = $slide.find('.--internal');
    const $textInternalBtn = $internalBtn.find('span');
    const $notificationBtn = $slide.find('.--disabled');
    const $textNotiBtn = $notificationBtn.find('span');
    const $leaveBtn = $slide.find('.--leave');
    const $removeBtn = $slide.find('.--remove');
    const $name = $('.js_info_parnter .toolbar-name .--name');
    const $image = $('.js_info_parnter .--img.avatar');
    const $timeActivity = $('.js_info_parnter .toolbar-name .--online');

    const offEventClickOutside = () => {
        $slide.hide();
        $(document).off('.hideChatboxTopBarOptionsSlice');
    };

    const handleClickOutside = () => $(document).on('click.hideChatboxTopBarOptionsSlice', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        $slide.show();
        handleClickOutside();
    };

    const editGroup = () => {
        modalCreateGroupComp.onInit(GLOBAL.getCurrentRoomId());
        offEventClickOutside();
    };

    const leaveGroup = () => {
        modalLeaveGroupComp.onInit();
        offEventClickOutside();
    };

    const removeGroup = () => {
        modalRemoveGroupComp.onInit();
        offEventClickOutside();
    };

    const updateInternalMessage = () => {
        const roomId = GLOBAL.getCurrentRoomId();
        const obRoomEdited = { ...GLOBAL.getRoomInfoWasEdited() };
        obRoomEdited[roomId] = obRoomEdited[roomId] || {};

        if (obRoomEdited[roomId].hide_mess) {
            $textInternalBtn.html('Enable');
            delete obRoomEdited[roomId].hide_mess;
        } else {
            $textInternalBtn.html('Disable');
            obRoomEdited[roomId].hide_mess = true;
        }
        
        GLOBAL.setRoomInfoWasEdited(obRoomEdited);
        offEventClickOutside();
        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => {});
    };

    const updateNotification = () => {
        const roomId = GLOBAL.getCurrentRoomId();
        const $room = $(`[${constant.ATTRIBUE_SIDEBAR_ROOM}="${roomId}"]`);
        const obRoomEdited = { ...GLOBAL.getRoomInfoWasEdited() };
        obRoomEdited[roomId] = obRoomEdited[roomId] || {};

        if (obRoomEdited[roomId].notification_mess === false) {
            $room.removeClass('mute');
            $textNotiBtn.html('Disable');
            delete obRoomEdited[roomId].notification_mess;
        } else {
            $room.addClass('mute');
            $textNotiBtn.html('Enable');
            obRoomEdited[roomId].notification_mess = false;
        }
        
        GLOBAL.setRoomInfoWasEdited(obRoomEdited);
        offEventClickOutside();
        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => {});
    };

    return {
        onInit: () => {
            $groupOptionsBtn.click(showSlide);
            $editBtn.click(editGroup);
            $leaveBtn.click(leaveGroup);
            $removeBtn.click(removeGroup);
            $notificationBtn.click(updateNotification);
            $internalBtn.click(updateInternalMessage);
            $image.click(modalEditRoomComp.onInit);
        },

        onRenderInfomation: (roomInfo) => {
            const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
            $image.off('error');
            $timeActivity.html('');

            // Check status of notification
            if (obRoomEdited[roomInfo.id]?.notification_mess === false) {
                $textNotiBtn.html('Enable');
            } else {
                $textNotiBtn.html('Disable');
            }

            if (obRoomEdited[roomInfo.id]?.hide_mess) {
                $textInternalBtn.html('Disable');
            } else {
                $textInternalBtn.html('Enable');
            }
            
            if (roomInfo.group) {
                $image.attr(constant.ATTRIBUTE_CHANGE_IMAGE_GROUP, roomInfo.id);
                $image.attr('src', getAvatar(roomInfo.id, true));
                $image.on('error', () => $image.attr('src', '/assets/images/group.svg'));
                $name.text(roomInfo.subject);
                $name.removeAttr(constant.ATTRIBUTE_CHANGE_NAME);
                $editBtn.show();
                $internalBtn.show();
                $leaveBtn.show();
                $removeBtn.show();
                $timeActivity.hide();
            } else {
                const userId = roomInfo.members[0].user.id;
                const userName = GLOBAL.getRoomInfoWasEdited()[userId]?.user_name || roomInfo.members[0].user.name;
                
                $image.removeAttr(constant.ATTRIBUTE_CHANGE_IMAGE_GROUP);
                $image.attr('src', getAvatar(roomInfo.members[0]?.user?.id));
                $image.on('error', () => $image.attr('src', '/assets/images/user.jpg'));
                $name.text(userName);
                $name.attr(constant.ATTRIBUTE_CHANGE_NAME, userId);
                $editBtn.hide();
                $internalBtn.hide();
                $leaveBtn.hide();
                $removeBtn.hide();
                $timeActivity.show();
            }
        },

        onRenderTimeActivity: (time) => {
            if (!time) {
                return;
            }

            const diffInSeconds = moment().diff(moment(time), 'seconds');
            if (diffInSeconds <= 10) {
                $timeActivity.html('online');
            } else {
                $timeActivity.html(`last seen ${moment(time).fromNow()}`);
            }
        },

        onUpdateTitle: (title) => {
            $name.text(title);
        }
    };
});
