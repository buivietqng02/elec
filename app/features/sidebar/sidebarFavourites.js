define([
    'shared/api',
    'shared/alert',
    'shared/data',
    'app/constant',
    'features/sidebar/sidebarService'
], (
    API,
    ALERT,
    GLOBAL,
    constant,
    services
) => {
    const { selectedSliderContainerFunc, setCurrentTranslate, setSliderPosition } = services;
    return {
        onToggleFavouritesRoom: (e, type) => {

            let $toggleFavouritesRoomBtn = $('.favouriteBtn');
            let roomID;
    
            if (type === 'desktop') {
                e.stopPropagation();
                roomID = e.target.closest('.js_li_list_user').getAttribute(constant.ATTRIBUTE_SIDEBAR_ROOM);
            }
    
            if (type === 'mobile') {
                roomID = e.currentTarget.getAttribute('favourRoom-mobile-id');
            }
    
            const $iconFavoritesTopBar = $(`[favourites-id="${roomID}"]`);
    
            let isLoading = true;
            $toggleFavouritesRoomBtn.disabled = isLoading;
        
            const listFavouritesRooms = GLOBAL.getFavouritesRooms();
            let indexExistRoomId = -1;
            
            indexExistRoomId = listFavouritesRooms.indexOf(roomID);
    
            if (indexExistRoomId > -1) {
                listFavouritesRooms.splice(indexExistRoomId, 1);
            } else {
                listFavouritesRooms.push(roomID);
            }
    
            try {
                API.put('users/preferences', { favourites_rooms: [...listFavouritesRooms] }).then(() => {
                    isLoading = false;
                    $toggleFavouritesRoomBtn.disabled = isLoading;
                   
                    const roomElement = document.querySelector(`[data-room-id="${roomID}"]`);
                     // Icon star desktop
                    const iconFavouriteFull = roomElement.querySelector('.favouriteBtn .icon-star-full');
                    const iconFavouriteEmpty = roomElement.querySelector('.favouriteBtn .icon-star-empty');
                    // Icon star mobile
                    const iconFavouriteFullMb = roomElement.querySelector('.contact__name .icon-star-full');
                    const iconStarMbBtn = selectedSliderContainerFunc(roomID).querySelector('.favourite-mb-btn i');
                    const textFavorMbBtn = selectedSliderContainerFunc(roomID).querySelector('.favourite-mb-btn lang');
                    
                    if (indexExistRoomId > -1) {
                        // After Remove
                        if (type === 'desktop') {
                            iconFavouriteFull.style.display = 'none';
                            iconFavouriteEmpty.style.display = 'none';
                        }
                       
                        if (type === 'mobile') {
                            iconFavouriteFullMb.style.display = 'none';
                            iconStarMbBtn.classList.replace('icon-star-empty', 'icon-star-full');
                            textFavorMbBtn.textContent = GLOBAL.getLangJson().FAVOURITES;
                        }
    
                        $iconFavoritesTopBar.addClass('hidden');
                        ALERT.show(GLOBAL.getLangJson().REMOVE_FROM_FAVOURITES, 'warning');
                    } else {
                        // After Add
                        if (type === 'desktop') {
                            iconFavouriteFull.style.display = 'block';
                            iconFavouriteEmpty.style.display = 'none';
                        }
    
                        if (type === 'mobile') {
                            iconFavouriteFullMb.style.display = 'block';
                            iconStarMbBtn.classList.replace('icon-star-full', 'icon-star-empty');
                            textFavorMbBtn.textContent = GLOBAL.getLangJson().REMOVE_FAVOURITES;
                        } 
    
                        $iconFavoritesTopBar.removeClass('hidden');
                        ALERT.show(GLOBAL.getLangJson().ADD_TO_FAVOURITES, 'success');
                    }
                    
                    GLOBAL.setFavouritesRooms([...listFavouritesRooms]);
    
                    // Close menu after
                    if (type === 'mobile') {
                        setCurrentTranslate(0);
                        setSliderPosition();
                    }
                });
            } catch (err) {
                console.log(err);
                isLoading = false;
                $toggleFavouritesRoomBtn.disabled = isLoading;
            }
        }
    };
});
