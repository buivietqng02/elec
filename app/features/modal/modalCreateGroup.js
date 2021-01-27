define([
    'shared/api', 
    'shared/data', 
    'shared/functions', 
    'shared/alert'
], (
    API, 
    GLOBAL, 
    functions, 
    ALERT
) => {
    const { 
        render, 
        debounce, 
        truncate, 
        getAvatar 
    } = functions;
    let arrUserId = [];
    let editId = null;
    let currentUserId; 
    let isProcess;
    let $menu;
    let $modal;
    let $title;
    let $loading;
    let $users;
    let $selectedWrapper;
    let $content;
    let $closeBtn;
    let $saveBtn;
    let $inputSearch;
    let $sliceCancelBtn;
    let $sliceDeleteBtn;
    let $sliceAdminBtn;
    let $inputGroupName;
    let isListRoomRendered = false;

    const template = `
        <div data-mcg-id="{id}" data-mcg-name="{name}" class="crm-room">
            <img class="--img avatar" src="{src}">
            <span>{name}</span>
        </div>
    `;
    const seletctedTemplate = `
        <div data-mcgs-id="{id}" class="crms-room {admin}">
            <img class="--img avatar" src={src}>
            <span>{name}</span>
        </div>
    `;
    const renderTemplate = (html) => `
        <div class="modal fade" id="createGroupModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            New group chat
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="crm-loading">
                            <img src="./assets/images/double-ring--load.svg" alt="loading...">
                        </div>
                        <input type="text" name="name" id="cgm-input-name" placeholder="Group Name" maxlength="50" />
                        <input type="search" name="search" id="cgm-input-search" placeholder="Search..." />
                        <div class="crm-room-selected-wrapper"></div>
                        <div class="crm-room-wrapper">${html}</div>
                        <div class="menu">
                            <button type="button" class="menu__item crmm-admin-btn" data-dismiss=".menu">
                                <i class="xm xm-key"></i>
                                Admin
                            </button>
                            <button type="button" class="menu__item crmm-delete-btn" data-dismiss=".menu">
                                <i class="xm xm-trash"></i>
                                Delete
                            </button>
                            <button type="button" class="menu__item crmm-cancel-btn" data-dismiss=".menu">
                                <i class="xm xm-close"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const renderRoom = (room) => {
        const firstMember = room.members[0];
        const name = room.group ? room.subject : firstMember?.user?.name;
        const userId = firstMember?.user?.id || '';

        // only direct room
        if (!room.id || !name || room.channel || room.group) {
            return '';
        }

        return render(template, {
            id: userId,
            src: getAvatar(userId),
            name
        });
    };

    const renderRoomList = () => {
        isListRoomRendered = true;
        return GLOBAL.getRooms().map(renderRoom).join('');
    };

    const onSearch = debounce(() => {
        const value = $inputSearch.val().trim().toUpperCase();
        const handleUser = (i) => {
            const $this = $users.eq(i);
            const name = $this.data().mcgName;

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
    }, 300);

    const onSelectedUserClick = (e) => {
        const $this = $(e.currentTarget);
        const { mcgsId } = $this.data();
        let left = $this.offset().left - $content.offset().left;
        const top = $this.offset().top - $content.offset().top - 5;

        if (left + 150 >= ($content.width() + $content.offset().left)) {
            left = $this.offset().left - $content.offset().left - 100;
        }

        currentUserId = mcgsId;
        $menu.css({ 
            top, 
            left
        });
        $menu.show();
    };

    const onUserClick = (e) => {
        const $this = $(e.currentTarget);
        const { mcgId, mcgName } = $this.data();
        const params = {
            id: mcgId,
            name: truncate(mcgName.split(' ')[0], 8),
            src: getAvatar(mcgId)
        };

        arrUserId = arrUserId.concat({
            id: mcgId,
            name: mcgName,
            alias: null,
            selected: true
        });

        $selectedWrapper.append(render(seletctedTemplate, params));
        $modal.addClass('room-selected');
        $this.attr('data-mcgi-selected', mcgId);
    };

    const onSlideCancelClick = () => $menu.hide();

    const onSlideDeleteClick = () => {
        arrUserId = arrUserId.filter(user => user.id !== currentUserId);
        $(`[data-mcgs-id="${currentUserId}"]`).remove();
        $(`[data-mcg-id="${currentUserId}"]`).removeAttr('data-mcgi-selected');

        if (!arrUserId.length) {
            $modal.removeClass('room-selected');
        }

        $menu.hide();
    };

    const onSlideAdminClick = () => {
        arrUserId = arrUserId.map(user => {
            const newUser = { ...user }; 
            if (user.id === currentUserId) {
                if (!user.admin) {
                    $(`[data-mcgs-id="${currentUserId}"]`).addClass('admin');
                    newUser.admin = true;
                } else {
                    $(`[data-mcgs-id="${currentUserId}"]`).removeClass('admin');
                    delete newUser.admin;
                }
            }

            return newUser;
        });

        $menu.hide();
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

        const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
        const chatboxTopbarComp = require('features/chatbox/chatboxTopbar');
        $saveBtn.addClass('loading-btn');
        isProcess = true;
        const params = {
            members: arrUserId,
            id: editId,
            subject: $inputGroupName.val()
        };

        if (editId) {
            const roomId = GLOBAL.getCurrentRoomId();
            API.put('chats', params).then((res) => {
                if (res.status === 403) {
                    $closeBtn.click();
                    ALERT.show("Sorry, you don't have permission to perform this action");
                }

                if (res.chat) {
                    chatboxTopbarComp.onUpdateTitle(params.subject);
                    sidebarRoomListComp.onUpdateRoomName(roomId, params.subject);

                    GLOBAL.setRooms(GLOBAL.getRooms().map(room => {
                        const tempRoom = { ...room };
                        if (roomId === room.id) {
                            tempRoom.subject = params.subject;
                        }
                        
                        return tempRoom;
                    }));

                    GLOBAL.setCurrentGroupMembers(arrUserId.map(member => ({
                        admin: !!member.admin,
                        user: {
                            id: member.id,
                            name: member.name
                        }
                    })));
                    
                    $closeBtn.click();
                }
            }).catch(onErrNetWork);

            return;
        }
        
        API.post('chats', params).then((res) => {
            if (res.chat) {
                const html = sidebarRoomListComp.onRenderRoom(res.chat);
                GLOBAL.setRooms([res.chat, ...GLOBAL.getRooms()]);
                sidebarRoomListComp.onPrepend(html);
                $closeBtn.click();
            }
        }).catch(onErrNetWork);
    };

    const onInit = () => {
        $('body').append(renderTemplate(renderRoomList()));
        $modal = $('#createGroupModal');
        $title = $modal.find('.modal-title');
        $content = $modal.find('.modal-content');
        $menu = $modal.find('.menu');
        $users = $modal.find('[data-mcg-id]');
        $saveBtn = $modal.find('.btn-outline-primary');
        $closeBtn = $modal.find('.close');
        $selectedWrapper = $modal.find('.crm-room-selected-wrapper');
        $sliceCancelBtn = $modal.find('.crmm-cancel-btn');
        $sliceDeleteBtn = $modal.find('.crmm-delete-btn');
        $sliceAdminBtn = $modal.find('.crmm-admin-btn');
        $loading = $modal.find('.crm-loading');
        $inputSearch = $('#cgm-input-search');
        $inputGroupName = $('#cgm-input-name');
        $inputSearch.attr('autocomplete', 'off');
        $inputGroupName.attr('autocomplete', 'off');

        $modal.on('click', '[data-mcgs-id]', onSelectedUserClick);
        $modal.on('click', '[data-mcg-id]', onUserClick);
        $modal.on('input', '#cgm-input-search', onSearch);

        $sliceCancelBtn.click(onSlideCancelClick);
        $sliceDeleteBtn.click(onSlideDeleteClick);
        $sliceAdminBtn.click(onSlideAdminClick);
        $saveBtn.click(onSaveGropChat);
    };

    const onRefresh = () => {
        isProcess = false;
        currentUserId = false;
        editId = null;
        arrUserId = [];
        $menu.hide();
        $title.html('New group chat');
        $loading.hide();
        $inputSearch.val('');
        $inputGroupName.val('');
        $selectedWrapper.html('');
        $saveBtn.removeClass('loading-btn');
        $saveBtn.prop('disabled', false);
        $users.removeAttr('data-mcgi-selected');
        $users.css('display', '');
        $modal.removeClass('room-selected');
        $modal.modal('show');
    };

    const onEditInit = (id) => {
        if (GLOBAL.getCurrentRoomId() !== id) {
            return;
        }

        if (!GLOBAL.getCurrentGroupMembers()) {
            $loading.show();
            $saveBtn.prop('disabled', true);
            setTimeout(() => {
                if ($modal.hasClass('show')) {
                    onEditInit(id);
                }
            }, 500);
            return;
        }

        const roomInfo = GLOBAL.getRooms().filter((room) => room.id === id)[0];
        if (!roomInfo) {
            $closeBtn.click();
            return;
        }

        editId = id;
        $loading.hide();
        $modal.addClass('room-selected');
        $saveBtn.prop('disabled', false);
        $inputGroupName.val(roomInfo.subject);
        GLOBAL.getCurrentGroupMembers().forEach(member => {
            const arrItem = { 
                id: member.user.id,
                name: member.user.name,
                alias: null,
                selected: true
            };
            const params = {
                id: member.user.id,
                name: truncate(member.user.name.split(' ')[0], 8),
                src: getAvatar(member.user.id)
            };

            if (member.admin) {
                arrItem.admin = true;
                params.admin = 'admin';
            }

            arrUserId = arrUserId.concat(arrItem);

            $selectedWrapper.append(render(seletctedTemplate, params));
            $(`[data-mcg-id="${member.user.id}"]`).attr('data-mcgi-selected', member.user.id);
        });
    };

    return {
        onInit: (id) => {
            if (!isListRoomRendered) {
                onInit();
            }

            onRefresh();
            setTimeout(() => $inputGroupName.focus(), 500);

            // handle edit group
            if (id) {
                $title.html('Edit group chat');
                onEditInit(id);
            }
        }
    };
});
