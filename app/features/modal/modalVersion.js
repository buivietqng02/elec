define(['shared/data'], (GLOBAL) => {
    const renderTemplate = (version, langJson) => `
        <div class="modal fade" id="versionModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <img src="assets/images/icon.png" alt="Cross messenger">
                        <h2 data-language="CROSS_MESSENGER" >${langJson.CROSS_MESSENGER}</h2>
                        <p>
                            xm-support@iptp.net
                        </p>
                        <p>
                            <lang data-language="WEB_VERSION">${langJson.WEB_VERSION}</lang>: #XM_VERSION
                        </p>
                        <p>
                            <lang data-language="SERVER_VERSION">${langJson.SERVER_VERSION}</lang>: ${version}
                        </p>
                        <p class="learn-more">
                            <a href="https://www.iptp.net/xm/" target="_blank">Learn more</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        onInit: () => {
            let $modal = $('#versionModal');
            
            if (!$modal.length) {
                $('body').append(renderTemplate(GLOBAL.getVersion(), GLOBAL.getLangJson()));
                $modal = $('#versionModal');
            }

            $modal.modal('show');
        }
    };
});
