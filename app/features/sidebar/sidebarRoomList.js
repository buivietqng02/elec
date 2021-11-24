define([
    'app/constant',
    'shared/data',
    'features/sidebar/sidebarService',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxInput',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/chatboxAttach',
    'features/chatbox/chatboxSearch',
    'features/modal/modalAcceptInvitation',
    'features/modal/modalMediaAndFiles'

], (
    constant,
    GLOBAL,
    services,
    chatboxContentComp,
    chatboxInputComp,
    chatboxTopbarComp,
    chatboxAttachComp,
    chatboxSearchComp,
    modalAcceptInvitationComp,
    viewMediaAndFilesComp
) => {
    const { getRooms, initScroll } = services;
    let $caption;
    let $chatbox;
    let mediaFilesWraper;
    let jumpToBottomBtn;

    const onRoomClick = (e) => {
        const lastRoomId = GLOBAL.getCurrentRoomId();
        const $this = $(e.currentTarget);
        const roomId = $this.attr('data-room-id');
        let roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(roomId)) {
                return true;
            }

            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));

        console.log(roomInfo);
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
        chatboxSearchComp.onCloseSearchBox();
        // chatboxAttachComp.markPhone(roomInfo.group);
        chatboxTopbarComp.onRenderInfomation(roomInfo);
        chatboxContentComp.onLoadMessage(roomInfo);

        // Close view media and files comp when click on sidebar
        console.log(jumpToBottomBtn);
        console.log(mediaFilesWraper);
        if (!mediaFilesWraper.classList.contains('hidden')) {
            console.log('test hehehehe');
           
            viewMediaAndFilesComp.closeMediaAndFilesModal();
        } 

        chatboxContentComp.onSwitchRoomWhileShowMessMediaAndFiles();
    };

    const onInit = () => {
        $caption = $('.js_caption');
        $chatbox = $('.js_wrap_mess');
        mediaFilesWraper = document.querySelector('.view-media-files-wraper');
        jumpToBottomBtn = document.querySelector('.jump-to-bottom');

        initScroll();
        getRooms();
        $(document).off('.sidebarRoomList').on('click.sidebarRoomList', `[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`, onRoomClick);
    };

    return {
        onInit
    };
});
