define([
    'app/constant',
    'shared/data',
    'features/sidebar/sidebarService',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxInput',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/chatboxAttach',
    'features/chatbox/chatboxSearch',
    'features/modal/modalAcceptInvitation'
], (
    constant,
    GLOBAL,
    services,
    chatboxContentComp,
    chatboxInputComp,
    chatboxTopbarComp,
    chatboxAttachComp,
    chatboxSearchComp,
    modalAcceptInvitationComp
) => {
    const { getRooms, initScroll } = services;
    let $caption;
    let $chatbox;

    const onRoomClick = (e) => {
        const lastRoomId = GLOBAL.getCurrentRoomId();
        const $this = $(e.currentTarget);
        const { roomId } = $this.data();
        let roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(roomId)) {
                return true;
            }

            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));

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
        chatboxAttachComp.markPhone(roomInfo.group);
        chatboxTopbarComp.onRenderInfomation(roomInfo);
        chatboxContentComp.onLoadMessage(roomInfo);
    };

    const onInit = () => {
        $caption = $('.js_caption');
        $chatbox = $('.js_wrap_mess');
        initScroll();
        getRooms();
        $(document).off('.sidebarRoomList').on('click.sidebarRoomList', `[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`, onRoomClick);
    };

    return {
        onInit
    };
});
