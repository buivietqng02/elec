define(['shared/data', 'shared/api', 'shared/alert'], (GLOBAL, API, ALERT) => {
    let $modal;
    let $btnSend;
    let $btnCancel;

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="sendErpModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p data-language="INTEGRATE_ERP_CONTACTS">
                            ${langJson.INTEGRATE_ERP_CONTACTS}
                        </p>
                        <button data-language="ACCEPT" type="button" class="btn btn-outline-primary btn-small float-right">
                            ${langJson.ACCEPT}
                        </button>
                        <button data-language="CANCEL" type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onSend = () => {
        $btnCancel.click();
        API.post('integrateERP').then((res) => {
            if (res.status === 2) {
                ALERT.show(res.message);
                return;
            }

            API.get('chats').then((resTwo) => {
                const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
                sidebarRoomListComp.onInit();
                GLOBAL.setRoomsWithAdapter(resTwo);
                $btnCancel.click();
            });
        }).catch((e) => {
            console.error(e);
            ALERT.show(e);
        });
    };

    return {
        onInit: () => {
            if (!$('#sendErpModal').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#sendErpModal');
                $btnSend = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');
                $btnSend.click(onSend);
            }

            $modal.modal('show');
        }
    };
});
