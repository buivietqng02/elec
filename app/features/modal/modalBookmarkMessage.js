define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/alert',
    'features/chatbox/chatboxContentFunctions'
], (
    constant,
    GLOBAL,
    API,  
    ALERT,
    contentFunc
) => {
    // let wrapper;
    // let $bookmarkMessage;
    // let messageId;
    let currentRoomId;
    // let isBookmark = false;
    let isViewingBookmark = false;

    let lastOffset = 0;
    let isTouchLastMess = false;
    let isToPosition = false;
    let processing = false;

    const { ATTRIBUTE_MESSAGE_ID, LABELS } = constant;
    const { getCurrentRoomId } = GLOBAL;
    const { renderMessage, renderRangeDate } = contentFunc;

    let searchLabelInput;
    let labelListUl;
    let labelItem;
    let manageLabel;

    let manageAddlabel;
    let labelEditAddGroup;
    let colorlabelItem;
    let labelEditAddConfirmBtn;
    let labelEditAddInput;
    let manageLabelListUl;
    let saveManagelabelsBtn;
    let spinnerSaveManage;
    let removeLabelBtn;

    let cloneFlagList;

    let flagList = [];

    let editLabelId = '';

    let viewBookmarkWraper;
    let closeViewBookmarkBtn;
    let viewBookmarkContent;
    let pulseViewBookmark;
    
    const callAPIListBookmarkMess = async (lastOffsetParam) => {
        processing = true;
        const params = {
            chatId: currentRoomId,
            offset: lastOffsetParam,
            starred: true
            
        };
        const res = await API.get('messages', params);
        lastOffset = res.messages[res.messages.length - 1]?.sequence;
        if (res.messages.length < 20) isTouchLastMess = true;

        return res;
    };
    
    const onGetMoreMessageByScrolling = () => {
        pulseViewBookmark.classList.remove('hidden');
        callAPIListBookmarkMess(lastOffset).then(res => {
            let messagesHtml = '';
            let moreMessages = [];

            const pos = viewBookmarkContent.scrollHeight + viewBookmarkContent.scrollTop;       
            moreMessages = moreMessages.concat(res?.messages || []).reverse();
            /*eslint-disable*/
            messagesHtml = moreMessages.map((mess, i, messArr) => (renderRangeDate(mess, i, messArr, 'down') + renderMessage(mess) + '<hr style="width:100%">')).join('');     

            viewBookmarkContent.innerHTML = messagesHtml + viewBookmarkContent.innerHTML;
            viewBookmarkContent.scrollTop = viewBookmarkContent.scrollHeight - pos;     
            processing = false;
            pulseViewBookmark.classList.add('hidden');

            showOriginMessageEventListener();
        });
    };

    const onWrapperScroll = () => {
        if (viewBookmarkContent.scrollTop < 100) {
            isToPosition = true;
        } else {
            isToPosition = false;
        }

        if (processing || isTouchLastMess || !isToPosition) {
            return;
        }
        onGetMoreMessageByScrolling();
    };

    const closeModalViewBookmark = () => {
        isViewingBookmark = false;
        viewBookmarkContent.classList.remove('viewingBookmark');
        viewBookmarkContent.removeEventListener('scroll', onWrapperScroll);
        
        if (!viewBookmarkWraper.classList.contains('hidden')) {
            viewBookmarkWraper.classList.remove('slideIn');
            viewBookmarkWraper.classList.add('slideOut');

            setTimeout(() => viewBookmarkWraper.classList.add('hidden'), 500);
        }

        viewBookmarkContent.innerHTML = '';
    };

    const onShowOriginMessage = (id, sequence) => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        closeModalViewBookmark();

        setTimeout(() => {
            chatboxContentComp.onShowExactOriginMessage(id, sequence);
        }, 500);
    };

    const showOriginMessageEventListener = () => {
        viewBookmarkContent.querySelectorAll('.js_li_list_mess').forEach(item => {
            const showOriginMess = item.querySelector('.show_origin_mess');
            const showOriginMessBtn = item.querySelector('.show_origin_btn');
            const sequence = showOriginMessBtn.getAttribute('sequence_number');
            const id = item.getAttribute(ATTRIBUTE_MESSAGE_ID);

            showOriginMess.classList.remove('hidden');
            showOriginMess.addEventListener('click', () => onShowOriginMessage(id, sequence));
        });
    };

    const openViewBookmarkModal = () => {
        viewBookmarkWraper = document.querySelector('.view-bookmark-wraper');
        closeViewBookmarkBtn = document.querySelector('.view-bookmark-topbar-close');
        if (viewBookmarkWraper.classList.contains('hidden')) {
            viewBookmarkWraper.classList.remove('hidden');
            viewBookmarkWraper.classList.remove('slideOut');
            viewBookmarkWraper.classList.add('slideIn');
        }
        closeViewBookmarkBtn.addEventListener('click', closeModalViewBookmark);
    };

    const onClickViewBookmarks = () => {
        openViewBookmarkModal();

        const chatboxTopbarComp = require('features/chatbox/chatboxTopbar');
        const viewBookmarksBtn = document.querySelector('#chatbox-group-option .--viewBookmark');
        pulseViewBookmark = viewBookmarkWraper.querySelector('.pulse-loading');

        viewBookmarksBtn.disabled = true;
        currentRoomId = getCurrentRoomId();
        lastOffset = 0;
        isTouchLastMess = false;

        pulseViewBookmark.classList.remove('hidden');

        viewBookmarkContent = document.querySelector('.view-bookmark-content');

        callAPIListBookmarkMess(lastOffset).then((res) => {
            let messagesHtml = '';
            pulseViewBookmark.classList.add('hidden');
            chatboxTopbarComp.onOffEventClickOutside();
            isViewingBookmark = true;
            processing = false;
            viewBookmarksBtn.disabled = false;
            viewBookmarkContent.classList.add('viewingBookmark');

            if (res.messages.length <= 0) {
                console.log(GLOBAL.getLangJson().NO_BOOKMARKS_FOUND)
                viewBookmarkContent.innerHTML = `<h4 class="text-center mt-3">${GLOBAL.getLangJson().NO_BOOKMARKS_FOUND}</h4>`
                return;
            }
            
            res.messages.reverse().map(mess => {
                messagesHtml += `${renderMessage(mess)} <hr style="width:100%">`;
                return messagesHtml;
            });
            
            viewBookmarkContent.innerHTML = messagesHtml;

            viewBookmarkContent.scrollTo(0, viewBookmarkContent.scrollHeight);

            showOriginMessageEventListener();
            viewBookmarkContent.addEventListener('scroll', onWrapperScroll);
        }).catch((err) => {
            console.log(err);
        });
    };

    const renderLabelList = (flagList) => {
        let listLabel = '';
        flagList.forEach((item, index) => {
            listLabel += `
            <li class="bm-label-item" bm-label-id="${item.id}" bm-cl-code="${item.color}" label-descript="${item.descript}">
                <span>
                    <i class="icon-bookmarks" style="color: ${LABELS[item.color]}"></i> 
                    <span class="bm-label-text" style="background: ${LABELS[item.color]}">${item.descript}</span>
                </span>
                
                <i class="icon-check"></i>
            </li>
            `
        })

        return listLabel
    }

    const renderLabelMessTemplate = (langJson) => {
        const listLabel = renderLabelList(flagList);
       
        return (`
            <div class="modal fade" id="bm-label-mess-modal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" data-language="USER_INTERFACE">Label Message</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <p class="bm-manage-label">Manage</p>
                        <div class="mb-search-label">
                            <span class="mb-search-label-container">
                                <span><i class="icon-search"></i></span>
                                <input id="mb-search-label-input" type="text" placeholder="Search">
                            </span>
                        </div>

                        <div class="modal-body">
                            <ul class="bm-label-list">
                                ${listLabel}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `)
    };
    
    const manageLabelsItemTemplate = (item) => `
    <li class="manage-labels-item" bm-label-id="${item.id}" bm-cl-code="${item.color}" label-descript="${item.descript}">
        <span>
            <i class="icon-bookmarks" style="color: ${LABELS[item.color]}"></i> 
            <span class="bm-label-text" style="background: ${LABELS[item.color]}">${item.descript}</span>
        </span>

        <div class="manage-label-action">
            <span class="label-edit-btn">
                <i class="icon-edit"></i>
            </span>
            <span class="label-remove-btn">
                <i class="icon-close"></i>
            </span>
        </div>
    </li>
    `

    const renderManageLabelsList = (flagList) => {
        let listLabel = '';

        flagList.forEach((item, index) => {
            listLabel += manageLabelsItemTemplate(item);
        })

        return listLabel
    };

    const renderManageLabels = (langJson) => {
        const listLabel = renderManageLabelsList(flagList);

        let listColorLabels = '';

        let count = 0;
        for (const code in LABELS) {
            const active = count === 0 ? 'active' : '';
            listColorLabels += `<div class="color-label-item ${active}" label-color-code="${code}" style="background: ${LABELS[code]}"></div>`;
            count ++;
        }
       
        return (`
        <div class="modal fade" id="bm-manage-labels-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="USER_INTERFACE">
                            Manage labels
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul class="bm-label-list">
                            ${listLabel}
                        </ul>

                        <hr>
                        <div><span class="label-add-btn">+ Add label</span></div>
                        
                        <div class="label-edit-add-group">
                            <div class="label-edit-add-container">
                                <input id="label-edit-add-input" placeholder="Name your label" required>
                                <div>
                                    ${listColorLabels}
                                </div>
                            </div>
                            
                            <span data-language="SAVE" type="button" class="label-edit-add-confirm">
                                <i class="icon-check"></i>
                            </span>
                        </div>
                        <hr>

                        <button data-language="SAVE" type="button" class="btn btn-outline-primary float-right save-manage-labels" disabled>
                            <span class="spinner-grow spinner-grow-sm hidden" role="status" aria-hidden="true"></span>
                            ${langJson.SAVE}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `)
    }
    
    const itemLabelOnClickFunc = () => {
        console.log('test');
        labelItem = document.querySelectorAll('#bm-label-mess-modal .bm-label-item');
        labelItem.forEach(item => {
            item.addEventListener('click', labelItemOnClick);
        });
    }
    
    const onSearchLabel = () => {
        const searchText = searchLabelInput.value.toLowerCase().trim();
        const searchList = flagList.filter(item => item.descript.toLowerCase().trim().includes(searchText))

        const listLabel = renderLabelList(searchList);
        labelListUl.innerHTML = listLabel;

        itemLabelOnClickFunc()
    };

    const labelItemOnClick = (e) => {
        labelItem.forEach(item => {
            item.classList.remove('active');
        })
        e.currentTarget.classList.add('active');
    }

    const openAddlabel = () => {
        const activeSelectedColor = document.querySelector('.color-label-item.active');
        editLabelId = '';
        labelEditAddInput.value = '';
        activeSelectedColor.classList.remove('active');
        document.querySelector('.color-label-item').classList.add('active');

        labelEditAddGroup.classList.add('active');
    };

    const colorLabelItemOnClick = (e) => {
        colorlabelItem.forEach(item => {
            item.classList.remove('active');
        })
        e.currentTarget.classList.add('active');
    }

    const onConfirmAddEditLabel = () => {
        if (!labelEditAddInput.value.trim()) return;
        console.log('conf');
        const descript = labelEditAddInput.value.trim();
        const activeSelectedColor = document.querySelector('.color-label-item.active')
        const color = Number(activeSelectedColor.getAttribute('label-color-code'));

        const id = !editLabelId ? Date.now() : editLabelId;

        const labelObj = {
            id,
            color,
            descript
        }

        if (!editLabelId) {
            cloneFlagList.push(labelObj);
        } else {
            cloneFlagList = cloneFlagList.map(item => {
                if (String(item.id) === editLabelId) {
                    return labelObj
                }
                return item         
            })
        }
        
        console.log(cloneFlagList);

        const listLabel = renderManageLabelsList(cloneFlagList);
        manageLabelListUl.innerHTML = listLabel;
       
        labelEditAddInput.value = '';
        activeSelectedColor.classList.remove('active');
        document.querySelector('.color-label-item').classList.add('active');

        labelEditAddGroup.classList.remove('active');

        saveManagelabelsBtn.disabled = false;

        addEventToRemoveLabelBtn();
        addEventToEditLabelBtn();
    };

    const addEventToRemoveLabelBtn = () => {
        removeLabelBtn = document.querySelectorAll('.label-remove-btn');
        removeLabelBtn.forEach(item => {
            item.addEventListener('click', onRemoveLabel);
        })
    };

    const addEventToEditLabelBtn = () => {
        editLabelBtn = document.querySelectorAll('.label-edit-btn');
        editLabelBtn.forEach(item => {
            item.addEventListener('click', onEditLabel);
        })
    }

    const onCloseModalManageLabels = () => {
        console.log('test');
        cloneFlagList = [...flagList];

        const listLabel = renderManageLabelsList(cloneFlagList);
        manageLabelListUl.innerHTML = listLabel;
        saveManagelabelsBtn.disabled = true;

        labelEditAddGroup.classList.remove('active');

        addEventToRemoveLabelBtn();
        addEventToEditLabelBtn();
    }

    const onSaveManageLabels = () => {
        console.log('save');
        spinnerSaveManage.classList.remove('hidden');
        flagList = [...cloneFlagList];
        console.log(flagList);
        GLOBAL.setLabelsList(flagList);

        saveManagelabelsBtn.disabled = true;
        API.put('users/preferences', { lables_list: [...flagList] }).then(() => {
            const listLabel = renderLabelList(flagList);
            labelListUl.innerHTML = listLabel;
            itemLabelOnClickFunc();
           
            $('#bm-manage-labels-modal').modal('hide');

            spinnerSaveManage.classList.add('hidden');
        }).catch(err => {
            spinnerSaveManage.classList.add('hidden');
        });

    }

    const onRemoveLabel = (e) => {
        editLabelId = '';
        const labelId = e.currentTarget.parentElement.parentElement.getAttribute('bm-label-id');

        const afterRemoveFlag = cloneFlagList.filter(item => String(item.id) !== labelId);
        cloneFlagList = [...afterRemoveFlag];
        console.log(cloneFlagList);

        const listLabel = renderManageLabelsList(cloneFlagList);
        manageLabelListUl.innerHTML = listLabel;
        saveManagelabelsBtn.disabled = false;
        addEventToRemoveLabelBtn();
        addEventToEditLabelBtn();
    };

    const onEditLabel = (e) => {
        console.log(e.currentTarget.parentElement.parentElement);
        const selectedEle = e.currentTarget.parentElement.parentElement
        const labelId = selectedEle.getAttribute('bm-label-id');
        const descript = selectedEle.getAttribute('label-descript');
        const colorCode = selectedEle.getAttribute('bm-cl-code');

        editLabelId = labelId;
        labelEditAddInput.value = descript;


        labelEditAddGroup.classList.add('active');

        colorlabelItem.forEach(item => {
            item.classList.remove('active');
        })  
        
        colorlabelItem[Number(colorCode) - 1].classList.add('active');

        addEventToRemoveLabelBtn();
        addEventToEditLabelBtn();
    };

    const openModalManageLabels = () => {
        let $modal = $('#bm-manage-labels-modal');
        if (!$('#bm-manage-labels-modal').length) {
            $('body').append(renderManageLabels(GLOBAL.getLangJson()));
            $modal = $('#bm-manage-labels-modal');
            $closeManageLabels = $modal.find('.close');

            $('#bm-manage-labels-modal').on('hidden.bs.modal', onCloseModalManageLabels);

            manageAddlabel = document.querySelector('.label-add-btn');
            labelEditAddGroup = document.querySelector('.label-edit-add-group');
            colorlabelItem = document.querySelectorAll('#bm-manage-labels-modal .color-label-item');
            labelEditAddConfirmBtn = document.querySelector('.label-edit-add-confirm');
            labelEditAddInput = document.querySelector('#label-edit-add-input');
            manageLabelListUl = document.querySelector('#bm-manage-labels-modal .bm-label-list');
            saveManagelabelsBtn = document.querySelector('.save-manage-labels');

            spinnerSaveManage = saveManagelabelsBtn.querySelector('.spinner-grow');

            addEventToRemoveLabelBtn();
            addEventToEditLabelBtn();
    
            manageAddlabel.addEventListener('click', openAddlabel)
            colorlabelItem.forEach(item => {
                item.addEventListener('click', colorLabelItemOnClick);
            })
    
            labelEditAddConfirmBtn.addEventListener('click', onConfirmAddEditLabel);
            saveManagelabelsBtn.addEventListener('click', onSaveManageLabels);
        }
        $modal.modal('show');

        cloneFlagList = [...flagList];
    };

    const openModalLabelMess = (mess) => {
        let $modal = $('#bm-label-mess-modal');
        let $closeBtn;
        if (!$('#bm-label-mess-modal').length) {
            console.log(mess);
            $('body').append(renderLabelMessTemplate(GLOBAL.getLangJson()));
            $modal = $('#bm-label-mess-modal');
            $closeBtn = $modal.find('.close');

            searchLabelInput = document.querySelector('#mb-search-label-input');
            labelListUl = document.querySelector('#bm-label-mess-modal .bm-label-list');
        
            manageLabel = document.querySelector('#bm-label-mess-modal .bm-manage-label');

            searchLabelInput.addEventListener('keyup', onSearchLabel);
            manageLabel.addEventListener('click', openModalManageLabels);
    
            itemLabelOnClickFunc();
        }

        $modal.modal('show');
    }

    return {
        onClickViewBookmarks,

        onInit: (message) => {
            // const bookmarkBtn = document.querySelector('.js-menu-messages-bookmark');
            // const pulseBookmarkBtn = bookmarkBtn.querySelector('.pulse');
            // pulseBookmarkBtn.classList.remove('hidden');
            // bookmarkBtn.disabled = true;
            // $('.js-menu-messages-bookmark lang').html(GLOBAL.getLangJson().LOADING);
            
            // messageId = message[0].dataset.chatId;
            // currentRoomId = getCurrentRoomId()
            // $bookmarkMessage = message;

            // isBookmark = $bookmarkMessage.hasClass('bookmark');
           
            // API.post(`chats/${currentRoomId}/messages/${messageId}/star`).then(() => {
            //     if(isBookmark) {
            //         // Remove Bookmark 
            //         ALERT.show(GLOBAL.getLangJson().ALREADY_REMOVE_BOOKMARK, 'danger');
            //     } else {
            //         // Add Bookmark 
            //         ALERT.show(GLOBAL.getLangJson().ALREADY_ADD_BOOKMARK, 'success');
            //     }
            // }).catch((err) => {
            //     console.log(err);
            // });
            flagList = GLOBAL.getLabelsList();
            console.log(flagList);
            openModalLabelMess(message.get(0))
        },

        onGetIsViewingBookmark: () => isViewingBookmark,

        closeModalViewBookmark,
    };
});
