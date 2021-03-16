/* eslint-disable */
define([
    'shared/data',
    'shared/api',
    'shared/functions',
    'features/chatbox/chatboxContent',
], (
    GLOBAL, 
    API,
    functions,
    chatboxContentComp
) => {
    const { debounce } = functions;
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

    $openBtn.hide();

    const refershVarible = () => {
        let $mess = $('.highlight-text').closest('.--mess');
        $mess.text($mess.text());
        $currentPos.text(0);
        $totalSearch.text(0);
        $loading.hide();
        currentPos = 0;
        totalSearch = 0;
        searchs = [];
    };

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

        Promise.all([
            API.get('messages', { chatId: roomId, offset: message.id.messageId }),
            API.get('messages', { chatId: roomId, offset: message.id.messageId + 20 })
        ]).then(res => {
            if (searchVal !== $input.val() || lastCurrentPos !== currentPos) {
                return;
            }

            $loading.hide();
            let $mess = $('.highlight-text').closest('.--mess');
            $mess.text($mess.text());
            const prevMessages = res[0].data.messages.reverse();
            const nextMessages = res[1].data.messages.filter(mess => mess.id.messageId >= message.id.messageId).reverse();
            GLOBAL.setCurrentSearchMessages(prevMessages.concat(nextMessages));

            chatboxContentComp.onSearch({
                value: searchVal,
                offset: message.id.messageId
            });
        });
    };

    const debounceInitListMessages = debounce(() => {
        if ($(`[data-chat-id="${searchs[currentPos].id.messageId}"]`).length) {
            let $mess = $('.highlight-text').closest('.--mess');
            $mess.text($mess.text());
            chatboxContentComp.onSearch({
                value: $input.val(),
                offset: searchs[currentPos].id.messageId
            }, searchs[currentPos]);
        } else {
            $loading.show();
            initListMessages(GLOBAL.getCurrentRoomId(), searchs[currentPos], currentPos, $input.val())
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

                if ($(`[data-chat-id="${searchs[0].id.messageId}"]`).length) {
                    $loading.hide();
                    chatboxContentComp.onSearch({
                        value: $input.val(),
                        offset: searchs[0].id.messageId
                    }, searchs[0]);
                } else {
                    initListMessages(roomId, searchs[0], currentPos, $input.val());
                }

            } else {
                $loading.hide();
            }
        })
    }, 1000);

    return {
        onInit: () => {
            $openBtn.click(onOpenSearchBox);
            $closeBtn.click(onCloseSearchBox);
            $upBtn.click(onUpMessage);
            $downBtn.click(onDownMessage);
            $input.bind('paste', onSearch);
            $input.attr('autocomplete', 'off');
            $(document).on('input', '#msbg-input', onSearch);
        },

        onCloseSearchBox
    };
});
