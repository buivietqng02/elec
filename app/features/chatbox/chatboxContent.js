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
    'features/chatbox/voiceChat',
    'features/sidebar/sidebarConference',
    'features/sidebar/sidebarLeftBar',
    'features/modal/modalPinMessage',
    'features/modal/modalTagPerson',
    'features/modal/modalMessageReaction',
    'features/modal/modalUserInfo',
    'features/modal/modalMarkdown'
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
    voiceChatComp,
    sidebarConferenceComp,
    sidebarLeftBarComp,
    modalPinMessage,
    modalTagPerson,
    modalMessageReaction,
    modalUserInfo,
    modalMarkdown
) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const IMAGE_CLASS = '.--click-show-popup-up-img';

    const {
        ATTRIBUTE_SIDEBAR_ROOM,
        ATTRIBUTE_MESSAGE_ID,
        PINNED_MESS_ID,
        COLOR_NAME_GROUP
    } = constant;
    const {
        htmlEncode,
        decodeStringBase64,
        getAvatar,
        downloadImage,
        downloadFile,
        markDown,
        markDownCodeBlock,
        getMobileOS
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
        onHandleRoomWasDeleted,
        renderTag
    } = contentFunc;
    const {
        getRoomById,
        storeRoomById,
        storePinnedMessRoomsById,
        getPinnedMessRoomsById
    } = chatboxContentChatListComp;
    let lastOffset = 0;
    let unreadScrollNum = 0;
    let processing = false;
    let isTouchLastMess = false;
    let isInit = false;
    let $btnScrollToBottom;
    let $scrollToMess;
    let $messageList;
    let $wrapper;
    let $loadingOfNew;
    let $unreadScroll;
    let jumpFastToBottomBtn;
    // ======== Handle scroll to origin message ===========
    let numberOfOffset = 0;
    let isScrollingToOriginMess = false;;
    let isProcessScrollDown = false;;
    let isTouchLastMessBottom = false;;
    let lastOffsetScrollDown = 0;;
    let ultiLastOffSet = 0;
    let currentViewOriginMessRoomInfo;
    let colorByUserid = {};
    let colorIndex = 0;
    let yourId;
    let isGroup;

    // ======== Handle scroll to origin message ===========

    const resetAfterShowOriginMessage = () => {
        numberOfOffset = 0;
        isScrollingToOriginMess = false;
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
        
        const res = await API.get(`chats/${params.chatId}/messages?offset=${params.offset}`);
        lastOffsetScrollDown = res?.messages[0]?.sequence;
        // console.log(`last offset scroll down ${lastOffsetScrollDown}`)
        return res;
    }

    const hideJumptoBottomBtn = () => {
        jumpFastToBottomBtn.classList.add('hidden');
        jumpFastToBottomBtn.removeEventListener('click', jumpToBottom)
    }

    const insertColorHeader = (currentSenderId, yourId, isGroup) => {
        let colorGroupUser;
        if (isGroup && yourId !== currentSenderId) {
            const colorUser = colorByUserid[currentSenderId];
            if (!colorUser) {
                if (colorIndex >= COLOR_NAME_GROUP.length - 1) {
                    colorIndex = 0;
                } else {
                    colorIndex++;
                }

                colorByUserid[currentSenderId] = COLOR_NAME_GROUP[colorIndex]?.name;
            }
            colorGroupUser = colorByUserid[currentSenderId];
        }

        return colorGroupUser;
    }

    const handleLoadNewMessOnScrollDown = () => {
        if( $wrapper.scrollTop() + $wrapper.height() >= $wrapper[0].scrollHeight - 1 && !isProcessScrollDown && !isTouchLastMessBottom){    
            isProcessScrollDown = true;
            
            getMoreMessScrollDownAPI().then(res => {
                let messagesHtml = '';
                let moreMessages = [];
                let returnedMessages = res?.messages;

                isProcessScrollDown = false;

                // In case scroll down and last messages are less than 20 messages
                if(numberOfOffset > 0 && numberOfOffset < 20){
                    returnedMessages = res?.messages.slice(0, numberOfOffset)
                }

                // Render message and append to chat list
                moreMessages = moreMessages.concat(returnedMessages || []).reverse();
                messagesHtml = moreMessages.map((mess, i, messArr) => {
                mess.currentSenderId = messArr[i].sender.id;
                mess.previousSenderId = messArr[i - 1]?.sender?.id;

                mess.colorGroupUser = insertColorHeader(mess.currentSenderId, yourId, isGroup);

                return (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))}).join(''); 
                $messageList.append(messagesHtml);

                // If touch last message at bottom, stop call API, remove eventListner
                if (lastOffsetScrollDown >= ultiLastOffSet) {
                    isTouchLastMessBottom = true;
                   
                    // resetAfterShowOriginMessage();
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

    const scrollToFunc = (originMessageEle) => {
        originMessageEle.classList.add('activeScrollTo');
        originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });

        setTimeout(() => {
            originMessageEle.classList.remove('activeScrollTo');
        }, 3000);
    };

    const getOffsetListMessages = (roomInfo, offset, messageId) => {
        const params = {
            chatId: roomInfo.id,
            offset: offset
        };
        
        API.get(`chats/${params.chatId}/messages?offset=${params.offset}`).then(res => {
            // Handle when user switch room but the request has not finished yet
            if (roomInfo.id !== GLOBAL.getCurrentRoomId()) {
                return;
            }

            let messages = (res?.messages || []).reverse();
            handleDataFromGetMess(messages, roomInfo);
            
            lastOffsetScrollDown = messages[messages.length - 1].sequence;

            $loadingOfNew.hide();

            const originMessageEle = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${messageId}"]`);

            // Scrolling to origin, wait until image finish loading 
            let imagesLoaded = 0;
            const totalImages = $messageList.find(IMAGE_CLASS).length;
            if (totalImages === 0) {
                scrollToFunc(originMessageEle);
            } else {
                setTimeout(() => scrollToFunc(originMessageEle), 1500);
                $messageList.find(IMAGE_CLASS).on('load', () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        scrollToFunc(originMessageEle);
                    }
                })
            }
            
            setTimeout(() => {
                document.querySelector('.js_con_list_mess').addEventListener('scroll',handleLoadNewMessOnScrollDown);
                isScrollingToOriginMess = false;
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

    const jumpToBottom = () => {
        isScrollingToOriginMess = true;
        document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown);

        $messageList.children().css('display', 'none');

        loadMessages(currentViewOriginMessRoomInfo)

        hideJumptoBottomBtn();

        // After click "Jump to bottom" button, allow to scroll top to get messages again
        setTimeout(() => {
            isScrollingToOriginMess = false;
        }, 200)
    }

    const handleShowOriginMessage = (offset, roomInfo, messageId) => {
        $loadingOfNew.show();

        currentViewOriginMessRoomInfo = {...roomInfo};
        resetAfterShowOriginMessage();

        document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown)

        isScrollingToOriginMess = true;
       
        $messageList.children().css('display', 'none');
        
        jumpFastToBottomBtn.classList.remove('hidden')

        getOffsetListMessages(roomInfo, parseInt(offset) + 10, messageId);

        jumpFastToBottomBtn.addEventListener('click', jumpToBottom)
    };

    const showExactOriginMessage = (id, sequence) => {
        const originMessageEle = document.querySelector(`[${ATTRIBUTE_MESSAGE_ID}="${id}"]`);
        if (originMessageEle) {
            scrollToFunc(originMessageEle);
        } else {
            let roomInfo = GLOBAL.getRooms().filter((room) => {
                if (String(room.id) === String(GLOBAL.getCurrentRoomId())) {
                    return true;
                }
    
                return false;
            })[0] || {};
            roomInfo = JSON.parse(JSON.stringify(roomInfo));

            handleShowOriginMessage(sequence, roomInfo, id);
        }
    };
    // ======== End Handle View Media and Files scroll to origin message ===========

     // ======== Start Scroll to origin position ===========
    const handleScrollToOriginId = (e) => {
        const originId = e.currentTarget.getAttribute('quoted-original-id').split('-')[1];
        const sequenceNum =  e.currentTarget.getAttribute('quoted-original-sequence');
        showExactOriginMessage(originId, sequenceNum)
    }
     // ======== End Scroll to origin position ===========

    // Conference Call
    const addEventListenerToMeetingLink = (e) => {
        let confRoomID = e.target.closest('.is_conference').getAttribute('confid'); 
        console.log(confRoomID);

        sidebarLeftBarComp.onSwitchToConference();
        sidebarConferenceComp.onInitConferencePage(confRoomID);
    }

    const onWrapperScroll = (event) => {
        // If is finding media and files or viewing label list
        if(isScrollingToOriginMess) return

        // Show scroll to bottom button
        // if(($wrapper.scrollTop() + $wrapper.height()) / $wrapper[0].scrollHeight < 1)
        if (($wrapper.scrollTop() + $wrapper.height()) - $wrapper[0].scrollHeight < -10) {
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
        if (processing || isTouchLastMess || isToPosition) {
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

    const onGetMoreMessageByScrolling = async () => {
        let isLoadedMoreResult = { isLoadedMore: false, loadedResult: [] };

        const params = {
            chatId: GLOBAL.getCurrentRoomId(),
            offset: lastOffset
        };
        processing = true;

        isLoadedMoreResult = await API.get(`chats/${params.chatId}/messages?offset=${params.offset}`).then(res => {
            if (params.offset !== lastOffset || params.chatId !== GLOBAL.getCurrentRoomId()) {
                processing = false;
                return;
            }

            const wrapperHtml = $wrapper.get(0);
            let pos;
            if (isMobile) {
                pos = wrapperHtml.scrollHeight
            } else {
                pos = wrapperHtml.scrollHeight - $wrapper.scrollTop();   
            }
            
            let messagesHtml = '';
            let moreMessages = [];

            if (res?.messages?.length < 20) {
                isTouchLastMess = true;
            }

            moreMessages = moreMessages.concat(res?.messages || []).reverse();

            messagesHtml = moreMessages.map((mess, i, messArr) => {
                mess.currentSenderId = messArr[i].sender.id;
                mess.previousSenderId = messArr[i - 1]?.sender?.id;
                mess.colorGroupUser = insertColorHeader(mess.currentSenderId, yourId, isGroup);
                return (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))
            }).join('');

            lastOffset = moreMessages[0]?.sequence;

            if(jumpFastToBottomBtn.classList.contains('hidden')) {
                storeRoomById(params.chatId, [...moreMessages, ...getRoomById(params.chatId)]);
            }
 
            $messageList.prepend(messagesHtml);
            if (getMobileOS() === 'iOS') {
                // $messageList.css('visibility', 'hidden');
                setTimeout(() => {
                    $wrapper.scrollTop(wrapperHtml.scrollHeight - pos)
                    // $messageList.css('visibility', 'visible');
                }, 100)
            } else {
                $wrapper.scrollTop(wrapperHtml.scrollHeight - pos);
            }

            setTimeout(() => {
                processing = false;
            }, 200);

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

        messages = [...cloneArray];
   
        messagesHtml = messages.map((mess, i, messArr) => {
            mess.currentSenderId = messArr[i].sender.id;
            mess.previousSenderId = messArr[i - 1]?.sender?.id;
            mess.colorGroupUser = insertColorHeader(mess.currentSenderId, yourId, isGroup);

            return (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))}).join('');
        $messageList.html(messagesHtml);

        // Handle scroll if message list have an unread message
        if (isShowUnread) {
            handleScrollToUnreadMessage(idUnread);
        } else {
            $wrapper.scrollTop($wrapper[0].scrollHeight);
        }

        $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
        $loadingOfNew.hide();

        setTimeout(() => {
            updateRoomInfo(roomInfo);
            processing = false;
        }, timeWait);
    };

    const onGetMessage = (roomInfo, positionRoom) => API.get(`chats/${roomInfo.id}/messages?offset=0`).then(res => {
        // Handle when user switch room but the request has not finished yet
        let messages;
        const pinnedMess = res?.pinnedMessage;
        let pinnedObjToStore;
 
        pinnedMess ? pinnedObjToStore = {
                        messId: pinnedMess?.id.messageId,
                        pinname: pinnedMess?.sender.name, 
                        message: htmlEncode(decodeStringBase64(pinnedMess?.message)),
                        pinSequence: pinnedMess?.sequence,
                        avatar: getAvatar(pinnedMess.sender.id),
                        taggedUsers: pinnedMess?.taggedUsers,
                        markdown: pinnedMess.markdown
                    } : null

        if (roomInfo.id !== GLOBAL.getCurrentRoomId() && !roomInfo.isUpdateOrRemoveMessBeforeGetRoomById) {
            return;
        }

        messages = (res?.messages || []).reverse();

        ultiLastOffSet = messages[messages?.length - 1]?.sequence;
        // If edit or remove massage but not yet load messages from the room yet, don't need to render below
        if(!roomInfo.isUpdateOrRemoveMessBeforeGetRoomById) {
             // Update time activity to top bar
            chatboxTopbarComp.onRenderTimeActivity(res?.partnerLastTimeActivity);
             // Show pinned messages
             modalPinMessage.renderPinnedMess(pinnedMess);
            // Render messages
            handleDataFromGetMess(messages, roomInfo);
        }

         // Assign message to store
         setChatsById(roomInfo.id, messages);
         storeRoomById(roomInfo.id, messages);
         storePinnedMessRoomsById(roomInfo.id, pinnedObjToStore)

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
        isTouchLastMess = false;
        colorByUserid = {};
        colorIndex = 0;

        if(jumpFastToBottomBtn.classList.contains('hidden')){
            ultiLastOffSet = 0;
        }
    };

    const loadMessages = async (roomInfo) => {
        onRefresh();
        
        isGroup = roomInfo.group;
        let messagesListLoadFirstTime;
        modalPinMessage.removePinBar();
        
        if (getRoomById(roomInfo.id) && isInit) {
            const messList = getRoomById(roomInfo.id);
            const pinnedObj = getPinnedMessRoomsById(roomInfo.id);

            ultiLastOffSet = messList[messList?.length - 1]?.sequence;

            onGetMessageFromCache(roomInfo);
            modalPinMessage.renderPinnedMess(pinnedObj, true);

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

            let messagesHtml = messagesChat.map((mess, i, messArr) => {
                mess.currentSenderId = messArr[i].sender.id;
                mess.previousSenderId = messArr[i - 1]?.sender?.id;
                mess.colorGroupUser = insertColorHeader(mess.currentSenderId, yourId, isGroup);

                return (renderRangeDate(mess, i, messArr) + renderUnread(mess) + renderMessage(mess))}).join('');
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
            isInit = false;
            yourId =  GLOBAL.getInfomation()?.id;

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

            // Conferecne invite link
            $(document).off('.btnConferenceLink').on('click.btnConferenceLink', '.messages__item .conference-link button', (e) => addEventListenerToMeetingLink(e));

            // Voice message
            $(document).off('.btnVoiceMessPlayStop').on('click.btnVoiceMessPlayStop', '.audio-playStop', (e) => voiceChatComp.audioPlayStopFunc(e))

            // Scroll to origin quoted message
            $(document).off('.scrollToOriginMess').on('click.scrollToOriginMess', '.comment-box-inline', (e) => handleScrollToOriginId(e));

            // View tagged profile
            $(document).off('.viewTaggedProfile').on('click.viewTaggedProfile', '.tagged-person-js', (e) => modalTagPerson.handleViewTagProfile(e));

            // Download picture
            $(document).off('.downloadImg').on('click.downloadImg', '.download-img', downloadImage);

            // Download file
            $(document).off('.downloadFile').on('click.downloadFile', '.download-file', downloadFile);

            // Reaction buttons
            $(document).off('.messageReaction').on('click.messageReaction', '.message-reaction', (e) => modalMessageReaction.onUpdate(e, GLOBAL.getCurrentRoomId()));

            // Open user profile in group chat
            $(document).off('.openUserInfo').on('click.openUserInfo', '.messages__item:not(.you):not([data-room-type=1]) .user-avatar .avatar', (e) => modalUserInfo.onInit(e));

            // show hide markdown
            $(document).off('.showHideMarkdown').on('click.showHideMarkdown', '.show-origin-mess-markdown', (e) => modalMarkdown.onToggleMarkdown(e));

            modalPinMessage.onInit();
        },

        onLoadMessage: async (roomInfo) => loadMessages(roomInfo),

        onSync: (messList = []) => {
            const mess = messList[0];
            let id = GLOBAL.getCurrentRoomId();
            
            // Prevent duplicate message
            if ($(`[${ATTRIBUTE_MESSAGE_ID} = "${mess?.id?.messageId}"]`).length) {
                return;
            }     
            let messages = getRoomById(id);
            // up unread message when scrollbar does not set at bottom 
            if (
                (($wrapper.scrollTop() + $wrapper.height()) / $wrapper[0].scrollHeight) < 1 && GLOBAL.getInfomation().id !== mess.sender.id
            ) {
                unreadScrollNum += 1;
                $unreadScroll.text(unreadScrollNum);
                $unreadScroll.show();

                $btnScrollToBottom.removeClass('round');
                $btnScrollToBottom.addClass('square');
                $scrollToMess.show();
            }

            // Update ultiLastOffSet when send/ receive new message
            ultiLastOffSet = messList[0].sequence;

            if (jumpFastToBottomBtn.classList.contains('hidden')) {
                const wrapperHtml = $wrapper.get(0);
                const isBottom = wrapperHtml.scrollHeight - wrapperHtml.scrollTop <= wrapperHtml.clientHeight;

                mess.currentSenderId = mess?.sender?.id;
                mess.previousSenderId = messages[messages?.length - 2]?.sender?.id || null;
                mess.colorGroupUser = insertColorHeader(mess.currentSenderId, yourId, isGroup);

                const messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);
                $messageList.append(messagesHtml);

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
            $message.find('.conference-link').hide();
            $message.removeClass('label');
        },

        onSyncUpdate: (message) => {
            const id = message.id.messageId;
            const $message = $(`[${ATTRIBUTE_MESSAGE_ID} = "${id}"]`);
            let text = htmlEncode(decodeStringBase64(message.message));
           
            if (message?.markdown) {
                text = markDown(text);
                text = markDownCodeBlock(text);
                $message.addClass('markdown');
                $message.find('.messages--markdown').removeClass('hidden');
            } else {
                $message.removeClass('markdown');
                $message.find('.messages--markdown').addClass('hidden');
            }
            // Render in case edit a tag message
            text = renderTag(text, message.taggedUsers, true);

            const $pinMessTopbar = $('.pin-message-status-bar');
            const $pinText = $pinMessTopbar.find('.pin-text');
            let $pinDetails = $pinMessTopbar.find('.pin-mess-details');
            let pinMessId;

            $message.find('.--mess').html(text);
            $message.find('.--edited').removeClass('hidden');
            
            // Update pin topbar when edit message
            pinMessId = $pinDetails?.attr(PINNED_MESS_ID);
            
            if (!$pinDetails || pinMessId !== id) return;
            const pinnedObjByRoom = getPinnedMessRoomsById(message.id.chatId);
            pinnedObjByRoom.message = text
            storePinnedMessRoomsById(message.id.chatId, pinnedObjByRoom)
            $pinText.html(text);
        },

        onFinishPostMessage: (data) => {
            const $mess = $(`[data-id-local="${data.idLocal}"]`);
            const messages = getRoomById(data.chatId);
            ultiLastOffSet++;

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
            $mess.find('.show_origin_btn').attr('sequence_number', ultiLastOffSet);

            // Fix repeating messages
            const messagesList = document.querySelector('.js_ul_list_mess')
            const arryMessages = messagesList.querySelectorAll('.js_li_list_mess');
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
                },
                taggedUsers: data?.taggedUsers,
                markdown: data.params?.markdown
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
                // If is finding origin message state, jump to bottom first
                if (!jumpFastToBottomBtn.classList.contains('hidden')) {
                    jumpToBottom();
                    return;
                } 
            }

            storeRoomById(rid, messages.concat(mess));

            if (!jumpFastToBottomBtn.classList.contains('hidden')) return;

            mess.currentSenderId = mess.sender.id;
            mess.previousSenderId = messages[messages.length - 1]?.sender?.id;
            mess.colorGroupUser = insertColorHeader(mess.currentSenderId, yourId, isGroup);
            
            if (messages?.length) {
                messagesHtml = renderRangeDate(mess, 1, [].concat(messages[messages.length - 1], mess)) + renderMessage(mess);
            } else {
                messagesHtml = renderMessage(mess);
            }

            $messageList.append(messagesHtml);
            $wrapper.scrollTop(wrapperHtml.scrollHeight);
            $messageList.find(IMAGE_CLASS).on('load', onLoadImage);
        },

        onShowExactOriginMessage: (id, sequence) => showExactOriginMessage(id, sequence),

        onSwitchRoomWhileShowMessMediaAndFiles: () => {
            document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown)
           
            hideJumptoBottomBtn()
        }
    };
});
