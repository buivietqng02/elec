define(['app/constant', 'shared/data', 'shared/api', 'shared/functions'], (constant, GLOBAL, API, functions) => {
    const { render } = functions;
    let userId;
    let isProcessing;
    let isInitEvent;
    const template = `
        <div class="modal fade" id="acceptInvitationModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h2>Invite confirmation</h2>
                        <p>Do you accept invitation from {name}</p>
                        <button type="button" class="btn btn-outline-primary btn-small float-right">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            Accept
                        </button>
                        <button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">Cancel</button>
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
            $('body').append(render(template, {
                name: element.find('.contact__name span').text()
            }));
            $('#acceptInvitationModal').modal('show');
        }
    };
});
