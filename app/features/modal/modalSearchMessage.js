define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/functions',
    'shared/alert',
    'features/chatbox/chatboxContentFunctions'
], (
    constant,
    GLOBAL,
    API,
    functions,
    ALERT,
    contentFunc
   
    ) => {
    const { SEARCH_ALL_ROOM } = constant;
    const { convertMessagetime } = functions;
    let inputSearch;
    let pulseLoading;
    let searchContent;
    let searchLobbyText;
    let searchWraper;
    let closeSearchViewBtn;
    let cancelSearchBtn;
    let searchMessTopBar;
    let searchBtn;

    let lastOffset = 0;
    let timestamp = '';
    let isTouchLastMess = false;
    let isProcessing = false;
    let isToPosition = false;
    let isShowOriginMess = false;
    let isCancelSearch = false;
    
    let isSearchMode = false;

    let valueKeywords = '';
    let roomId = 0;
    let searchContentTemp = '';
    let inputSearchTemp = '';

    const {
        renderMessage
    } = contentFunc;

    const getRoomInfo = (roomIdInfo) => GLOBAL.getRooms().find(room => (room.id === roomIdInfo)); 

    const showRoomName = (rId) => {
        const roomInfo = getRoomInfo(rId);
        let roomName;
        if (roomInfo.subject) {
            roomName = `${GLOBAL.getLangJson().GROUP}: ${roomInfo.subject}`;
        } else {
            roomName = `${GLOBAL.getLangJson().CHAT_WITH}: ${roomInfo.partner.name}`;
        }
        return `
            <div class="search-room-name">
                <span>${roomName}</span>
            </div>
        `;
    };

    const templateSearch = (messGroup, search, isSearchAllRoom) => `
        <div class="separate-date text-center">
            <hr>
            <span>${convertMessagetime(messGroup[0].msgDate, GLOBAL.getLangJson(), !!search)}</span>
        </div> 
        
        ${isSearchAllRoom ? showRoomName(messGroup[0].id.chatId) : ''}

        <div class="message-before-keywords">${messGroup[-1] ? renderMessage(messGroup[-1], search, isSearchAllRoom) : ''}</div>
        <div class="message-contains-keywords">${renderMessage(messGroup[0], search, isSearchAllRoom)}</div>
        <div class="message-after-keywords">${messGroup[1] ? renderMessage(messGroup[1], search, isSearchAllRoom) : ''}</div>`;

    const onRenderSearchResult = (searchMessageList, search, type) => {
        isCancelSearch = false;
        let textHTML = '';
        let prevSearchMess = '';
        let reArrangeSearchList = [];

        searchMessageList.forEach((mess) => {
            const currSearchMess = mess.searchMessage;
            if (currSearchMess === prevSearchMess) {
                reArrangeSearchList[reArrangeSearchList.length - 1][mess.searchIndex] = mess;
            } else {
                reArrangeSearchList.push({ [mess.searchIndex]: mess });
            }
            prevSearchMess = currSearchMess;
        });

        if (type === SEARCH_ALL_ROOM) {
            reArrangeSearchList = reArrangeSearchList.map(messGroup => {
                textHTML += templateSearch(messGroup, search, true);
                return textHTML;
            });
        } else {
            reArrangeSearchList = reArrangeSearchList.map(messGroup => {
                textHTML += templateSearch(messGroup, search, false);
                return textHTML;
            });
        }
      
        const pos = searchContent.scrollHeight + searchContent.scrollTop;  
        searchContent.innerHTML = textHTML + searchContent.innerHTML;
        searchContent.scrollTop = searchContent.scrollHeight - pos;
    };

    const callAPI = async (value, offsetTimestamp, currentRoomId) => {
        let res;
        try {
            isProcessing = true;
            pulseLoading.classList.remove('hidden');

            if (currentRoomId) {
                res = await API.get(`chats/${currentRoomId}/messages/search?keyword=${value}&offset=${offsetTimestamp}`);
            } else {
                res = await API.get(`messages/search?keyword=${value}&timestamp=${offsetTimestamp}`);
            }

            const listMessWithKeyword = res.filter(response => response.searchIndex === 0);

            lastOffset = listMessWithKeyword[listMessWithKeyword.length - 1]?.sequence;
            const lastMsgDate = listMessWithKeyword[listMessWithKeyword.length - 1]?.msgDate;
            timestamp = new Date(lastMsgDate).getTime();
         
            if (listMessWithKeyword.length < 20) isTouchLastMess = true;

            isProcessing = false;
            if (res.length) isToPosition = false;

            pulseLoading.classList.add('hidden');
            searchLobbyText.classList.add('hidden');
    
            return res;
        } catch (error) {
            console.log(error);
            isProcessing = false;
            pulseLoading.classList.add('hidden');
            ALERT.show('Something wrong, please search again!', 'danger');
        }

        return res;
    };

    const resetScroll = () => {
        lastOffset = 0;
        isTouchLastMess = false;
        isToPosition = false;
        timestamp = '';
    };

    const closeModal = () => {
        if (!searchWraper || searchWraper?.classList.contains('hidden')) return;

        if (!searchWraper.classList.contains('hidden')) {
            searchWraper.classList.remove('slideIn');
            searchWraper.classList.add('slideOut');

            setTimeout(() => searchWraper.classList.add('hidden'), 500);
        }
        isSearchMode = false;
        isShowOriginMess = false;

        searchContentTemp = searchContent.innerHTML;
        inputSearchTemp = inputSearch.value;
        searchContent.innerHTML = '';
        inputSearch.value = '';
        searchBtn.disabled = true;
        searchWraper.classList.remove('viewingSearchAllRooms');
    };

    const onClearSearchInput = () => {
        searchContentTemp = '';
        inputSearchTemp = '';
        inputSearch.value = '';
        cancelSearchBtn.classList.add('hidden');
    };

    const closeModalAndResetScroll = () => {
        closeModal();
        resetScroll();
        if (cancelSearchBtn) cancelSearchBtn.classList.add('hidden');
    };

    const onShowOriginMessage = (id, sequence, roomid) => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        closeModal();
        if (roomid) {
            // Scroll to origin for search all room, load the room first
            $(`.js_li_list_user[data-room-id="${roomid}"]`).click();
        }
        
        isShowOriginMess = true;

        setTimeout(() => {
            chatboxContentComp.onShowExactOriginMessage(id, sequence);
        }, 600);
    };

    const showOriginMessageEventListener = () => {
        searchContent.querySelectorAll('.js_li_list_mess').forEach(item => {
            const showOriginMess = item.querySelector('.show_origin_mess');
            const showOriginMessBtn = item.querySelector('.show_origin_btn');
            const sequence = showOriginMessBtn.getAttribute('sequence_number');
            const id = item.getAttribute(constant.ATTRIBUTE_MESSAGE_ID);
            const roomid = showOriginMessBtn.getAttribute('room-id');

            showOriginMess.classList.remove('hidden');
            showOriginMess.addEventListener('click', () => onShowOriginMessage(id, sequence, roomid));
        });
    };

    const onSearch = () => {
        valueKeywords = inputSearch.value;
        searchBtn.disabled = true;
        resetScroll();

        if (valueKeywords.trim().length < 3 || isProcessing) {   
            return;
        }

        callAPI(valueKeywords, lastOffset, roomId).then(res => {
            searchBtn.disabled = false;
            if (!res?.length) {
                searchContent.innerHTML = `<div class="not-found-mess text-center">${GLOBAL.getLangJson().MESSAGE_NOT_FOUND}</div>`;
                return;
            }

            if (valueKeywords !== inputSearch.value) {
                return;
            }

            searchContent.innerHTML = '';
            onRenderSearchResult(res.reverse(), valueKeywords);

            showOriginMessageEventListener();
        });
    };

    const onEnterSearch = (e) => {
        if (inputSearch.value.trim().length > 0) {
            cancelSearchBtn.classList.remove('hidden');
        } else {
            cancelSearchBtn.classList.add('hidden');
        }

        if (inputSearch.value.trim().length < 3 || isProcessing) {
            searchBtn.disabled = true;
            return;
        }
        
        searchBtn.disabled = false;
        if (e.keyCode === 13) onSearch();
    };

    const onGetMoreMessageByScrolling = () => {
        const offsetTimestamp = !roomId ? timestamp : lastOffset;
        callAPI(valueKeywords, offsetTimestamp, roomId).then(res => {
            console.log(res);
            let moreMessages = [];
            moreMessages = moreMessages.concat(res || []).reverse();

            if (!roomId) {
                onRenderSearchResult(moreMessages, valueKeywords, SEARCH_ALL_ROOM);
            } else {
                onRenderSearchResult(moreMessages, valueKeywords);
            }
           
            showOriginMessageEventListener();
        });
    };

    const onWrapperScroll = () => {
        if (searchContent.scrollTop < 100) {
            isToPosition = true;
        } else {
            isToPosition = false;
        }

        // console.log(isProcessing, isTouchLastMess, isToPosition);

        if (isProcessing || isTouchLastMess || !isToPosition || !isSearchMode || isCancelSearch) {
            return;
        }
        onGetMoreMessageByScrolling();
    };

    const openModal = () => {
        searchWraper.classList.remove('hidden');
        searchWraper.classList.remove('slideOut');
        searchWraper.classList.add('slideIn');
    };

    const openSearchAllRoomsModal = (value) => {
        const searchAllRoomInitBtn = document.querySelector('.search-all-room-link');
        resetScroll();
        roomId = '';
        valueKeywords = value;
       
        isSearchMode = true;
        searchAllRoomInitBtn.disabled = true;
        searchLobbyText.classList.remove('hidden');
       
        // If not yet open search modal;
        if (searchWraper.classList.contains('hidden')) {
            openModal();
        } else {
            searchContent.innerHTML = '';
        }
        searchMessTopBar.classList.add('hidden');

        callAPI(value, timestamp).then(res => {
            searchAllRoomInitBtn.disabled = false;
            if (!res?.length) {
                searchContent.innerHTML = `<div class="not-found-mess text-center">${GLOBAL.getLangJson().MESSAGE_NOT_FOUND}</div>`;
                return;
            }

            searchContent.innerHTML = '';
            onRenderSearchResult(res.reverse(), value, SEARCH_ALL_ROOM);

            showOriginMessageEventListener();
        });
    };

    const removeEventListenerEle = () => {
        closeSearchViewBtn.removeEventListener('click', closeModalAndResetScroll);
        searchBtn.removeEventListener('click', onSearch);
        inputSearch.removeEventListener('keyup', onEnterSearch);
        searchContent.removeEventListener('scroll', onWrapperScroll);
        cancelSearchBtn.removeEventListener('click', onClearSearchInput);
    };

    const openModalSearchOneRoom = () => {
        if (searchWraper.classList.contains('hidden')) {
            openModal();
            searchMessTopBar.classList.remove('hidden');
            roomId = GLOBAL.getCurrentRoomId();
            isSearchMode = true;

            if (isShowOriginMess) {
                searchContent.innerHTML = searchContentTemp;
                inputSearch.value = inputSearchTemp;
                searchContent.scrollTo(0, searchContent.scrollHeight);
                showOriginMessageEventListener();
            } else {
                searchLobbyText.classList.remove('hidden');
            }

            setTimeout(() => inputSearch.focus(), 1000);
        }
    };

    const defineElementsSelector = () => {
        searchWraper = document.querySelector('.view-search-wraper');
        closeSearchViewBtn = document.querySelector('.search-close');
        cancelSearchBtn = document.querySelector('.cancel-search-btn');
        searchBtn = document.querySelector('.search-mess-btn');
        inputSearch = document.querySelector('#msbg-input');
        searchContent = document.querySelector('.search-content');
        pulseLoading = searchWraper.querySelector('.pulse-loading');
        searchLobbyText = document.querySelector('.search-lobby-text');
        searchMessTopBar = document.querySelector('.mess-search-topright');
    };

    return {
        onInit: () => {
            defineElementsSelector();

            removeEventListenerEle();
            closeSearchViewBtn.addEventListener('click', closeModalAndResetScroll);
            inputSearch.addEventListener('keyup', onEnterSearch);
            searchBtn.addEventListener('click', onSearch);
            searchContent.addEventListener('scroll', onWrapperScroll);
            cancelSearchBtn.addEventListener('click', onClearSearchInput);
    
            openModalSearchOneRoom();
        },

        closeViewSearch: () => closeModalAndResetScroll(),

        onInitSearchAllRooms: (value) => {
            defineElementsSelector();
            searchWraper.classList.add('viewingSearchAllRooms');

            removeEventListenerEle();

            closeSearchViewBtn.addEventListener('click', closeModalAndResetScroll);
            searchContent.addEventListener('scroll', onWrapperScroll);
            openSearchAllRoomsModal(value);
        }
    };
});
