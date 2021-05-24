define([
    'app/constant',
    'shared/icon',
    'shared/data', 
    'shared/functions'
], (
    constant,
    ICON,
    GLOBAL, 
    functions
) => {
    const { 
        render, getAvatar, htmlEncode, htmlDecode 
    } = functions;
    const template = `
        <div data-mcg-id="{id}" data-mcg-name="{name}" {markSelected} class="crm-room">
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
    const ob = {};
    let $selectedWrapper;
    let $usersWrapper;
    let search = '';
    let offset = 0;
    let offsetSelected = 0;
    let mapArr;
    let arrSelectedUsers = [];

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

    const getUserList = () => {
        let arr = [];

        if (!mapArr) {
            const filterArr = GLOBAL.getRooms().filter(filterRoom);
            mapArr = filterArr.map(mapRoom);
        }

        if (search) {
            arr = mapArr.filter(user => {
                const { name, currentName } = user;
                if (String(name).toUpperCase().indexOf(search.toUpperCase()) > -1) {
                    return true;
                }

                if (String(currentName).toUpperCase().indexOf(search.toUpperCase()) > -1) {
                    return true;
                }

                return false;
            });
        } else {
            arr = arr.concat(mapArr);
        }

        return arr.sort((a, b) => a.currentName.localeCompare(b.currentName))
                .slice(offset, offset + 10)
                .map(room => render(template, room))
                .join('');
    };

    const getSelectedUserList = (isAppend) => {
        let arr = [];

        if (search) {
            arr = arrSelectedUsers.filter(user => {
                const { data, currentName } = user;
                const { name } = data;
                if (String(name).toUpperCase().indexOf(search.toUpperCase()) > -1) {
                    return true;
                }

                if (String(currentName).toUpperCase().indexOf(search.toUpperCase()) > -1) {
                    return true;
                }

                return false;
            });
        } else {
            arr = arr.concat(arrSelectedUsers);
        }

        return arr.slice(isAppend ? offsetSelected : 0, offsetSelected + 10).map(
            user => render(renderSelectedTemplate(GLOBAL.getLangJson()), user)
        ).join('');
    };

    const getSelectWrapper = () => {
        if (!$selectedWrapper) {
            $selectedWrapper = $('#createGroupModal').find('.crmfwu-selected-user');
        }

        return $selectedWrapper;
    };

    const getUsersWrapper = () => {
        if (!$usersWrapper) {
            $usersWrapper = $('#createGroupModal').find('.crmfwu-default-user');
        }

        return $usersWrapper;
    };

    ob.getSelectedUserList = () => arrSelectedUsers;

    ob.refreshSelected = () => {
        offsetSelected = 0;
        arrSelectedUsers = [];
        search = '';
        for (let i = 0, { length } = mapArr; i < length; i += 1) {
            const user = mapArr[i];
            delete user.markSelected;
        }
    };

    ob.initWithEdit = (members) => {
        members.forEach(member => {
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

            arrSelectedUsers = arrSelectedUsers.concat(arrItem);
            for (let i = 0, { length } = mapArr; i < length; i += 1) {
                const user = mapArr[i];
    
                if (user.id === member.user.id) {
                    user.markSelected = `data-mcgi-selected="${member.user.id}"`;
                    break;
                }
            }
        });

        offset = 0;
        arrSelectedUsers.sort((a, b) => a.currentName.localeCompare(b.currentName));
        getSelectWrapper().html(getSelectedUserList());
        getUsersWrapper().html(getUserList());
    };

    ob.handleSearch = (event) => {
        search = event.currentTarget.value;
        offset = 0;
        offsetSelected = 0;

        getUsersWrapper().html(getUserList());
        getSelectWrapper().html(getSelectedUserList());
    };

    ob.getMoreUserOfLeft = (event) => {
        const $scroll = $(event.currentTarget);
        if ($scroll.scrollTop() + $scroll.height() < $scroll[0].scrollHeight - 100) {
            return;
        }

        offset += 10;
        $scroll.append(ob.getUsers().arr);
    };

    ob.getMoreUserOfRight = (event) => {
        const $scroll = $(event.currentTarget);
        if ($scroll.scrollTop() + $scroll.height() < $scroll[0].scrollHeight - 100) {
            return;
        }

        offsetSelected += 10;
        $scroll.append(getSelectedUserList(true));
    };

    ob.getUsers = () => ({
        arr: getUserList(),
        length: mapArr.length
    });

    ob.removeSelectedUser = (e) => {
        const $this = $(e.target).closest('.crm-room');
        const { mcgsId } = $this.data();

        arrSelectedUsers = arrSelectedUsers.filter(user => !(user.id === mcgsId));

        for (let i = 0, { length } = mapArr; i < length; i += 1) {
            const user = mapArr[i];
        
            if (user.id === mcgsId) {
                delete user.markSelected;
                break;
            }
        }

        $(`[data-mcg-id="${mcgsId}"]`).removeAttr('data-mcgi-selected');
        getSelectWrapper().html(getSelectedUserList());
        return arrSelectedUsers.length;
    };

    ob.onUserClick = (e) => {
        const $this = $(e.currentTarget);
        const { mcgId, mcgName } = $this.data();
        let isSelected = false;
        let number = 0;

        for (let i = 0, { length } = arrSelectedUsers; i < length; i += 1) {
            const user = arrSelectedUsers[i];
            
            if (user.id === mcgId) {
                isSelected = true;
                number = i;
                break;
            }
        }

        for (let i = 0, { length } = mapArr; i < length; i += 1) {
            const user = mapArr[i];
        
            if (user.id === mcgId && isSelected) {
                delete user.markSelected;
                break;
            }

            if (user.id === mcgId && !isSelected) {
                user.markSelected = `data-mcgi-selected="${mcgId}"`;
                break;
            }
        }

        if (isSelected) {
            arrSelectedUsers.splice(number, 1);
            $this.removeAttr('data-mcgi-selected');
        } else {
            const obRoomEdit = GLOBAL.getRoomInfoWasEdited()[mcgId];
            const crName = obRoomEdit?.user_name ? htmlEncode(obRoomEdit.user_name) : mcgName;
            $this.attr('data-mcgi-selected', mcgId);
            arrSelectedUsers = arrSelectedUsers.concat({
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
        }

        getSelectWrapper().html(getSelectedUserList());
        return arrSelectedUsers.length;
    };

    ob.grantAdminClick = (e) => {
        const $this = $(e.target).closest('.crm-room');
        const { mcgsId } = $this.data();

        arrSelectedUsers = arrSelectedUsers.map(user => {
            const newUser = { ...user };
            if (user.id === mcgsId) {
                $this.addClass('admin');
                newUser.admin = 'admin';
                newUser.data.admin = true;
            }

            return newUser;
        });
    };

    ob.removeAdminClick = (e) => {
        const $this = $(e.target).closest('.crm-room');
        const { mcgsId } = $this.data();

        arrSelectedUsers = arrSelectedUsers.map(user => {
            const newUser = { ...user };
            if (user.id === mcgsId) {
                $this.removeClass('admin');
                delete newUser.admin;
                delete newUser.data.admin;
            }

            return newUser;
        });
    };

    ob.onInit = () => {
        $selectedWrapper = undefined;
        $usersWrapper = undefined;
        search = '';
        offset = 0;
        offsetSelected = 0;
        mapArr = undefined;
        arrSelectedUsers = [];
    };

    return ob;
});
