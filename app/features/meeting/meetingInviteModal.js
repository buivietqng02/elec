define(['shared/alert', 'shared/data'], (ALERT, GLOBAL) => {
    let isInitEvent;
    let $modal;
    let $url;
    let $urlText;

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="inviteModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" style="width: 400px;" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="INVITE_MORE_PEOPLE">
                            ${langJson.INVITE_MORE_PEOPLE}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="im-text" data-language="SHARE_THE_MEETING_LINK">
                            ${langJson.SHARE_THE_MEETING_LINK}
                        </div>
                        <div class="mvwmb-url">
                            <div class="mvwmb-copy"></div>
                            <div class="mvwmb-placeholder" data-language="CLICK_TO_COPY_AND_SHARE">${langJson.CLICK_TO_COPY_AND_SHARE}</div>
                            <div class="input-only-view"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        onInit: () => {
            if (!isInitEvent) {
                const searchParams = new URLSearchParams(window.location.search);

                isInitEvent = true;
                $('body').append(renderTemplate(GLOBAL.getLangJson()));
                $modal = $('#inviteModal');
                $url = $modal.find('.mvwmb-url');
                $urlText = $modal.find('.mvwmb-copy');
                $urlText.text(`${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);

                $url.click(() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
                    ALERT.show(GLOBAL.getLangJson().LINK_COPIED, 'success');
                });
            }

            $modal.modal('show');
        }
    };
});
