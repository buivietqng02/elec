define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/functions',
    'features/chatbox/chatboxContent'
], (
    constant,
    GLOBAL, 
    API,
    functions,
    chatboxContentComp
) => {
    const { debounce } = functions;
    let $wrapper;
    let $input;
    let $loading;
    let $closeBtn;
    let $openBtn;

    const onOpenSearchBox = () => {
        $wrapper.addClass('open');
        $input.focus();
    };

    const onCloseSearchBox = (isClick) => {
        $wrapper.removeClass('open');
        $input.val('');
        $loading.hide();

        if (isClick) {
            let roomInfo = GLOBAL.getRooms().filter((room) => {
                if (String(room.id) === String(GLOBAL.getCurrentRoomId())) {
                    return true;
                }
    
                return false;
            })[0] || {};
            roomInfo = JSON.parse(JSON.stringify(roomInfo));
            chatboxContentComp.onLoadMessage(roomInfo);
        }
    };

    const onSearch = debounce(() => {
        const value = $input.val();
        const roomId = GLOBAL.getCurrentRoomId();

        if (value.length < 3) {   
            return;
        }

        $loading.show();

        API.get('messages', { chatId: roomId, search: value }).then(res => {
            $loading.hide();
            if (value !== $input.val() || !res?.data?.messages?.length) {
                return;
            }

            chatboxContentComp.onSearch(res.data.messages.reverse(), value);
        });
    }, 1000);

    return {
        onInit: () => {
            $wrapper = $('.mess-search-box');
            $input = $('#msbg-input');
            $loading = $wrapper.find('.pulse');
            $closeBtn = $wrapper.find('.msb-close');
            $openBtn = $('.btn-toggle-search-box');

            $openBtn.off().click(onOpenSearchBox);
            $closeBtn.off().click(() => onCloseSearchBox(true));
            $input.off().bind('paste', onSearch);
            $input.attr('autocomplete', 'off');
            $(document).off('.chatbotSearch').on('input.chatbotSearch', '#msbg-input', onSearch);
        },

        onCloseSearchBox
    };
});
