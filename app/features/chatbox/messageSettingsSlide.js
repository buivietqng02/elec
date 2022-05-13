define([
    'shared/data',
    'shared/alert',
    'shared/functions',
    'features/chatbox/chatboxInput',
    'features/modal/modalForwardMessage',
    'features/modal/modalMessageInfo',
    'features/modal/modalRemoveMessage',
    'features/modal/modalLabelMessage',
    'features/modal/modalPinMessage',
    'features/modal/modalMessageReaction',
    'features/modal/modalMessageReactionList'
], (
    GLOBAL,
    ALERT,
    functions,
    chatboxInputComp,
    modalForwardMessageComp,
    modalMessageInfoComp,
    modalRemoveMessage,
    modalLabelMessageComp,
    modalPinMessageComp,
    modalMessageReactionComp,
    modalMessageReactionListComp
) => {
    const message = {};
    let $message;
    let isShow = false;
    let $wrapper;
    let $slide;
    let $cmtBtn;
    let $forwardBtn;
    let $editBtn;
    let $removeBtn;
    let $copyTextBtn;

    const onComment = () => {
        const { chatId } = $message.data();
        const $name = $message.find('.--name');
        const name = $name.html();
        const messHtml = $message.find('.--mess').html();
        const { useridName, userOfficiallyName } = $name.data();
        let mess = functions.stripTags(messHtml);
        let hasFile = 0;
        const sequence = $message.find('.show_origin_btn').attr('sequence_number')

        if ($message.hasClass('have-file')) {
            hasFile = 1;
            mess = messHtml;
        }

        offEventClickOutside();
        chatboxInputComp.onComment({
            chatId,
            userId: useridName,
            mess,
            name,
            hasFile,
            officiallyName: userOfficiallyName,
            origin_sequence: sequence
        });
    };

    const onForward = () => {
        const { chatId } = $message.data();

        offEventClickOutside();
        modalForwardMessageComp.onInit(chatId);
    };

    const onEdit = () => {
        const { chatId } = $message.data();
        const value = $message.find('.--mess').html();
        const taggedUsersAttribute = $message.find('.--mess').attr('tagged-users')
        let taggedUsers = [];
        if(taggedUsersAttribute) taggedUsers = JSON.parse(taggedUsersAttribute);

        offEventClickOutside();
        chatboxInputComp.onUpdate(chatId, value, taggedUsers);
    };

    const onRemove = () => {
        offEventClickOutside();
        modalRemoveMessage.onInit($message);
    };

    const onLabelMessage = () => {
        offEventClickOutside();
        modalLabelMessageComp.onInit($message);
    };

    const onCopyText = () => {
        const value = $message.find('.--mess').text();

        const elem = document.createElement('textarea');
        elem.value = value;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        ALERT.show(GLOBAL.getLangJson().COPIED_TO_CLIPBOARD, 'success');
        document.body.removeChild(elem);

        offEventClickOutside();
    };

    const onInfo = () => {
        const chatId = GLOBAL.getCurrentRoomId();
        const messageDate = $message.find('.--date').attr('date-value');

        offEventClickOutside();
        modalMessageInfoComp.onInit(chatId, messageDate);
    };

    const onReaction = () => {
        const chatId = GLOBAL.getCurrentRoomId();
        const messageId = $message.data().chatId;
        offEventClickOutside();
        modalMessageReactionComp.onModal(chatId, messageId);
    }

    const onReactionList = () => {
        const chatId = GLOBAL.getCurrentRoomId();
        const messageId = $message.data().chatId;
        offEventClickOutside();
        modalMessageReactionListComp.onInit(chatId, messageId);
    }

    const locatePosition = ($element) => {
        const winWidth = $(window).width();
        const winHeight = $(window).height();
        const slideHiehgt = $slide.height();
        const elementPos = $element.offset();
        const left = elementPos.left - ($wrapper.offset().left + 132);
        let top = elementPos.top + 20;

        if (slideHiehgt + top > winHeight) {
            top = elementPos.top - slideHiehgt - 20;
        }
        $slide.css({
            display: 'block',
            top: `${top}px`,
            left: `${left}px`
        });
    };

    const offEventClickOutside = () => {
        isShow = false;
        $slide.hide();
        $(document).off('.hideMessageSettings');
    };

    const handleOptionsByUser = () => {
        // If view label messages list
        const isViewLabelMess = modalLabelMessageComp.onGetIsViewingLabelMess();
        let chatId;
        if (isViewLabelMess) {
            chatId = $message.find('.show_origin_btn').attr('room-id');
            $editBtn.hide();
            $removeBtn.hide();
            $messageReactionListBtn.hide();
            $pinMessBtn.hide();
            $cmtBtn.hide();
            $messageReactionBtn.hide();
            $forwardBtn.hide();
            return;
        } else {
            chatId = GLOBAL.getCurrentRoomId();
            $editBtn.show();
            $removeBtn.show();
            $messageReactionListBtn.show();
            $pinMessBtn.show();
            $cmtBtn.show();
            $messageReactionBtn.show();
            $forwardBtn.show();
        }

        const isActiveUser = $message.hasClass('you');
        const haveFile = $message.hasClass('have-file');
        const isPinned = $message.hasClass('pinned');
        const haveReactions = $message.hasClass('have-reactions');
        const roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(chatId)) {
                return true;
            }

            return false;
        })[0] || {};
        const isChannel = roomInfo.channel;

        if (isActiveUser) {
            if ($message.find('.--mess.fwme').length) {
                $editBtn.hide();
            } else {
                $editBtn.show();
            }

            $removeBtn.show();
            $messageInfoBtn.show();
            $messageReactionBtn.show();
        } else {
            $messageReactionBtn.show();
            $editBtn.hide();
            $removeBtn.hide();
            $messageInfoBtn.hide();
        }

        if (haveFile) {
            $editBtn.hide();
            $copyTextBtn.hide();
        } else {
            $copyTextBtn.show();
        }
        
        if (haveReactions && !isChannel) {
            $messageReactionListBtn.show();
        } else {
            $messageReactionListBtn.hide();
        }

        // If pinned message
        if (isPinned) {
            $textPinBtn.html(GLOBAL.getLangJson().UNPIN_MESSAGE);
        } else {
            $textPinBtn.html(GLOBAL.getLangJson().PIN_MESSAGE);
        }
    };

    const handleClickOutside = () => $(document).on('click.hideMessageSettings', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const onPinMessage = () => {
        modalPinMessageComp.onPinMess($message);
        // offEventClickOutside();
    }

    return {
        onInit: () => {
            isShow = false;
            $wrapper = $('.js_con_list_mess');
            $slide = $('.js-menu-messages');
            $cmtBtn = $('.js-menu-messages-cmt');
            $forwardBtn = $('.js-menu-messages-forward');
            $editBtn = $('.js-menu-messages-edit');
            $removeBtn = $('.js-menu-messages-remove');
            $copyTextBtn = $('.js-menu-messages-copytext');
            $messageInfoBtn = $('.js-menu-messages-info');
            $labelMessBtn = $('.js-menu-messages-label');
            $pinMessBtn = $('.js-menu-messages-pinmess');
            $textPinBtn = $('.js-menu-messages-pinmess lang');
            $messageReactionBtn = $('.js-menu-messages-rcn');
            $messageReactionListBtn = $('.js-menu-messages-rcn-list');

            $cmtBtn.off().click(onComment);
            $forwardBtn.off().click(onForward);
            $editBtn.off().click(onEdit);
            $removeBtn.off().click(onRemove);
            $copyTextBtn.off().click(onCopyText);
            $messageInfoBtn.off().click(onInfo);
            $labelMessBtn.off().click(onLabelMessage);
            $pinMessBtn.off().click(onPinMessage);
            $messageReactionBtn.off().click(onReaction);
            $messageReactionListBtn.off().click(onReactionList);
        },

        onShow: (e) => {
            e.preventDefault();
            e.stopPropagation();
          
            if (!isShow) {
                const $this = $(e.currentTarget);
                $message = $this.closest('.js_li_list_mess');
                isShow = true;

                handleOptionsByUser();
                locatePosition($this);
                handleClickOutside();
            } else {
                offEventClickOutside();
            }
        },

        offEventClickOutside
    };
});
