define(['shared/api', 'shared/data', 'shared/functions'], (API, GLOBAL, functions) => {
    const { render, debounce, getAvatar, htmlEncode } = functions;
    let $modal;
    let $closeBtn;
    let $input;
    let chatId;
    let isListRoomRendered = false;
    let process = false;
    let $roomWrapper;
    let search = '';
    const offset = 10;
    let range = [0, offset];

    const template = `
        <div data-fmm-room-id="{id}" data-fmm-room-name="{name}" class="fmm-room">
            <img class="--img avatar {group}" src="{src}" {handleImageErr}>
            <span>{name}</span>
        </div>
    `;
    const renderTemplate = (html, langJson) => `
        <div class="modal fade" id="forwardMessageModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="FORWARD_MESSAGE_TO_CHAT">
                            ${langJson.FORWARD_MESSAGE_TO_CHAT}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input data-language="SEARCH_PLACEHOLDER" data-lang-type="placeholder" type="search" name="search" id="fmm-input" placeholder="${langJson.SEARCH_PLACEHOLDER}" />
                        <div class="fmm-room-wrapper">
                            ${html}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const renderRoom = (room) => {
        let data = {};
        let src = '';
        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const name = room.group ? room.subject : (obRoomEdited[room.partner?.id]?.user_name || room.partner?.name);

        // only forward to rooms with id, name and it is not own channel
        if (!room.id || !name || (room.channel && !room.owner)) {
            return '';
        }

        // group chat
        if (room.group) {
            src = getAvatar(room.id, true);
        }

        // direct chat
        if (!room.group) {
            src = getAvatar(room.partner?.id);
        }

        data = {
            id: room.id,
            group: room.group ? 'hagr' : '',
            handleImageErr: `onerror="this.src='${room.group ? '/assets/images/group.svg' : '/assets/images/user.jpg'}'"`,
            src,
            name: htmlEncode(name)
        };

        return render(template, data);
    };

    const filteredRoomList = () => {
        let rooms = GLOBAL.getRooms();
        // console.log(rooms);
        if (search) {
            rooms = rooms.filter(room => {
                const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
                const {
                    id,
                    partner,
                    unreadMessages,
                    group,
                    subject,
                    sender,
                    lastMessage
                } = room;
                const groupName = subject || '';
                const name = group ? '' : (partner?.name || '');
                const editName = group ? '' : (obRoomEdited[partner?.id]?.user_name || '');

                if (String(name).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                if (String(groupName).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                if (String(editName).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                return false;
            });
        }

        return rooms;
    }

    const getRoomsHtml = (rooms, range) => rooms.slice(range[0], range[1]).map(renderRoom);

    const getRoomsList = () => getRoomsHtml(filteredRoomList(), range);

    const appendRoom = () => {
        process = true;
        $roomWrapper.append(getRoomsHtml(filteredRoomList(), range));

        setTimeout(() => {
            process = false;
        }, 100);
    };

    const initScroll = () => {
        $roomWrapper.off().scroll(() => { 
            if ($roomWrapper.scrollTop() + $roomWrapper.height() < $roomWrapper[0].scrollHeight - 100 || process || range[1] > GLOBAL.getRooms().length) {
                return;
            }

            range = [range[1], range[1] + offset];
            appendRoom();
        });
    };

    // const renderRoomList = () => GLOBAL.getRooms().map(renderRoom).join('');

    const onRoomClick = (e) => {
        $closeBtn.click();
        API.post('messages/forward', {
            sourceChatId: GLOBAL.getCurrentRoomId(),
            destChatId: $(e.currentTarget).data().fmmRoomId,
            messageId: chatId
        }).then();
    };

    const onSearch = debounce(() => {
        range = [0, offset];
        search = $input.val().trim().toUpperCase();
        $roomWrapper.html(getRoomsList);
    }, 300);

    return {
        onInit: (id) => {
            const roomList = GLOBAL.getRooms().filter(room => room.id);
            range = [0, offset];
            search = '';
           
            if (!$('#forwardMessageModal').length) {
                $(document).off('.forwardMessageClick').on('click.forwardMessageClick', '[data-fmm-room-id]', onRoomClick);
                $(document).off('.forwardMessageInput').on('input.forwardMessageInput', '#fmm-input', onSearch);
                $('body').append(renderTemplate(getRoomsList, GLOBAL.getLangJson()));
                $modal = $('#forwardMessageModal');
                $closeBtn = $modal.find('.close');
                $rooms = $('[data-fmm-room-id]');
                $input = $('#fmm-input');
                $input.attr('autocomplete', 'off');

                $roomWrapper = $modal.find('.fmm-room-wrapper')
            }

            if (roomList.length !== $rooms.length) {
                $modal.find('.fmm-room-wrapper').html(getRoomsList);
                $rooms = $('[data-fmm-room-id]');
            }
           
            initScroll();

            chatId = id;
            $input.val('');
            $rooms.show();
            $(`[data-fmm-room-id="${GLOBAL.getCurrentRoomId()}"]`).hide();
            $modal.modal('show');

            $modal.scrollTop(0);
        }
    };
});
