define([
    'app/constant',
    'shared/data',
    'shared/functions',
    // 'shared/api',
    // 'shared/alert'
    'features/chatbox/chatboxContentFunctions'
], (
    constant,
    GLOBAL,
    functions,
    // API,
    // ALERT
    chatboxContentFunctions
    
) => {
    const contactHeight = $('.contacts').eq(0).height() || 1000;
    const {
        render,
        getAvatar,
        stripTags,
        htmlEncode,
        decodeStringBase64,
        truncate
    } = functions;
    const {
        ATTRIBUTE_SIDEBAR_ROOM,
        ATTRIBUTE_CHANGE_IMAGE_GROUP,
        ATTRIBUTE_CHANGE_GROUP_NAME,
        ATTRIBUTE_CHANGE_NAME,
        ATTRIBUTE_INVITE_ID
    } = constant;
    const ob = {};
    const offset = contactHeight < 600 ? 10 : Math.ceil(contactHeight / 60);
    let range = [0, offset];
    let process = false;
    let search = '';
    let filter = 1;

    // Slide to show menu
    let isTouched = false;
    let isDrag = false;
    let startPos = 0;
    let currentTranslate = 0;
    let animationID;
    let currentSlideRoomID;
    let isShowMenu = false;

    const template = `
        <div class="js_li_list_user-container">
            <li class="js_li_list_user contact-list__item p-cur {status} {live} {mute} {isFavourite} slide-menu" ${ATTRIBUTE_SIDEBAR_ROOM}="{id}" {isGroup} {inviteId}>
                <img ${ATTRIBUTE_CHANGE_IMAGE_GROUP}="{id}" class="--img avatar {classImg}" src="{src}" {handleImageErr} />
                <div class="badge badge-orange">{unread}</div>
                <div class="badge-tag hidden">@</div>
                <div class="p-pl-10 meta">
                    <div class="--name contact__name p-1-line">
                        <i class="xm icon-volume-mute" aria-hidden="true"></i>
                        <span ${ATTRIBUTE_CHANGE_GROUP_NAME}="{id}" ${ATTRIBUTE_CHANGE_NAME}="{userId}">{name}</span> 
                        <i class="xm icon-star-full" aria-hidden="true"></i> 
                    </div>
                    <div class="p-1-line preview">{mess}</div>
                </div>

                <div class="favouriteBtn">
                    <i class="xm icon-star-empty" aria-hidden="true"></i>
                    <i class="xm icon-star-full" aria-hidden="true"></i>
                </div>
            </li>

            <div class="contact-list__item-menu-mb slide-menu">
                <div class="favourite-mb-btn" favourRoom-mobile-id="{id}">
                    <i class="xm icon-star-{favouriteIcon}" aria-hidden="true"></i>
                    <div><small><lang data-language="{lang_FAVOURITES}">{lang_FAVOURITES}</lang></small></div>
                </div>
            </div>
        </div>
    `;

     ob.setCurrentTranslate = (value) => currentTranslate = value;
 
     function getPositionX(event) {
         return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
     }
     
     const selectedSliderContainerFunc = (roomID) => {
        const selectedChatRoom = document.querySelector(`[data-room-id="${roomID}"]`);
        const selectedSliderContainer = selectedChatRoom?.closest('.js_li_list_user-container');

         return selectedSliderContainer;
     }

     ob.selectedSliderContainerFunc = selectedSliderContainerFunc

     const setSliderPosition = () => {
        if (currentTranslate > 0 && !isShowMenu) return
        
        const selectedSlider = selectedSliderContainerFunc(currentSlideRoomID)
        if (selectedSlider) selectedSlider.style.transform = `translateX(${currentTranslate}px)`;

        // Prevent scroll Y when open menu
        const contacts = document.querySelector('.contacts');
        if(currentTranslate < -20) {  
            contacts.style.overflowY = 'hidden';
        } else {
            contacts.style.overflowY = 'auto';
        }
       
     };

     ob.setSliderPosition = setSliderPosition;
 
     const animation = () => {
         setSliderPosition();
         if (isTouched) window.requestAnimationFrame(animation);
     };
 
     const touchStart = (e) => {
        const frame = document.querySelector('#frame');
        // Prevent slide after collapse
        if (!frame.classList.contains('indent')) {
            currentTranslate = 0;
            startPos = getPositionX(e);
            return;
        } 

         startPos = getPositionX(e);

         let previousSlideRoomId = currentSlideRoomID;

         currentSlideRoomID = e.currentTarget.getAttribute('data-room-id')
         selectedChatRoom = e.currentTarget;
         isTouched = true;
        
        animationID = window.requestAnimationFrame(animation);

        // Close tab menu when click on others
         if (previousSlideRoomId !== currentSlideRoomID && isShowMenu) {
            const selectedSlider = selectedSliderContainerFunc(previousSlideRoomId)
            selectedSlider.style.transform = 'translateX(0px)';
         }
 
        //  const slideChatContent = selectedChatRoom.querySelector('.p-pl-10');
        //  // disable default image drag
        //  slideChatContent.addEventListener('dragstart', (event) => event.preventDefault());
     };
       
     const touchMove = (e) => {
         if (isTouched) {

            isDrag = true;
           const currentPosition = getPositionX(e);
           currentTranslate = currentPosition - startPos;
         }
     };
       
     const touchEnd = () => {
         window.cancelAnimationFrame(animationID);
        
         if (!isDrag || !isTouched) return;

         const sidebarWidth = document.querySelector('.sidebar').offsetWidth
         const contactWidth = document.querySelector('.js_li_list_user-container').offsetWidth
        
         if (currentTranslate < -50) {
             currentTranslate = -(Math.abs(contactWidth - sidebarWidth));
             isShowMenu = true;
         } else {
            currentTranslate = 0;
            isShowMenu = false;
         }
 
         setSliderPosition();

        isTouched = false;
        isDrag = false;
        startPos = 0;
     };    
     
    const sliderChatMenu = (roomID) => {
        if(!roomID) return;
        const jsListUser = document.querySelector(`[data-room-id="${roomID}"]`);

        // Touch mobile event
        jsListUser.addEventListener('touchstart', touchStart);
        jsListUser.addEventListener('touchend', touchEnd);
        jsListUser.addEventListener('touchmove', touchMove);

        // mouse events
        // jsListUser.addEventListener('mousedown', touchStart);
        // jsListUser.addEventListener('mouseup', touchEnd);
        // jsListUser.addEventListener('mousemove', touchMove);
        // jsListUser.addEventListener('mouseleave', touchEnd);
    };

    const addEventSliderMenu = () => {
        getRooms().slice(range[0], range[1]).map(item => {
            sliderChatMenu(item.id)
        });
    }

    const getWrapper = () => $('#sidebar_room_list');

    const getRoomsHtml = (rooms, range) => rooms.slice(range[0], range[1]).map(ob.renderRoom);

    const getRooms = () => {
        let rooms = GLOBAL.getRooms();
        // console.log(rooms);
        if (search) {
            rooms = rooms.filter(room => {
                const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
                const {
                    id,
                    partner,
                    unreadMessages,
                    group,
                    subject,
                    sender,
                    lastMessage
                } = room;
                const groupName = subject || '';
                const name = group ? '' : (partner?.name || '');
                const editName = group ? '' : (obRoomEdited[partner?.id]?.user_name || '');

                if (String(name).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                if (String(groupName).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                if (String(editName).toUpperCase().indexOf(search) > -1) {
                    return true;
                }

                return false;
            });
        }

        // Unread
        if (filter === 2) {
            rooms = rooms.filter(room => {
                if (room.unreadMessages) {
                    return true;
                }

                return false;
            });
        }

        // Group
        if (filter === 3) {
            rooms = rooms.filter(room => {
                if (room.group) {
                    return true;
                }

                return false;
            });
        }

        // Direct
        if (filter === 4) {
            rooms = rooms.filter(room => {
                if (!room.group) {
                    return true;
                }

                return false;
            });
        }

        // Favourite rooms
        if (filter === 5) {
            const listFavouritesRooms = GLOBAL.getFavouritesRooms()
            const filterFavorRooms = [];
            rooms = rooms.forEach(room => {
                listFavouritesRooms.forEach(favorItem => {
                    if(room.id === favorItem) filterFavorRooms.push(room);
                })
            });

            rooms = [...filterFavorRooms]
        }

        return rooms;
    };

    const checkRoom = (rid, range) => getRooms().some(room => (room.id === rid));

    ob.initScroll = () => {
        range = [0, offset];
        process = false;
        search = '';
        filter = 1;

        addEventSliderMenu();

        const $scroll = getWrapper().parent();
        $scroll.off().scroll(() => {
            if ($scroll.scrollTop() + $scroll.height() < $scroll[0].scrollHeight - 100 || process) {
                return;
            }

            range = [range[1], range[1] + offset];
            ob.appendRoom();

            roomSlider = document.querySelectorAll('.js_li_list_user-container');
            addEventSliderMenu();
        });
    };

    ob.renderRoom = (room) => {
        const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
        const {
            id,
            partner,
            unreadMessages,
            group,
            subject,
            sender,
            lastMessage,
            muted,
            type
        } = room;
        let data = {};
        let src = '';
        let status = !id ? 'p_disabled' : '';
        const numUnRead = unreadMessages || '';
        let name = group ? subject : (obRoomEdited[partner?.id]?.user_name || partner?.name);
        let mess = lastMessage ? htmlEncode(stripTags(decodeStringBase64(lastMessage))) : '';
        const live = (GLOBAL.getCurrentRoomId() === id) ? 'active' : '';
        const userId = group ? '' : partner?.id;
        let isFavourite = false;

        // data error during processing
        if (group && !name) {
            return '';
        }

        // group chat
        if (group) {
            src = getAvatar(id, true);
        }

        // direct chat
        if (!group) {
            src = getAvatar(partner?.id);
        }

        // direct chat but cross user has not accepted the invitation yet
        if (!group && !partner) {
            src = '/assets/images/user.svg';
        }

        // waiting cross user accept the invitation
        if (!id && sender) {
            name = partner?.name;
            mess = 'Invite: pending';
            src = getAvatar(partner?.id);
        }

        // have not accepted the invitation yet
        if (!id && !sender) {
            name = partner?.name;
            mess = 'Invite: not accepted';
            src = getAvatar(partner?.id);
            status = '';
        }

        if (type === 9) {
            mess = `Pin: ${mess}`;
        }

        if (type === 8) {
            mess = `Unpin: ${mess}`;
        }

        // In case last message contains tag person
        mess = chatboxContentFunctions.renderTag(mess);

        // Favourite Room
        const listFavouritesRooms = GLOBAL.getFavouritesRooms()
        if(listFavouritesRooms.indexOf(id) > -1) {
            isFavourite = true;
        } else {
            isFavourite = false;
        }

        data = {
            id: id,
            isGroup: group ? 'data-is-group="true"' : 'data-is-group="false"',
            inviteId: id ? '' : `${ATTRIBUTE_INVITE_ID}="${partner?.id}"`,
            status,
            live,
            unread: numUnRead,
            handleImageErr: `onerror="this.src='${group ? '/assets/images/group.svg' : '/assets/images/user.jpg'}'"`,
            classImg: group ? 'hagr' : '',
            src,
            name: truncate(htmlEncode(name), 37),
            mess,
            userId,
            mute: muted ? 'mute' : '',
            isFavourite: isFavourite ? 'favourites' : '',
            lang_FAVOURITES: isFavourite ? GLOBAL.getLangJson().REMOVE_FAVOURITES : GLOBAL.getLangJson().FAVOURITES,
            favouriteIcon: isFavourite ? 'empty': 'full'
        };

        return render(template, data);
    };

    ob.getRooms = () => {
        range = [0, offset];
        
        getWrapper().html(getRoomsHtml(getRooms(), range));
    };
    ob.appendRoom = () => {
        process = true;
        getWrapper().append(getRoomsHtml(getRooms(), range));

        setTimeout(() => {
            process = false;
        }, 100);
    };

    ob.moveRoomUp = (room) => {
        $room = $(`[${ATTRIBUTE_SIDEBAR_ROOM}="${room.id}"]`);
        const roomContainer = selectedSliderContainerFunc(room.id)

        $chatsItem = $('#leftbar .lbi-chats');
        $chatsItemNoti = $('.lbi-chats__newMess-noti');

        if (!$room.length && checkRoom(room.id)) {
            range = [range[0] + 1, range[1] + 1];
            getWrapper().prepend(ob.renderRoom(room));
        }

        if ($room.length) {
            $room.remove();
            roomContainer.remove();
            getWrapper().prepend(ob.renderRoom(room));
            sliderChatMenu(room.id);
        }

        if($chatsItemNoti.hasClass('hidden') && !$chatsItem.hasClass('active')) {
            $chatsItemNoti.removeClass('hidden');
        }
       
    };

    ob.newRoomUp = (room) => {
        if (checkRoom(room.id)) {
            range = [range[0] + 1, range[1] + 1];
            getWrapper().prepend(ob.renderRoom(room));
        }
    };

    ob.lostRoom = (rid) => {
        $room = $(`[${ATTRIBUTE_SIDEBAR_ROOM}="${rid}"]`);

        if ($room.length) {
            $room.remove();
            range = [range[0] - 1, range[1] - 1];
        }
    };

    ob.onChangeSearch = (value) => {
        search = value;
        ob.getRooms();

        // Add event listener again when change search
        addEventSliderMenu();
    }

    ob.onChangeFilter = (value) => {
        filter = value;
        ob.getRooms();

        // Add event listener again when change filter
        addEventSliderMenu();
    }

    return ob;
});
