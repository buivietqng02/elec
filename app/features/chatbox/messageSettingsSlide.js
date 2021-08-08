define([
    'shared/data',
    'shared/alert',
    'shared/functions',
    'features/chatbox/chatboxInput', 
    'features/modal/modalForwardMessage'
], (
    GLOBAL,
    ALERT,
    functions,
    chatboxInputComp, 
    modalForwardMessageComp
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
            officiallyName: userOfficiallyName
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

        offEventClickOutside();
        chatboxInputComp.onUpdate(chatId, value);
    };

    const onRemove = () => {
        const { chatId } = $message.data();
        const value = $message.find('.--mess').html();

        offEventClickOutside();

        $message.find('.--mess').addClass('--message-removed').html('This message was removed');
        $message.find('.btn-message-settings').hide();
        $message.find('.--double-check').addClass('hidden');

        chatboxInputComp.onRemove(chatId, value);
    };

    const onCopyText = () => {
        const value = $message.find('.--mess').html();

        const elem = document.createElement('textarea');
        elem.value = value;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        ALERT.show(GLOBAL.getLangJson().COPIED_TO_CLIPBOARD, 'success');
        document.body.removeChild(elem);

       offEventClickOutside();
    };

    const locatePosition = ($element) => {
        const winWidth = $(window).width();
        const winHeight = $(window).height();
        const slideHiehgt = $slide.height();
        const elementPos = $element.offset();
        const left = elementPos.left - ($wrapper.offset().left + 132);
        let top = elementPos.top + 20;

        if (slideHiehgt + top + 100 > winHeight) {
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
        const isActiveUser = $message.hasClass('you');
        const haveFile = $message.hasClass('have-file');

        if (isActiveUser) {
            if ($message.find('.--mess.fwme').length) {
                $editBtn.hide();
            } else {
                $editBtn.show();
            }
            
            $removeBtn.show();
        } else {
            $editBtn.hide();
            $removeBtn.hide();
        }

        if (haveFile) {
            $editBtn.hide();
            $copyTextBtn.hide();
        } else {
            $copyTextBtn.show();
        }
    };

    const handleClickOutside = () => $(document).on('click.hideMessageSettings', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

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

            $cmtBtn.off().click(onComment);
            $forwardBtn.off().click(onForward);
            $editBtn.off().click(onEdit);
            $removeBtn.off().click(onRemove);
            $copyTextBtn.off().click(onCopyText);
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
        }
    };
});
