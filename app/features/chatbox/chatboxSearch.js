/* eslint-disable */
define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/functions',
    'features/chatbox/chatboxContent',
    'features/chatbox/chatboxContentChatList',
], (
    constant,
    GLOBAL, 
    API,
    functions,
    chatboxContentComp,
    chatboxContentChatListComp,
) => {
    const { debounce } = functions;
    const { getRoomById } = chatboxContentChatListComp;
    const $wrapper = $('.mess-search-box');
    const $input = $('#msbg-input');
    const $loading = $wrapper.find('.pulse');
    const $currentPos = $wrapper.find('.msbp-cur');
    const $totalSearch = $wrapper.find('.msbp-all');
    const $upBtn = $wrapper.find('.msbgb-up');
    const $downBtn = $wrapper.find('.msbgb-down');
    const $closeBtn = $wrapper.find('.msb-close');
    const $openBtn = $('.btn-toggle-search-box');
    let searchs = [];
    let currentPos = 0;
    let totalSearch = 0;

    const refershVarible = () => {
        const $mess = $('.highlight-text').closest('.--mess');
        $mess.text($mess.text());
        $currentPos.text(0);
        $totalSearch.text(0);
        $loading.hide();
        currentPos = 0;
        totalSearch = 0;
        searchs = [];
    };

    const onHandleSearchCallback = (value, id, searchObj) => chatboxContentComp.onSearch({
        value,
        id
    }, searchObj);

    const onOpenSearchBox = () => {
        $wrapper.addClass('open');
        $input.focus();
    };

    const onCloseSearchBox = () => {
        $wrapper.removeClass('open');
        $input.val('');
        refershVarible();
    };

    const initListMessages = (roomId, message, lastCurrentPos, searchVal) => {
        if (searchVal !== $input.val()) {
            return;
        }

        const messages = getRoomById(GLOBAL.getCurrentRoomId());
        const firstMessage = messages[0];

        if (message.sequence >= firstMessage.sequence) {
            $loading.hide();
            GLOBAL.setCurrentSearchMessages([]);
            onHandleSearchCallback(searchVal, message.id.messageId, { intoCache: true });
            return;
        }

        Promise.all([
            API.get('messages', { chatId: roomId, offset: message.sequence }),
            API.get('messages', { chatId: roomId, offset: message.sequence + 20 })
        ]).then(res => {
            if (searchVal !== $input.val() || lastCurrentPos !== currentPos) {
                return;
            }

            $loading.hide();
            const $mess = $('.highlight-text').closest('.--mess');
            const prevMessages = res[0].data.messages.reverse();
            const nextMessages = res[1].data.messages.filter(mess => (
                mess.id.messageId >= message.id.messageId
            )).reverse();

            $mess.text($mess.text());
            GLOBAL.setCurrentSearchMessages(prevMessages.concat(nextMessages));
            onHandleSearchCallback(searchVal, message.id.messageId);
        });
    };

    const debounceInitListMessages = debounce(() => {
        if ($(`[${constant.ATTRIBUTE_MESSAGE_ID}="${searchs[currentPos].id.messageId}"]`).length) {
            const $mess = $('.highlight-text').closest('.--mess');
            $mess.text($mess.text());
            onHandleSearchCallback($input.val(), searchs[currentPos].id.messageId, searchs[currentPos]);
        } else {
            $loading.show();
            initListMessages(
                GLOBAL.getCurrentRoomId(), 
                searchs[currentPos], 
                currentPos, 
                $input.val()
            );
        }
    }, 500);

    const onUpMessage = () => {
        if (totalSearch === 0 || totalSearch === 1) {
            return;
        }

        if (currentPos + 1 === totalSearch) {
            currentPos = 0;
        } else {
            currentPos += 1;
        }

        $currentPos.text(currentPos + 1);
        debounceInitListMessages(); 
    };

    const onDownMessage = () => {
        if (totalSearch === 0 || totalSearch === 1) {
            return;
        }
        
        if (currentPos - 1 === -1) {
            currentPos = totalSearch - 1;
        } else {
            currentPos -= 1;
        }

        $currentPos.text(currentPos + 1);
        debounceInitListMessages();
    };

    const onSearch = debounce(() => {
        const value = $input.val();
        const roomId = GLOBAL.getCurrentRoomId();

        refershVarible();
        if (value.length < 3) {   
            return;
        }

        $loading.show();

        API.get('messages', { chatId: roomId, search: value }).then(res => {
            if (value !== $input.val()) {
                return;
            }

            if (res.data.messages.length) {
                searchs = res.data.messages;
                totalSearch = res.data.messages.length;
                $currentPos.text(currentPos + 1);
                $totalSearch.text(res.data.messages.length);

                if ($(`[${constant.ATTRIBUTE_MESSAGE_ID}="${searchs[0].id.messageId}"]`).length) {
                    $loading.hide();
                    onHandleSearchCallback($input.val(), searchs[0].id.messageId, searchs[0]);
                } else {
                    initListMessages(roomId, searchs[0], currentPos, $input.val());
                }
            } else {
                $loading.hide();
            }
        });
    }, 1000);

    return {
        onInit: () => {
            $openBtn.off().click(onOpenSearchBox);
            $closeBtn.off().click(onCloseSearchBox);
            $upBtn.off().click(onUpMessage);
            $downBtn.off().click(onDownMessage);
            $input.off().bind('paste', onSearch);
            $input.attr('autocomplete', 'off');
            $(document).off('.chatbotSearch').on('input.chatbotSearch', '#msbg-input', onSearch);
        },

        onCloseSearchBox
    };
});
