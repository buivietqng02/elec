define(['shared/data', 'shared/api', 'shared/alert'], (GLOBAL, API, ALERT) => {
    let isModalRendered = false;
    let $input;
    let $modal;
    let $btnSend;
    let $btnCancel;

    const template = `
        <div class="modal fade" id="sendErpModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p>Enter ERP URL to load contacts</p>
                        <input id="sem-url-input" placeholder="https://erp.iptp.net/erp/dispatcher" />
                        <button type="button" class="btn btn-outline-primary btn-small float-right" disabled>Send</button>
                        <button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onChange = () => {
        const value = $input.val();
        
        if (!value) {
            $input.addClass('error');
            $btnSend.prop('disabled', true);
        } else {
            $input.removeClass('error');
            $btnSend.prop('disabled', false);
        }
    };

    const onSend = () => {
        const value = $input.val();

        if (!value) {
            return;
        }

        $btnCancel.click();
        API.postForm('integrateERP', `url=${value}&email=${GLOBAL.getInfomation().email}`).then((res) => {
            if (res.status === 2) {
                ALERT.show(res.message);
                return;
            }

            API.get('chats').then((resTwo) => {
                const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
                sidebarRoomListComp.onInit();
                GLOBAL.setRoomsWithAdapter(resTwo.data.chats);
                $btnCancel.click();
            });
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
            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(template);

                $modal = $('#sendErpModal');
                $input = $('#sem-url-input');
                $btnSend = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');

                $(document).on('input', '#sem-url-input', onChange);
                $input.keydown(onKeyDown);
                $btnSend.click(onSend);
            }

            const erp = GLOBAL.getInfomation().erp_url || '';

            if (erp) {
                $btnSend.prop('disabled', false);
            } else {
                $btnSend.prop('disabled', true);
            }

            $modal.modal('show');
            $input.val(erp);
            setTimeout(() => $input.focus(), 500);
        }
    };
});
