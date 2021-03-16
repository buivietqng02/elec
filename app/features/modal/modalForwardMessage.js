define(['shared/api', 'shared/data', 'shared/functions'], (API, GLOBAL, functions) => {
    const { render, debounce, getAvatar, htmlEncode } = functions;
    let $modal;
    let $closeBtn;
    let $input;
    let chatId;
    let isListRoomRendered = false;
    const template = `
        <div data-fmm-room-id="{id}" data-fmm-room-name="{name}" class="fmm-room">
            <img class="--img avatar {group}" src="{src}" {handleImageErr}>
            <span>{name}</span>
        </div>
    `;
    const renderTemplate = (html) => `
        <div class="modal fade" id="forwardMessageModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Forward message to chat...
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input type="search" name="search" id="fmm-input" placeholder="Search..." />
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

        // only forward to rooms with id, name and it is not channel
        if (!room.id || !name || room.channel) {
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

    const renderRoomList = () => GLOBAL.getRooms().map(renderRoom).join('');

    const onRoomClick = (e) => {
        $closeBtn.click();
        API.post('messages/forward', {
            sourceChatId: GLOBAL.getCurrentRoomId(),
            destChatId: $(e.currentTarget).data().fmmRoomId,
            messageId: chatId
        }).then();
    };

    const onSearch = debounce(() => {
        const value = $input.val().trim().toUpperCase();

        if (!value) {
            $rooms.show();
            return;
        }

        $rooms.each(function () {
            const $this = $(this);
            const name = $this.data().fmmRoomName;

            if (String(name).toUpperCase().indexOf(value) > -1) {
                $this.show();
            } else {
                $this.hide();
            }
        });
    }, 300);

    return {
        onInit: (id) => {
            const roomList = GLOBAL.getRooms().filter(room => room.id);
            if (!isListRoomRendered) {
                isListRoomRendered = true;
                $(document).on('click', '[data-fmm-room-id]', onRoomClick);
                $(document).on('input', '#fmm-input', onSearch);
                $('body').append(renderTemplate(renderRoomList()));
                $modal = $('#forwardMessageModal');
                $closeBtn = $modal.find('.close');
                $rooms = $('[data-fmm-room-id]');
                $input = $('#fmm-input');
                $input.attr('autocomplete', 'off');
            }

            if (roomList.length !== $rooms.length) {
                $modal.find('.fmm-room-wrapper').html(renderRoomList());
                $rooms = $('[data-fmm-room-id]');
            }

            chatId = id;
            $input.val('');
            $rooms.show();
            $(`[data-fmm-room-id="${GLOBAL.getCurrentRoomId()}"]`).hide();
            $modal.modal('show');
        }
    };
});
