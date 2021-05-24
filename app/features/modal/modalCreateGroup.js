define([
    'app/constant',
    'shared/icon',
    'shared/api', 
    'shared/data',
    'shared/alert',
    'features/sidebar/sidebarService',
    'features/modal/modalCreateGroupFunc'
], (
    constant,
    ICON,
    API, 
    GLOBAL,
    ALERT,
    sidebarService,
    createGroupService
) => {
    let arrUserId = [];
    let editId = null;
    let isProcess;
    let $modal;
    let $title;
    let $loading;
    let $selectedWrapper;
    let $usersWrapper;
    let $closeBtn;
    let $saveBtn;
    let $inputSearch;
    let $inputGroupName;
    let $numSelected;
    
    const renderTemplate = ({ html, numMembers }, langJson) => `
        <div class="modal fade" id="createGroupModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="crm-loading">
                            <div class="pulse"></div>
                        </div>
                        <input data-language="ENTER_GROUP_NAME" data-lang-type="placeholder" type="text" name="name" id="cgm-input-name" placeholder="${langJson.ENTER_GROUP_NAME}" maxlength="50" />
                        <div class="crm-frame-wrapper">
                            <div class="crmfwu">
                                <div class="crmfwu-search-box">
                                    <i class="xm xm-search"></i>
                                    <input data-language="SEARCH_PLACEHOLDER" data-lang-type="placeholder" type="search" name="search" id="cgm-input-search" placeholder="${langJson.SEARCH_PLACEHOLDER}" />
                                    <span class="crmfwusb-title">
                                        <lang data-language="GROUP_MEMBERS">${langJson.GROUP_MEMBERS}</lang>: 
                                        <span class="crmfwusbt-num">${numMembers}</span> 
                                        <lang data-language="MEMBER">${langJson.MEMBER}</lang>
                                    </span>
                                </div>
                                <div class="crmfwus crmfwu-default-user">
                                    ${html}
                                </div>
                            </div>
                            <div class="crmfwu">
                                <h2 class="crmfwu-title">
                                    <lang data-language="SELECTED">${langJson.SELECTED}<lang>: <span class="crmfwut-num">0</span> <lang data-language="MEMBER">${langJson.MEMBER}</lang>
                                </h2>
                                <div class="crmfwus crmfwu-selected-user"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <lang data-language="SAVE">${langJson.SAVE}</lang>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const renderRoomList = () => {
        const usersOb = createGroupService.getUsers();

        return {
            html: usersOb.arr,
            numMembers: usersOb.length
        };
    };

    const onUserClick = (e) => {
        $numSelected.text(createGroupService.onUserClick(e));
        $modal.find('[data-toggle="tooltip"]').tooltip();
    };

    const onRemoveClick = (e) => {
        $numSelected.text(createGroupService.removeSelectedUser(e));
        $('.tooltip.show').remove();
    };

    const validate = () => {
        if (!$inputGroupName.val()) {
            ALERT.show('Please enter group name.');
            return false;
        }

        if (!createGroupService.getSelectedUserList().length) {
            ALERT.show('Please select at least one member.');
            return false;
        }

        return true;
    };

    const onErrNetWork = () => {
        $closeBtn.click();
        ALERT.show(GLOBAL.getLangJson().UNABLE_TO_CONNECT);
    };

    const onSaveGropChat = () => {
        if (!validate() || isProcess) {
            return;
        }

        $saveBtn.addClass('loading-btn');
        isProcess = true;
        const params = {
            members: createGroupService.getSelectedUserList().map(arr => arr.data),
            id: editId,
            subject: $inputGroupName.val()
        };

        if (editId) {
            const roomId = GLOBAL.getCurrentRoomId();
            API.put('chats', params).then((chat) => {
                if (chat) {
                    $(`[${constant.ATTRIBUTE_CHANGE_GROUP_NAME}="${roomId}"]`).text(params.subject);

                    GLOBAL.setRooms(GLOBAL.getRooms().map(room => {
                        const tempRoom = { ...room };
                        if (roomId === room.id) {
                            tempRoom.subject = params.subject;
                        }

                        return tempRoom;
                    }));
                    $closeBtn.click();
                }
            }).catch(onErrNetWork);

            return;
        }

        API.post('chats', params).then((chat) => {
            if (chat) {
                GLOBAL.setRooms([GLOBAL.setRoomWithAdapter(chat), ...GLOBAL.getRooms()]);
                sidebarService.newRoomUp(chat);
                $closeBtn.click();
            }
        }).catch(onErrNetWork);
    };

    const onInit = () => {
        createGroupService.onInit();
        $('body').append(renderTemplate(renderRoomList(), GLOBAL.getLangJson()));
        $modal = $('#createGroupModal');
        $title = $modal.find('.modal-title');
        $saveBtn = $modal.find('.btn-outline-primary');
        $closeBtn = $modal.find('.close');
        $selectedWrapper = $modal.find('.crmfwu-selected-user');
        $usersWrapper = $modal.find('.crmfwu-default-user');
        $loading = $modal.find('.crm-loading');
        $numSelected = $modal.find('.crmfwut-num');
        $inputSearch = $('#cgm-input-search');
        $inputGroupName = $('#cgm-input-name');
        $inputSearch.attr('autocomplete', 'off');
        $inputGroupName.attr('autocomplete', 'off');

        $usersWrapper.off('scroll').scroll(createGroupService.getMoreUserOfLeft);
        $selectedWrapper.off('scroll').scroll(createGroupService.getMoreUserOfRight);
        $modal.off('.dataMcgId').on('click.dataMcgId', '[data-mcg-id]', onUserClick);
        $modal.off('.crmrgiiCross').on('click.crmrgiiCross', '.crmrgii-cross', onRemoveClick);    
        $modal.off('.crmrgiiAdmin').on('click.crmrgiiAdmin', '.crmrgii-admin', createGroupService.grantAdminClick);
        $modal.off('.crmrgiiRemoveadmin').on('click.crmrgiiRemoveadmin', '.crmrgii-removeadmin', createGroupService.removeAdminClick);
        $modal.off('.cgmInputSearch').on('input.cgmInputSearch', '#cgm-input-search', createGroupService.handleSearch);

        $saveBtn.off('click').click(onSaveGropChat);
    };

    const onRefresh = () => {
        $modal.find('[data-mcg-id]').css('display', '').removeAttr('data-mcgi-selected');
        isProcess = false;
        editId = null;
        arrUserId = [];
        $title.html(GLOBAL.getLangJson().NEW_GROUP_CHAT);
        $numSelected.text(arrUserId.length);
        $loading.hide();
        $inputSearch.val('');
        $inputGroupName.val('');
        $selectedWrapper.html('');
        $saveBtn.removeClass('loading-btn');
        $modal.modal('show');
        createGroupService.refreshSelected();
    };

    const onEditInit = (id) => API.get(`chats/${id}`).then((res) => {
        if (res.members) {
            const roomInfo = GLOBAL.getRooms().filter((room) => room.id === id)[0];
            editId = id;
            $loading.hide();

            if (!roomInfo) {
                $closeBtn.click();
                return;
            }

            $inputGroupName.val(roomInfo.subject);
            $numSelected.text(res.members.length);
            createGroupService.initWithEdit(res.members);
            $modal.find('[data-toggle="tooltip"]').tooltip();
        }
    });

    return {
        onInit: (id) => {
            if (!$('#createGroupModal').length) {
                onInit();
            }

            onRefresh();
            setTimeout(() => $selectedWrapper.scrollTop(0), 200);
            setTimeout(() => $usersWrapper.scrollTop(0), 200);
            setTimeout(() => $inputGroupName.focus(), 500);

            // handle edit group
            if (id) {
                $title.html(GLOBAL.getLangJson().EDIT_GROUP);
                $loading.show();
                setTimeout(() => onEditInit(id), 200);
            }
        }
    };
});
