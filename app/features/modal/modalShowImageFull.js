define(() => {
    let $modal;
    let $img;
    const renderTemplate = `
        <div class="modal fade" id="showImageFull" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <img />
                    </div>
                </div>
            </div>
        </div>
    `;

    const showImage = (e) => {
        $modal.modal('show');
        $img.attr('src', e.target.src.replace('&small=1', '&small=0'));
        $img.removeClass('zoomout');
        $img.removeAttr('style');
    };

    const zoomImage = () => {
        if ($img.hasClass('zoomout')) {
            $img.removeAttr('style');
            $img.removeClass('zoomout');
        } else {
            const {
                clientWidth,
                clientHeight
            } = $img.get(0);

            const scale = clientWidth / clientHeight;
            let height = 0;
            let width = 0;

            if (clientWidth > clientHeight) {
                height = clientHeight * 1.5;
                width = height * scale;
            } else {
                width = clientWidth * 1.5;
                height = width / scale;
            }

            $img.css({
                height: `${height}px`,
                width: `${width}px`
            });

            $img.addClass('zoomout');
        }
    };

    return {
        onInit: () => {
            if (!$('#showImageFull').length) {
                $('body').append(renderTemplate);
                $modal = $('#showImageFull');
                $img = $modal.find('img');
                $(document).on('click', '.--click-show-popup-up-img', showImage);
                $img.click(zoomImage);
            }
        }
    };
});
