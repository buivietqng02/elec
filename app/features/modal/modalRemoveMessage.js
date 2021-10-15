define(['shared/data', 'features/chatbox/chatboxInput'], (GLOBAL, chatboxInputComp) => {
    let $modal;
    let $btnRemove;
    let $btnCancel;
    let $message;

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="removeMessageModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p><lang data-language="LEAVING_GROUP_CHAT">${langJson.ARE_YOU_SURE_REMOVE_MESSAGE}</lang></p>
                        <button style="margin-left: 10px" type="button" class="btn btn-danger btn-small float-right">
                            ${langJson.REMOVE}
                        </button>
                        <button data-language="CANCEL" type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onRemove = () => {
        const { chatId } = $message.data();
        const value = $message.find('.--mess').html();

        $message.find('.--mess').addClass('--message-removed').html('This message was removed');
        $message.find('.btn-message-settings').hide();
        $message.find('.--double-check').addClass('hidden');

        chatboxInputComp.onRemove(chatId, value);

        $modal.modal('hide');
    };

    return {
        onInit: (message) => {
            if (!$('#removeMessageModal').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#removeMessageModal');
                $btnRemove = $modal.find('.btn-danger');
                $btnCancel = $modal.find('.btn-outline-secondary');

                $btnRemove.click(onRemove);
            }

            $message = message;

            $btnCancel.show();
            $btnRemove.prop('disabled', false);
            $modal.modal('show');
        }
    };
});
