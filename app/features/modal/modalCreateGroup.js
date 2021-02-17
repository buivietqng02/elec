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
        getAvatar,
        htmlEncode
    } = functions;
    let arrUserId = [];
    let editId = null;
    let isProcess;
    let $modal;
    let $title;
    let $loading;
    let $users;
    let $selectedWrapper;
    let $closeBtn;
    let $saveBtn;
    let $inputSearch;
    let $inputGroupName;
    let isListRoomRendered = false;

    const template = `
        <div data-mcg-id="{id}" data-mcg-name="{name}" class="crm-room">
            <img class="--img avatar" src="{src}">
            <span>{name}</span>
        </div>
    `;
    const selectedTemplate = `
        <div data-mcgs-id="{id}" class="crms-room">
            <div><div>x</div></div>
            <img class="--img avatar" src={src} data-toggle="tooltip" data-placement="right" title="{fullName}" />
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
            name: htmlEncode(name)
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
        arrUserId = arrUserId.filter(user => user.id !== mcgsId);
        $(`[data-mcgs-id="${mcgsId}"]`).remove();
        $('.tooltip.fade.show').remove();
        $(`[data-mcg-id="${mcgsId}"]`).removeAttr('data-mcgi-selected');

        if (!arrUserId.length) {
            $modal.removeClass('room-selected');
        }
    };

    const onUserClick = (e) => {
        const $this = $(e.currentTarget);
        const { mcgId, mcgName } = $this.data();
        const params = {
            id: mcgId,
            fullName: htmlEncode(mcgName),
            name: truncate(htmlEncode(mcgName).split(' ')[0], 8),
            src: getAvatar(mcgId)
        };

        arrUserId = arrUserId.concat({
            id: mcgId,
            name: mcgName,
            alias: null,
            selected: true
        });

        $selectedWrapper.append(render(selectedTemplate, params));
        $modal.addClass('room-selected');
        $this.attr('data-mcgi-selected', mcgId);
        $modal.find('[data-toggle="tooltip"]').tooltip();
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
        $users = $modal.find('[data-mcg-id]');
        $saveBtn = $modal.find('.btn-outline-primary');
        $closeBtn = $modal.find('.close');
        $selectedWrapper = $modal.find('.crm-room-selected-wrapper');
        $loading = $modal.find('.crm-loading');
        $inputSearch = $('#cgm-input-search');
        $inputGroupName = $('#cgm-input-name');
        $inputSearch.attr('autocomplete', 'off');
        $inputGroupName.attr('autocomplete', 'off');

        $modal.on('click', '[data-mcgs-id]', onSelectedUserClick);
        $modal.on('click', '[data-mcg-id]', onUserClick);
        $modal.on('input', '#cgm-input-search', onSearch);

        $saveBtn.click(onSaveGropChat);
    };

    const onRefresh = () => {
        isProcess = false;
        editId = null;
        arrUserId = [];
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
                fullName: member.user.name,
                name: truncate(htmlEncode(member.user.name).split(' ')[0], 8),
                src: getAvatar(member.user.id)
            };

            if (member.admin) {
                arrItem.admin = true;
                params.admin = 'admin';
            }

            arrUserId = arrUserId.concat(arrItem);

            $selectedWrapper.append(render(selectedTemplate, params));
            $(`[data-mcg-id="${member.user.id}"]`).attr('data-mcgi-selected', member.user.id);
            $modal.find('[data-toggle="tooltip"]').tooltip();
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
