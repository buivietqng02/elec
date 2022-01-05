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
    'features/chatbox/messageSettingsSlide',
    'features/sidebar/sidebarConference',
    'features/sidebar/sidebarLeftBar'

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
    messageSettingsSlideComp,
    sidebarConferenceComp,
    sidebarLeftBarComp
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
    let $scrollToMess;
    let $messageList;
    let $wrapper;
    let $loadingOfNew;
    let $unreadScroll;

    let jumpFastToBottomBtn;

    // ========== Start Voice message ==============

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

                    // console.log(audio.getAttribute('duration'))
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
        playPauseBtn.forEach(item => {
            item.setAttribute("isPlaying", false);

            item.addEventListener('click', (e) => {
                addEventListenerToAudioRecorder(getAudioID(item.id));

            })
        })
    }

    // ============== End voice message ==============

    // ======== Start Scroll to origin position ===========
    const findOriginMess = (id) => {
        $wrapper.animate({ scrollTop: 0 }, 600);
        onGetMoreMessageByScrolling().then(result => {

            if (result.loadedResult.some((item, index) => {
                return item.id.messageId === id
            })) {
                let originMessageEle = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${id}"]`);
                originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
                originMessageEle.classList.add('activeScrollTo');
                setTimeout(() => {
                    originMessageEle.classList.add('activeScrollTo');
                    originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }, 2000)

                setTimeout(() => {
                    originMessageEle.classList.remove('activeScrollTo');
                }, 5000)

            } else {
                findOriginMess(id)
            }
        }).catch((e) => {
            console.log(e);
            findOriginMess(id)
        })
    }

    const handleScrollToOriginId = (element) => {
        const quotedOriginalMess = element.getAttribute('quoted-original-id');
        let originId = quotedOriginalMess.split('-')
        let originMessageEle = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${originId[1]}"]`);

        if (originMessageEle) {
            originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
            originMessageEle.classList.add('activeScrollTo');

            setTimeout(() => {
                originMessageEle.classList.remove('activeScrollTo');
            }, 3000)


        } else {
            findOriginMess(originId[1]);
        }
    }

    const addEventToAllScrollToOriginl = () => {
        let quotedMessage = document.querySelectorAll('.comment-box-inline');
        quotedMessage.forEach(item => {
            item.addEventListener('click', (e) => {
                handleScrollToOriginId(item);
            })
        })
    }

    // render file for quotedMessage
    // const getFileForQuoteMessage = (messagesArray) => {
    //     let newArray = messagesArray.map((item, index) => {
    //         if (item.quotedMessage) {
    //             messagesArray.map(ite => {
    //                 if (item.quotedMessage.id.messageId === ite.id.messageId) {
    //                     return item.quotedMessage.file = ite.file
    //                 }

    //             })

    //         }
    //         return item;
    //     })
    //     return newArray;
    // }
    // ======== End Scroll to origin position ===========

    // ======== Handle View Media and Files scroll to origin message ===========
    let numberOfOffset = 0;
    let isFindingMediaFiles = false;;
    let isProcessScrollDown = false;;
    let isTouchLastMessBottom = false;;
    let lastOffsetScrollDown = 0;;
    let ultiLastOffSet = 0;

    const resetAfterSearchMediaAndFiles = () => {
        numberOfOffset = 0;
        isFindingMediaFiles = false;
        isProcessScrollDown = false;
        isTouchLastMessBottom = false;
        lastOffsetScrollDown = 0;
    }

    // Call API to get newer messages when scroll to bottom
    const getMoreMessScrollDownAPI = async () => {
        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: parseInt(lastOffsetScrollDown) + 21,
        };
        
        const res = await API.get('messages', params);
        lastOffsetScrollDown = res?.messages[0]?.sequence;
        // console.log(`last offset scroll down ${lastOffsetScrollDown}`)
        return res;
    }

    const hideJumptoBottomBtn = () => {
        jumpFastToBottomBtn.classList.add('hidden');
        jumpFastToBottomBtn.removeEventListener('click', jumpToBottom)
    }

    const handleLoadNewMessOnScrollDown = () => {

        if( $wrapper.scrollTop() + $wrapper.height() >= $wrapper[0].scrollHeight - 1 && !isProcessScrollDown && !isTouchLastMessBottom){    
            isProcessScrollDown = true;

            getMoreMessScrollDownAPI().then(res => {
                isProcessScrollDown = false;

                let messagesHtml = '';
                let moreMessages = [];
                let returnedMessages = res?.messages;

                // In case scroll down and last messages are less than 20 messages
                if(numberOfOffset > 0 && numberOfOffset < 20){
                    returnedMessages = res?.messages.slice(0, numberOfOffset)
                }

                // Render message and append to chat list
                moreMessages = moreMessages.concat(returnedMessages || []).reverse();
                // console.log(moreMessages)
                messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join(''); 
                $messageList.append(messagesHtml);

                // Add eventlistner of each messages (audio, conference, scroll to origin) to each scroll down more message
                addEvtListenToMessOnScroll(moreMessages)

                // If touch last message at bottom, stop call API, remove eventListner
                if (lastOffsetScrollDown >= ultiLastOffSet) {
                    isTouchLastMessBottom = true;
                   
                    // resetAfterSearchMediaAndFiles();
                    document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown);

                    hideJumptoBottomBtn()

                } else {

                    // Not not touch last message yet but within last 20 messages
                    if (lastOffsetScrollDown + 21 > ultiLastOffSet) {
                        numberOfOffset = ultiLastOffSet - lastOffsetScrollDown
                    }
                }
                
            })
        }  
    }

    const getOffsetListMessages = (roomInfo, offset, messageId) => {
        const params = {
            chatId: roomInfo.id,
            offset: offset
        };
        
        API.get('messages', params).then(res => {
            // Handle when user switch room but the request has not finished yet
            if (roomInfo.id !== GLOBAL.getCurrentRoomId()) {
                return;
            }

            let messages = (res?.messages || []).reverse();
            handleDataFromGetMess(messages, roomInfo);
            
            lastOffsetScrollDown = messages[messages.length - 1].sequence;

            $loadingOfNew.hide();

            const originMessageEle = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${messageId}"]`);

            originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
            originMessageEle.classList.add('activeScrollTo');

            setTimeout(() => {
                originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 2000)

            setTimeout(() => {
                originMessageEle.classList.remove('activeScrollTo');
            }, 5000);

            setTimeout(() => {
                document.querySelector('.js_con_list_mess').addEventListener('scroll',handleLoadNewMessOnScrollDown)

                isFindingMediaFiles = false;
            },200)
            
        }).catch(err => {
            if (err.response?.status == 404) {
                onHandleRoomWasDeleted();
                return;
            }
            if (err === 19940402) {
                onErrNetWork(err);
            }
        });
    }

    let currentViewMediaFilesRoomInfo;

    const jumpToBottom = () => {
        isFindingMediaFiles = true;
        document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown);

        $messageList.children().css('display', 'none');

        loadMessages(currentViewMediaFilesRoomInfo)

        hideJumptoBottomBtn();

        // After click "Jump to bottom" button, allow to scroll top to get messages again
        setTimeout(() => {
            isFindingMediaFiles = false;
        }, 200)
    }

    const handleViewMediaAndFiles = (offset, roomInfo, messageId) => {
        $loadingOfNew.show();

        currentViewMediaFilesRoomInfo = {...roomInfo};
        resetAfterSearchMediaAndFiles();

        document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown)

        isFindingMediaFiles = true;
       
        $messageList.children().css('display', 'none');
        
        jumpFastToBottomBtn.classList.remove('hidden')

        getOffsetListMessages(roomInfo, parseInt(offset) + 10, messageId);

        jumpFastToBottomBtn.addEventListener('click', jumpToBottom)
    };
    // ======== End Handle View Media and Files scroll to origin message ===========

    // Conference Call
    const addEventListenerToMeetingLink = () => {
        let joinConferenceBtn = document.querySelectorAll('.messages__item .is_conference')

        joinConferenceBtn.forEach(item => {
            item.querySelector('button').addEventListener('click', () => {
                let confRoomID = item.getAttribute('confId');
                console.log(confRoomID);

                sidebarLeftBarComp.onSwitchToConference();
                sidebarConferenceComp.onInitConferencePage(confRoomID);
            });
        })
    }

    const onWrapperScroll = (event) => {
        // If is finding media and files
        if(isFindingMediaFiles) return

        // Show scroll to bottom button
        if (($wrapper.scrollTop() + $wrapper.height()) / $wrapper[0].scrollHeight < 1) {
            $btnScrollToBottom.show();
        } else {
            unreadScrollNum = 0;
            $unreadScroll.text(0);
            $unreadScroll.hide();
            $btnScrollToBottom.hide();

            $btnScrollToBottom.addClass('round');
            $btnScrollToBottom.removeClass('square');
            $scrollToMess.hide();
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
    
    const addEvtListenToMessOnScroll = (moreMessages) => {
        // Audio vocie mess addeventlistener when scroll top
        moreMessages.filter(m => m.file?.id === 3).forEach(message => {
            let scrollUpAudioRecorder = document.querySelector(`#btn-${message.file.id}`);
            scrollUpAudioRecorder.setAttribute("isPlaying", false);
            scrollUpAudioRecorder.addEventListener('click', () => {
                addEventListenerToAudioRecorder(message.file.id)
            })
        });

        // Add event listener to Scroll to origin message when scroll more
        moreMessages.forEach(item => {
            const messageItem = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${item.id.messageId}"]`)
            const quotedMessageItem = messageItem.querySelector('.comment-box-inline');
            if (quotedMessageItem) {
                quotedMessageItem.addEventListener('click', () => {
                    handleScrollToOriginId(quotedMessageItem);
                })
            }
        })

        // Add event listener for conference call
        addEventListenerToMeetingLink();
    }

    const onGetMoreMessageByScrolling = async () => {
        let isLoadedMoreResult = { isLoadedMore: false, loadedResult: [] };

        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: lastOffset
        };
        processing = true;

        isLoadedMoreResult = await API.get('messages', params).then(res => {
            if (params.offset !== lastOffset || params.chatId !== GLOBAL.getCurrentRoomId()) {
                processing = false;
                return;
            }

            const wrapperHtml = $wrapper.get(0);
            const pos = wrapperHtml.scrollHeight + $wrapper.scrollTop();
            let messagesHtml = '';
            let moreMessages = [];

            if (res?.messages?.length < 20) {
                isTouchLastMess = true;
            }

            moreMessages = moreMessages.concat(res?.messages || []).reverse();

            // Render quotedMessage for files and images
            // getFileForQuoteMessage(moreMessages)

            // console.log(moreMessages)

            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join('');
            lastOffset = moreMessages[0]?.sequence;

            // console.log(lastOffset);

            if(jumpFastToBottomBtn.classList.contains('hidden')) {
                storeRoomById(params.chatId, [...moreMessages, ...getRoomById(params.chatId)]);
            }
          
            $messageList.prepend(messagesHtml);
            $wrapper.scrollTop(wrapperHtml.scrollHeight - pos);

            // Add event listener to messages when scroll more
            addEvtListenToMessOnScroll(moreMessages)

            setTimeout(() => {
                processing = false;
            }, 50);

            return { isLoadedMore: true, loadedResult: [...moreMessages] };
        });

        return isLoadedMoreResult;
    };

    // Remove dupplicated messages with same messageId
    const removeRepeatedMess = (messages) => {
        let cloneArray = [];
        let processArray = [];
        if(messages.length > 0) {
            processArray = [...messages]
            const indexAfterRemoveDup = [];
            const toFindDuplicates = (cloneArray) => {
                let newArray = cloneArray.map(ite => ite?.id?.messageId);
                // console.log(newArray)
                return newArray.filter((item, index) => {
                    if(newArray.indexOf(item) === index) {
                        indexAfterRemoveDup.push(index)
                        return true;
                    } 
                })
            }
    
            toFindDuplicates(processArray);
            // console.log(`Message ID after remove dupplicate: ${indexAfterRemoveDup}`);
            
            indexAfterRemoveDup.forEach(item => {
                cloneArray.push(processArray[item])
            })
        }

        return cloneArray;
    }

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

        // Remove dupplidate messageID in Array when bad connection
        // console.log(messages)
        const cloneArray = removeRepeatedMess(messages);
       
        // Update ultiLastOffSet whenever reload loadMessages function
        // console.log(cloneArray);

        if(cloneArray.length > 0){
            //  console.log(`Before set ultiOffset: ${ultiLastOffSet}`)
            //  get last sequence number (Receive new messages or send new message --> sequence is null, therefore have to use below method to get sequence)
             let nullIndex = 0;
 
             const checkNullSequence = (element, index) => {
                 if (element.sequence === null || element.sequence === undefined) {
                     nullIndex = index;
                     return true
                 }
             }
             const isNullSequence = cloneArray.some(checkNullSequence); 

             if(isNullSequence) {
                // console.log(nullIndex)
                // In case newly created group
                if(nullIndex === 0){
                    ultiLastOffSet = cloneArray.length;
                } else {
                    ultiLastOffSet = cloneArray[nullIndex - 1].sequence + (cloneArray.length - nullIndex)
                }
                
             } else {
                 if(ultiLastOffSet < cloneArray[cloneArray.length - 1].sequence) ultiLastOffSet = cloneArray[cloneArray.length - 1].sequence
             }
 
            //  console.log(`After set ultiOffset: ${ultiLastOffSet}`)
         }

        messages = [...cloneArray]

        // Update file property for quotedMessage
        // getFileForQuoteMessage(messages);

        // console.log(messages);

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

        if(jumpFastToBottomBtn.classList.contains('hidden')){
            $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
        }

        // Audio
        audioPlayStopFunc()

        // Scroll to orginal message
        addEventToAllScrollToOriginl();

        $loadingOfNew.hide();

        // Add event listener for conference call
        addEventListenerToMeetingLink();

        setTimeout(() => {
            updateRoomInfo(roomInfo);
            processing = false;
        }, timeWait);

    };

    const onGetMessage = (roomInfo, positionRoom) => API.get('messages', { chatId: roomInfo.id, offset: 0 }).then(res => {
        // Handle when user switch room but the request has not finished yet
        let messages;
     
        if (roomInfo.id !== GLOBAL.getCurrentRoomId() && !roomInfo.isUpdateOrRemoveMessBeforeGetRoomById) {
            return;
        }

        messages = (res?.messages || []).reverse();

        // Update time activity to top bar
        if(!roomInfo.isUpdateOrRemoveMessBeforeGetRoomById) {
            chatboxTopbarComp.onRenderTimeActivity(res?.partnerLastTimeActivity);

            handleDataFromGetMess(messages, roomInfo);
        }

         // Assign message to store
         setChatsById(roomInfo.id, messages);
         storeRoomById(roomInfo.id, messages);

        return messages;
        
    }).catch(err => {
        if (err.response?.status == 404) {
            onHandleRoomWasDeleted();
            return;
        }
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

        if(jumpFastToBottomBtn.classList.contains('hidden')){
            ultiLastOffSet = 0;
        }
    };

    const loadMessages = async (roomInfo) => {
        onRefresh();

        let messagesListLoadFirstTime;
        if (getRoomById(roomInfo.id) && isInit) {
            onGetMessageFromCache(roomInfo);

            // update chat last read time
            API.post(`chats/${roomInfo.id}/read`).then(() => { })
                .catch(err => console.error(err));

            return;
        }

        if (GLOBAL.getNetworkStatus()) {
            isInit = true;

            messagesListLoadFirstTime = await onGetMessage(roomInfo);

            return messagesListLoadFirstTime;
           
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
    }

    return {
        onInit: () => {
            lastOffset = 0;
            unreadScrollNum = 0;
            processing = false;
            isTouchLastMess = false;
            isSearchMode = false;
            isInit = false;

            $btnScrollToBottom = $('.scroll-to__bottom');
            $scrollToMess = $('.scroll-to__message');
            $messageList = $('.messages__list');
            $wrapper = $('.js_con_list_mess');
            $loadingOfNew = $('.--load-mess');
            $unreadScroll = $('.unread-message-scroll');

            jumpFastToBottomBtn = document.querySelector('.jump-to-bottom');
            $unreadScroll.hide();
            messageSettingsSlideComp.onInit();
            $wrapper.off('scroll').scroll(onWrapperScroll);
            $btnScrollToBottom.off('click').click(onScrollToBottom);
            $(document).off('.btnMessageSettings').on('click.btnMessageSettings', '.btn-message-settings', (e) => messageSettingsSlideComp.onShow(e));
        },

        onLoadMessage: async (roomInfo) => loadMessages(roomInfo),

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
                (($wrapper.scrollTop() + $wrapper.height()) / $wrapper[0].scrollHeight) < 1 &&
                GLOBAL.getInfomation().id !== mess.sender.id &&
                !isSearchMode
            ) {
                unreadScrollNum += 1;
                $unreadScroll.text(unreadScrollNum);
                $unreadScroll.show();

                $btnScrollToBottom.removeClass('round');
                $btnScrollToBottom.addClass('square');
                $scrollToMess.show();
            }

            // Render new quotedMessage
            // if (mess.quotedMessage) {
            //     messages.some(item => {
            //         if (mess.quotedMessage.id.messageId === item.id.messageId) {
            //             mess.quotedMessage.file = item.file
            //             return true;
            //         }
            //     })
            // }

            if (!isSearchMode) {
                const wrapperHtml = $wrapper.get(0);
                const isBottom = wrapperHtml.scrollHeight - wrapperHtml.scrollTop <= wrapperHtml.clientHeight;
                const messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);

                // console.log(messagesHtml)
                // console.log(mess)
                // Render new message
                $messageList.append(messagesHtml);

                // Audio when send new voice mess
                if (mess.file?.id) {
                    const newAudioRecorder = document.querySelector(`#btn-${mess.file.id}`);
                    if (newAudioRecorder) {
                        // Scroll to bottom when new voice message sent
                        onScrollToBottom()

                        newAudioRecorder.setAttribute("isPlaying", false);
                        newAudioRecorder.addEventListener('click', () => {
                            // console.log('click');
                            addEventListenerToAudioRecorder(mess.file.id);
                        })
                        // addEventListenerToAudioRecorder(mess.file.id);
                    }
                }

                // Scroll to origin message
                const $messItem = $(`[${ATTRIBUTE_MESSAGE_ID}="${mess.id.messageId}"]`);
                $messItem.find('.comment-box-inline').on('click', (e) => {
                    // let originId = e.currentTarget.getAttribute('quoted-original-id').split('-')
                    handleScrollToOriginId(e.currentTarget);
                })

                // Add event listener for conference call
                addEventListenerToMeetingLink();

                // Check if chatbox scrolled to the bottom
                if (isBottom) {
                    $wrapper.scrollTop(wrapperHtml.scrollHeight);
                    $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
                }
            }

             // Update ultiLastOffSet when receive new message
            if(GLOBAL.getInfomation().id !== mess.sender.id &&
            !isSearchMode) {
                if(mess.id.messageId) ultiLastOffSet++;
                // console.log(ultiLastOffSet)
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
            $message.find('.conference-link').hide();
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
            // console.log(data)
            // Update ultiLastOffSet when send new mess
            ultiLastOffSet++;
            // console.log(ultiLastOffSet)

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

            $mess.find('.comment-box-inline').on('click', (e) => {
                // let originId = e.currentTarget.getAttribute('quoted-original-id').split('-')
                // console.log(originId[1]);
                handleScrollToOriginId(e.currentTarget);
            })

            // Add event listener for conference call
            addEventListenerToMeetingLink();

            // Fix repeating messages
            const messagesList = document.querySelector('.messages__list')
            const arryMessages = messagesList.querySelectorAll('.messages__item');
            const indexArr = [];
            const toFindDuplicates = (arryParam) => {
                let newArray = Array.from(arryParam).map(ite => ite.getAttribute('data-chat-id'));
                return newArray.filter((item, index) => {
                    if(newArray.indexOf(item) !== index) {
                        indexArr.push(index)
                        return true;
                    }
                      
                })
            }
            toFindDuplicates(arryMessages);

            if(indexArr.length){
                indexArr.map(item => {
                    // console.log(arryMessages[item]);
                    messagesList.removeChild(arryMessages[item])
                })
            }
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
            // console.log(data, messages)

            if (data.params.quotedMessageId) {
                const quotedObject = messages.find(item => item.id.messageId === data.params.quotedMessageId);
                if (quotedObject && quotedObject?.id) {
                    mess.quotedMessage = quotedObject;
                }
            }

            if (messages?.length) {
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

        onHandleViewMediaAndFiles: (offset, roomInfo, messageId) => handleViewMediaAndFiles(offset, roomInfo, messageId),

        onSwitchRoomWhileShowMessMediaAndFiles: () => {
            document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown)
           
            hideJumptoBottomBtn()
        }
    };
});
