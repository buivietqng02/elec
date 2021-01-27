define(['shared/data'], (GLOBAL) => {
    let isModalRendered = false;
    let $modal;
    const renderTemplate = (version) => `
        <div class="modal fade" id="versionModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <img src="assets/images/icon.png" alt="Cross messenger">
                        <h2>Cross messenger</h2>
                        <p>
                            Web Version: #XM_VERSION
                        </p>
                        <p>
                            Server Version: ${version}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        onInit: () => {
            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(renderTemplate(GLOBAL.getVersion()));
                $modal = $('#versionModal');
            }

            $modal.modal('show');
        }
    };
});
