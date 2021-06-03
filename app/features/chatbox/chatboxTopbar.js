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
    let $groupOptionsBtn;
    let $slide;
    let $editBtn;
    let $internalBtn;
    let $textInternalBtn;
    let $notificationBtn;
    let $textNotiBtn;
    let $leaveBtn;
    let $removeBtn;
    let $name;
    let $image;
    let $timeActivity;

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
            $textInternalBtn.html(GLOBAL.getLangJson().ENABLE_INTERNAL_MESSAGES);
            delete obRoomEdited[roomId].hide_mess;
        } else {
            $textInternalBtn.html(GLOBAL.getLangJson().DISABLE_INTERNAL_MESSAGES);
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
            $textNotiBtn.html(GLOBAL.getLangJson().DISABLE_NOTIFICATIONS);
            delete obRoomEdited[roomId].notification_mess;
        } else {
            $room.addClass('mute');
            $textNotiBtn.html(GLOBAL.getLangJson().ENABLE_NOTIFICATIONS);
            obRoomEdited[roomId].notification_mess = false;
        }
        
        GLOBAL.setRoomInfoWasEdited(obRoomEdited);
        offEventClickOutside();
        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => {});
    };

    return {
        onInit: () => {
            $groupOptionsBtn = $('.js-group-option');
            $slide = $('#chatbox-group-option');
            $editBtn = $slide.find('.--edit-group');
            $internalBtn = $slide.find('.--internal');
            $textInternalBtn = $internalBtn.find('span');
            $notificationBtn = $slide.find('.--disabled');
            $textNotiBtn = $notificationBtn.find('span');
            $leaveBtn = $slide.find('.--leave');
            $removeBtn = $slide.find('.--remove');
            $name = $('.js_info_parnter .toolbar-name .--name');
            $image = $('.js_info_parnter .--img.avatar');
            $timeActivity = $('.js_info_parnter .toolbar-name .--online');

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
                $textNotiBtn.html(GLOBAL.getLangJson().ENABLE_NOTIFICATIONS);
            } else {
                $textNotiBtn.html(GLOBAL.getLangJson().DISABLE_NOTIFICATIONS);
            }

            if (obRoomEdited[roomInfo.id]?.hide_mess) {
                $textInternalBtn.html(GLOBAL.getLangJson().DISABLE_INTERNAL_MESSAGES);
            } else {
                $textInternalBtn.html(GLOBAL.getLangJson().ENABLE_INTERNAL_MESSAGES);
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
