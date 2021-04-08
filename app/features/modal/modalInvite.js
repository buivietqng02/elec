define(['shared/data', 'shared/api', 'shared/alert'], (GLOBAL, API, ALERT) => {
    let isModalRendered = false;
    let $input;
    let $modal;
    let $btnSend;
    let $btnCancel;

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="inviteModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p data-language="ENTER_EMAIL_ADDRESS">
                            ${langJson.ENTER_EMAIL_ADDRESS}
                        </p>
                        <input id="im-email-input" placeholder="user@mail.com" />
                        <button data-language="SEND" type="button" class="btn btn-outline-primary btn-small float-right" disabled>
                            ${langJson.SEND}
                        </button>
                        <button data-language="CANCEL" type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                            ${langJson.CANCEL}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const onChange = () => {
        const value = $input.val();
        
        if (!validateEmail(value)) {
            $input.addClass('error');
            $btnSend.prop('disabled', true);
        } else {
            $input.removeClass('error');
            $btnSend.prop('disabled', false);
        }
    };

    const onSend = () => {
        const value = $input.val();

        if (!validateEmail(value)) {
            return;
        }

        $btnCancel.click();
        API.post(`contacts/invite?email=${value}`).then((res) => {
            if (res.status === 400) {
                ALERT.show(res.details);
            }
        }).catch((e) => {
            ALERT.show(e);
        });
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return {
        onInit: () => {
            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(renderTemplate(GLOBAL.getLangJson()));

                $modal = $('#inviteModal');
                $input = $('#im-email-input');
                $btnSend = $modal.find('.btn-outline-primary');
                $btnCancel = $modal.find('.btn-outline-secondary');

                $(document).on('input', '#im-email-input', onChange);
                $input.keydown(onKeyDown);
                $btnSend.click(onSend);
            }

            $modal.modal('show');
            $input.val('');
            $btnSend.prop('disabled', true);
            setTimeout(() => $input.focus(), 500);
        }
    };
});
