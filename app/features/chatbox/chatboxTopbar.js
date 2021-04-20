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
            $textInternalBtn.html(GLOBAL.getLangJson().ENABLE);
            delete obRoomEdited[roomId].hide_mess;
        } else {
            $textInternalBtn.html(GLOBAL.getLangJson().DISABLE);
            obRoomEdited[roomId].hide_mess = true;
        }
        
        GLOBAL.setRoomInfoWasEdited(obRoomEdited);
        offEventClickOutside();
        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => {});
    };

    const updateNotification = () => {
        const roomId = GLOBAL.getCurrentRoomId();
        const $room = $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${roomId}"]`);
        const obRoomEdited = { ...GLOBAL.getRoomInfoWasEdited() };
        obRoomEdited[roomId] = obRoomEdited[roomId] || {};

        if (obRoomEdited[roomId].notification_mess === false) {
            $room.removeClass('mute');
            $textNotiBtn.html(GLOBAL.getLangJson().DISABLE);
            delete obRoomEdited[roomId].notification_mess;
        } else {
            $room.addClass('mute');
            $textNotiBtn.html(GLOBAL.getLangJson().ENABLE);
            obRoomEdited[roomId].notification_mess = false;
        }
        
        GLOBAL.setRoomInfoWasEdited(obRoomEdited);
        offEventClickOutside();
        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => {});
    };

    return {
        onInit: () => {
            $groupOptionsBtn.off().click(showSlide);
            $editBtn.off().click(editGroup);
            $leaveBtn.off().click(leaveGroup);
            $removeBtn.off().click(removeGroup);
            $notificationBtn.off().click(updateNotification);
            $internalBtn.off().click(updateInternalMessage);
            $image.off().click(modalEditRoomComp.onInit);
        },

        onRenderInfomation: (roomInfo) => {
            const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
            $image.off('error');
            $timeActivity.html('');

            // Check status of notification
            if (obRoomEdited[roomInfo.id]?.notification_mess === false) {
                $textNotiBtn.html(GLOBAL.getLangJson().ENABLE);
            } else {
                $textNotiBtn.html(GLOBAL.getLangJson().DISABLE);
            }

            if (obRoomEdited[roomInfo.id]?.hide_mess) {
                $textInternalBtn.html(GLOBAL.getLangJson().DISABLE);
            } else {
                $textInternalBtn.html(GLOBAL.getLangJson().ENABLE);
            }
            
            if (roomInfo.group) {
                $image.attr(constant.ATTRIBUTE_CHANGE_IMAGE_GROUP, roomInfo.id);
                $image.attr('src', getAvatar(roomInfo.id, true));
                $image.on('error', () => $image.attr('src', '/assets/images/group.svg'));
                $name.text(roomInfo.subject);
                $name.removeAttr(constant.ATTRIBUTE_CHANGE_NAME);
                $name.attr(constant.ATTRIBUTE_CHANGE_GROUP_NAME, roomInfo.id);
                $editBtn.show();
                $internalBtn.show();
                $leaveBtn.show();
                $removeBtn.show();
                $timeActivity.hide();
            } else {
                const userId = roomInfo.partner.id;
                const userName = GLOBAL.getRoomInfoWasEdited()[userId]?.user_name || roomInfo.partner.name;
                
                $image.removeAttr(constant.ATTRIBUTE_CHANGE_IMAGE_GROUP);
                $image.attr('src', getAvatar(roomInfo.partner?.id));
                $image.on('error', () => $image.attr('src', '/assets/images/user.jpg'));
                $name.text(userName);
                $name.attr(constant.ATTRIBUTE_CHANGE_NAME, userId);
                $name.removeAttr(constant.ATTRIBUTE_CHANGE_GROUP_NAME);
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
            if (diffInSeconds <= 30) {
                $timeActivity.html(`<lang data-language="ONLINE">${GLOBAL.getLangJson().ONLINE}</lang>`);
            } else {
                $timeActivity.html(`<lang data-language="LAST_SEEN">${GLOBAL.getLangJson().LAST_SEEN}</lang> ${moment(time).fromNow()}`);
            }
        }
    };
});
