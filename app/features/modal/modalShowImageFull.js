define([
    // 'shared/api',
    // 'app/constant',
    'features/modal/modalMediaAndFiles',
    'assets/js/slick.min.js'
], (
    // API,
    // constant
    modalMediaAndFiles
) => {
    // const { API_URL } = constant;
    let $modal;
    let $img;
    let hdImg;
    let wzoom;
    let wzoomHD;
    let $frame;

    // let $viewHDImage;
    // let isHDMode = false;
    // let $imgSlide;
    // let currentImageId;
    // const activeClassName = 'issi-active';
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
                            <div class="ibo-zoom-down">
                                <i class="icon-search"></i>
                            </div>
                            <div class="ibo-zoom-up">
                                <i class="icon-search"></i>
                            </div>

                            <!-- View All image -->
                            <div id="viewFullLibrary">
                                <i class="xm icon-photo xm-fw" aria-hidden="true"></i>
                                <span>View library</span>
                            </div>
                            
                        </div>

                        <div class="embed-responsive embed-responsive-4by3">
                            <div class="image-caption-wrap embed-responsive-item" id="image-caption-wrap">
                                <img class="icw-image" id="icw-image" />
                                <img id="icw-hd-image" class="inactive" />
                            </div>
                        </div>
                        <!-- <div id="image-slick-slide"></div> -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // const getImageList = () => {
    //     $imgSlide.css({ visibility: 'visible' });

    //     const params = {
    //         chatId: GLOBAL.getCurrentRoomId(),
    //         offset: 0,
    //         type: 2
    //     };
        
    //     API.get('messages', params).then((res) => {
    //         res.messages.reverse().forEach((mess, index) => {
    //             const activeClass = mess.id.messageId === currentImageId ? activeClassName : '';
    //             const { file } = mess;
                
    //             $imgSlide.slick('slickAdd', `
    //                 <div class="iss-item ${activeClass}" data-mess-id="${mess.id.messageId}">
    //                     <img src="${API_URL}/image?id=${file.id}&small=1" />
    //                 </div>
    //             `);

    //             if (activeClass) {
    //                 $imgSlide.slick('slickGoTo', index);
    //             }
    //         });
    //     });
    // };

    const zoomFunc = (id) => {
        const zoomObj = {
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
        };

        if (id === 'icw-hd-image') {
            wzoomHD = WZoom.create(`#${id}`, zoomObj);

            $('.ibo-zoom-up').off().click(() => {
                wzoomHD.zoomUp();
            });
    
            $('.ibo-zoom-down').off().click(() => {
                wzoomHD.zoomDown();
            });
        } else {
            wzoom = WZoom.create(`#${id}`, zoomObj);

            $('.ibo-zoom-up').off().click(() => {
                wzoom.zoomUp();
            });
    
            $('.ibo-zoom-down').off().click(() => {
                wzoom.zoomDown();
            });
        }
    };

    const applyLargePicture = (e) => {
        wzoom.maxZoomDown();
        $img.style.visibility = 'hidden';
        setTimeout(() => {
            // eslint-disable-next-line prefer-destructuring
            // $img.src = isHDMode ? e.target.src.replace('&small=1', '&small=0') : e.target.src;
            $img.src = e.target.src;
            
            $img.addEventListener('load', () => {
                $img.style.visibility = 'visible';

                hdImg.src = e.target.src.replace('&small=1', '&small=0');
                hdImg.addEventListener('load', () => {
                    // isHDMode = true;
                    $img.style.display = 'none';
                    hdImg.classList.remove('inactive');
                    zoomFunc('icw-hd-image');
                });
            }, { once: true });
        }, 500);
    };

    // const viewHDModeFunc = (e) => {
    //     $viewHDImage = $('.view-hd-mode');
    //     const switchButton = document.getElementById('switchHDView');
    //     switchButton.checked = false;

    //     $viewHDImage.off().click(() => {
    //         isHDMode = switchButton.checked ? isHDMode = true : isHDMode = false;
    //         applyLargePicture(e);
    //     });
    // };

    const showImage = (e) => {
        // isHDMode = false;
        $modal.modal('show');
        $img.style.display = 'block';
        hdImg.classList.add('inactive');
        hdImg.removeAttribute('style');
        hdImg.removeAttribute('src');
        // $imgSlide.slick('removeSlide', null, null, true);
        // currentImageId = $(e.target).closest('[data-chat-id]').data().chatId;
        applyLargePicture(e);
        // viewHDModeFunc(e);
        // setTimeout(() => {
        //     getImageList();
        // }, 500);
    };

    // const changeImage = (e) => {
    //     const $this = $(e.currentTarget);
    //     const oldIndex = $(`.${activeClassName}`).index();
    //     const newIndex = $this.index();

    //     if ($this.hasClass(activeClassName)) {
    //         return;
    //     }

    //     $('.iss-item').removeClass(activeClassName);
    //     $this.addClass(activeClassName);
    //     applyLargePicture(e);

    //     if (newIndex > oldIndex) {
    //         $imgSlide.slick('slickGoTo', newIndex + 2);
    //     } else {
    //         $imgSlide.slick('slickGoTo', newIndex - 2);
    //     }
    // };

    return {
        onInit: () => {
            if (!$('#showImageFull').length) {
                $('body').append(renderTemplate);
                $modal = $('#showImageFull');
                // $imgSlide = $('#image-slick-slide');
                $img = document.getElementById('icw-image');
                hdImg = document.getElementById('icw-hd-image');

                $frame = document.getElementById('image-caption-wrap');

                $(document).off('.showFullImage').on('click.showFullImage', '.--click-show-popup-up-img', showImage);
                // $(document).off('.changeLargeImage').
                // on('click.changeLargeImage', '.iss-item', changeImage);
                
                zoomFunc('icw-image');

                // $imgSlide.slick({
                //     slidesToShow: 10,
                //     slidesToScroll: 10,
                //     infinite: false,
                //     arrows: false,
                //     autoplay: false,
                //     responsive: [
                //         {
                //             breakpoint: 1500,
                //             settings: {
                //                 slidesToShow: 8,
                //                 slidesToScroll: 8
                //             }
                //         },
                //         {
                //             breakpoint: 1000,
                //             settings: {
                //                 slidesToShow: 6,
                //                 slidesToScroll: 6
                //             }
                //         },
                //         {
                //             breakpoint: 700,
                //             settings: {
                //                 slidesToShow: 4,
                //                 slidesToScroll: 4
                //             }
                //         },
                //         {
                //             breakpoint: 400,
                //             settings: {
                //                 slidesToShow: 3,
                //                 slidesToScroll: 3
                //             }
                //         }
                //     ]
                // });
                $('#viewFullLibrary').off().click(() => {
                    $('#showImageFull').modal('hide');
                    modalMediaAndFiles.onInit();
                });
            }
        }
    };
});
