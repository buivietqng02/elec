define(['shared/data', 'app/constant', 'features/chatbox/chatboxInput'], (GLOBAL, constant, chatboxInputComp) => {
    let $modal;
    let $btnRemove;
    let $btnCancel;
    let $message;
    let listCurrentMessages;
    const { ATTRIBUTE_MESSAGE_ID, ATTRIBUTE_SIDEBAR_ROOM } = constant;

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

    const getLastMessageID = () => {
        let lastMessageId = '';
        lastMessageId = listCurrentMessages.lastElementChild.getAttribute(ATTRIBUTE_MESSAGE_ID);
        let position = 0;

        for (let i = (listCurrentMessages.children.length - 1); i >= 0; i -= 1) {
            const classRmMess = listCurrentMessages.children[i].children[0].children[2];
            if (classRmMess.innerText !== 'This message was removed') {
                console.log(i);
                position = i;
                break;
            }
        }
        lastMessageId = listCurrentMessages.children[position].getAttribute(ATTRIBUTE_MESSAGE_ID);
        return lastMessageId;
    };

    const onRemove = () => {
        const roomId = GLOBAL.getCurrentRoomId();
        const { chatId } = $message.data();
        const value = $message.find('.--mess').html();
        const sidebarItem = document.querySelectorAll(`[${ATTRIBUTE_SIDEBAR_ROOM}="${roomId}"]`);

        const lastIdMessage = getLastMessageID();

        if (chatId === lastIdMessage) {
            sidebarItem[0].children[2].children[1].textContent = 'This message was removed';
        }

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

                listCurrentMessages = document.querySelector('.js_ul_list_mess');

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
