define(['shared/data', 'features/logout/logout'], (GLOBAL, logout) => {
    let $modal;
    let $btnRefresh;
    const renderTemplate = (langJson, reason) => `
        <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <h5 style="text-align: center;">Your session has expired</h5>
                        <p>Reason: ${reason}</p>
                        <p>Please log out, then log in again.</p>
                        <hr />
                        <button style="margin-left: 10px" type="button" class="btn btn-primary btn-small float-right">
                            ${langJson.LOGOUT}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        onInit: (reason) => {
            if (!$('#logoutModal').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson(), reason));

                $modal = $('#logoutModal');
                $modal.modal({
                    keyboard: false
                });
                $btnRefresh = $modal.find('.btn-primary');

                $btnRefresh.off().click(() => {
                    $modal.modal('hide');
                    // wait for modal to close and then logout
                    setTimeout(() => logout.onLogout(), 300);
                });
            }

            $modal.modal('show');
        }
    };
});
