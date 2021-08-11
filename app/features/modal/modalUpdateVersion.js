define(['shared/data'], (GLOBAL) => {
    let $modal;
    let $btnRefresh;
    let $btnCancel;
    const renderTemplate = (langJson) => `
        <div class="modal fade" id="updateVersionModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p>${langJson.NEW_VERSION_AVAILABLE}</p>
                        <button style="margin-left: 10px" type="button" class="btn btn-outline-primary btn-small float-right">
                            ${langJson.REFRESH}
                        </button>
                        <button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        onInit: () => {
            if (!$('#updateVersionModal').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#updateVersionModal');
                $btnRefresh = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');
            }

            $btnRefresh.off().click(() => window.location.reload(true));
            $btnCancel.off().click(() => {
                setTimeout(() => {
                    $modal.modal('show');
                }, 60000);
            });

            $modal.modal('show');
        }
    };
});
