/* eslint no-underscore-dangle: 0 */
define(['app/constant', 'shared/data', 'shared/api', 'shared/alert'], (constant, GLOBAL, API, ALERT) => {
    let isModalRendered = false;
    let $modal;
    let $name;
    let $btnLeave;
    let $btnCancel;
    const $caption = $('.js_caption');
    const $chatbox = $('.js_wrap_mess');

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="leaveGroupModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h2><lang data-language="LEAVING_GROUP_CHAT">${langJson.LEAVING_GROUP_CHAT}</lang> "<span></span>" </h2>
                        <p data-language="YOU_WILL_NOT_BE">
                            ${langJson.YOU_WILL_NOT_BE}
                        </p>
                        <button type="button" class="btn btn-outline-primary btn-small float-right">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <lang data-language="LEAVE">${langJson.LEAVE}</lang>
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
        ALERT.show(GLOBAL.getLangJson().UNABLE_TO_CONNECT);
    };

    const onLeave = () => {
        const id = GLOBAL.getCurrentRoomId();
        $btnLeave.prop('disabled', true);
        $btnCancel.hide();
        $modal.data('bs.modal')._config.backdrop = 'static';
        $modal.data('bs.modal')._config.keyboard = false;

        API.delete(`chats/${id}/leave`).then((res) => {
            if (res.status === 400) {
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
            const id = GLOBAL.getCurrentRoomId();
            const roomInfo = GLOBAL.getRooms().filter((room) => (room.id === id))[0] || {};

            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#leaveGroupModal');
                $name = $modal.find('h2 span');
                $btnLeave = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');

                $btnLeave.click(onLeave);
            }

            $btnCancel.show();
            $btnLeave.prop('disabled', false);
            $name.html(roomInfo.subject);
            $modal.modal('show');
            if ($modal.data('bs.modal')) {
                $modal.data('bs.modal')._config.backdrop = true;
                $modal.data('bs.modal')._config.keyboard = true;
            }
        }
    };
});
