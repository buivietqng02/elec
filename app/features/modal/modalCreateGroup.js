define([
    'app/constant',
    'shared/icon',
    'shared/api', 
    'shared/data', 
    'shared/functions', 
    'shared/alert',
    'features/sidebar/sidebarService'
], (
    constant,
    ICON,
    API, 
    GLOBAL, 
    functions, 
    ALERT,
    sidebarService
) => {
    const {
        render,
        debounce,
        getAvatar,
        htmlDecode,
        htmlEncode
    } = functions;
    let arrUserId = [];
    let isListRoomRendered = false;
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

    const template = `
        <div data-mcg-id="{id}" data-mcg-name="{name}" class="crm-room">
            <img class="--img avatar" src="{src}">
            <span ${constant.ATTRIBUTE_CHANGE_NAME}="{id}">{currentName}</span>
            <div class="styled-checkbox"></div>
        </div>
    `;
    const renderSelectedTemplate = (langJson) => `
        <div ${constant.ATTRIBUTE_CHANGE_NAME}="{id}" data-mcgs-id="{id}" class="crm-room {admin}">
            <img class="--img avatar" src="{src}">
            <span ${constant.ATTRIBUTE_CHANGE_NAME}="{id}">{currentName}</span>
            <div class="crmr-group-icon">
                <div class="crmrgi-icon crmrgii-admin" data-toggle="tooltip" data-placement="left" title="${langJson.GRANTING_ADMINISTRATOR}" data-lang-type="tooltip" data-language="GRANTING_ADMINISTRATOR">
                    ${ICON.ADMIN}
                </div>
                <div class="crmrgi-icon crmrgii-removeadmin" data-toggle="tooltip" data-placement="left" title="${langJson.REMOVING_ADMINISTRATOR}" data-lang-type="tooltip" data-language="REMOVING_ADMINISTRATOR">
                    ${ICON.REMOVE_ADMIN}
                </div>
                <div class="crmrgi-icon crmrgii-cross" data-toggle="tooltip" data-placement="left" title="${langJson.REMOVE_MEMBER}" data-lang-type="tooltip" data-language="REMOVE_MEMBER">
                    ${ICON.CROSS}
                </div>
            </div>
        </div>
    `;
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

    const filterRoom = (room) => {
        const name = room?.partner?.name;
        const userId = room?.partner?.id || '';

        // only direct room
        if (!room.id || !name || room.channel || room.group || !userId) {
            return false;
        }

        return true;
    };

    const mapRoom = (room) => {
        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const name = room?.partner?.name;
        const userId = room?.partner?.id || '';
        const currentName = obRoomEdited[room?.partner?.id]?.user_name || name;

        return {
            id: userId,
            src: getAvatar(userId),
            name: htmlEncode(name),
            currentName: htmlEncode(currentName)
        };
    };

    const renderRoomList = () => {
        const filterArr = GLOBAL.getRooms().filter(filterRoom);
        const mapArr = [...filterArr].map(mapRoom);

        return {
            html: mapArr.sort((a, b) => a.currentName.localeCompare(b.currentName)).map(room => render(template, room)).join(''),
            numMembers: mapArr.length
        };
    };

    const handleSearch = () => {
        const $users = $modal.find('.crm-room');
        const value = $inputSearch.val().trim().toUpperCase();
        const handleUser = (i) => {
            const $this = $users.eq(i);
            const name = $this.find('span').text();

            if (String(name).toUpperCase().indexOf(value) > -1) {
                $this.css('display', '');
            } else {
                $this.hide();
            }
        };

        if (!value) {
            $users.css('display', '');
            return;
        }

        $users.each(handleUser);
    };

    const onSearch = debounce(handleSearch, 300);

    const onUserClick = (e) => {
        const $this = $(e.currentTarget);
        const { mcgId, mcgName } = $this.data();

        if ($this.attr('data-mcgi-selected')) {
            arrUserId = arrUserId.filter(room => room.id !== mcgId);
            $(`[data-mcgs-id="${mcgId}"]`).remove();
            $this.removeAttr('data-mcgi-selected');
        } else {
            const obRoomEdit = GLOBAL.getRoomInfoWasEdited()[mcgId];
            const crName = obRoomEdit?.user_name ? htmlEncode(obRoomEdit.user_name) : mcgName;

            arrUserId = arrUserId.concat({
                id: mcgId,
                currentName: crName,
                src: getAvatar(mcgId),
                data: {
                    id: mcgId,
                    name: htmlDecode(mcgName),
                    alias: null,
                    selected: true
                }
            }).sort((a, b) => a.currentName.localeCompare(b.currentName));

            $this.attr('data-mcgi-selected', mcgId);
            $selectedWrapper.html(arrUserId.map(
                room => render(renderSelectedTemplate(GLOBAL.getLangJson()), room)
            ));
            $modal.find('[data-toggle="tooltip"]').tooltip();
            if ($inputSearch.val()) {
                handleSearch();
            }
        }

        $numSelected.text(arrUserId.length);
    };

    const onRemoveClick = (e) => {
        const $this = $(e.target).closest('.crm-room');
        const { mcgsId } = $this.data();

        arrUserId = arrUserId.filter(room => room.id !== mcgsId);
        $(`[data-mcg-id="${mcgsId}"]`).removeAttr('data-mcgi-selected');
        $numSelected.text(arrUserId.length);
        $('.tooltip.show').remove();
        $this.remove();
    };

    const onGrantAdminClick = (e) => {
        const $this = $(e.target).closest('.crm-room');
        const { mcgsId } = $this.data();

        arrUserId = arrUserId.map(user => {
            const newUser = { ...user };
            if (user.id === mcgsId) {
                $this.addClass('admin');
                newUser.admin = 'admin';
                newUser.data.admin = true;
            }

            return newUser;
        });
    };

    const onRemoveAdminClick = (e) => {
        const $this = $(e.target).closest('.crm-room');
        const { mcgsId } = $this.data();

        arrUserId = arrUserId.map(user => {
            const newUser = { ...user };
            if (user.id === mcgsId) {
                $this.removeClass('admin');
                delete newUser.admin;
                delete newUser.data.admin;
            }

            return newUser;
        });
    };

    const validate = () => {
        if (!$inputGroupName.val()) {
            ALERT.show('Please enter group name.');
            return false;
        }

        if (!arrUserId.length) {
            ALERT.show('Please select at least one member.');
            return false;
        }

        return true;
    };

    const onErrNetWork = () => {
        $closeBtn.click();
        ALERT.show('Unable to connect to the Internet');
    };

    const onSaveGropChat = () => {
        if (!validate() || isProcess) {
            return;
        }

        $saveBtn.addClass('loading-btn');
        isProcess = true;
        const params = {
            members: arrUserId.map(arr => arr.data),
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

        $modal.on('click', '[data-mcg-id]', onUserClick);
        $modal.on('click', '.crmrgii-cross', onRemoveClick);
        $modal.on('click', '.crmrgii-admin', onGrantAdminClick);
        $modal.on('click', '.crmrgii-removeadmin', onRemoveAdminClick);
        $modal.on('input', '#cgm-input-search', onSearch);

        $saveBtn.click(onSaveGropChat);
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
    };

    const onEditInit = (id) => {
        $loading.show();
        API.get(`chats/${id}`).then((res) => {
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
                res.members.forEach(member => {
                    const obRoomEdit = GLOBAL.getRoomInfoWasEdited()[member.user.id];
                    const crName = obRoomEdit?.user_name ? obRoomEdit.user_name : member.user.name;
                    const arrItem = {
                        id: member.user.id,
                        currentName: htmlEncode(crName),
                        src: getAvatar(member.user.id),
                        data: {
                            id: member.user.id,
                            name: member.user.name,
                            alias: null,
                            selected: true
                        }
                    };

                    if (member.admin) {
                        arrItem.admin = 'admin';
                        arrItem.data.admin = true;
                    }

                    $(`[data-mcg-id="${member.user.id}"]`).attr('data-mcgi-selected', member.user.id);
                    arrUserId = arrUserId.concat(arrItem);
                });

                arrUserId.sort((a, b) => a.currentName.localeCompare(b.currentName));
                $selectedWrapper.html(arrUserId.map(
                    room => render(renderSelectedTemplate(GLOBAL.getLangJson()), room)
                ));
                $modal.find('[data-toggle="tooltip"]').tooltip();
            }
        });
    };

    return {
        onInit: (id) => {
            if (!isListRoomRendered) {
                isListRoomRendered = true;
                onInit();
            }

            onRefresh();
            setTimeout(() => $usersWrapper.scrollTop(0), 200);
            setTimeout(() => $inputGroupName.focus(), 500);

            // handle edit group
            if (id) {
                $title.html(GLOBAL.getLangJson().EDIT_GROUP);
                onEditInit(id);
            }
        }
    };
});
