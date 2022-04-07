define([
    'features/modal/modalMediaAndFiles',
    'shared/functions',
    'assets/js/slick.min.js'
], (
    modalMediaAndFiles,
    functions
) => {
    // const { API_URL } = constant;
    let $modal;
    let $img;
    let wzoom;
    let $frame;
    let hdImg;
    let mediaFilesWraper;
    let loadingHigherResCap;
    let downloadImg;

    const {
        downloadImage
    } = functions;

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
                        <div class="image-bottom-options clearfix">
                            <div class="ibo-zoom-up">
                                <i class="icon-zoom-in"></i>
                            </div>
                            <div class="ibo-zoom-down">
                                <i class="icon-zoom-out"></i>
                            </div>

                            <div class="img-download-container" data-toggle="tooltip" data-placement="top" title="Download image">
                                <button class="img-download">
                                    <i class="icon-download"></i>
                                </button>
                            </div>

                            <!-- View All image -->
                            <div id="viewFullLibrary">
                                <i class="xm icon-photo xm-fw" aria-hidden="true"></i>
                                <span>View library</span>
                            </div>
                            
                        </div>

                        <p class="loading-hd-img" style="display:none">Loading higher resolution image...</p>
                        
                        <div class="embed-responsive embed-responsive-4by3">
                            <div class="image-caption-wrap embed-responsive-item" id="image-caption-wrap">
                                <img class="icw-image" id="icw-image" />
                            </div>
                        </div>
                        <!-- <div id="image-slick-slide"></div> -->
                    </div>
                </div>
            </div>
        </div>
    `;

    const zoomFunc = (id) => {
            wzoom = WZoom.create(`#${id}`, {
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
    };

    const loadingHDimg = () => {
        $img.style.display = 'none';
        hdImg.classList.remove('inactive');
        zoomFunc('icw-hd-image');
    };

    const applyLargePicture = (e) => {
        wzoom.maxZoomDown();
        $img.style.display = 'none';
        setTimeout(() => {
            // eslint-disable-next-line prefer-destructuring
            $img.src = e.target.src;
            downloadImg.setAttribute('src', e.target.src);
            downloadImg.addEventListener('click', downloadImage);

            $img.addEventListener('load', () => {
                // $img.style.visibility = 'visible';
                $img.style.display = 'block';
                loadingHigherResCap.style.display = 'block';
                
                setTimeout(() => {
                    hdImg = document.createElement('img');
                    hdImg.src = e.target.src.replace('&small=1', '&small=0');
                    downloadImg.href = hdImg.src; 

                    hdImg.id = 'icw-hd-image';
                    hdImg.classList.add('inactive');
                    $frame.append(hdImg);
                    
                    hdImg.addEventListener('load', () => {
                        loadingHigherResCap.style.display = 'none';
                        loadingHDimg();
                    }, { once: true });
                }, 500);
            }, { once: true });
        }, 500);
    };

    const showImage = (e) => {
        $modal.modal('show');
        zoomFunc('icw-image');
        applyLargePicture(e);
    };

    return {
        onInit: () => {
            if (!$('#showImageFull').length) {
                mediaFilesWraper = document.querySelector('.view-media-files-wraper');

                $('body').append(renderTemplate);
                $modal = $('#showImageFull');
                // $imgSlide = $('#image-slick-slide');
                $img = document.getElementById('icw-image');

                $frame = document.getElementById('image-caption-wrap');
                loadingHigherResCap = document.querySelector('.loading-hd-img');

                downloadImg = document.querySelector('.img-download');
                
                $(document).off('.showFullImage').on('click.showFullImage', '.--click-show-popup-up-img', showImage);
               
                $('#viewFullLibrary').off().click(() => {
                    $('#showImageFull').modal('hide');
                    
                    // If already open model viewAndMedia, don't need to init again
                    if (mediaFilesWraper.classList.contains('hidden')) {
                        modalMediaAndFiles.onInit();
                    }
                });

                $('#showImageFull').on('hidden.bs.modal', () => {
                    while ($frame.childElementCount > 1) {
                        $frame.removeChild($frame.lastElementChild);
                    }

                    $img.style.display = 'block';
                });
            }
        }
    };
});
