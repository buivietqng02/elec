define(['shared/data'],(GLOBAL) => {
    let isModalRendered = false;
    let $modal;
    let $btnRefresh;
    const renderTemplate = (langJson) => `
        <div class="modal fade" id="updateVersionModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p>A new version of Cross Messenger is avaible</p>
                        <button style="margin-right: 10px" type="button" class="btn btn-outline-primary btn-small float-right">
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
            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#updateVersionModal');
                $btnRefresh = $modal.find('.btn-outline-primary');

                $btnRefresh.click(() => window.location.reload(true));
            }

            $modal.modal('show');
        }
    };
});
