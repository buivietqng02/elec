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
    'features/modal/modalBookmarkMessage'

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
    modalBookmarkMessage
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
    // ======== Handle scroll to origin message ===========
    let numberOfOffset = 0;
    let isScrollingToOriginMess = false;;
    let isProcessScrollDown = false;;
    let isTouchLastMessBottom = false;;
    let lastOffsetScrollDown = 0;;
    let ultiLastOffSet = 0;
    let currentViewOriginMessRoomInfo;

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
                messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join(''); 
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
            originMessageEle.scrollIntoView({ block: 'center', behavior: 'smooth' });
            originMessageEle.classList.add('activeScrollTo');

            setTimeout(() => {
                originMessageEle.classList.remove('activeScrollTo');
            }, 5000);
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
        const originId = e.target.getAttribute('quoted-original-id').split('-')[1];
        const sequenceNum =  e.target.getAttribute('quoted-original-sequence');
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
        // If is finding media and files or viewing bookmark list
        if(isScrollingToOriginMess || modalBookmarkMessage.onGetIsViewingBookmark()) return

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

            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess))).join('');
            lastOffset = moreMessages[0]?.sequence;

            // console.log(lastOffset);

            if(jumpFastToBottomBtn.classList.contains('hidden')) {
                storeRoomById(params.chatId, [...moreMessages, ...getRoomById(params.chatId)]);
            }
          
            $messageList.prepend(messagesHtml);
            $wrapper.scrollTop(wrapperHtml.scrollHeight - pos);

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

    const findUltiLastOffSet = (arrayMess) => {
        // Update ultiLastOffSet whenever reload loadMessages function
        let ultiLastOffSet = 0;
        let addedSequenceMessList = [];
        if (arrayMess.length > 0) {
            //  console.log(`Before set ultiOffset: ${ultiLastOffSet}`)
            //  get last sequence number (Receive new messages or send new message --> sequence is null, therefore have to use below method to get sequence)
            let nullIndex = 0;

            const checkNullSequence = (element, index) => {
                if (element.sequence === null || element.sequence === undefined) {
                    nullIndex = index;
                    return true
                }
            }
            const isNullSequence = arrayMess.some(checkNullSequence);

            if (nullIndex > 0) {
                addedSequenceMessList = arrayMess.map((item, index) => {
                    if (index >= nullIndex) {
                        item.sequence = arrayMess[index - 1].sequence + 1;
                    } 
                    return item;
                })
            }

            if(isNullSequence) {
            // In case newly created group
                if(nullIndex === 0) {
                    ultiLastOffSet = arrayMess.length;
                } else {
                    ultiLastOffSet = arrayMess[nullIndex - 1].sequence + (arrayMess.length - nullIndex)
                }
            } else {
                if(ultiLastOffSet < arrayMess[arrayMess.length - 1].sequence) ultiLastOffSet = arrayMess[arrayMess.length - 1].sequence
            }
        }

        return {
            ultiLastOffSet: ultiLastOffSet, 
            addedSequenceMessList: addedSequenceMessList
        };
    }

    const handleDataFromGetMess = (messages, roomInfo) => {
        let messagesHtml = '';
        let isShowUnread = roomInfo.unreadMessages > 0 && roomInfo.unreadMessages < 16;
        let idUnread = null;
        const timeWait = isMobile ? 300 : 50;
        let ultiLastOffsetAndSequenceList = {}; 

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
        ultiLastOffsetAndSequenceList =  findUltiLastOffSet(cloneArray);

        // If not scrolling to origin message, reassign ultiLastOffSet
        if(jumpFastToBottomBtn.classList.contains('hidden')) ultiLastOffSet = ultiLastOffsetAndSequenceList.ultiLastOffSet;

        addedSequenceMessList = ultiLastOffsetAndSequenceList.addedSequenceMessList
        if (addedSequenceMessList.length > 0) {
            messages = [...addedSequenceMessList]
        } else {
            messages = [...cloneArray]
        }

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

        $loadingOfNew.hide();

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

        ultiLastOffSet = messages[messages.length - 1].sequence;
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

            // Conferecne invite link
            $(document).off('.btnConferenceLink').on('click.btnConferenceLink', '.messages__item .conference-link button', (e) => addEventListenerToMeetingLink(e));

            // Voice message
            $(document).off('.btnVoiceMessPlayStop').on('click.btnVoiceMessPlayStop', '.audio-playStop', (e) => voiceChatComp.audioPlayStopFunc(e))

            // Scroll to origin quoted message
            $(document).off('.scrollToOriginMess').on('click.scrollToOriginMess', '.comment-box-inline', (e) => handleScrollToOriginId(e))
        },

        onLoadMessage: async (roomInfo) => loadMessages(roomInfo),

        onSync: (messList = []) => {
            let isViewBookmarkMode = modalBookmarkMessage.onGetIsViewingBookmark();
            const mess = messList[0];
            let id = GLOBAL.getCurrentRoomId();

            // Prevent duplicate message
            if ($(`[${ATTRIBUTE_MESSAGE_ID} = "${mess?.id?.messageId}"]`).length) {
                return;
            }     
            let messages = getRoomById(id);
            // up unread message when scrollbar does not set at bottom 
            if (
                (($wrapper.scrollTop() + $wrapper.height()) / $wrapper[0].scrollHeight) < 1 &&
                GLOBAL.getInfomation().id !== mess.sender.id &&
                !isSearchMode && !isViewBookmarkMode
            ) {
                unreadScrollNum += 1;
                $unreadScroll.text(unreadScrollNum);
                $unreadScroll.show();

                $btnScrollToBottom.removeClass('round');
                $btnScrollToBottom.addClass('square');
                $scrollToMess.show();
            }

            // Update ultiLastOffSet when receive new message
            if(GLOBAL.getInfomation().id !== mess.sender.id &&
            !isSearchMode && !isViewBookmarkMode) {
                if(mess.id.messageId) ultiLastOffSet++;
            }

            if (!isSearchMode && !isViewBookmarkMode) {
                const wrapperHtml = $wrapper.get(0);
                const isBottom = wrapperHtml.scrollHeight - wrapperHtml.scrollTop <= wrapperHtml.clientHeight;
                mess.sequence = ultiLastOffSet;
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
            $message.removeClass('bookmark');
        },

        onSyncUpdate: (message) => {
            const id = message.id.messageId;
            const $message = $(`[${ATTRIBUTE_MESSAGE_ID} = "${id}"]`);
            $message.find('.--mess').html(transformLinkTextToHTML(htmlEncode(decodeStringBase64(message.message))).split('__').pop());
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
            // Update ultiLastOffSet when send new mess
            ultiLastOffSet++; 
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
                // If is finding origin message state, jump to bottom first
                if (!jumpFastToBottomBtn.classList.contains('hidden')) jumpToBottom();
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

        onShowExactOriginMessage: (id, sequence) => showExactOriginMessage(id, sequence),

        onSwitchRoomWhileShowMessMediaAndFiles: () => {
            document.querySelector('.js_con_list_mess').removeEventListener('scroll',handleLoadNewMessOnScrollDown)
           
            hideJumptoBottomBtn()
        }
    };
});
