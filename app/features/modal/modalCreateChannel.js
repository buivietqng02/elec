define(['shared/data', 'shared/api', 'shared/alert', 'features/sidebar/sidebarService'], (GLOBAL, API, ALERT, sidebarService) => {
    let $input;
    let $modal;
    let $btnSend;
    let $btnCancel;

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="createChannelModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p data-language="ENTER_EMAIL_ADDRESS">
                            ${langJson.ENTER_CHANNEL_NAME}
                        </p>
                        <input id="ccm-name-input" placeholder="${langJson.ENTER_CHANNEL_NAME}" />
                        <button data-language="SEND" type="button" class="btn btn-outline-primary btn-small float-right" disabled>
                            ${langJson.SEND}
                        </button>
                        <button data-language="CANCEL" type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onChange = () => {
        const value = $input.val();

        if (!value.length) {
            $input.addClass('error');
            $btnSend.prop('disabled', true);
        } else {
            $input.removeClass('error');
            $btnSend.prop('disabled', false);
        }
    };

    const onSend = () => {
        const channelName = $input.val();

        if (!channelName.length) {
            return;
        }

        // $btnCancel.click();

        const channel = {
            subject: channelName,
            channel: true
        };

        API.post('chats', channel).then((chat) => {
            if (chat) {
                GLOBAL.setRooms([GLOBAL.setRoomWithAdapter(chat), ...GLOBAL.getRooms()]);
                sidebarService.newRoomUp(chat);
                $btnCancel.click();
            }
        }).catch((e) => {
            ALERT.show(e);
        });
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return {
        onInit: () => {
            if (!$('#createChannelModal').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#createChannelModal');
                $input = $('#ccm-name-input');
                $btnSend = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');

                $(document).on('input', '#ccm-name-input', onChange);
                $input.keydown(onKeyDown);
                $btnSend.click(onSend);
            }

            $modal.modal('show');
            $input.val('');
            $btnSend.prop('disabled', true);
            setTimeout(() => $input.focus(), 500);
        }
    };
});
