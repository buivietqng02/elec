define([
    'app/constant',
    'shared/functions',
    'shared/api',
    'shared/data',
    'features/modal/modalTagPerson'
], (
    constant,
    functions,
    API,
    GLOBAL,
    modalTagPerson
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
            if ($input.text().replace(/[\s\n]/g, '')) {
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

    const onKeyDown = (e) => {
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

    const onPaste = (e) => {
        handleInputAutoExpand();

        // Paste as plain text
        e.preventDefault();
        // Get the copied text from the clipboard
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        // insert text manually
        document.execCommand("insertHTML", false, text);
    };

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
            $input.html(roomDraft[rid]);
        } else {
            $input.html('');
        }

        handleInputAutoExpand();
        modalTagPerson.setSelectedTagList([]);
    };

    const onErrFetch = (err) => {
        // console.log(err);
        if (err === 19940402) {
            setTimeout(() => postMessage(messagesWaitProcessingArr[0]), 3000)
            count = 0;
        }
    };

    // Fixing repeating messages
    let awaitProcessClone = [];
    let count = 0;

    const postMessage = (data) => {
        if (data.isDelete) {
            API.delete(`chats/${data.chatId}/messages/${data.messageId}`).then(() => {
                messagesWaitProcessingArr.shift();
                if (messagesWaitProcessingArr.length) {
                    postMessage(messagesWaitProcessingArr[0]);
                }
            }).catch(onErrFetch);

            return;
        }

        if (data.messageId) {
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
        })

        // Fixing repeating messages
        if(count > 1){
            return
        }

        if(data.chatId) {
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
        let text = $input.get(0).innerText;
        let data = {};
        const tagList = $input.get(0).querySelectorAll('.tagged');
        const userIdTagList = [];

        if (modalTagPerson.getPossibleEnter()) return;

        tagList.forEach(item => {
            text = text.replace(`@${item.innerText}`, `@[user:${item.getAttribute('userid')}, ${item.innerText}]`)
            userIdTagList.push(item.getAttribute('userid'));
        })

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
                quotedMessageId: commentState.chatId,
                taggedUsers: userIdTagList
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

    const fakePlacehoder = () => {
        const element = $(this);        
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
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

            $input.off('keydown').keydown(onKeyDown);
            $input.off('paste').bind('paste', onPaste);
            $btnSend.off().click(onSendMessage);
            $btnCloseCommentBox.off().click(onHideCommentBox);

            $input.off('focusout').focusout(fakePlacehoder);

            modalTagPerson.onInit();

            $input.off('keyup').keyup(modalTagPerson.onRenderTagModal);
        },

        onUpdate: (id, value) => {
            const text = htmlDecode(stripTags(value.replace(/<br>/g, '\n')));
            $input.get(0).innerText = text;
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
                userId: object.userId,
                origin_sequence: object.sequence
            };
           
            $input.focus();
            $commentWrapper.show();
            $commentBox.html(`<b>${object.name}</b>: <span class="span-mess-cmt span-mess-cmt-ids">${object.hasFile ? object.mess : transformLinkTextToHTML(commentState.mess)}</span>`);
        },

        onAddEmoji: (emoji) => {
            $input.html($input.text() + emoji);
            $input.focus();
            handleInputAutoExpand();
        },

        onClear,

        onHandleDraft: (currentId) => {
            const value = $input.text() || '';
            const roomDraft = GLOBAL.getRoomDraft();

            if (value) {
                $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${currentId}"] .preview`).addClass('draft').text(`[draft] ${value}`);
            }

            roomDraft[currentId] = value;
            GLOBAL.setRoomDraft(roomDraft);

            // Remove tag model
            modalTagPerson.closeTagModalAndReset();
        }
    };
});
