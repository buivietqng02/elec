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

    const {
        ENTER_KEY_PREFERENCES
    } = constant;

    let $input;
    let $wrapperMessages;
    let $btnSend;
    let $btnAttach;
    let initVoiceMessageBtn;
    let $commentWrapper;
    let $commentBox;
    let $btnCloseCommentBox;
    let messagesWaitProcessingArr = [];
    let deleteState = false;
    let commentState = false;
    let messageId = 0;
    let timeOfLastTypingEvent;
    let timeOfLastSentTypingEvent;

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
                // $btnAttach.hide();
                $initVoiceMessageBtn.hide();
            } else {
                removeDraft();
                $btnSend.hide();
                // $btnAttach.show();
                $initVoiceMessageBtn.show();
            }

            input.style.cssText = '';

            const height = Math.min(window.outerHeight / 5, input.scrollHeight);
            input.style.cssText = `height: ${height}px`;
            wrapperMessages.style.cssText = `height: calc(100% - ${68 + height}px)`;
            isBottom && wrapperMessages.scrollTo(0, wrapperMessages.scrollHeight);
        }, 10);
    };

    const onKeydown = (e) => {
        let enterKeyIsNewLine = GLOBAL.getEnterKeyPreference() === ENTER_KEY_PREFERENCES[0].value;

        if (enterKeyIsNewLine) {
            if (e.keyCode === 13 && e.shiftKey) {
                e.preventDefault();
                removeDraft();
                onSendMessage();
            } else {
                onTypingEvent();
            }
        } else {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                removeDraft();
                onSendMessage();
            } else {
                onTypingEvent();
            }
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

    const onErrFetch = (err) => {
        console.log(err);
        if (err === 19940402) {
            setTimeout(() => postMessage(messagesWaitProcessingArr[0]), 3000)
            count = 0;
        }
    };

    // Fixing repeating messages
    let awaitProcessClone = [];
    let count = 0;

    const postMessage = (data) => {
        if (data?.isDelete) {
            API.delete(`chats/${data.chatId}/messages/${data.messageId}`).then(() => {
                messagesWaitProcessingArr.shift();
                if (messagesWaitProcessingArr.length) {
                    postMessage(messagesWaitProcessingArr[0]);
                }
            }).catch(onErrFetch);

            return;
        }

        if (data?.messageId) {
            API.put(`chats/${data.chatId}/messages/${data.messageId}`, data.params.message).then(() => {
                messagesWaitProcessingArr.shift();
                if (messagesWaitProcessingArr.length) {
                    postMessage(messagesWaitProcessingArr[0]);
                }
            }).catch(onErrFetch);

            return;
        } 

        // Fixing repeating messages
        awaitProcessClone.map((item, index) => {
            if( item?.idLocal === data?.idLocal) {
                count = count + 1
            } 
            // else {
            //     if(awaitProcessClone.length === 1){
            //         count = 0;
            //     }
            // }
        })

        // console.log('clone await array', awaitProcessClone); 
        // console.log('data input', data);
        // console.log('response ID', responseID)  
        // console.log("new array", newArray)
        // console.log(count)

        // Fixing repeating messages
        if(count > 1){
            return
        }

        if(data?.chatId) {
            // console.log(data?.idLocal)
            API.post(`chats/${data.chatId}/messages`, data.params).then((res) => {
                const chatboxContentComp = require('features/chatbox/chatboxContent');
                messagesWaitProcessingArr.shift();
                
                // Fixing repeating messages
                count = 0;

                chatboxContentComp.onFinishPostMessage({
                    idLocal: data.idLocal,
                    ...res
                });  
                
                if (messagesWaitProcessingArr.length) {
                    postMessage(messagesWaitProcessingArr[0]);
                }
            }).catch(onErrFetch);
        }
        
    };

    const onSendMessage = () => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const roomId = GLOBAL.getCurrentRoomId();
        let text = $input.val();
        let data = {};

        // console.log(obRoomEdited, roomId, text, data);

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

        if (!deleteState) {
            sendTypingEvent(false);
        }

        if (!messagesWaitProcessingArr.length) {
            postMessage(data);
        }

        onClear();
        messagesWaitProcessingArr = messagesWaitProcessingArr.concat(data);

        // Fixing repeating messages
        awaitProcessClone = [...messagesWaitProcessingArr]
    };

    const onHideCommentBox = () => {
        commentState = false;
        $commentWrapper.hide();
    };

    const onTypingEvent = () => {
        let currentTimestamp = Date.now();
        if (timeOfLastTypingEvent != null) {
            // check if last typing event was more than 2.5 seconds ago
            // OR if last typing event sent to API was more than 5 seconds ago
            if (currentTimestamp - timeOfLastTypingEvent > 2500
                || currentTimestamp - timeOfLastSentTypingEvent > 5000) {
                sendTypingEvent(true);
            }
        } else {
            sendTypingEvent(true);
        }
        timeOfLastTypingEvent = currentTimestamp;
    }

    const sendTypingEvent = (typing) => {
        // reset times of typing event
        timeOfLastTypingEvent = null;
        timeOfLastSentTypingEvent = Date.now();

        // get current room id
        const roomId = GLOBAL.getCurrentRoomId();
        // send typing event
        API.post(`chats/${roomId}/typing?typing=${typing}`, null).then(() => { })
            .catch(onErrFetch);
    }

    return {
        onInit: () => {
            $input = $('.js_endter_mess');
            $wrapperMessages = $('.js_con_list_mess');
            $btnSend = $('.btn__send');
            $btnAttach = $('.btn__attach');
            $commentWrapper = $('.mess-comment-box');
            $commentBox = $commentWrapper.find('.mess-fw-box');
            $btnCloseCommentBox = $commentWrapper.find('.mess-fw-box-close');
            $initVoiceMessageBtn = $('#init-voiceChat')
            messagesWaitProcessingArr = [];
            deleteState = false;
            commentState = false;
            messageId = 0;

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
