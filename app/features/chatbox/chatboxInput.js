define(['shared/functions', 'shared/api', 'shared/data'], (functions, API, GLOBAL) => {
    const { htmlDecode, htmlEncode, stripTags, transformLinkTextToHTML } = functions;
    const $input = $('.js_endter_mess');
    const $wrapperMessages = $('.js_con_list_mess');
    const $btnSend = $('.btn__send');
    const $commentWrapper = $('.mess-comment-box');
    const $commentBox = $commentWrapper.find('.mess-fw-box');
    const $btnCloseCommentBox = $commentWrapper.find('.mess-fw-box-close');
    let messagesWaitProcessingArr = [];
    let updateState = false;
    let deleteState = false;
    let commentState = false;
    let messageId = 0;

    const handleInputAutoExpand = () => {
        const input = $input.get(0);
        const wrapperMessages = $wrapperMessages.get(0);
        const isBottom = wrapperMessages.scrollTop + wrapperMessages.clientHeight >= wrapperMessages.scrollHeight;

        setTimeout(() => {
            input.style.cssText = '';
    
            const height = Math.min(window.outerHeight / 5, input.scrollHeight);
            input.style.cssText = `height: ${height}px`;
            wrapperMessages.style.cssText = `height: calc(100% - ${68 + height}px)`;
            isBottom && wrapperMessages.scrollTo(0, wrapperMessages.scrollHeight);
        }, 0);
    };

    const onKeydown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }

        handleInputAutoExpand();
    };

    const onPaste = () => handleInputAutoExpand();

    const onClear = () => {
        messageId = 0;
        deleteState = false;
        updateState = false;
        commentState = false;
        $input.val('');
        $input.focus();
        $commentWrapper.hide();
        handleInputAutoExpand();
    };

    const postMessage = (params) => API.post('messages', params).then(() => {
        messagesWaitProcessingArr.shift();
        if (messagesWaitProcessingArr.length) {
            postMessage(messagesWaitProcessingArr[0]);
        }
    }).catch(() => setTimeout(() => postMessage(messagesWaitProcessingArr[0]), 5000));

    const onSendMessage = () => {
        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const roomId = GLOBAL.getCurrentRoomId();
        let text = $input.val();
        const time = new Date().getTime();
        let params = {};
        
        if (!text.replace(/[\s\n]/g, '')) {
            onClear();
            return;
        }

        console.log(htmlEncode(text));
        text = htmlEncode(text);
        console.log(text);
        if (commentState) {
            text = `${text}<c style="display:none" ob="${JSON.stringify(commentState)}"></c>`;
        }

        params = {
            sender: GLOBAL.getInfomation(),
            id: {
                chatId: roomId,
                messageId
            },
            comment: 1,
            message: text,
            type: 1,
            deleted: deleteState,
            updated: updateState,
            internal: !!obRoomEdited[roomId]?.hide_mess
        };

        onClear();
        if (!messagesWaitProcessingArr.length) {
            postMessage(params);
            messagesWaitProcessingArr = messagesWaitProcessingArr.concat(params);
        } else {
            messagesWaitProcessingArr = messagesWaitProcessingArr.concat(params);
        }    
    };

    const onHideCommentBox = () => {
        commentState = false;
        $commentWrapper.hide();
    };

    return {
        onInit: () => {
            $input.keydown(onKeydown);
            $input.bind('paste', onPaste);
            $btnSend.click(onSendMessage);
            $btnCloseCommentBox.click(onHideCommentBox);
        },

        onUpdate: (id, value) => {
            const text = htmlDecode(stripTags(value.replace(/<br>/g, '\n')));

            $input.val(text);
            $input.focus();
            updateState = true;
            messageId = id;
            handleInputAutoExpand();
        },

        onRemove: (id, value) => {
            deleteState = true;
            messageId = id;
            $input.val(value);
            onSendMessage();
        },

        onComment: (object) => {
            commentState = {
                chatId: object.chatId,
                mess: object.mess,
                name: object.officiallyName,
                userId: object.userId
            };

            $input.focus();
            $commentWrapper.show();
            $commentBox.html(`<b>${object.name}</b>: <span class="span-mess-cmt span-mess-cmt-ids">${object.hasFile ? object.mess : transformLinkTextToHTML(object.mess)}</span>`);
        },

        onAddEmoji: (emoji) => {
            $input.val($input.val() + emoji);
            $input.focus();
        },

        onClear
    };
});
