define(() => {
    let $modal;
    let $img;
    let wzoom;
    let $frame;
    const renderTemplate = `
        <div class="modal fade" id="showImageFull" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="crm-loading">
                            <div class="pulse"></div>
                        </div>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div class="embed-responsive embed-responsive-4by3">
                            <div class="image-caption-wrap embed-responsive-item" id="image-caption-wrap">
                                <img class="icw-image" id="icw-image" />
                            </div>
                        </div>
                        <div class="image-bottom-options clearfix">
                            <div class="ibo-zoom-up">
                                <i class="icon-search"></i>
                            </div>
                            <div class="ibo-zoom-down">
                                <i class="icon-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const showImage = (e) => {
        $modal.modal('show');
        wzoom.maxZoomDown();
        $img.style.visibility = 'hidden';
        setTimeout(() => {
            // eslint-disable-next-line prefer-destructuring
            $img.src = e.target.src.replace('&small=1', '&small=0');
            $img.style.visibility = 'visible';
        }, 500);
    };

    return {
        onInit: () => {
            if (!$('#showImageFull').length) {
                $('body').append(renderTemplate);
                $modal = $('#showImageFull');
                $img = document.getElementById('icw-image');
                $frame = document.getElementById('image-caption-wrap');
                $(document).off('.showFullImage').on('click.showFullImage', '.--click-show-popup-up-img', showImage);
                wzoom = WZoom.create('#icw-image', {
                    zoomOnClick: false,
                    maxScale: 10,
                    speed: 2,
                    dragScrollableOptions: {
                        onGrab: () => {
                            $frame.style.cursor = 'grabbing';
                        },
                        onDrop: () => {
                            $frame.style.cursor = 'grab';
                        }
                    }
                });

                $('.ibo-zoom-up').off().click(() => {
                    wzoom.zoomUp();
                });
                $('.ibo-zoom-down').off().click(() => {
                    wzoom.zoomDown();
                });
            }
        }
    };
});
