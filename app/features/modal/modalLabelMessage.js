/*eslint-disable*/      
define([
    'app/constant',
    'shared/data',
    'shared/api',
    'shared/alert',
    'features/chatbox/chatboxContentFunctions',
    'features/chatbox/chatboxContentChatList',
    'features/sidebar/sidebarService'
], (
    constant,
    GLOBAL,
    API,  
    ALERT,
    contentFunc,
    chatboxContentChatListComp,
    sidebarService
) => {
    let currentRoomId;
    let isViewingLabelsMess = false;
    let isViewAllRoom = false;

    let listLabelMessChat = {};
    let currentFilterView = 0;
    const resetListLabelAllRooms = {
        listMess: [],
        timestamp: '',
        isTouchLastMess: false,
        isToPosition: false,
        processing: false
    };
    const resetListLabelOneRoom = {
        listMess: [],
        lastOffset: 0,
        isTouchLastMess: false,
        isToPosition: false,
        processing: false
    };

    const { ATTRIBUTE_MESSAGE_ID, LABELS, BM_CL_CODE } = constant;
    const { getCurrentRoomId } = GLOBAL;
    const { renderMessage } = contentFunc;
    const {
        getRoomById, storeRoomById
    } = chatboxContentChatListComp;

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
    let labelEditAddColorList;

    let flagList = [];
    let cloneFlagList = [];
    let editLabelId = '';
    let labelMapping = {};
    let cloneLabelMapping = {};

    let tempAddedLabel = [];

    let viewLabelsWraper;
    let closeViewLabelsBtn;
    let viewLabelMessContent;
    let pulseViewLabel;
    let filterLabelSelect;
    let wrapMessages;
    let isHidenWrapMess = false;

    let currRoomId = '';
    let currMessageId = '';
    let currLabelCode = '';
    
    
    // ===================== View label list ==========================
    const getRoomInfo = (roomIdInfo) => GLOBAL.getRooms().find(room => (room.id === roomIdInfo)); 
    
    const loadingCallAPIViewLabel = () => {
        pulseViewLabel.classList.remove('hidden');
        listLabelMessChat[currentFilterView].processing = true;
    };

    const processAfterCallAPIViewLabel = (res) => {
        listLabelMessChat[currentFilterView].processing = false;
        pulseViewLabel.classList.add('hidden');
        listLabelMessChat[currentFilterView].listMess = listLabelMessChat[currentFilterView].listMess.concat(res);
        if (res.length < 20) listLabelMessChat[currentFilterView].isTouchLastMess = true;

        if (res.length > 0) {
            if (isViewAllRoom) {
                const lastMsgDate = res[res.length - 1]?.msgDate;
                listLabelMessChat[currentFilterView].timestamp = new Date(lastMsgDate).getTime();
            } else {
                listLabelMessChat[currentFilterView].lastOffset = res[res.length - 1]?.sequence;
            }
        }
    };

    const callAPIViewForAllLabel = async (chatId, lastOffsetOrTimestamp) => {
        let res;
        loadingCallAPIViewLabel();

        if (isViewAllRoom) {
            res = await API.get(`chats/messages/label?timestamp=${lastOffsetOrTimestamp}`);
        } else {
            res = await API.get(`chats/${chatId}/messages/label?offset=${lastOffsetOrTimestamp}`);
        }
       
        processAfterCallAPIViewLabel(res);
        return res;
    };

    const callAPIViewForOneLabel = async (chatId, labelId, lastOffsetOrTimestamp, isCheckRemoveLabel) => {
        let res;

        if (isCheckRemoveLabel) {
            res = await API.get(`chats/messages/label/${labelId}?timestamp=${lastOffsetOrTimestamp}`);
        } else {
            loadingCallAPIViewLabel();
            if (isViewAllRoom) {
                res = await API.get(`chats/messages/label/${labelId}?timestamp=${lastOffsetOrTimestamp}`);
            } else {
                res = await API.get(`chats/${chatId}/messages/label/${labelId}?offset=${lastOffsetOrTimestamp}`);
            }
            processAfterCallAPIViewLabel(res);
        }
       
        return res;
    };

    const showRoomName = (rId) => {
        const roomInfo = getRoomInfo(rId);
        let roomName;
        if (roomInfo.subject) {
            roomName = `${GLOBAL.getLangJson().GROUP}: ${roomInfo.subject}`;
        } else {
            roomName = `${GLOBAL.getLangJson().CHAT_WITH}: ${roomInfo.partner.name}`;
        }
        return `
            <div class="search-room-name text-center">
                <span>${roomName}</span>
            </div>
        `;
    };

    const onShowOriginMessage = (id, sequence, roomid) => {
        const chatboxContentComp = require('features/chatbox/chatboxContent');
        closeModalViewLabelMess();
        
        if (roomid) {
            const roomInfo = GLOBAL.getRooms().find(room => (room.id === roomid));
            sidebarService.moveRoomUp(roomInfo);
            console.log(sidebarService);

            $(`.js_li_list_user[data-room-id="${roomid}"]`).click();
        }

        setTimeout(() => {
            chatboxContentComp.onShowExactOriginMessage(id, sequence);
        }, 600);
    };

    const showOriginMessageEventListener = () => {
        viewLabelMessContent.querySelectorAll('.js_li_list_mess').forEach(item => {
            const showOriginMess = item.querySelector('.show_origin_mess');
            const showOriginMessBtn = item.querySelector('.show_origin_btn');
            const sequence = showOriginMessBtn.getAttribute('sequence_number');
            const id = item.getAttribute(ATTRIBUTE_MESSAGE_ID);
            const roomid = showOriginMessBtn.getAttribute('room-id');
    
            showOriginMess.classList.remove('hidden');
            showOriginMess.addEventListener('click', () => onShowOriginMessage(id, sequence, roomid));
        });
    };

    const renderGetMoreMessWhenScroll = (res) => {
        const cloneRes = [...res];
        let messagesHtml = '';

        const pos = viewLabelMessContent.scrollHeight + viewLabelMessContent.scrollTop;

        cloneRes.reverse().forEach(mess => {
            messagesHtml += `
                ${isViewAllRoom ? showRoomName(mess.id.chatId) : ''}
                ${isViewAllRoom ? renderMessage(mess, '', true) : renderMessage(mess)} <hr style="width:100%">
            `;
            return messagesHtml;
        });

        viewLabelMessContent.innerHTML = messagesHtml + viewLabelMessContent.innerHTML;
        viewLabelMessContent.scrollTop = viewLabelMessContent.scrollHeight - pos;

        showOriginMessageEventListener();
    };

    const onGetMoreMessageByScrolling = async () => {
        currentRoomId = getCurrentRoomId();
        let res;
        // All labels
        if (currentFilterView === '0') {
            res = await callAPIViewForAllLabel(currentRoomId, listLabelMessChat[0].lastOffset ?? listLabelMessChat[0].timestamp);
        } else {
        // One label
            res = await callAPIViewForOneLabel(currentRoomId, currentFilterView, listLabelMessChat[currentFilterView].lastOffset ?? listLabelMessChat[currentFilterView].timestamp);
        };
        renderGetMoreMessWhenScroll(res);
    };

    const onWrapperScroll = () => {
        currentFilterView = filterLabelSelect.value;
       
        if (viewLabelMessContent.scrollTop < 100) {
            listLabelMessChat[currentFilterView].isToPosition = true;
        } else {
            listLabelMessChat[currentFilterView].isToPosition = false;
        }
    
        if (listLabelMessChat[currentFilterView].processing 
            || listLabelMessChat[currentFilterView].isTouchLastMess 
            || !listLabelMessChat[currentFilterView].isToPosition) {
            return;
        }
        onGetMoreMessageByScrolling();
    };

    const closeModalViewLabelMess = () => {
        isViewingLabelsMess = false;
        isViewAllRoom = false;
        viewLabelMessContent.classList.remove('viewingLabelMess');
        viewLabelMessContent.classList.remove('viewAllRoom');
        viewLabelMessContent.removeEventListener('scroll', onWrapperScroll);

        if (isHidenWrapMess) {
            wrapMessages.style.display = 'none';
            isHidenWrapMess = false;
        };
        
        if (!viewLabelsWraper.classList.contains('hidden')) {
            viewLabelsWraper.classList.remove('slideIn');
            viewLabelsWraper.classList.add('slideOut');
    
            setTimeout(() => viewLabelsWraper.classList.add('hidden'), 500);
        }
    
        viewLabelMessContent.innerHTML = '';
        listLabelMessChat = {};
        currentFilterView = 0;
    }

    const renderFilterMessWithLabel = () => {
        let filterHTML = '';
        const listOfLabels = GLOBAL.getLabelsList();

        listOfLabels.forEach(item => {
            filterHTML += `
                <option value="${item.color}" style="color: ${renderColorLabel(item.color)}">Label: ${item.descript}</option>
            `;
        });

        return filterHTML;
    };

    const openViewLabelMessModal = () => {
        filterLabelSelect = document.querySelector('.view-labels-filter select');
        viewLabelsWraper = document.querySelector('.view-label-mess-wraper');
        closeViewLabelsBtn = document.querySelector('.view-label-topbar-close');
        if (viewLabelsWraper.classList.contains('hidden')) {
            viewLabelsWraper.classList.remove('hidden');
            viewLabelsWraper.classList.remove('slideOut');
            viewLabelsWraper.classList.add('slideIn');
        }
        closeViewLabelsBtn.addEventListener('click', closeModalViewLabelMess);

        filterLabelSelect.innerHTML = `<option value="0" selected>Search for all labeled messages</option> ${renderFilterMessWithLabel()}`;
        filterLabelSelect.removeEventListener('change', onRenderMessOneLabel);
        filterLabelSelect.addEventListener('change', onRenderMessOneLabel);
    };

    const renderListLabeledMessage = (res) => {
        const cloneRes = [...res];
        let messagesHtml = '';
        if (res.length <= 0) {
            viewLabelMessContent.innerHTML = `<h4 class="text-center mt-3">${GLOBAL.getLangJson().MESSAGE_NOT_FOUND}</h4>`
            return;
        }
        
        cloneRes.reverse().forEach(mess => {
            messagesHtml += `
                ${isViewAllRoom ? showRoomName(mess.id.chatId) : ''}
                ${isViewAllRoom ? renderMessage(mess, '', true) : renderMessage(mess)} <hr style="width:100%">
            `;
            return messagesHtml;
        });
        
        viewLabelMessContent.innerHTML = messagesHtml;

        viewLabelMessContent.scrollTo(0, viewLabelMessContent.scrollHeight);

        showOriginMessageEventListener();
        viewLabelMessContent.addEventListener('scroll', onWrapperScroll);
    };

    const onRenderMessOneLabel = async (event) => {
        currentFilterView = event.target.value;
        const valueEachLabel = listLabelMessChat[event.target.value];
        let response;
        currentRoomId = getCurrentRoomId();
    
        if (valueEachLabel) {
            response = listLabelMessChat[event.target.value].listMess;
        } else {
            if (isViewAllRoom) {
                listLabelMessChat[currentFilterView] = {...resetListLabelAllRooms};
                if (currentFilterView === '0') {
                    onClickViewLabelsAllRooms();
                    return;
                }
            } else {
                listLabelMessChat[currentFilterView] = {...resetListLabelOneRoom};
                if (currentFilterView === '0') {
                    onClickViewLabelsWithinRoom();
                    return;
                }
            }

            const offsetOrTimestamp = listLabelMessChat[currentFilterView].lastOffset ?? listLabelMessChat[currentFilterView].timestamp;
            response = await callAPIViewForOneLabel(currentRoomId, event.target.value, offsetOrTimestamp);
        }
        renderListLabeledMessage(response);
    };

    const onClickViewLabelsWithinRoom = () => {
        openViewLabelMessModal();
        const viewLabelsMessBtn = document.querySelector('#chatbox-group-option .--viewLabelsMess');
        pulseViewLabel = viewLabelsWraper.querySelector('.pulse-loading');
        viewLabelMessContent = document.querySelector('.view-label-mess-content');

        listLabelMessChat = {};
        currentFilterView = 0;
        listLabelMessChat[currentFilterView] = {...resetListLabelOneRoom};
        isViewAllRoom = false;
        viewLabelsMessBtn.disabled = true;
        currentRoomId = getCurrentRoomId();
        callAPIViewForAllLabel(currentRoomId, listLabelMessChat[0].lastOffset).then((res) => {
            isViewingLabelsMess = true;       
            viewLabelsMessBtn.disabled = false;
            viewLabelMessContent.classList.add('viewingLabelMess');
            listLabelMessChat[0].listMess = res;
    
            renderListLabeledMessage(res, false);
        }).catch((err) => {
            console.log(err);
        });
    };

    const onClickViewLabelsAllRooms = () => {
        openViewLabelMessModal();
        viewLabelMessContent = document.querySelector('.view-label-mess-content');
        pulseViewLabel = viewLabelsWraper.querySelector('.pulse-loading');

        // For show menu item
        wrapMessages = document.querySelector('.js_wrap_mess');
        const displayStyleWrapMess = wrapMessages.getAttribute('style');
        if (displayStyleWrapMess === 'display: none;') {
            isHidenWrapMess = true;
            wrapMessages.style.display = 'block';
        }
        // ============== 
        listLabelMessChat = {};
        currentFilterView = 0;
        listLabelMessChat[currentFilterView] = {...resetListLabelAllRooms};
        isViewAllRoom = true;
        viewLabelMessContent.classList.add('viewAllRoom');

        callAPIViewForAllLabel('', listLabelMessChat[0].timestamp).then((res) => {
            isViewingLabelsMess = true;
            viewLabelMessContent.classList.add('viewingLabelMess');
            listLabelMessChat[0].listMess = res;
    
            renderListLabeledMessage(res, true);
        }).catch((err) => {
            console.log(err);
        });
    };

  // ===================== Manage labels ==========================
    const renderColorLabel = (colorCode) => {
        if (!cloneLabelMapping[colorCode]) {
            cloneLabelMapping = GLOBAL.getDefaultLabelMapping();
        }
        const color = cloneLabelMapping[colorCode];
        const hexaColor = LABELS[color];
        return hexaColor;
    };

    const renderLabelList = (flagList, colorCode) => {
        let listLabel = '';
    
        flagList.forEach((item, index) => {
            const isActive = Number(colorCode) === item.color ? 'active' : '';
            listLabel += `
            <li class="bm-label-item ${isActive}" bm-cl-code="${item.color}" label-descript="${item.descript}">
                <span>
                    <i class="icon-bookmarks" style="color: ${renderColorLabel(item.color)}"></i> 
                    <span class="bm-label-text" style="background: ${renderColorLabel(item.color)}">${item.descript}</span>
                </span>
                
                <span class="bm-label-item-icon">
                    <i class="icon-check"></i>
                    <div class="pulse hidden"></div>
                </span>
            </li>
            `;
        });

        return listLabel;
    };

    const renderLabelMessTemplate = (langJson, colorCode) => {
        const listLabel = renderLabelList(cloneFlagList, colorCode);
    
        return (`
            <div class="modal fade" id="bm-label-mess-modal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" data-language="LABEL_MESSAGE">${langJson.LABEL_MESSAGE}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <p class="bm-manage-label">${langJson.MANAGE}</p>

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
    <li class="manage-labels-item" bm-cl-code="${item.color}" label-descript="${item.descript}">
        <span>
            <i class="icon-bookmarks" style="color: ${renderColorLabel(item.color)}"></i> 
            <span class="bm-label-text" style="background: ${renderColorLabel(item.color)}">${item.descript}</span>
        </span>

        <div class="manage-label-action">
            <span class="label-edit-btn">
                <i class="icon-edit"></i>
            </span>
            <button class="label-remove-btn">
                <i class="icon-close"></i>
                <div class="pulse hidden"></div>
            </button>
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

    const colorLabelItemOnClick = (e) => {
        colorlabelItem.forEach(item => {
            item.classList.remove('active');
        })
        e.currentTarget.classList.add('active');
    }

    const renderColorsListArr = (activeId) => {
        let colorList = []
        if (!activeId) {
            colorList = Object.keys(cloneLabelMapping);
            cloneFlagList.forEach(item => {
                colorList.forEach((ite, index) => {
                    if (item.color === Number(ite)) {
                        colorList.splice(index, 1)
                        return;
                    };
                })
            })
        } else {
            colorList = Object.keys(LABELS);
            const labelMappingArr = Object.values(cloneLabelMapping);
            labelMappingArr.forEach(item => {
                colorList.forEach((ite, index) => {
                    if (item === ite) {
                        colorList.splice(index, 1)
                        return;
                    };
                })
            })
            colorList = [cloneLabelMapping[activeId], ...colorList];
        }

        let listColorLabelsHTML = '';

        const templateLabel = (active, item) => {
            let templateHTML = ''
            if (!activeId) {
                templateHTML = `<div class="color-label-item ${active}" ${BM_CL_CODE}="${item}" style="background: ${renderColorLabel(item)}"></div>`
            } else {
                templateHTML = `<div class="color-label-item ${active}" color-label="${item}" style="background: ${LABELS[item]}"></div>`;
            }

            return templateHTML;
        };

        colorList.forEach(item => {
            let active;
            if (!activeId) { 
                active = colorList[0] === item ? 'active' : '';
            } else {
                active = cloneLabelMapping[activeId] === item ? 'active' : '';
            }
            
            listColorLabelsHTML += templateLabel(active, item);
        })

        return listColorLabelsHTML;
    }

    const renderManageLabels = (langJson) => {
        const listLabel = renderManageLabelsList(cloneFlagList);
   
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
                                <div class="list-color-labels">
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
    };

    const addEventlistenerToColorlabelItem = () => {
        colorlabelItem = document.querySelectorAll('#bm-manage-labels-modal .color-label-item');
        colorlabelItem.forEach(item => {
            item.addEventListener('click', colorLabelItemOnClick);
        })
    };

    const openAddlabel = () => {
        labelEditAddColorList.innerHTML = renderColorsListArr();
        addEventlistenerToColorlabelItem();

        const activeSelectedColor = document.querySelector('.color-label-item.active');
        editLabelId = '';
        labelEditAddInput.value = '';

        if (activeSelectedColor) {
            activeSelectedColor.classList.remove('active');
            document.querySelector('.color-label-item').classList.add('active');
            labelEditAddGroup.classList.add('active');
        };
    };

    const onRenderManageLabelsItem = () => {
        const listLabel = renderManageLabelsList(cloneFlagList);
        manageLabelListUl.innerHTML = listLabel;
        addEventToRemoveLabelBtn();
        addEventToEditLabelBtn();
    };

    const onShowHideManageAddLabel = (isDelete) => {
        const manageLabelItem = document.querySelectorAll('#bm-manage-labels-modal .manage-labels-item');
        const maximumLabel = isDelete ? 11 : 10;

        if (manageLabelItem.length >= maximumLabel) {
            manageAddlabel.classList.add('hidden');
        } else {
            manageAddlabel.classList.remove('hidden');
        }
    };

    const onConfirmAddEditLabel = () => {
        const manageLabelItem = document.querySelectorAll('#bm-manage-labels-modal .manage-labels-item');
        if (!labelEditAddInput.value.trim() || manageLabelItem.length >= 10) return;

        const descript = labelEditAddInput.value.trim();
        const activeSelectedColor = document.querySelector('.color-label-item.active');

        if (!editLabelId) {
            const color = Number(activeSelectedColor.getAttribute(BM_CL_CODE));

            const labelObj = {
                color,
                descript
            }

            cloneFlagList.push(labelObj);
            tempAddedLabel.push(labelObj.color);
        } else {
            const color = activeSelectedColor.getAttribute('color-label');
            cloneFlagList = cloneFlagList.map(item => {
                if (String(item.color) === editLabelId) {
                    return { color: item.color, descript }
                }
                return item         
            });

            cloneLabelMapping[Number(editLabelId)] = color;
        }

        onRenderManageLabelsItem()
       
        labelEditAddInput.value = '';
        activeSelectedColor.classList.remove('active');
        document.querySelector('.color-label-item').classList.add('active');
        labelEditAddGroup.classList.remove('active');
        saveManagelabelsBtn.disabled = false;

        onShowHideManageAddLabel();
    };

    const addEventToRemoveLabelBtn = () => {
        removeLabelBtn = document.querySelectorAll('.label-remove-btn');
        removeLabelBtn.forEach(item => {
            item.addEventListener('click', onRemoveLabelManage);
        })
    };

    const addEventToEditLabelBtn = () => {
        editLabelBtn = document.querySelectorAll('.label-edit-btn');
        editLabelBtn.forEach(item => {
            item.addEventListener('click', onEditLabelManage);
        })
    }
    
    const onRemoveLabelManage = (e) => {
        editLabelId = '';
        const removeLabelManageBtn = e.currentTarget;

        const removeLabelManage = (colorCode) => {
            const afterRemoveFlag = cloneFlagList.filter(item => String(item.color) !== colorCode);
            cloneFlagList = [...afterRemoveFlag];
            onRenderManageLabelsItem();
            saveManagelabelsBtn.disabled = false;
            labelEditAddGroup.classList.remove('active');
        };
        
        const colorCode = removeLabelManageBtn.parentElement.parentElement.getAttribute(BM_CL_CODE);

        if (tempAddedLabel.indexOf(Number(colorCode)) !== -1) {
            removeLabelManage(colorCode);
        } else {
            removeLabelManageBtn.querySelector('.pulse').classList.remove('hidden');
            removeLabelManageBtn.disabled = true;

            callAPIViewForOneLabel('', colorCode, '', true).then(res => {
                if (res.length > 0) {
                    ALERT.show(GLOBAL.getLangJson().LABEL_IS_BEING_USED, 'danger');
                } else {
                    removeLabelManage(colorCode);
                }

                removeLabelManageBtn.querySelector('.pulse').classList.add('hidden');
                removeLabelManageBtn.disabled = false;
            }).catch(err => {
                removeLabelManageBtn.querySelector('.pulse').classList.add('hidden');
                removeLabelManageBtn.disabled = false;
            })
        }

        onShowHideManageAddLabel(true);
    };

    const onCloseModalManageLabels = () => {
        tempAddedLabel = [];
        cloneFlagList = [...flagList];
        cloneLabelMapping = {...labelMapping};
        saveManagelabelsBtn.disabled = true;
        labelEditAddGroup.classList.remove('active');
    }

    const onSaveManageLabels = () => {
        spinnerSaveManage.classList.remove('hidden');
        const manageLabels = {
            flagList: [...cloneFlagList],
            labelMapping: {...cloneLabelMapping}
        }
        saveManagelabelsBtn.disabled = true;
        API.put('users/preferences', { manage_labels: manageLabels }).then(() => {
            GLOBAL.setLabelsList(manageLabels.flagList);
            GLOBAL.setDefaultLabelMapping(manageLabels.labelMapping);

            const chatboxContentComp = require('features/chatbox/chatboxContent');
           
            $('#bm-manage-labels-modal').modal('hide');
            $('#bm-label-mess-modal').modal('hide');

            spinnerSaveManage.classList.add('hidden');

            const roomInfo = getRoomInfo(getCurrentRoomId());
            chatboxContentComp.onLoadMessage(roomInfo);

            if (viewLabelMessContent?.classList?.contains('viewingLabelMess')) {
                const response = listLabelMessChat[currentFilterView]?.listMess;
                renderListLabeledMessage(response);
            }
        }).catch(err => {
            spinnerSaveManage.classList.add('hidden');
        });

    }

    const onEditLabelManage = (e) => {
        const selectedEle = e.currentTarget.parentElement.parentElement
        const descript = selectedEle.getAttribute('label-descript');
        const colorCode = selectedEle.getAttribute(BM_CL_CODE);

        editLabelId = colorCode;
        labelEditAddInput.value = descript;
        labelEditAddGroup.classList.add('active');
        labelEditAddColorList.innerHTML = renderColorsListArr(colorCode);
        addEventlistenerToColorlabelItem();
    };

    const openModalManageLabels = () => {
        let $modal = $('#bm-manage-labels-modal');
        
        if (!$('#bm-manage-labels-modal').length) {
            $('body').append(renderManageLabels(GLOBAL.getLangJson()));
            $modal = $('#bm-manage-labels-modal');

            $('#bm-manage-labels-modal').on('hidden.bs.modal', onCloseModalManageLabels);

            manageAddlabel = document.querySelector('.label-add-btn');
            labelEditAddGroup = document.querySelector('.label-edit-add-group');
          
            labelEditAddConfirmBtn = document.querySelector('.label-edit-add-confirm');
            labelEditAddInput = document.querySelector('#label-edit-add-input');
            labelEditAddColorList = document.querySelector('.list-color-labels');
            manageLabelListUl = document.querySelector('#bm-manage-labels-modal .bm-label-list');
            saveManagelabelsBtn = document.querySelector('.save-manage-labels');
            spinnerSaveManage = saveManagelabelsBtn.querySelector('.spinner-grow');

            addEventToRemoveLabelBtn();
            addEventToEditLabelBtn();
    
            manageAddlabel.addEventListener('click', openAddlabel);
    
            labelEditAddConfirmBtn.addEventListener('click', onConfirmAddEditLabel);
            saveManagelabelsBtn.addEventListener('click', onSaveManageLabels);
        } else {
            onRenderManageLabelsItem();
        }
        
        onShowHideManageAddLabel();
        addEventlistenerToColorlabelItem();

        $modal.modal('show');
    };


    // ===================== Label a message ==========================
    const callAPIlabelMess = async (chatId, messageId, labelId) => {
        const res = await API.post(`chats/${chatId}/messages/${messageId}/label/${labelId}`);
        return res;
    };

    const callAPIRemovelabelMess = async (chatId, messageId) => {
        const res = await API.delete(`chats/${chatId}/messages/${messageId}/label`);
        return res;
    };

    const labelMessageOnSyncEvent = (labelEvents) => {
        labelEvents.forEach(labelEventItem => {
            const roomId = labelEventItem.chatId;
            const messId = labelEventItem.messageId;
            const labelColorId = labelEventItem.label;
            const $message = $(`[${constant.ATTRIBUTE_MESSAGE_ID}="${messId}"]`);

            // Label message
            if (roomId === getCurrentRoomId() || isViewAllRoom) {
                const currentRoomList = getRoomById(roomId);
                const labelIcon = $message.find('.message-bookmark-icon');
             
                if (labelColorId) {
                    $message.addClass('label');
                    $message.attr(BM_CL_CODE, labelColorId);
                    labelIcon.css('color', `${renderColorLabel(labelColorId)}`);
                } else {
                    $message.removeClass('label');
                    $message.attr(BM_CL_CODE, '');
                    labelIcon.css('color', '');
                }
    
                // update to storeRoomById
                const updatedRoomList = currentRoomList?.map((item) => {
                    if (item.id.messageId === messId) {
                        const tempItem = { ...item };
                        tempItem.label = labelColorId;
                        return tempItem;
                    } 
                    return item;
                });
                storeRoomById(roomId, updatedRoomList);
            }
        });
    }

    const labelItemOnClick = (e) => {
        const currentTargetLabel = e.currentTarget;
        const colorId = currentTargetLabel.getAttribute(BM_CL_CODE);

        currentTargetLabel.querySelector('.pulse').classList.remove('hidden');

        if (currentTargetLabel.classList.contains('active')) {
            currentTargetLabel.classList.remove('active');
            callAPIRemovelabelMess(currRoomId, currMessageId).then(res => {
                ALERT.show(GLOBAL.getLangJson().ALREADY_REMOVE_LABEL, 'danger');
                $('#bm-label-mess-modal').modal('hide');
                currentTargetLabel.querySelector('.pulse').classList.add('hidden');
            })
        } else {
            labelItem.forEach(item => {
                item.classList.remove('active');
            })

            currentTargetLabel.classList.add('active');
            callAPIlabelMess(currRoomId, currMessageId, colorId).then(res => {
                ALERT.show(GLOBAL.getLangJson().ALREADY_ADD_LABEL, 'success');
                $('#bm-label-mess-modal').modal('hide');
                currentTargetLabel.querySelector('.pulse').classList.add('hidden');
            });
        }

        listLabelMessChat = {};
    };

    const itemLabelOnClickFunc = () => {
        labelItem = document.querySelectorAll('#bm-label-mess-modal .bm-label-item');
        labelItem.forEach(item => {
            item.addEventListener('click', labelItemOnClick);
        });
    }

    const renderCurrentActiveLabel = (currLabelCode) => {
        const listLabel = renderLabelList(flagList, currLabelCode);
        labelListUl.innerHTML = listLabel;
        itemLabelOnClickFunc();
    };  

    // const onSearchLabel = () => {
    //     const searchText = searchLabelInput.value.toLowerCase().trim();
    //     const searchList = flagList.filter(item => item.descript.toLowerCase().trim().includes(searchText))

    //     const listLabel = renderLabelList(searchList);
    //     labelListUl.innerHTML = listLabel;

    //     itemLabelOnClickFunc()
    // };

    const openModalLabelMess = (mess) => {
        let $modal = $('#bm-label-mess-modal');
        currMessageId = mess.getAttribute(ATTRIBUTE_MESSAGE_ID);
        currLabelCode = mess.getAttribute(BM_CL_CODE);
        if (isViewAllRoom) {
            currRoomId = mess.querySelector('.show_origin_btn').getAttribute('room-id');
        } else {
            currRoomId = getCurrentRoomId();
        }

        if (!$('#bm-label-mess-modal').length) {
            $('body').append(renderLabelMessTemplate(GLOBAL.getLangJson(), currLabelCode));
            $modal = $('#bm-label-mess-modal');
            labelListUl = document.querySelector('#bm-label-mess-modal .bm-label-list');   
            manageLabel = document.querySelector('#bm-label-mess-modal .bm-manage-label');
            manageLabel.addEventListener('click', openModalManageLabels);
            itemLabelOnClickFunc();
        } else {
            renderCurrentActiveLabel(currLabelCode);
        }
        $modal.modal('show');
    };

// ===================== Return ==========================
    return {
        onClickViewLabelsWithinRoom,

        onInit: (message) => {
            flagList = GLOBAL.getLabelsList();
            labelMapping = GLOBAL.getDefaultLabelMapping();
            cloneFlagList = [...flagList];
            cloneLabelMapping = {...labelMapping};
            openModalLabelMess(message.get(0))
        },

        onGetIsViewingLabelMess: () => isViewingLabelsMess,

        closeModalViewLabelMess,

        labelMessageOnSyncEvent,

        onClickViewLabelsAllRooms
    };
});
