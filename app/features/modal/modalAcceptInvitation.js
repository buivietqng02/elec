define(['app/constant', 'shared/data', 'shared/api'], (constant, GLOBAL, API) => {
    let userId;
    let isProcessing;
    let isInitEvent;
    const renderTemplate = (name, langJson) => `
        <div class="modal fade" id="acceptInvitationModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h2 data-language="INVITE_CONFIRMATION">${langJson.INVITE_CONFIRMATION}</h2>
                        <p><lang data-language="DO_YOU_ACCEPT_INVITATION"></lang>${langJson.DO_YOU_ACCEPT_INVITATION} ${name}???</p>
                        <button type="button" class="btn btn-outline-primary btn-small float-right">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <lang data-language="ACCEPT">${langJson.ACCEPT}</lang>
                        </button>
                        <button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            <lang data-language="CANCEL">${langJson.CANCEL}</lang>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onAccept = () => {
        if (isProcessing) {
            return;
        }

        const $modal = $('#acceptInvitationModal');
        const $btnAccept = $modal.find('.btn-outline-primary');
        const $btnCancel = $modal.find('.btn-outline-secondary');
        $btnCancel.hide();
        $btnAccept.prop('disabled', true);
        isProcessing = true;

        API.post(`contacts/${userId}/accept`).then(() => {
            API.get('chats').then((res) => {
                const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
                GLOBAL.setRoomsWithAdapter(res);
                sidebarRoomListComp.onInit();
                $btnCancel.click(); 
            }).catch((err) => {
                console.log(err);
                isProcessing = false;
                $btnAccept.prop('disabled', false);
            });
        }).catch(() => {
            isProcessing = false;
            $btnAccept.prop('disabled', false);
        });
    };

    return {
        onInit: (element) => {
            if (!isInitEvent) {
                isInitEvent = true;
                $(document).on('click', '#acceptInvitationModal .btn-outline-primary', onAccept);
            }

            userId = element.find(`[${constant.ATTRIBUTE_CHANGE_NAME}]`).data().useridName;
            const urlAvatar = element.find('.avatar').prop('src');
            const position = urlAvatar.indexOf('users');

            $('#acceptInvitationModal').remove && $('#acceptInvitationModal').remove();
            $('body').append(renderTemplate(element.find('.contact__name span').text(), GLOBAL.getLangJson()));
            $('#acceptInvitationModal').modal('show');
        }
    };
});
