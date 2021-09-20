define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions',
    'shared/offlineData',
    'features/chatbox/chatboxContentChatList',
    'features/chatbox/chatboxContentFunctions',
    'features/chatbox/chatboxContentTemplate',
    'features/chatbox/chatboxTopbar',
    'features/chatbox/messageSettingsSlide'
], (
    constant,
    API,
    GLOBAL,
    functions,
    offlineData,
    chatboxContentChatListComp,
    contentFunc,
    template,
    chatboxTopbarComp,
    messageSettingsSlideComp
) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const IMAGE_CLASS = '.--click-show-popup-up-img';

    const {
        ATTRIBUTE_SIDEBAR_ROOM,
        ATTRIBUTE_MESSAGE_ID
    } = constant;
    const {
        transformLinkTextToHTML,
        highlightText,
        htmlEncode,
        decodeStringBase64
    } = functions;
    const {
        getChatById,
        setChatsById
    } = offlineData;
    const {
        renderMessage,
        renderUnread,
        renderRangeDate,
        onErrNetWork,
        onHandleRoomWasDeleted
    } = contentFunc;
    const {
        getRoomById,
        storeRoomById
    } = chatboxContentChatListComp;
    let lastOffset = 0;
    let unreadScrollNum = 0;
    let processing = false;
    let isTouchLastMess = false;
    let isSearchMode = false;
    let isInit = false;
    let $btnScrollToBottom;
    let $messageList;
    let $wrapper;
    let $loadingOfNew;
    let $unreadScroll;

    // ========== Audio test ==============

    const timeConvert = (time) => {
        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(time / 60);
        let currentSeconds = Math.floor(time - currentMinutes * 60);

        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }

        return `${currentMinutes}:${currentSeconds}`
    }

    const getAudioID = (string) => {
        if (string.includes("audio-")) {
            return string.substring(6, string.length)
        }

        if (string.includes("btn-")) {
            return string.substring(4, string.length)
        }
    }

    const addEventListenerToAudioRecorder = (id) => {
        const audio = document.querySelector(`#audio-${id}`);
        const playStopBtn = document.querySelector(`#btn-${id}`);
        console.log(audio)
        console.log(playStopBtn)

        let countDownTimmer;
        let audioMicroPic = document.querySelector(`#btn-${id} .audio-microPic`);
        let isPlaying = playStopBtn.getAttribute('isPlaying');
        let audioTime = document.querySelector(`#btn-${id} .audio-timeIndicate`);
        let audioBar = document.querySelectorAll(`#btn-${id} .audio-bar`);


        let audioProgress = document.querySelectorAll(`#btn-${id} .audio-progress`);

        if (!audioProgress || audioProgress.length === 0) {
            audioBar[0].innerHTML = `<div class="audio-progress"></div>`;
            audioBar[1].innerHTML = `<div class="audio-progress"></div>`;

            audioProgress = document.querySelectorAll(`#btn-${id} .audio-progress`);
        }

        let durationAudio = parseFloat(audio.getAttribute('duration'));

        if (isPlaying === 'true') {
            playStopBtn.setAttribute("isPlaying", false);
            audio.pause()
            audioMicroPic.src = `/assets/images/microphone.svg`
            clearInterval(countDownTimmer)

            audioProgress[0].style.animationPlayState = "paused";
            audioProgress[1].style.animationPlayState = "paused";

        }

        if (isPlaying === 'false') {
            let playPromise = audio.play()
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioMicroPic.src = `/assets/images/microphoneListening.svg`

                    console.log(audio.getAttribute('duration'))
                    countDownTimmer = setInterval(() => {
                        audioTime.textContent = timeConvert(durationAudio - audio.currentTime)
                    }, 1000)

                    audioProgress[0].style.animationName = "left";
                    audioProgress[1].style.animationName = "right";

                    audioProgress[0].style.animationPlayState = "running";
                    audioProgress[1].style.animationPlayState = "running";

                    audioProgress[0].style.animationDuration = `${durationAudio / 2}s`;
                    audioProgress[1].style.animationDuration = `${durationAudio / 2}s`;
                    audioProgress[1].style.animationDelay = `${durationAudio / 2}s`;

                    playStopBtn.setAttribute("isPlaying", true)
                })
                    .catch(error => {
                        console.log(error)
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }

        audio.addEventListener('ended', () => {
            audioMicroPic.src = `/assets/images/microphone.svg`;
            playStopBtn.setAttribute("isPlaying", false)
            clearInterval(countDownTimmer)

            audioTime.textContent = timeConvert(durationAudio)

            audioBar[0].innerHTML = ``;
            audioBar[1].innerHTML = ``;
        })

    }

    const audioPlayStopFunc = () => {
        let playPauseBtn = document.querySelectorAll('.audio-playStop');
        let audioRecorder = document.querySelectorAll('.audio-recorder');

        playPauseBtn.forEach(item => {
            item.setAttribute("isPlaying", false);

            item.addEventListener('click', (e) => {
                console.log('click test', item)

                audioRecorder.forEach(audioRecorderItem => {
                    if (getAudioID(item.id) === getAudioID(audioRecorderItem.id)) {

                        addEventListenerToAudioRecorder(getAudioID(item.id));

                        // let countDownTimmer;
                        // let audioMicroPic = document.querySelector(`#${item.id} .audio-microPic`);
                        // let isPlaying = e.target.getAttribute('isPlaying');
                        // let audioTime = document.querySelector(`#${e.target.id} .audio-timeIndicate`);
                        // let audioBar = document.querySelectorAll(`#${e.target.id} .audio-bar`);


                        // let audioProgress = document.querySelectorAll(`#${e.target.id} .audio-progress`);

                        // if (!audioProgress || audioProgress.length === 0) {
                        //     audioBar[0].innerHTML = `<div class="audio-progress"></div>`;
                        //     audioBar[1].innerHTML = `<div class="audio-progress"></div>`;

                        //     audioProgress = document.querySelectorAll(`#${e.target.id} .audio-progress`);
                        // }

                        // let durationAudio = parseFloat(audioRecorderItem.getAttribute('duration'));

                        // if (isPlaying === 'true') {
                        //     e.target.setAttribute("isPlaying", false);
                        //     audioRecorderItem.pause()
                        //     audioMicroPic.src = `/assets/images/microphone.svg`
                        //     clearInterval(countDownTimmer)

                        //     audioProgress[0].style.animationPlayState = "paused";
                        //     audioProgress[1].style.animationPlayState = "paused";

                        // }

                        // if (isPlaying === 'false') {
                        //     let playPromise = audioRecorderItem.play()
                        //     if (playPromise !== undefined) {
                        //         playPromise.then(() => {
                        //             audioMicroPic.src = `/assets/images/microphoneListening.svg`

                        //             console.log(audioRecorderItem.getAttribute('duration'))
                        //             countDownTimmer = setInterval(() => {
                        //                 audioTime.textContent = timeConvert(durationAudio - audioRecorderItem.currentTime)
                        //             }, 1000)

                        //             audioProgress[0].style.animationName = "left";
                        //             audioProgress[1].style.animationName = "right";

                        //             audioProgress[0].style.animationPlayState = "running";
                        //             audioProgress[1].style.animationPlayState = "running";

                        //             audioProgress[0].style.animationDuration = `${durationAudio / 2}s`;
                        //             audioProgress[1].style.animationDuration = `${durationAudio / 2}s`;
                        //             audioProgress[1].style.animationDelay = `${durationAudio / 2}s`;

                        //             e.target.setAttribute("isPlaying", true)
                        //         })
                        //             .catch(error => {
                        //                 console.log(error)
                        //                 // Auto-play was prevented
                        //                 // Show paused UI.
                        //             });
                        //     }
                        // }

                        // audioRecorderItem.addEventListener('ended', () => {
                        //     audioMicroPic.src = `/assets/images/microphone.svg`;
                        //     e.target.setAttribute("isPlaying", false)
                        //     clearInterval(countDownTimmer)

                        //     audioTime.textContent = timeConvert(durationAudio)

                        //     audioBar[0].innerHTML = ``;
                        //     audioBar[1].innerHTML = ``;
                        // })
                    }
                })
            })
        })
    }

    // ============== Audio test ==============

    const onWrapperScroll = (event) => {
        // Show scroll to bottom button
        if ($wrapper.scrollTop() + $wrapper.height() < $wrapper[0].scrollHeight - 400) {
            $btnScrollToBottom.show();
        } else {
            unreadScrollNum = 0;
            $unreadScroll.text(0);
            $unreadScroll.hide();
            $btnScrollToBottom.hide();
        }

        // condition 1: When the request is being processed, this action will skip, prevent user spam
        // condition 2: If message number gets from API have length small than 20, this action will skip
        // condition 3: When scroll to near bottom, get more messages
        const isToPosition = isMobile ? $wrapper.scrollTop() > 1 : $wrapper.scrollTop() > 700
        if (processing || isTouchLastMess || isToPosition || isSearchMode) {
            return;
        }

        onGetMoreMessageByScrolling();
    };

    const onLoadImage = () => {
        const wrapperHtml = $wrapper.get(0);
        $wrapper.scrollTop(wrapperHtml.scrollHeight);
    };

    const onScrollToBottom = () => {
        $wrapper.animate({ scrollTop: $wrapper[0].scrollHeight }, 200);
    };

    const updateRoomInfo = (roomInfo) => {
        // Mark unread of active room to zero
        if (roomInfo.unreadMessages !== 0) {
            const rooms = GLOBAL.getRooms();
            const positionRoom = rooms.findIndex(room => room.id === roomInfo.id);
            $(`[${ATTRIBUTE_SIDEBAR_ROOM} = "${roomInfo.id}"]`).find('.badge').html('');

            if (positionRoom !== -1) {
                roomInfo.unreadMessages = 0;
                rooms[positionRoom] = roomInfo;
                GLOBAL.setRooms(rooms);
            }
        }
    };

    const handleScrollToUnreadMessage = (idMess) => {
        const $messageUnread = $(`[${ATTRIBUTE_MESSAGE_ID} = "${idMess}"]`);

        if (!$messageUnread.length) {
            return;
        }

        const topPos = $messageUnread.offset().top;
        const topParent = $wrapper.offset().top;
        const posScrollParent = $wrapper.scrollTop();

        $wrapper.scrollTop((topPos + posScrollParent) - (topParent + 200));
    };

    const onGetMoreMessageByScrolling = () => {
        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: lastOffset
        };
        processing = true;

        API.get('messages', params).then(res => {
            if (params.offset !== lastOffset || params.chatId !== GLOBAL.getCurrentRoomId() || res.status !== 0) {
                processing = false;
                return;
            }

            const wrapperHtml = $wrapper.get(0);
            const pos = wrapperHtml.scrollHeight + $wrapper.scrollTop();
            let messagesHtml = '';
            let moreMessages = [];

            if (res?.data?.messages?.length < 20) {
                isTouchLastMess = true;
            }

            moreMessages = moreMessages.concat(res?.data?.messages || []).reverse();
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join('');
            lastOffset = moreMessages[0]?.sequence;
            storeRoomById(params.chatId, [...moreMessages, ...getRoomById(params.chatId)]);
            $messageList.prepend(messagesHtml);
            $wrapper.scrollTop(wrapperHtml.scrollHeight - pos);

            setTimeout(() => {
                processing = false;
            }, 50);
        });
    };

    const handleDataFromGetMess = (messages, roomInfo) => {
        let messagesHtml = '';
        let isShowUnread = roomInfo.unreadMessages > 0 && roomInfo.unreadMessages < 16;
        let idUnread = null;
        const timeWait = isMobile ? 300 : 50;

        // Mark when got all messages in this chat room
        if (messages.length < 20) {
            isTouchLastMess = true;
        }

        // Mark unread message position
        if (isShowUnread && messages.length) {
            const index = messages.length - roomInfo.unreadMessages;

            if (messages[index]) {
                messages[index].posUnread = true;
                idUnread = messages[index].id.messageId;
            } else {
                isShowUnread = false;
            }
        }

        lastOffset = messages[0]?.sequence;
        messagesHtml = messages.map((mess, i, messArr) => (
            renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))
        ).join('');
        $messageList.html(messagesHtml);

        // Handle scroll if message list have an unread message
        if (isShowUnread) {
            handleScrollToUnreadMessage(idUnread);
        } else {
            $wrapper.scrollTop($wrapper[0].scrollHeight);
        }

        $messageList.find(IMAGE_CLASS).on('load', onLoadImage);

        // Audio
        audioPlayStopFunc()

        $loadingOfNew.hide();

        setTimeout(() => {
            updateRoomInfo(roomInfo);
            processing = false;
        }, timeWait);
    };

    const onGetMessage = (roomInfo, positionRoom) => API.get('messages', { chatId: roomInfo.id, offset: 0 }).then(res => {
        // Handle when user switch room but the request has not finished yet
        if (roomInfo.id !== GLOBAL.getCurrentRoomId()) {
            return;
        }

        if (res.status !== 0) {
            // Handle when room was deleted
            if (res.status === 2) {
                onHandleRoomWasDeleted();
            }

            return;
        }

        // Update time activity to top bar
        chatboxTopbarComp.onRenderTimeActivity(res?.data?.partnerLastTimeActivity);

        let messages = (res?.data?.messages || []).reverse();

        // Assign message to store
        setChatsById(roomInfo.id, messages);
        storeRoomById(roomInfo.id, messages);

        handleDataFromGetMess(messages, roomInfo);
    }).catch(err => {
        if (err === 19940402) {
            onErrNetWork(err);
        }
    });

    const onGetMessageFromCache = (roomInfo, positionRoom) => {
        handleDataFromGetMess(getRoomById(roomInfo.id), roomInfo);
    };

    const onRefresh = () => {
        $loadingOfNew.show();
        $messageList.html('');
        $unreadScroll.text(0);
        $unreadScroll.hide();
        unreadScrollNum = 0;
        processing = true;
        isSearchMode = false;
        isTouchLastMess = false;
    };

    return {
        onInit: () => {
            lastOffset = 0;
            unreadScrollNum = 0;
            processing = false;
            isTouchLastMess = false;
            isSearchMode = false;
            isInit = false;
            $btnScrollToBottom = $('.scroll-to__bottom');
            $messageList = $('.messages__list');
            $wrapper = $('.js_con_list_mess');
            $loadingOfNew = $('.--load-mess');
            $unreadScroll = $('.unread-message-scroll');

            $unreadScroll.hide();
            messageSettingsSlideComp.onInit();
            $wrapper.off('scroll').scroll(onWrapperScroll);
            $btnScrollToBottom.off('click').click(onScrollToBottom);
            $(document).off('.btnMessageSettings').on('click.btnMessageSettings', '.btn-message-settings', (e) => messageSettingsSlideComp.onShow(e));
        },

        onLoadMessage: async (roomInfo) => {
            onRefresh();

            if (getRoomById(roomInfo.id) && isInit) {
                onGetMessageFromCache(roomInfo);

                // update chat last read time
                API.post(`chats/${roomInfo.id}/read`).then(() => { })
                    .catch(err => console.error(err));

                return;
            }

            if (GLOBAL.getNetworkStatus()) {
                isInit = true;
                onGetMessage(roomInfo);
            } else {
                const messagesChat = await getChatById(roomInfo.id);
                if (!messagesChat) {
                    onErrNetWork('');
                    return;
                }

                let messagesHtml = messagesChat.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))).join('');
                $messageList.html(messagesHtml);
                $loadingOfNew.hide();
                $(`[${ATTRIBUTE_SIDEBAR_ROOM} = "${roomInfo.id}"]`).find('.badge').html('');
                $wrapper.scrollTop($wrapper[0].scrollHeight);
            }
        },

        onSync: (messList = []) => {
            const mess = messList[0];
            let id = GLOBAL.getCurrentRoomId();
            // Prevent duplicate message
            if ($(`[${ATTRIBUTE_MESSAGE_ID} = "${mess?.id?.messageId}"]`).length) {
                return false;
            }

            let messages = getRoomById(id);
            // up unread message when scrollbar does not set at bottom 
            if (
                $wrapper.scrollTop() + $wrapper.height() < $wrapper[0].scrollHeight - 400 &&
                GLOBAL.getInfomation().id !== mess.sender.id &&
                !isSearchMode
            ) {
                unreadScrollNum += 1;
                $unreadScroll.text(unreadScrollNum);
                $unreadScroll.show();
            }

            if (!isSearchMode) {
                const wrapperHtml = $wrapper.get(0);
                const isBottom = wrapperHtml.scrollHeight - wrapperHtml.scrollTop <= wrapperHtml.clientHeight;
                const messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);

                // Render new message
                $messageList.append(messagesHtml);

                // Audio
                if (mess.file?.id) {
                    const newAudioRecorder = document.querySelector(`#btn-${mess.file.id}`);
                    if (newAudioRecorder) {
                        newAudioRecorder.setAttribute("isPlaying", false);
                        newAudioRecorder.addEventListener('click', () => {
                            console.log('click');
                            addEventListenerToAudioRecorder(mess.file.id);
                        })
                        // addEventListenerToAudioRecorder(mess.file.id);
                    }
                }

                // Check if chatbox scrolled to the bottom
                if (isBottom) {
                    $wrapper.scrollTop(wrapperHtml.scrollHeight);
                    $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
                }
            }
        },

        onSyncRemove: (message) => {
            const id = message.id.messageId;
            const $message = $(`[${ATTRIBUTE_MESSAGE_ID} = "${id}"]`);
            $message.find('.--mess').addClass('--message-removed').html(decodeStringBase64(message.message));
            $message.find('.--mess').removeClass('fwme');
            $message.find('.above-of-mess').removeClass('fwme');
            $message.find('.btn-message-settings').hide();
            $message.find('.--edited').addClass('hidden');
            $message.find('.--double-check').addClass('hidden');
        },

        onSyncUpdate: (message) => {
            const id = message.id.messageId;
            const $message = $(`[${ATTRIBUTE_MESSAGE_ID} = "${id}"]`);

            $message.find('.--mess').html(transformLinkTextToHTML(htmlEncode(decodeStringBase64(message.message))));
            $message.find('.--edited').removeClass('hidden');
        },

        onSearch: (searchMessageList, search) => {
            const messagesHtml = searchMessageList.map(mess => renderMessage(mess, search));
            isSearchMode = true;
            $messageList.html(messagesHtml);
            $wrapper.scrollTop($wrapper.get(0).scrollHeight);
            $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
        },

        onFinishPostMessage: (data) => {
            const $mess = $(`[data-id-local="${data.idLocal}"]`);
            const messages = getRoomById(data.chatId);

            storeRoomById(data.chatId, messages.map(mess => {
                if (data.idLocal === mess.idLocal) {
                    mess.idLocal = null;
                    mess.id = {
                        chatId: data.chatId,
                        messageId: data.messageId
                    }
                }

                return mess;
            }));

            if (!$mess.length) {
                return false;
            }

            $mess.attr(ATTRIBUTE_MESSAGE_ID, data.messageId);
            $mess.removeClass('js_li_mess_local');
        },

        onAddLocal: async (data) => {
            const rid = data.chatId;
            const info = GLOBAL.getInfomation();
            const wrapperHtml = $wrapper.get(0);
            let messages = getRoomById(rid);
            let messagesHtml = '';
            const mess = {
                deleted: false,
                forwarded: false,
                file: null,
                quotedMessage: null,
                idLocal: data.idLocal,
                type: 1,
                updated: false,
                internal: data.params.internal,
                message: data.params.message,
                msgDate: data.idLocal,
                sender: {
                    email: info.email,
                    id: info.id,
                    name: info.name
                }
            };

            if (!isInit) {
                messages = await getChatById(rid) || [];
            }

            if (data.params.quotedMessageId) {
                const quotedObject = messages.find(item => item.id.messageId === data.params.quotedMessageId);
                if (quotedObject && quotedObject?.id) {
                    mess.quotedMessage = quotedObject;
                }
            }

            if (messages.length) {
                messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);
            } else {
                messagesHtml = renderMessage(mess);
            }

            storeRoomById(rid, messages.concat(mess));

            if (!isSearchMode) {
                $messageList.append(messagesHtml);
                $wrapper.scrollTop(wrapperHtml.scrollHeight);
                $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
            }
        },
    };
});
