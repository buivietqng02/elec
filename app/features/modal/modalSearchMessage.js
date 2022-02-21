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
    const { debounce, convertMessagetime } = functions;
    let messSearchBox;
    let inputSearch;
    let searchingMess;
    let searchingMessContent;
    let searchContent;
    let searchLobbyText;
    let searchWraper;
    let closeSearchViewBtn;
    let lastOffset = 0;
    let isTouchLastMess = false;
    let isProcessing = false;
    let isToPosition = false;
    let isShowOriginMess = false;
    
    let isSearchMode = false;
    let valueKeywords = '';
    let roomId = 0;
    let searchContentTemp = '';
    let inputSearchTemp = '';

    const {
        renderMessage
    } = contentFunc;

    const onRenderSearchResult = (searchMessageList, search) => {
        let textHTML = '';
        searchMessageList.map(mess => {
            textHTML += `<div class="separate-date text-center"><hr><span>${convertMessagetime(mess.msgDate, GLOBAL.getLangJson(), !!search)}</span></div> ${renderMessage(mess, search)}`;
            return textHTML;
        });
       
        searchContent.innerHTML = textHTML;
        searchContent.scrollTop = searchContent.scrollHeight;
    };

    const callAPI = async (currentRoomId, lastOffsetParam, value) => {
        let res;
        try {
            isProcessing = true;
            searchingMess.classList.remove('hidden');
            searchingMessContent.classList.remove('hidden');

            const params = {
                chatId: currentRoomId,
                offset: lastOffsetParam,
                search: value
                
            };
            res = await API.get('messages', params);
            lastOffset = res.messages[res.messages.length - 1]?.sequence;
            if (res.messages.length < 20) isTouchLastMess = true;

            isProcessing = false;
            if (res.messages.length) isToPosition = false;

            searchingMess.classList.add('hidden');
            searchingMessContent.classList.add('hidden');
            searchLobbyText.classList.add('hidden');
    
            return res;
        } catch (error) {
            console.log(error);
            isProcessing = false;
            searchingMess.classList.add('hidden');
            searchingMessContent.classList.add('hidden');
            ALERT.show('Something wrong, please search again!', 'danger');
        }

        return res;
    };

    const resetScroll = () => {
        lastOffset = 0;
        isTouchLastMess = false;
        isToPosition = false;
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

        console.log(isSearchMode);

        searchContentTemp = searchContent.innerHTML;
        inputSearchTemp = inputSearch.value;
        searchContent.innerHTML = '';
        inputSearch.value = '';
    };

    const closeModalAndResetScroll = () => {
        closeModal();
        resetScroll();
    };

    const onShowOriginMessage = (id, sequence) => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        closeModal();
        isShowOriginMess = true;

        setTimeout(() => {
            chatboxContentComp.onShowExactOriginMessage(id, sequence);
        }, 500);
    };

    const showOriginMessageEventListener = () => {
        searchContent.querySelectorAll('.js_li_list_mess').forEach(item => {
            const showOriginMess = item.querySelector('.show_origin_mess');
            const showOriginMessBtn = item.querySelector('.show_origin_btn');
            const sequence = showOriginMessBtn.getAttribute('sequence_number');
            const id = item.getAttribute(constant.ATTRIBUTE_MESSAGE_ID);

            showOriginMess.classList.remove('hidden');
            showOriginMess.addEventListener('click', () => onShowOriginMessage(id, sequence));
        });
    };

    const onSearch = debounce(() => {
        valueKeywords = inputSearch.value;
        resetScroll();

        if (valueKeywords.length < 3) {   
            return;
        }

        callAPI(roomId, lastOffset, valueKeywords).then(res => {
            console.log(res);
            if (!res?.messages?.length) {
                searchContent.innerHTML = `<div class="not-found-mess text-center">${GLOBAL.getLangJson().MESSAGE_NOT_FOUND}</div>`;
                return;
            }

            if (valueKeywords !== inputSearch.value) {
                return;
            }

            onRenderSearchResult(res.messages.reverse(), valueKeywords);

            showOriginMessageEventListener();
        });
    }, 1000);

    const onGetMoreMessageByScrolling = () => {
        callAPI(roomId, lastOffset, valueKeywords).then(res => {
            console.log(res);
            let messagesHtml = '';
            let moreMessages = [];

            const pos = searchContent.scrollHeight + searchContent.scrollTop;  

            moreMessages = moreMessages.concat(res?.messages || []).reverse();

            moreMessages.map(mess => {
                messagesHtml += `<div class="separate-date text-center"><hr><span>${convertMessagetime(mess.msgDate, GLOBAL.getLangJson(), true)}</span></div> ${renderMessage(mess, valueKeywords)}`;
                return messagesHtml;
            });

            searchContent.innerHTML = messagesHtml + searchContent.innerHTML;
            searchContent.scrollTop = searchContent.scrollHeight - pos;

            showOriginMessageEventListener();
        });
    };

    const onWrapperScroll = () => {
        if (searchContent.scrollTop < 100) {
            isToPosition = true;
        } else {
            isToPosition = false;
        }

        console.log(isProcessing, isTouchLastMess, isToPosition);

        if (isProcessing || isTouchLastMess || !isToPosition || !isSearchMode) {
            return;
        }
        onGetMoreMessageByScrolling();
    };

    const removeEventListenerEle = () => {
        closeSearchViewBtn.removeEventListener('click', closeModalAndResetScroll);
        inputSearch.removeEventListener('keyup', onSearch);
        searchContent.removeEventListener('scroll', onWrapperScroll);
    };

    const openModal = () => {
        if (searchWraper.classList.contains('hidden')) {
            searchWraper.classList.remove('hidden');
            searchWraper.classList.remove('slideOut');
            searchWraper.classList.add('slideIn');

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

    return {
        onInit: () => {
            searchWraper = document.querySelector('.view-search-wraper');
            closeSearchViewBtn = document.querySelector('.search-close');

            console.log(lastOffset, isTouchLastMess, isProcessing);
         
            console.log('test');

            messSearchBox = document.querySelector('.mess-search-box');
            inputSearch = document.querySelector('#msbg-input');
            searchContent = document.querySelector('.search-content');

            searchingMess = messSearchBox.querySelector('.pulse');
            searchingMessContent = document.querySelector('.pulse-loading');
            searchLobbyText = document.querySelector('.search-lobby-text');

            removeEventListenerEle();
            closeSearchViewBtn.addEventListener('click', closeModalAndResetScroll);
            inputSearch.addEventListener('keyup', onSearch);
            searchContent.addEventListener('scroll', onWrapperScroll);
    
            openModal();
        },

        closeViewSearch: () => closeModalAndResetScroll()
    };
});
