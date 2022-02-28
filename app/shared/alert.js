define(['shared/functions'], (functions) => {
    const { render } = functions;
    let isRenderWrapper = false;
    let $wrapper;
    const template = `
        <div class="alert {class}" role="alert">
            {message}
            <button type="button" class="close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;

    const onRemove = (e) => {
        $(e.currentTarget).closest('.alert').remove();
    };
    
    return {
        show: (message, type = 'error') => {
            if (!isRenderWrapper) {
                isRenderWrapper = true;
                $('body').append('<div id="alert-wrapper"></div>');
                $wrapper = $('#alert-wrapper');
                $(document).on('click', '#alert-wrapper .close', onRemove);
            }

            const params = {
                class: 'alert-danger',
                message
            };

            if (type === 'success') {
                params.class = 'alert-success';
            }

            if (type === 'dark') {
                params.class = 'alert-dark';
            }

            const $alert = $(render(template, params));
            $wrapper.prepend($alert);

            setTimeout(() => $alert.remove(), 2500);
        }
    };
});
