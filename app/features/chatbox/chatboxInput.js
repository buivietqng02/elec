define([
    'app/constant', 
    'shared/functions', 
    'shared/api', 
    'shared/data'
], (
    constant, 
    functions, 
    API, 
    GLOBAL
) => {
    const { 
        htmlDecode, 
        htmlEncode, 
        stripTags, 
        decodeStringBase64,
        encodeStringBase64, 
        transformLinkTextToHTML, 
        getDataToLocalApplication 
    } = functions;

    const token = getDataToLocalApplication(constant.TOKEN) || '';
    const $input = $('.js_endter_mess');
    const $wrapperMessages = $('.js_con_list_mess');
    const $btnSend = $('.btn__send');
    const $btnAttach = $('.btn__attach');
    const $commentWrapper = $('.mess-comment-box');
    const $commentBox = $commentWrapper.find('.mess-fw-box');
    const $btnCloseCommentBox = $commentWrapper.find('.mess-fw-box-close');
    let messagesWaitProcessingArr = [];
    let deleteState = false;
    let commentState = false;
    let messageId = 0;

    const removeDraft = () => {
        const roomDraft = GLOBAL.getRoomDraft() || {};
        const rid = GLOBAL.getCurrentRoomId();

        if (roomDraft[rid]) {
            const queryStr = `[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${rid}"] .preview`;
            const roomInfo = GLOBAL.getRooms().filter((room) => String(room.id) === String(rid))[0] || {};
            roomDraft[rid] = '';
            GLOBAL.setRoomDraft(roomDraft);
            $(queryStr).removeClass('draft').text(decodeStringBase64(roomInfo.lastMessage) || '');
        }
    };

    const handleInputAutoExpand = () => {
        const input = $input.get(0);
        const wrapperMessages = $wrapperMessages.get(0);
        const isBottom = wrapperMessages.scrollTop + wrapperMessages.clientHeight >= wrapperMessages.scrollHeight;
        
        setTimeout(() => {
            if ($input.val().replace(/[\s\n]/g, '')) {
                $btnSend.show();
                $btnAttach.hide();
            } else {
                removeDraft();
                $btnSend.hide();
                $btnAttach.show();
            }

            input.style.cssText = '';
    
            const height = Math.min(window.outerHeight / 5, input.scrollHeight);
            input.style.cssText = `height: ${height}px`;
            wrapperMessages.style.cssText = `height: calc(100% - ${68 + height}px)`;
            isBottom && wrapperMessages.scrollTo(0, wrapperMessages.scrollHeight);
        }, 10);
    };

    const onKeydown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            removeDraft();
            onSendMessage();
        }

        handleInputAutoExpand();
    };

    const onPaste = () => handleInputAutoExpand();

    const onClear = () => {
        const roomDraft = GLOBAL.getRoomDraft();
        const rid = GLOBAL.getCurrentRoomId();
        messageId = 0;
        deleteState = false;
        commentState = false;
        $input.focus();
        $btnSend.hide();
        $commentWrapper.hide();

        if (roomDraft[rid]) {
            $input.val(roomDraft[rid]);
        } else {
            $input.val('');
        }

        handleInputAutoExpand();
    };

    const postMessage = (data) => {
        if (data.isDelete) {
            API.delete(`chats/${data.chatId}/messages/${data.messageId}`).then(() => {
                messagesWaitProcessingArr.shift();
                if (messagesWaitProcessingArr.length) {
                    postMessage(messagesWaitProcessingArr[0]);
                }
            }).catch(() => setTimeout(() => postMessage(messagesWaitProcessingArr[0]), 5000))
            return;
        }

        if (data.messageId) {
            $.ajax({
                type: 'PUT',
                url: `${constant.API_URL}/chats/${data.chatId}/messages/${data.messageId}`,
                data: data.params.message,
                headers: {
                    'X-Authorization-Token': token
                },
                cache: false,
                contentType: false,
                processData: false,
                success: () => {
                    messagesWaitProcessingArr.shift();
                    if (messagesWaitProcessingArr.length) {
                        postMessage(messagesWaitProcessingArr[0]);
                    }
                },
                error: () => setTimeout(() => postMessage(messagesWaitProcessingArr[0]), 5000)
            });

            return;
        }

        API.post(`chats/${data.chatId}/messages`, data.params).then((res) => {
            const chatboxContentComp = require('features/chatbox/chatboxContent');
            messagesWaitProcessingArr.shift();
            chatboxContentComp.onFinishPostMessage({
                idLocal: data.idLocal,
                ...res
            });
            if (messagesWaitProcessingArr.length) {
                postMessage(messagesWaitProcessingArr[0]);
            }
        }).catch((err) => {
            console.log(err);
            if (!GLOBAL.getNetworkStatus()) {
                setTimeout(() => postMessage(messagesWaitProcessingArr[0]), 5000)
            }
        })
    };

    const onSendMessage = () => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const roomId = GLOBAL.getCurrentRoomId();
        let text = $input.val();
        let data = {};
        
        if (!text.replace(/[\s\n]/g, '') && !deleteState) {
            onClear();
            return;
        }

        data = {
            idLocal: new Date().getTime(),
            messageId: messageId,
            chatId: roomId,
            isDelete: deleteState,
            text,
            params: {
                message: encodeStringBase64(text),
                internal: !!obRoomEdited[roomId]?.hide_mess,
                quotedMessageId: commentState.chatId
            }
        };

        if (!data.messageId) {
            chatboxContentComp.onAddLocal(data);
        }

        if (!messagesWaitProcessingArr.length) {
            postMessage(data);
        }

        onClear();
        messagesWaitProcessingArr = messagesWaitProcessingArr.concat(data);
    };

    const onHideCommentBox = () => {
        commentState = false;
        $commentWrapper.hide();
    };

    return {
        onInit: () => {
            $input.off('keydown').keydown(onKeydown);
            $input.off('paste').bind('paste', onPaste);
            $btnSend.off().click(onSendMessage);
            $btnCloseCommentBox.off().click(onHideCommentBox);
        },

        onUpdate: (id, value) => {
            const text = htmlDecode(stripTags(value.replace(/<br>/g, '\n')));

            $input.val(text);
            $input.focus();
            messageId = id;
            handleInputAutoExpand();
        },

        onRemove: (id, value) => {
            deleteState = true;
            messageId = id;
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
            handleInputAutoExpand();
        },

        onClear,

        onHandleDraft: (currentId) => {
            const value = $input.val() || '';
            const roomDraft = GLOBAL.getRoomDraft();

            if (value) {
                $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${currentId}"] .preview`).addClass('draft').text(`[draft] ${value}`);
            }

            roomDraft[currentId] = value;
            GLOBAL.setRoomDraft(roomDraft);
        }
    };
});
