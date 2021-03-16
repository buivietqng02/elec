define(['shared/alert'], (ALERT) => {
    let isInitEvent;
    let $modal;
    let $url;
    let $urlText;

    const template = `
        <div class="modal fade" id="inviteModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" style="width: 400px;" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Invite more people
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="im-text">
                            Share the meeting link to invite others
                        </div>
                        <div class="mvwmb-url">
                            <div class="mvwmb-copy"></div>
                            <div class="mvwmb-placeholder">Click to copy and share meeting link</div>
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
                $('body').append(template);
                $modal = $('#inviteModal');
                $url = $modal.find('.mvwmb-url');
                $urlText = $modal.find('.mvwmb-copy');
                $urlText.text(`${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);

                $url.click(() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${searchParams.get('id')}`);
                    ALERT.show('Link copied to clipboard', 'success');
                });
            }

            $modal.modal('show');
        }
    };
});
