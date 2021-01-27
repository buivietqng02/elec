define(['features/chatbox/chatboxInput', 'features/modal/modalForwardMessage'], (chatboxInputComp, modalForwardMessageComp) => {
    const message = {};
    let $message;
    let isShow = false;
    const $wrapper = $('.js_con_list_mess');
    const $slide = $('.js-menu-messages');
    const $cmtBtn = $('.js-menu-messages-cmt');
    const $forwardBtn = $('.js-menu-messages-forward');
    const $editBtn = $('.js-menu-messages-edit');
    const $removeBtn = $('.js-menu-messages-remove');

    const onComment = () => {
        const { chatId } = $message.data();
        const $name = $message.find('.--name');
        const mess = $message.find('.--mess').html();
        const name = $name.html();
        const { useridName, userOfficiallyName } = $name.data();

        offEventClickOutside();
        chatboxInputComp.onComment({
            chatId,
            userId: useridName,
            mess,
            name,
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
        chatboxInputComp.onRemove(chatId, value);
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
            $editBtn.show();
            $removeBtn.show();
        } else {
            $editBtn.hide();
            $removeBtn.hide();
        }

        if (haveFile) {
            $editBtn.hide();
        }
    };

    const handleClickOutside = () => $(document).on('click.hideMessageSettings', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    return {
        onInit: () => {
            $cmtBtn.click(onComment);
            $forwardBtn.click(onForward);
            $editBtn.click(onEdit);
            $removeBtn.click(onRemove);
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
