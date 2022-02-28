define([
    'app/constant',
    'shared/data',
    'features/sidebar/sidebarService',
    'features/sidebar/sidebarFavourites',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxInput',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/chatboxAttach',
    'features/modal/modalSearchMessage',
    'features/modal/modalAcceptInvitation',
    'features/modal/modalMediaAndFiles',
    'features/modal/modalBookmarkMessage'

], (
    constant,
    GLOBAL,
    services,
    sidebarFavouritesComp,
    chatboxContentComp,
    chatboxInputComp,
    chatboxTopbarComp,
    chatboxAttachComp,
    modalSearchMessage,
    modalAcceptInvitationComp,
    viewMediaAndFilesComp,
    modalBookmarkMessage

) => {
    const { getRooms, initScroll, setCurrentTranslate } = services;
    let $caption;
    let $chatbox;
    let mediaFilesWraper;
    let roomInfo;
    let $frame;
    let $lCollapse;
    let sidebar;

    const onRoomClick = (e) => {
        const lastRoomId = GLOBAL.getCurrentRoomId();
        const $this = $(e.currentTarget);
        const roomId = $this.attr('data-room-id');
        roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(roomId)) {
                return true;
            }

            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));

         // For mobile view 
         sidebar = document.querySelector('.sidebar');
         if (sidebar.classList.contains('mobile')) {
             $frame.removeClass('indent');
             $lCollapse.removeClass('indent');
             setCurrentTranslate(0);
         } 

        // Handle when the user has not accepted the invitation yet
        if (!roomId) {
            $caption.show();
            $chatbox.hide();
            GLOBAL.setCurrentRoomId(null);
            $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`).removeClass('active');
            modalAcceptInvitationComp.onInit($this);
            return;
        }

        if ($this.hasClass('p_disabled') || roomId === lastRoomId) {
            return;
        }

        // Hide chat input if this room is xm channel
        if (roomInfo?.channel && !roomInfo?.owner) {
            $('.messages-input-wrap').hide();
        } else {
            $('.messages-input-wrap').show();
        }

        // Hide chat input if using voice message
        const initVoiceChat = document.querySelector('#init-voiceChat');
        const isUssingVoiceMess = initVoiceChat.getAttribute('isUsingVoiceMess');
        if (isUssingVoiceMess === 'true') {
            document.querySelector('.messages__input').classList.add('de-active');
        } else {
            document.querySelector('.messages__input').classList.remove('de-active');
        }

        // Handle draft
        chatboxInputComp.onHandleDraft(lastRoomId, roomId);

        // Update new room
        GLOBAL.setCurrentRoomId(roomId);
        // Hide background what express the active state of the room
        $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`).removeClass('active');
        // Hide the caption when user start entering the room
        $caption.hide();
        $chatbox.show();
        // Show background for new room 
        $this.addClass('active');

        chatboxInputComp.onClear();
        // chatboxAttachComp.markPhone(roomInfo.group);
        chatboxTopbarComp.onRenderInfomation(roomInfo);
        chatboxContentComp.onLoadMessage(roomInfo);

        // Close view media and files comp when click on sidebar
        if (!mediaFilesWraper.classList.contains('hidden')) {
            viewMediaAndFilesComp.closeMediaAndFilesModal();
        } 

        // Close search view when click on sidebar
        modalSearchMessage.closeViewSearch();

        chatboxContentComp.onSwitchRoomWhileShowMessMediaAndFiles();

        // Close view bookmark message list when click other room
        if (modalBookmarkMessage.onGetIsViewingBookmark()) {
            modalBookmarkMessage.onCloseViewBookmarks();
        }
    };

    const onInit = () => {
        $caption = $('.js_caption');
        $chatbox = $('.js_wrap_mess');
        mediaFilesWraper = document.querySelector('.view-media-files-wraper');

        $frame = $('#frame');
        $lCollapse = $('.lbog-collapse');

        getRooms();
        initScroll();

        $(document).off('.sidebarFavorRooms').on('click.sidebarFavorRooms', '.favouriteBtn', (e) => sidebarFavouritesComp.onToggleFavouritesRoom(e, 'desktop'));
        $(document).off('.sidebarFavorRoomsMB').on('click.sidebarFavorRoomsMB', '.favourite-mb-btn', (e) => sidebarFavouritesComp.onToggleFavouritesRoom(e, 'mobile'));

        $(document).off('.sidebarRoomList').on('click.sidebarRoomList', `[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`, onRoomClick);
    };

    return {
        onInit,

        getRoomInfoOnClick: () => roomInfo
    };
});
