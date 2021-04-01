/* eslint no-underscore-dangle: 0 */
define(['app/constant', 'shared/data', 'shared/api', 'shared/alert'], (constant, GLOBAL, API, ALERT) => {
    let isModalRendered = false;
    let $modal;
    let $btnRemove;
    let $btnCancel;
    const $caption = $('.js_caption');
    const $chatbox = $('.js_wrap_mess');

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="removeGroupModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h2 data-language="DELETE_GROUP_CHAT">
                            ${langJson.DELETE_GROUP_CHAT}
                        </h2>
                        <p data-language="GROUP_CHAT_INCLUDING">
                            ${langJson.GROUP_CHAT_INCLUDING}
                        </p>
                        <button type="button" class="btn btn-outline-primary btn-small float-right" disabled>
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <lang data-language="REMOVE">${langJson.REMOVE}</lang>
                        </button>
                        <button data-language="CANCEL" type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onErrNetWork = () => {
        $btnCancel.click();
        ALERT.show('Unable to connect to the Internet');
    };

    const onRemove = () => {
        const id = GLOBAL.getCurrentRoomId();
        $btnRemove.prop('disabled', true);
        $btnCancel.hide();
        $modal.data('bs.modal')._config.backdrop = 'static';
        $modal.data('bs.modal')._config.keyboard = false;

        API.delete(`chats/${id}`).then((res) => {
            if (res.status === 400 || res.status === 403) {
                ALERT.show(res.details);
                $btnCancel.click();
                return;
            }
            
            const rooms = GLOBAL.getRooms().filter((room) => (room.id !== id));

            GLOBAL.setRooms(rooms);
            GLOBAL.setCurrentRoomId(null);
            $btnCancel.click();
            $caption.show();
            $chatbox.hide();
            $(`[${constant.ATTRIBUE_SIDEBAR_ROOM}="${id}"]`).remove();
        }).catch(onErrNetWork);
    };

    return {
        onInit: () => {
            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#removeGroupModal');
                $btnRemove = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');

                $btnRemove.click(onRemove);
            }

            $btnRemove.prop('disabled', false);
            $modal.modal('show');
            if ($modal.data('bs.modal')) {
                $modal.data('bs.modal')._config.backdrop = true;
                $modal.data('bs.modal')._config.keyboard = true;
            }
        }
    };
});
