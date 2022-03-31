define([
    'moment',
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/functions',
    'shared/offlineData',
    'features/modal/modalCreateGroup',
    'features/modal/modalEditRoom',
    'features/modal/modalRemoveGroup',
    'features/modal/modalLeaveGroup',
    'features/modal/modalMediaAndFiles',
    'features/modal/modalBookmarkMessage',
    'features/modal/modalSearchMessage',
], (
    moment,
    constant,
    GLOBAL,
    API,
    functions,
    offlineData,
    modalCreateGroupComp,
    modalEditRoomComp,
    modalRemoveGroupComp,
    modalLeaveGroupComp,
    modalMediaAndFiles,
    modalBookmarkMessageComp,
    modalSearchMessage
) => {
    const { getAvatar, stripTags } = functions;
    let $groupOptionsBtn;
    let $callOptionsBtn;
    let $slide;
    let $callSlide;
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
    let $typing;
    let $roomInfo;
    let $iconFavorites;
    let $viewBookmarks;

    const offEventClickOutside = () => {
        $slide.hide();
        $callSlide.hide();
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

    const showCallSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        $callSlide.show();
        handleClickOutside();
    }
    
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

    const initMediaAndFiles = () => {
        if (modalBookmarkMessageComp.onGetIsViewingBookmark()) {
            modalBookmarkMessageComp.onCloseViewBookmarksAndReloadMess();
        }

        modalMediaAndFiles.onInit();
        offEventClickOutside();
    };

    const initSearchMessage = () => {
        modalSearchMessage.onInit();
        offEventClickOutside();
    }
 
    const initViewBookmark = () => {
        modalBookmarkMessageComp.onClickViewBookmarks();
        // offEventClickOutside();
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
        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => { });
    };

    const updateNotification = () => {
        const roomId = GLOBAL.getCurrentRoomId();
        const roomInfo = GLOBAL.getRooms().find(room => (room.id === roomId));
        API.post(`chats/${roomId}/${roomInfo.muted ? 'unmute' : 'mute'}`).then(() => {
            offEventClickOutside();
        });
    };

    const onRenderTimeActivity = (time) => {
        if (!time) {
            return;
        }

        const diffInSeconds = moment().diff(moment(time), 'seconds');
        if (diffInSeconds <= 30) {
            $timeActivity.html(`<lang data-language="ONLINE">${GLOBAL.getLangJson().ONLINE}</lang>`);
        } else {
            $timeActivity.html(`<lang data-language="LAST_SEEN">${GLOBAL.getLangJson().LAST_SEEN}</lang> ${moment(time).fromNow()}`);
        }
    };

    return {
        onInit: () => {
            $groupOptionsBtn = $('.js-group-option');
            $callOptionsBtn = $('.js-call-option');
            $slide = $('#chatbox-group-option');
            $callSlide = $('#chatbox-call-option');
            $editBtn = $slide.find('.--edit-group');
            $internalBtn = $slide.find('.--internal');
            $textInternalBtn = $internalBtn.find('span');
            $notificationBtn = $slide.find('.--disabled');
            $textNotiBtn = $notificationBtn.find('span');
            $leaveBtn = $slide.find('.--leave');
            $removeBtn = $slide.find('.--remove');
            $mediaAndFilesBtn = $slide.find('.--mediaAndFile');
            $searchMessage = $slide.find('.--viewSearch');

            $name = $('.js_info_parnter .toolbar-name .--name');
            $image = $('.js_info_parnter .--img.avatar');
            $timeActivity = $('.js_info_parnter .toolbar-name .--online');
            $typing = $('.js_info_parnter .toolbar-name .--typing');
            $iconFavorites = $('.js_info_parnter .--avatar-wraper .--favourite')
            $viewBookmarks = $slide.find('.--viewBookmark');

            $groupOptionsBtn.off().click(showSlide);
            $callOptionsBtn.off().click(showCallSlide);
            $editBtn.off().click(editGroup);
            $leaveBtn.off().click(leaveGroup);
            $removeBtn.off().click(removeGroup);
            $notificationBtn.off().click(updateNotification);
            $internalBtn.off().click(updateInternalMessage);
            $mediaAndFilesBtn.off().click(initMediaAndFiles);
            $viewBookmarks.off().click(initViewBookmark);
            $searchMessage.off().click(initSearchMessage);
            $image.off().click(modalEditRoomComp.onInit);
        },

        onRenderInfomation: (roomInfo) => {
            const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
            $roomInfo = roomInfo;
            $image.off('error');
            $timeActivity.html('');
            $typing.hide();

            // Check status of notification
            if (roomInfo.muted) {
                $textNotiBtn.html(GLOBAL.getLangJson().ENABLE_NOTIFICATIONS);
            } else {
                $textNotiBtn.html(GLOBAL.getLangJson().DISABLE_NOTIFICATIONS);
            }

            // favourite chat
            let listFavouritesRooms = GLOBAL.getFavouritesRooms();
            if (listFavouritesRooms.indexOf(roomInfo.id) === -1) {  
                $iconFavorites.addClass('hidden');
            } else {
                $iconFavorites.removeClass('hidden');
            }

            if (obRoomEdited[roomInfo.id]?.hide_mess) {
                $textInternalBtn.html(GLOBAL.getLangJson().DISABLE_INTERNAL_MESSAGES);
            } else {
                $textInternalBtn.html(GLOBAL.getLangJson().ENABLE_INTERNAL_MESSAGES);
            }

            $iconFavorites.attr('favourites-id', roomInfo.id);
            if (roomInfo.group) {
                $image.attr(constant.ATTRIBUTE_CHANGE_IMAGE_GROUP, roomInfo.id);
                $image.attr('src', getAvatar(roomInfo.id, true));
                $image.on('error', () => $image.attr('src', '/assets/images/group.svg'));
                $name.text(roomInfo.subject);
                $name.removeAttr(constant.ATTRIBUTE_CHANGE_NAME);
                $name.attr(constant.ATTRIBUTE_CHANGE_GROUP_NAME, roomInfo.id);
                $timeActivity.hide();
                if (roomInfo.isLiveAssistance) {
                    $callOptionsBtn.hide();
                    $editBtn.show();
                    $leaveBtn.show();
                    $notificationBtn.show();
                    $internalBtn.show();
                    $removeBtn.hide();
                } else if (roomInfo.channel) {
                    $callOptionsBtn.hide();
                    if (roomInfo.owner) {
                        $editBtn.show();
                        $leaveBtn.hide();
                        $notificationBtn.show();
                        $internalBtn.hide();
                        $removeBtn.show();
                    } else {
                        $editBtn.hide();
                        $leaveBtn.show();
                        $notificationBtn.show();
                        $internalBtn.hide();
                        $removeBtn.hide();
                    }
                } else {
                    $callOptionsBtn.show();
                    $editBtn.show();
                    $leaveBtn.show();
                    $notificationBtn.show();
                    $internalBtn.hide();
                    $removeBtn.show();
                }
            } else {
                const userId = roomInfo.partner.id;
                const userName = stripTags(GLOBAL.getRoomInfoWasEdited()[userId]?.user_name || roomInfo.partner.name);

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
                $notificationBtn.show();
                $timeActivity.show();
                $callOptionsBtn.show();

                offlineData.getChatById(roomInfo.id).then(chat => {
                    if (chat) {
                        API.get(`users/${roomInfo.partner?.id}/last-seen`).then(lastSeen => {
                            onRenderTimeActivity(lastSeen);
                        }).catch(err => { console.log(err); });
                    }
                });
            }

            // This is added because there are channels that are not a group
            if (roomInfo.channel) {
                $callOptionsBtn.hide();
            }
        },

        onRenderTimeActivity: (time) => {
            onRenderTimeActivity(time);
        },

        onRenderTyping: (typingEvent) => {
            if (typingEvent.typing) {
                // show typing message
                $timeActivity.hide();
                if ($roomInfo.group) {
                    $typing.html(`${typingEvent.user.name} <lang data-language="IS_TYPING">${GLOBAL.getLangJson().IS_TYPING}</lang>`);
                } else {
                    $typing.html(`<lang data-language="TYPING">${GLOBAL.getLangJson().TYPING}</lang>`);
                }
                $typing.show();

                // hide it after 5 seconds
                setTimeout(() => {
                    $typing.hide();
                    $timeActivity.show();
                }, 5000);
            } else {
                $typing.hide();
                $timeActivity.show();
            }
        },

        onOffEventClickOutside: () =>   offEventClickOutside()
    };
});
