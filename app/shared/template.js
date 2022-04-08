define(['shared/icon'], (ICON) => ({
    main: `
        <div id="leftbar-mobile">
            <div class="lbmi-welcome">
                <div class="lb-welcome__avatar"></div>
                <div class="lb-welcome-wc__name">Hi <span class="lb-welcome__name"></span></div>
            </div>
            <button class="btn lbm-item lbmi-lagblaster">
                <i class="icon-lb"></i>
            </button>
            <button class="btn lbm-item lbmi-chats">
                <i class="icon-comments"></i>
                <div class="lbi-chats__newMess-noti hidden"></div>
            </button>
            <button class="btn lbm-item lbmi-cart">
                <i class="icon-shopping-cart"></i>
            </button>
            <button class="btn lbm-item lbmi-conference">
                <i class="icon-video-camera"></i>
            </button>

        </div>

        <div id="leftbar">
            <div class="lb-cuser-avatar"></div>

            <!-- Lag Blaster Button --> 
            <div class="lb-item lbi-lagblaster">
                <i class="icon-lb"></i>
            </div>
            <!-- End Lag Blaster Button --> 

            <div class="lb-item lbi-chats">
                <i class="icon-comments"></i>
                <div class="lbi-chats__newMess-noti hidden"></div>
            </div>

            <div class="lb-item lbi-cart">
                <i class="icon-shopping-cart"></i>
            </div>

            <!-- Conference -->
            <div class="lb-item lbi-conference">
                <i class="icon-video-camera"></i>
            </div>
            <!-- End Conference -->

            <div class="lb-options-group">
                <div class="lbog-users">
                    <div class="lbogi-icon btn-sidebar-contacts">
                        <i class="icon-users"></i>
                    </div>
                    <div class="xm-dropdown dropdown-soc">
                        <div class="sodi-startchat">
                            <i class="icon-comments"></i>
                            <lang data-language="START_CHAT"></lang>
                        </div>

                        <!-- 
                        <div class="sodi-conference">
                            <i class="icon-video-camera"></i>
                            <lang data-language="START_CONFERENCE"></lang>
                        </div>
                        -->

                        <div class="sodi-channel">
                            <i class="icon-info-circle"></i>
                            <lang data-language="CREATE_CHANNEL"></lang>
                        </div>
                        <div class="sodi-invite">
                            <i class="icon-send"></i>
                            <lang data-language="SEND_INVITE"></lang>
                        </div>
                        <div class="sodi-erpcontacrt">
                            <i class="icon-users"></i>
                            <lang data-language="ERP_CONTACTS"></lang>
                        </div>
                    </div>
                </div>
                <div class="lbog-options">
                    <div class="lbogi-icon btn-sidebar-options">
                        <i class="icon-cog"></i>
                    </div>
                    <div class="xm-dropdown dropdown-soo">
                        <div class="sodi-interface">
                            <i class="icon-users"></i>
                            <lang data-language="USER_INTERFACE"></lang>
                        </div>
                        <div class="sodi-about">
                            <i class="icon-info-circle"></i>
                            <lang data-language="ABOUT"></lang>
                        </div>
                        <div class="sodi-language">
                            <i class="icon-language"></i>
                            <lang data-language="LANGUAGE"></lang>
                        </div>
                        <div class="sodi-logout">
                            <i class="icon-info-circle"></i>
                            <lang data-language="LOGOUT"></lang>
                        </div>
                    </div>
                </div>
                <div class="lbog-collapse">
                    <div class="lbogi-icon btn-sidebar-collapse">
                        <i class="icon-angle-up"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- LagBlaster content --> 

        <!--
        <div id="lagblaster-content">
            <div class="lb-tab-content" id="lb-tabContent">
                <div class="lb-content show" id="lb-home-content" role="tabpanel"> 
                    <div id="lb-home-balance" class="lb-home-content__item">
                        <div class="lb-home-content__item__wrap text-center">
                            <div class="">
                                <div class="lb-home-content__item__text">Available balance</div>
                                <div class="lb-home-content__item__amount">2,000,000 đ</div>
                            </div>
                            
                            <div class="d-flex justify-content-center">
                                <div class="lb-home-content__item__wrap__addMoney">
                                    <i class="icon-add"></i>
                                    <div class="lb-home-content__item__desc">Add money</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <div id="lb-home-package" class="lb-home-content__item">
                        <div class="lb-home-content__item__wrap">
                            <div class="row lb-home-package-item">
                                <div class="col">
                                    <div>Current package</div>                             
                                </div>
                                <div class="col">
                                    <b>Alpha: 48$/ month</b>
                                </div>
                            </div>

                            <div class="row lb-home-package-item">
                                <div class="col">
                                    Subscription status
                                </div>
                                <div class="col">
                                    <div class="lb-home-content__item__desc active-status">
                                        <div class="active-icon mr-2"></div>
                                        <span>Active</span>
                                    </div>
                                </div>
                            </div>

                            <div class="row lb-home-package-item">
                                <div class="col">
                                    Connection status
                                </div>
                                <div class="col">
                                    <div class="lb-home-content__item__desc deactive-status">
                                        <div class="active-icon mr-2"></div>
                                        <span>Disconnected</span>
                                    </div>
                                </div>
                            </div>

                            <hr>
                            <div class="row"> 
                                <div class="col">
                                    <div>Subscription due</div>
                                </div>
                                <div class="col"><b>01/04/2022 00:00</b></div>
                            </div>
                                
                        </div>      
                    </div>

                    <div id="lb-home-btnList" class="lb-home-content__item">
                        <div class="row">
                            <div id="lb-home-btnList-changePlan" class="col lb-home-btnList-item">
                                <div><i class="icon-change"></i></div>  
                                Change Plan
                            </div>
                            <div id="lb-home-btnList-renew" class="col lb-home-btnList-item">
                                <div><i class="icon-renew"></i></div>
                                Renew
                            </div>
                            <div id="lb-home-btnList-addMoney" class="col lb-home-btnList-item">
                                <div><i class="icon-add"></i></div>
                                Add money
                            </div>
                        </div>
                    </div>

                </div>

                <div class="lb-content fade" id="lb-user-content" role="tabpanel">
                    lorem absdhasdhad 2
                </div>

                <div class="lb-content fade" id="lb-payment-content" role="tabpanel">
                    lorem absdhasdhad 3
                </div>
            </div>

            <ul class="nav nav-pills mb-3" id="lb-tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="lb-tab-item nav-link active" id="lb-home-tab">
                        <div class="lb-icon">
                            <i id="lb-home-icon" class="icon-home2-active"></i>
                        </div>
                        <div class="lb-icon-desc">Home</div> 
                    </button>
                </li>
               
                <li class="nav-item" role="presentation">
                    <button class="lb-tab-item nav-link" id="lb-payment-tab">
                        <div class="lb-icon">
                            <i id="lb-payment-icon" class="icon-payment"></i>
                        </div>
                        <div class="lb-icon-desc">Trans History</div>
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button class="lb-tab-item nav-link" id="lb-user-tab">
                        <div class="lb-icon"><i id="lb-user-icon" class="icon-user2"></i></div>
                        <div class="lb-icon-desc">User</div>
                    </button>
                </li>
            </ul>
           
        </div>
        -->

        <!-- Lag Blater end content -->
        <div id="cart-packages" style="display: none">
            <div id="cart-packages-wrapper" class="row">
                <div class="col-md-4">
                    <div class="cp-product">
                        <div>
                            <img src="/assets/images/lagbalster.png" />
                        </div>
                        <div class="cpp-content clearfix">
                            <h2>
                                LagBlaster
                            </h2>   
                            <p>
                                An innovative Gaming Network for Vietnam especially enabling console users.
                            </p>
                           
                            <a href="https://lagblaster.org/" target="_blank" class="btn btn-info">
                                Preview
                            </a>
                            <!--
                            <button id="lb-order-btn" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#lagBlasterModal">
                                Order now
                            </button>
                            <div class="lb-order__loading spinner-border text-primary" role="status">
                            </div>
                            -->
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="cp-product">
                        <div>
                            <img src="/assets/images/jumpo.jpeg" />
                        </div>
                        <div class="cpp-content clearfix">
                            <h2>
                                JumboIX - Internet Exchange of a kind (AS43565)
                            </h2>
                            <p>
                                Building up an Internet Exchange in Latin America from the Scratch
                            </p>
                            <a href="https://www.iptp.net/en_US/jumboix/" target="_blank" class="btn btn-info">
                                Preview
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Conference content -->
        <div id="conference-content">
            <div class="start-conference-container">
                <h2 class="conference-content__header text-center">
                    <lang data-language="VIDEO_CONFERENCE"></lang>
                </h2>
                <div class="conference-content-btnGroup text-center">
                    <div class="carousel-create-conference-wraper">

                        <div id="conference-carousel" class="carousel slide carousel-fade" data-ride="carousel">
                            <ol class="carousel-indicators">
                                <li data-target="#conference-carousel" data-slide-to="0" class="active"></li>
                                <li data-target="#conference-carousel" data-slide-to="1"></li>
                                <li data-target="#conference-carousel" data-slide-to="2"></li>
                            </ol>
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src="/assets/images/xmimg1.png" class="d-block" alt="...">
                                    <div class="carousel-caption">
                                        <h5>Chat with anyone. Anywhere.</h5>
                                        <p>You can use video conference inside the application as well as share it with anyone to join via browser.</p>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="/assets/images/xmimg2.png" class="d-block" alt="...">
                                    <div class="carousel-caption">
                                        <h5>Work together. Share your screen.</h5>
                                        <p>You can share your desktop or dedicated application window to another user. One click and you can work together on a project!</p>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="/assets/images/xmimg3.png" class="d-block" alt="...">
                                    <div class="carousel-caption">
                                        <h5>Fully functional presentations</h5>
                                        <p>Gather as many people as you want to make virtual presentations. Participants can virtually raise hands to ask the questions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <button id="conference-content__startBtn" class="start-conf">
                                <lang data-language="START_CONFERENCE"></lang>
                            </button>
                        </div> 
                    </div>   

                    <div class="input-group join-existing-room">
                        <input type="text" class="join-existing-room__input form-control" placeholder="FILL_ROOM_ID" data-language="FILL_ROOM_ID" data-lang-type="placeholder">
                        <button class="" type="button" id="join-existing-room__btn" disabled><lang data-language="JOIN_MEETING"></lang></button>
                    </div>
                </div>
            </div>

            <!-- Jitsi frame content --> 
            <div class="conference-content-iframe">
            </div>
            <!-- Jitsi frame end content --> 

            <div class="xm-meeting-loading" style="display:none">
                <div class="xm-meeting-loading-inner">
                    <img
                        src="data:image/png;base64,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"
                    width="130" />
                    <div class="xm-loading-pulse"></div>
                </div>
            </div>

        </div>


        <div id="frame">
            <div class="sidebar desktop">
                <div class="profile profile--mini js_info_you" id="sidebarProfile">
                    <a title="Edit Profile">
                        <img class="--avatar avatar p-cur" src="" alt="" style="display:none">
                    </a>
                    <p class="--name"></p>
                </div>
                <div id="search" class="search">
                    <button class="search-toggle">
                        <i class="xm icon-search --icon"></i>
                    </button>
                    <div class="--item js-menu menu" style="display:none;">
                        <button type="button" class="menu__item --s-all active" data-s="1" data-language="ALL"></button>
                        <button type="button" class="menu__item --s-unread" data-s="2" data-language="UNREAD"></button>
                        <button type="button" class="menu__item --s-group" data-s="3" data-language="GROUP"></button>
                        <button type="button" class="menu__item --s-personal" data-s="4" data-language="PERSONAL"></button>
                        <button type="button" class="menu__item --s-favourites" data-s="5" data-language="FAVOURITES"></button>
                    </div>
                    <span class="clearable xs-search">
                        <button class="search__option" title="Option">
                            <i class="xm icon-sliders" aria-hidden="true"></i>
                        </button>
                        <input class="search__input" type="search" data-language="SEARCH_PLACEHOLDER" data-lang-type="placeholder" placeholder="Search..." />
                        <i class="clearable__clear">&times;</i>
                    </span>
                </div>
                <div class="contacts">
                    <ul class="contact-list js_ul_list_user" id="sidebar_room_list"></ul>
                </div>
                <div class="sidebar-options">
                    <button class="btn btn-sidebar-contacts">
                        <i class="icon-users"></i>
                        <span data-language="CONTACTS">
                            Contacts
                        </span>
                        <div class="xm-dropdown dropdown-soc">
                            <div class="sodi-startchat">
                                <i class="icon-comments"></i>
                                <lang data-language="START_CHAT"></lang>
                            </div>
                            <div class="sodi-conference">
                                <i class="icon-video-camera"></i>
                               <lang data-language="START_CONFERENCE"></lang>
                            </div>
                            <div class="sodi-channel">
                                <i class="icon-info-circle"></i>
                                <lang data-language="CREATE_CHANNEL"></lang>
                            </div>
                            <div class="sodi-invite">
                                <i class="icon-send"></i>
                                <lang data-language="SEND_INVITE"></lang>
                            </div>
                            <div class="sodi-erpcontacrt">
                                <i class="icon-users"></i>
                                <lang data-language="ERP_CONTACTS"></lang>
                            </div>
                        </div>
                    </button>
                    <button class="btn btn-sidebar-options">
                        <i class="icon-cog"></i>
                        <span data-language="OPTIONS">
                            Options
                        </span>
                        <div class="xm-dropdown dropdown-soo">
                            <div class="sodi-interface">
                                <i class="icon-users"></i>
                                <lang data-language="USER_INTERFACE"></lang>
                            </div>
                            <div class="sodi-about">
                                <i class="icon-info-circle"></i>
                                <lang data-language="ABOUT"></lang>
                            </div>
                            <div class="sodi-language">
                                <i class="icon-language"></i>
                                <lang data-language="LANGUAGE"></lang>
                            </div>
                            <div class="sodi-logout">
                                <i class="icon-info-circle"></i>
                                <lang data-language="LOGOUT"></lang>
                            </div>
                        </div>
                    </button>
                    <button class="btn btn-sidebar-collapse">
                        <i class="icon-angle-up"></i>
                    </button>
                </div>
            </div>
            <div class="main-right content desktop">
                <div class="notify-update-info">Updating Information...</div>
                <div class="js_caption">
                    <p class="messages__first" data-language="PLEASE_SELECT_A_CHAT"></p>
                    <div class="messages__intro">
                        <img src="/assets/images/icon.png" alt="Cross messenger" width="200" />
                        <h1 class="--title" data-language="CROSS_MESSENGER"></h1>
                    </div>
                </div>
                <div class="js_wrap_mess wrap-messages" style="display: none;">
                    <div class="js_info_parnter toolbar-profile">
                        <div class="--avatar-wraper">
                            <img class="--img avatar" src="" alt="" style="cursor: pointer;" />
                            <div class="--favourite hidden"><i class="xm icon-star-full" aria-hidden="true"></i></div>
                        </div>

                        <div class="toolbar-name">
                            <div class="--name"></div> 
                            <div class="--online"></div>
                            <div class="--typing"></div>
                        </div>
                        <a class="js-call-option btn__option" data-target="#call-option"><i class="xm icon-phone xm-fw p-cur" aria-hidden="true"></i></a>
                        <div id="chatbox-call-option" class="--option menu js-dismiss-menu">
                            <button class="--call-audio menu__item">
                                <i class="xm icon-phone"></i>
                                <span data-language="CALL_AUDIO_ONLY"></span>
                            </button>
                            <button class="--call-video menu__item">
                                <i class="xm icon-video-camera"></i>
                                <span data-language="CALL_WITH_VIDEO"></span>
                            </button>
                        </div>
                        
                        <a class="js-group-option btn__option" data-target="#group-option"><i class="xm icon-ellipsis-v xm-fw p-cur" aria-hidden="true"></i></a>
                        <div id="chatbox-group-option" class="--option menu js-dismiss-menu">
                    
                            <button class="--edit-group menu__item">
                                <i class="xm icon-edit"></i>
                                <lang data-language="EDIT"></lang>
                            </button>
                            <button class="--viewSearch menu__item">
                                <i class="xm icon-search"></i>
                                <lang data-language="SEARCH_PLACEHOLDER"></lang>
                            </button>
                            <button class="--mediaAndFile menu__item">
                                <i class="xm icon-photo xm-fw" aria-hidden="true"></i>
                                <lang data-language="VIEW_MEDIA_FILE"></lang>
                            </button>
                            <button class="--viewBookmark menu__item">
                                <div class="pulse hidden"></div>
                                <i class="xm icon-bookmarks-empty" aria-hidden="true"></i>
                                <lang data-language="VIEW_BOOKMARK"></lang>
                            </button>
                            <button class="--internal menu__item">
                                <i class="xm icon-comments"></i>
                                <span data-language="ENABLE_INTERNAL_MESSAGES"></span>
                            </button>
                            <button class="--disabled menu__item">
                                <i class="xm icon-volume-mute" aria-hidden="true"></i>
                                <span data-language="DISABLE_NOTIFICATIONS"></span>
                            </button>
                            <button class="--leave menu__item">
                                <i class="xm icon-mail-forward" aria-hidden="true"></i>
                                <lang data-language="LEAVE_GROUP"></lang>
                            </button>
                            <button class="--remove menu__item">
                                <i class="xm icon-trash" aria-hidden="true"></i>
                                <lang data-language="REMOVE"></lang>
                            </button>
                           
                        </div>
                    </div>

                    <div class="pin-message-status-bar hidden"></div>

                    <div class="js_con_list_mess messages scroll__wrap">
                        <div class="--load-mess">
                            <div class="pulse"></div>
                        </div>
                        <a class="scroll-to scroll-to__bottom p-cur show round" style="display:none">
                            <i class="xm icon-angle-down"></i>
                            <p class="scroll-to__message" style="display:none">
                                <span class="unread-message-scroll">0</span> 
                                <lang data-language="NEW_MESSAGE"></lang>
                            </p>
                        </a>

                        <button class="jump-to-bottom hidden">
                            <i class="xm icon-angle-down"></i>
                            <span class="">
                                <lang data-language="JUMP_TO_BOTTOM"></lang>
                            </span>
                        </button>

                        <ul class="js_ul_list_mess messages__list scroll__inner">
                            <li class="messages__item">
                                <div></div>
                            </li>
                        </ul>
                        <div class="--menu-item menu js-menu-messages">
                            <button class="--rcn menu__item js-menu-messages-rcn-list">
                                <i class="xm icon-reaction-list"></i>
                                <lang data-language="REACTION_LIST"></lang>
                            </button>
                            <button class="--rcn menu__item js-menu-messages-rcn">
                                <i class="xm icon-reaction"></i>
                                <lang data-language="REACTION"></lang>
                            </button>
                            <button class="--cmt menu__item js-menu-messages-cmt">
                                <i class="xm icon-comment-o"></i>
                                <lang data-language="COMMENT"></lang>
                            </button>
                            <button class="--fw menu__item js-menu-messages-forward">
                                <i class="xm icon-mail-forward"></i>
                                <lang data-language="FORWARD"></lang>
                            </button>
                            <button class="--fw menu__item js-menu-messages-copytext">
                                <i class="xm icon-file-o"></i>
                                <lang data-language="COPY_TEXT"></lang>
                            </button>
                            <button class="--fw menu__item js-menu-messages-info">
                                <i class="xm icon-info-circle"></i>
                                <lang data-language="INFO"></lang>
                            </button>
                            <button class="--bm menu__item js-menu-messages-bookmark">
                                <div class="pulse hidden"></div>
                                <i class="xm icon-bookmarks-empty"></i>
                                <lang data-language="BOOKMARK"></lang>
                            </button>
                            <button class="--pin menu__item js-menu-messages-pinmess">
                                <div class="pulse hidden"></div>
                                <i class="xm icon-pin-outline"></i>
                                <lang data-language="PIN_MESSAGE"></lang>
                            </button>
                            <button class="--update menu__item js-menu-messages-edit">
                                <i class="xm icon-edit"></i>
                                <lang data-language="EDIT"></lang>
                            </button>
                            <button class="--remove menu__item js-menu-messages-remove">
                                <i class="xm icon-close"></i>
                                <lang data-language="REMOVE"></lang>
                            </button>
                        </div>
                    </div>
                    <div class="dropzone">
                        <div class="dropzone-container">
                            <div class="file-icon">+</div>
                            <div class="dropzone-title" data-language="DRAG_AND_DROP"></div>
                        </div>
                    </div>
                    <div>
                        <div class="js-tag-person tag-person-content"></div>
                        <div class="js-cmt-mess messages__item comment message-input-calc" style="display: none;">
                            <div class="--heading">
                                <img class="--img avatar" src="" alt="" />
                                <div class="--name"></div>
                                <div class="--real_name" hidden></div>
                            </div>
                            <div class="--mess p-2-line"></div>
                            <button type="button" class="--close btn__edit--close"><i class="xm icon-close"></i></button>
                        </div>
                        <div class="wrap-enter-mess messages-input-wrap">
                            <div class="wrap-tag-member" style="display: none;"></div>
                            <div class="col-xs-12 mess-comment-box" style="display: none;">
                                <div class="mess-fw-box"></div>
                                <i class="xm icon-close mess-fw-box-close" role="button" tabindex="0"></i>
                            </div>
                            <div class="js_endter_mess messages__input" data-language="WRITE_A_MESSAGE" data-lang-type="placeholder" placeholder="Write a message..." contenteditable="true"></div>

                            <!-- Voice & send group button --> 
                            <div class="input-wrap-group-btn">
                                <button class="btn__send js_send_mess"><i class="xm icon-paper-plane xm-fw"></i></button>
                                
                                <!-- Voice chat btn -->

                                <button id="init-voiceChat"" class="btn__voice-chat js_voice-chat">
                                    <i class="icon-microphoneVoice"></i>
                                </button>
                                <!-- End Voice chat btn -->

                            </div>
                            <!-- End Voice & send group button --> 

                            <button type="button" class="js_close_update_mess btn__edit--close" style="display: none;"><i class="xm icon-close"></i></button>
                            
                            <!-- Attached button --> 
                            <button class="btn__attach" data-target="#media-menu"><svg height="20px" viewBox="0 0 426.66667 426.66667" width="20px" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m410.667969 229.332031h-394.667969c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h394.667969c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
                                        <path d="m213.332031 426.667969c-8.832031 0-16-7.167969-16-16v-394.667969c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v394.667969c0 8.832031-7.167969 16-16 16zm0 0" /></svg></button>
                            <!-- End Attached button --> 

                            <div class="wrap-emojis">
                                <div class="emojis-tab-content">
                                    <div class="wrap-emoji active wrap-emojis-calc">
                                        <div class="--menu">
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-1" class="active">🕓</a>
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-2">😄</a>
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-3">🙏</a>
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-4">➡</a>
                                        </div>
                                        <div class="--list">
                                            <div data-em-tab-content="--tab-1" class="--tab active">
                                            </div>
                                            <div data-em-tab-content="--tab-2" class="--tab">
                                            </div>
                                            <div data-em-tab-content="--tab-3" class="--tab">
                                            </div>
                                            <div data-em-tab-content="--tab-4" class="--tab">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="wrap-emoji-codes">
                                <div class="--head">
                                    <lang data-language="EMOJI_CODES">ЭМОДЗИ, НАЗВАНИЯ КОТОРЫХ СОДЕРЖАТ</lang> <span class="emoji-code"></span>
                                </div>
                                <div class="--list">

                                </div>
                            </div>

                            <div class="chatbox-progress-upload">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                                    <path fill="none" stroke-width="2" stroke-linecap="square" d="M10,1A9,9 0 1 1 1,10A9,9 0 0 1 10,1" stroke-dasharray="56.548667764616276" stroke-dashoffset="56.548667764616276" transform="rotate(0 10 10)"></path>
                                </svg>
                                <lang data-language="UPLOADING"></lang>... (<span>0</span>%)
                            </div>
                            <div id="media-menu" class="menu js-dismiss-menu">
                               
                                <!-- Emoji button -->
                                <label class="js-up-file menu__item" data-dismiss=".menu">
                                    <button class="js-emoji btn__emoji"><i class="xm icon-smile-o"></i></button>
                                </label>
                                <!-- End Emoji button -->

                                <label class="js-up-file menu__item" data-trigger=".--input-up-file" data-dismiss=".menu">
                                    <i class="xm icon-file-o xm-fw"></i>
                                    <lang data-language="UP_FILE"></lang>
                                    <input type="file" hide class="--input-up-file --hide" multiple/>
                                </label>
                                <label class="js-up-media menu__item" data-trigger=".--input-up-media" data-dismiss=".menu">
                                    <input type="file" hide class="--input-up-media --hide" accept="image/*,video/*,audio/*" multiple/>
                                    <i class="xm icon-photo xm-fw"></i>
                                    <lang data-language="UP_MEDIA"></lang>
                                </label>
                            </div>

                            <!-- Voice chat wrap -->
                            
                            <div id="voice-chat-wrapper">
                                <div id="voice-statusRecording">
                                </div>
                                <div id="voice-statusMessage">
                                </div>

                                <div class="voices-audio-content d-flex justify-content-end">
                                    <div class="voice-sound-clips">

                                    </div>
                                </div>

                                <div class="voice-button-group" style="display:none">
                                    <button id="record__start-stop__btn" class="btn btn-primary">
        
                                        <i class="icon-microphoneVoice"></i>
                                        <div class="record__start-stop-pulse-ring"></div>
                                    </button>
                                </div>
                                <div class="btn-voice-chat-description"><lang data-language="HOLD_TO_SPEAK"></lang></div>
                            </div>

                            <!-- End Voice chat wrap -->

                        </div>
                    </div>

                    <!-- View media and files --> 
                        <div class="view-media-files-wraper hidden">
                            <div class="media-files-topbar">
                                <button class="media-files-close">
                                    <i class="icon-chevron-left"></i>
                                    <lang data-language="BACK"></lang>
                                </button>

                                <ul id="media-files-tab" class="nav nav-pills mb-3" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link active" id="images-tab" data-toggle="pill" href="#media-list" role="tab" aria-controls="media-list" aria-selected="true">
                                            <lang data-language="IMAGES"></lang>
                                        </a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link" id="videos-tab" data-toggle="pill" href="#videos-list" role="tab" aria-controls="videos-list" aria-selected="false">
                                            <lang data-language="VIDEOS"></lang>
                                        </a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link" id="files-tab" data-toggle="pill" href="#files-list" role="tab" aria-controls="files-list" aria-selected="false">
                                            <lang data-language="FILES"></lang>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div class="media-files-content tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active view-images-list" id="media-list" role="tabpanel" aria-labelledby="images-tab">    
                                    <div class="text-center">
                                        <div class="images__spiner spinner-grow text-secondary hidden" role="status">
                                        <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade view-videos-list" id="videos-list" role="tabpanel" aria-labelledby="videos-tab">
                                    <div class="text-center">
                                        <div class="videos__spiner spinner-grow text-secondary hidden" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade view-files-list" id="files-list" role="tabpanel" aria-labelledby="files-tab">
                                    <div class="text-center">
                                        <div class="files__spiner spinner-grow text-secondary hidden" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    <!-- End View media and files -->
                    <!-- Start View search -->
                    <div class="view-search-wraper hidden">
                        <div class="search-topbar">
                            <button class="search-close">
                                <i class="icon-chevron-left"></i>
                                <lang data-language="BACK"></lang>
                            </button>
                            <div class="mess-search-topright">
                                <div class="mess-search-box">
                                    <div class="msbg-input-container">
                                        <input type="text" id="msbg-input" data-lang-type="placeholder" data-language="PLEASE_ENTER_THREE_LETTERS" />
                                        <button class="btn btn-secondary cancel-search-btn hidden" data-toggle="tooltip" data-placement="bottom" title="Clear search input">
                                            <i class="icon-close"></i>
                                        </button>
                                    </div>
            
                                    <button class="btn btn-primary search-mess-btn" data-toggle="tooltip" data-placement="bottom" title="Search message" disabled>
                                        <i class="xm icon-search"></i>
                                    </button>
                                </div>

                                <div class="search-all-rooms-container custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="search-all-rooms">
                                    <label class="custom-control-label" for="search-all-rooms">Search all rooms</label>
                                </div>
                            </div>
                        </div>

                        <div class="search-content"></div>

                        <div class="search-lobby-text text-center">
                            <lang data-language="PLEASE_ENTER_THREE_LETTERS"></lang>
                        </div>

                        <div class="pulse-loading hidden">
                            <div class="files__spiner spinner-grow text-secondary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <!-- End View Search --> 

                    <!-- Start View Bookmark -->
                    <div class="view-bookmark-wraper hidden">
                        <div class="view-bookmark-topbar">
                            <button class="view-bookmark-topbar-close">
                                <i class="icon-chevron-left"></i>
                                <lang data-language="BACK"></lang>
                            </button>
                        </div>

                        <div class="view-bookmark-content"></div>

                        <div class="pulse-loading hidden">
                            <div class="files__spiner spinner-grow text-secondary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <!-- End View Bookmark --> 
                </div>
            </div>
        </div>
    `,
    login: `
    <div class="wrap-login">
        <div class="login js-global js-login active">
            <div class="login__header">
                <img class="login__logo" src="/assets/images/icon.png" alt="Cross messenger logo">
                <div class="login__name">
                    <h1 class="login__title" data-language="CROSS_MESSENGER"></h1>
                </div>
                
                <div class="language-select" id="change-lang-btn">
                    <svg height="14px" viewBox="0 0 480 480" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm207.566406 324.078125-68.253906 11.777344c7.8125-28.652344 12.03125-58.164063 12.558594-87.855469h71.929687c-.902343 26.117188-6.398437 51.871094-16.234375 76.078125zm-431.367187-76.078125h71.929687c.527344 29.691406 4.746094 59.203125 12.558594 87.855469l-68.253906-11.777344c-9.835938-24.207031-15.332032-49.960937-16.234375-76.078125zm16.234375-92.078125 68.253906-11.777344c-7.8125 28.652344-12.03125 58.164063-12.558594 87.855469h-71.929687c.902343-26.117188 6.398437-51.871094 16.234375-76.078125zm215.566406-27.472656c28.746094.367187 57.421875 2.984375 85.761719 7.832031l28.238281 4.871094c8.675781 29.523437 13.34375 60.078125 13.878906 90.847656h-127.878906zm88.488281-7.9375c-29.238281-4.996094-58.828125-7.695313-88.488281-8.0625v-96c45.863281 4.40625 85.703125 46.398437 108.28125 107.511719zm-104.488281-8.0625c-29.660156.367187-59.242188 3.066406-88.480469 8.0625l-19.800781 3.425781c22.578125-61.128906 62.417969-103.136719 108.28125-107.523438zm-85.753906 23.832031c28.335937-4.847656 57.007812-7.464844 85.753906-7.832031v103.550781h-127.878906c.535156-30.769531 5.203125-61.324219 13.878906-90.847656zm-42.125 111.71875h127.878906v103.550781c-28.746094-.367187-57.421875-2.984375-85.761719-7.832031l-28.238281-4.871094c-8.675781-29.523437-13.34375-60.078125-13.878906-90.847656zm39.390625 111.488281c29.238281 5.003907 58.824219 7.714844 88.488281 8.105469v96c-45.863281-4.410156-85.703125-46.402344-108.28125-107.515625zm104.488281 8.105469c29.660156-.390625 59.242188-3.101562 88.480469-8.105469l19.800781-3.425781c-22.578125 61.128906-62.417969 103.136719-108.28125 107.523438zm85.753906-23.875c-28.335937 4.847656-57.007812 7.464844-85.753906 7.832031v-103.550781h127.878906c-.535156 30.769531-5.203125 61.324219-13.878906 90.847656zm58.117188-111.71875c-.527344-29.691406-4.746094-59.203125-12.558594-87.855469l68.253906 11.777344c9.835938 24.207031 15.332032 49.960937 16.234375 76.078125zm47.601562-93.710938-65.425781-11.289062c-11.761719-38.371094-33.765625-72.808594-63.648437-99.601562 55.878906 18.648437 102.21875 58.457031 129.074218 110.890624zm-269.871094-110.890624c-29.882812 26.792968-51.886718 61.230468-63.648437 99.601562l-65.425781 11.289062c26.855468-52.433593 73.195312-92.242187 129.074218-110.890624zm-129.074218 314.3125 65.425781 11.289062c11.761719 38.371094 33.765625 72.808594 63.648437 99.601562-55.878906-18.648437-102.21875-58.457031-129.074218-110.890624zm269.871094 110.890624c29.882812-26.792968 51.886718-61.230468 63.648437-99.601562l65.425781-11.289062c-26.855468 52.433593-73.195312 92.242187-129.074218 110.890624zm0 0"/></svg>
                    <span></span>
                </div>
            </div>

            <form name="loginForm" class="login__form js_login__form" method="post">
                <input data-lang-type="placeholder" data-language="EMAIL" required="Please enter a email" type="email" name="email" class="form-control" />
                <input data-lang-type="placeholder" data-language="PASSWORD" required="Please enter the password" type="password" name="password" class="form-control" />
                <div class="clearfix neccessary-wrapper">
                    <div class="mess"></div>
                    <button type="button" data-language="FORGOT_PASSWORD" class="xmbtn login__btn-forgot js-btn-forget"></button>
                </div>
                <button type="submit" class="login__btn-submit js-btn-spin">
                    <span class="--spin" style="display:none">◉</span>
                    <lang data-language="LOGIN"></lang>
                </button>
                <div class="or-sign-in">
                    OR LOGIN WITH
                </div>
                <div class="thirdparty-login-btn-container">
                    <button type="button" class="thirdparty-login-btn erp">
                        ${ICON.ERP_LOGO}
                        <div class="--login-btn-spiner spinner-border text-primary">
                        </div>
                    </button>
                    <button type="button" class="thirdparty-login-btn google">${ICON.GOOGLE_LOGO}</button>

                    <button type="button" class="thirdparty-login-btn apple">${ICON.APPLE_LOGO}</button>

                    <button type="button" class="thirdparty-login-btn lagblaster">
                        ${ICON.LAGBLASTER_LOGO}
                        <div>LagBlaster</div>
                    </button>
                </div>
            </form>

            <form class="erp-login-form" style="display: none">
                <img src="/assets/images/qrcode.png">
                <input placeholder="ERP username" required="Please enter a username" type="text" name="login" class="form-control" />
                <input placeholder="ERP Password" required="Please enter the password" type="password" name="password" class="form-control" />
                <div class="clearfix neccessary-wrapper">
                    <div class="mess"></div>
                </div>
                <div class="clearfix">
                    <button data-language="CANCEL" class="btn btn-secondary erp-cancel-btn" type="button"></button>
                    <button type="submit" class="login__btn-submit js-btn-spin">
                        <span class="--spin" style="display:none">◉</span>
                        <lang data-language="LOGIN"></lang>
                    </button>
                </div>
            </form>

            <!-- Lagblaster login form -->
            <form class="lagblaster-login-form" style="display: none">
                <input placeholder="LagBlaster username" required="Please enter a username" type="text" name="login" class="form-control" />
                <input placeholder="LagBlaster Password" required="Please enter the password" type="password" name="password" class="form-control" />
                <div class="clearfix neccessary-wrapper">
                    <div class="mess"></div>
                </div>
                <div class="clearfix">
                    <button data-language="CANCEL" class="btn btn-secondary lagblaster-cancel-btn" type="button"></button>
                    <button type="submit" class="login__btn-submit js-btn-spin">
                        <span class="--spin" style="display:none">◉</span>
                        <lang data-language="LOGIN"></lang>
                    </button>
                </div>
            </form>
            <!-- End LB login form -->

            <button data-language="SIGN_UP" class="xmbtn login__btn-signup js-btn-signup"></button>    
        </div>

        <div class="reset-password reset-password2 form-style js-global js-forget">
            <h2 data-language="RESET_PASSWORD" class="popup__heading"></h2>
            <form name="resetForm" class="js_forgot__form_code" method="post">
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="EMAIL" class="form-control form-control2" required type="email" name="email" />
                </div>
                <div class="captcha-wrapper">
                    <div class="pulse"></div>
                    <img src="" class="mt-2 mb-2 rounded-lg float-left" name="captcha-img"/>
                    <button class="btn" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/></svg>
                    </button>
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="CAPTCHA" class="form-control form-control2" required type="text" name="captcha" />
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="CODE" class="form-control form-control2" type="text" name="code" />
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="NEW_PASSWORD" class="form-control form-control2" type="password" name="password" />
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="CONFIRM_NEW_PASSWORD" class="form-control form-control2" type="password" name="confirmpassword" />
                </div>
                <div class="clearfix neccessary-wrapper">
                    <div class="mess"></div> 
                </div>
                <div class="popup__bottom">
                    <button data-language="CANCEL" class="btn btn--second js-btn-cancel" type="button"></button>
                    <button class="btn btn--second ml-2 js-btn-send-code js-btn-spin" type="submit">
                        <span class="--spin" style="display:none">◉</span>
                        <lang data-language="REQUEST_CODE"></lang>
                    </button>                
                    <button class="btn btn--second ml-2 js-btn-spin js-btn-reset-code" type="submit">
                        <span class="--spin" style="display:none">◉</span>
                        <lang data-language="RESET"></lang>
                    </button>
                </div>
            </form>
        </div>

        <!-- Version -->
        <div class="xm-current-version"></div>
        <!-- learn more -->
        <div class="learn-more"><a target="_blank" href="https://www.iptp.net/xm/">Learn more</a></div>
    </div>
    `,
    signup: `
    <div class="wrap-login">
        <div class="sign-up form-style js-global js-signup active">
            <div class="login__header">
                <img class="login__logo" src="/assets/images/icon.png" alt="Cross messenger logo">
                <h1 class="login__title" data-language="CROSS_MESSENGER"></h1>
                <div class="language-select" id="change-lang-btn">
                    <svg height="14px" viewBox="0 0 480 480" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm207.566406 324.078125-68.253906 11.777344c7.8125-28.652344 12.03125-58.164063 12.558594-87.855469h71.929687c-.902343 26.117188-6.398437 51.871094-16.234375 76.078125zm-431.367187-76.078125h71.929687c.527344 29.691406 4.746094 59.203125 12.558594 87.855469l-68.253906-11.777344c-9.835938-24.207031-15.332032-49.960937-16.234375-76.078125zm16.234375-92.078125 68.253906-11.777344c-7.8125 28.652344-12.03125 58.164063-12.558594 87.855469h-71.929687c.902343-26.117188 6.398437-51.871094 16.234375-76.078125zm215.566406-27.472656c28.746094.367187 57.421875 2.984375 85.761719 7.832031l28.238281 4.871094c8.675781 29.523437 13.34375 60.078125 13.878906 90.847656h-127.878906zm88.488281-7.9375c-29.238281-4.996094-58.828125-7.695313-88.488281-8.0625v-96c45.863281 4.40625 85.703125 46.398437 108.28125 107.511719zm-104.488281-8.0625c-29.660156.367187-59.242188 3.066406-88.480469 8.0625l-19.800781 3.425781c22.578125-61.128906 62.417969-103.136719 108.28125-107.523438zm-85.753906 23.832031c28.335937-4.847656 57.007812-7.464844 85.753906-7.832031v103.550781h-127.878906c.535156-30.769531 5.203125-61.324219 13.878906-90.847656zm-42.125 111.71875h127.878906v103.550781c-28.746094-.367187-57.421875-2.984375-85.761719-7.832031l-28.238281-4.871094c-8.675781-29.523437-13.34375-60.078125-13.878906-90.847656zm39.390625 111.488281c29.238281 5.003907 58.824219 7.714844 88.488281 8.105469v96c-45.863281-4.410156-85.703125-46.402344-108.28125-107.515625zm104.488281 8.105469c29.660156-.390625 59.242188-3.101562 88.480469-8.105469l19.800781-3.425781c-22.578125 61.128906-62.417969 103.136719-108.28125 107.523438zm85.753906-23.875c-28.335937 4.847656-57.007812 7.464844-85.753906 7.832031v-103.550781h127.878906c-.535156 30.769531-5.203125 61.324219-13.878906 90.847656zm58.117188-111.71875c-.527344-29.691406-4.746094-59.203125-12.558594-87.855469l68.253906 11.777344c9.835938 24.207031 15.332032 49.960937 16.234375 76.078125zm47.601562-93.710938-65.425781-11.289062c-11.761719-38.371094-33.765625-72.808594-63.648437-99.601562 55.878906 18.648437 102.21875 58.457031 129.074218 110.890624zm-269.871094-110.890624c-29.882812 26.792968-51.886718 61.230468-63.648437 99.601562l-65.425781 11.289062c26.855468-52.433593 73.195312-92.242187 129.074218-110.890624zm-129.074218 314.3125 65.425781 11.289062c11.761719 38.371094 33.765625 72.808594 63.648437 99.601562-55.878906-18.648437-102.21875-58.457031-129.074218-110.890624zm269.871094 110.890624c29.882812-26.792968 51.886718-61.230468 63.648437-99.601562l65.425781-11.289062c-26.855468 52.433593-73.195312 92.242187-129.074218 110.890624zm0 0"/></svg>
                    <span></span>
                </div>
            </div>

            <h2 data-language="REGISTER_NEW_ACCOUNT" class="popup__heading"></h2>
            <form name="resetForm" class="js_register__form" method="post">
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="NAME" class="form-control form-control2" required type="text" name="name" />
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="EMAIL" class="form-control form-control2" required type="email" name="email" />
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="PASSWORD" class="form-control form-control2" required type="password" placeholder="Password" name="password" />
                </div>
                <div class="form__line">
                    <input data-lang-type="placeholder" data-language="CONFIRM_PASSWORD" class="form-control form-control2" required type="password" name="password2" />
                </div>

                <div class="form__line form__line_code" style="display:none;">
                    <input data-lang-type="placeholder" data-language="CODE" class="form-control form-control2" type="text" name="code" />
                </div>
                <div class="clearfix neccessary-wrapper">
                    <div class="mess"></div>
                </div>
                <div class="popup__bottom">
                    <button data-language="CANCEL" class="btn btn--second js-btn-cancel" type="button"></button>
                    <button class="btn btn--second ml-2 js-btn-spin" type="submit">
                        <span class="--spin" style="display:none">◉</span>
                        <lang data-language="CREATE"></lang>
                    </button>
                </div>          
            </form>
        </div>
    </div>
    `,
    meeting: `
        <div class="meeting-video-wrapper">
            <div class="language-select" id="change-lang-btn">
                <svg height="14px" viewBox="0 0 480 480" width="14px" xmlns="http://www.w3.org/2000/svg">
                    <path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm207.566406 324.078125-68.253906 11.777344c7.8125-28.652344 12.03125-58.164063 12.558594-87.855469h71.929687c-.902343 26.117188-6.398437 51.871094-16.234375 76.078125zm-431.367187-76.078125h71.929687c.527344 29.691406 4.746094 59.203125 12.558594 87.855469l-68.253906-11.777344c-9.835938-24.207031-15.332032-49.960937-16.234375-76.078125zm16.234375-92.078125 68.253906-11.777344c-7.8125 28.652344-12.03125 58.164063-12.558594 87.855469h-71.929687c.902343-26.117188 6.398437-51.871094 16.234375-76.078125zm215.566406-27.472656c28.746094.367187 57.421875 2.984375 85.761719 7.832031l28.238281 4.871094c8.675781 29.523437 13.34375 60.078125 13.878906 90.847656h-127.878906zm88.488281-7.9375c-29.238281-4.996094-58.828125-7.695313-88.488281-8.0625v-96c45.863281 4.40625 85.703125 46.398437 108.28125 107.511719zm-104.488281-8.0625c-29.660156.367187-59.242188 3.066406-88.480469 8.0625l-19.800781 3.425781c22.578125-61.128906 62.417969-103.136719 108.28125-107.523438zm-85.753906 23.832031c28.335937-4.847656 57.007812-7.464844 85.753906-7.832031v103.550781h-127.878906c.535156-30.769531 5.203125-61.324219 13.878906-90.847656zm-42.125 111.71875h127.878906v103.550781c-28.746094-.367187-57.421875-2.984375-85.761719-7.832031l-28.238281-4.871094c-8.675781-29.523437-13.34375-60.078125-13.878906-90.847656zm39.390625 111.488281c29.238281 5.003907 58.824219 7.714844 88.488281 8.105469v96c-45.863281-4.410156-85.703125-46.402344-108.28125-107.515625zm104.488281 8.105469c29.660156-.390625 59.242188-3.101562 88.480469-8.105469l19.800781-3.425781c-22.578125 61.128906-62.417969 103.136719-108.28125 107.523438zm85.753906-23.875c-28.335937 4.847656-57.007812 7.464844-85.753906 7.832031v-103.550781h127.878906c-.535156 30.769531-5.203125 61.324219-13.878906 90.847656zm58.117188-111.71875c-.527344-29.691406-4.746094-59.203125-12.558594-87.855469l68.253906 11.777344c9.835938 24.207031 15.332032 49.960937 16.234375 76.078125zm47.601562-93.710938-65.425781-11.289062c-11.761719-38.371094-33.765625-72.808594-63.648437-99.601562 55.878906 18.648437 102.21875 58.457031 129.074218 110.890624zm-269.871094-110.890624c-29.882812 26.792968-51.886718 61.230468-63.648437 99.601562l-65.425781 11.289062c26.855468-52.433593 73.195312-92.242187 129.074218-110.890624zm-129.074218 314.3125 65.425781 11.289062c11.761719 38.371094 33.765625 72.808594 63.648437 99.601562-55.878906-18.648437-102.21875-58.457031-129.074218-110.890624zm269.871094 110.890624c29.882812-26.792968 51.886718-61.230468 63.648437-99.601562l65.425781-11.289062c-26.855468 52.433593-73.195312 92.242187-129.074218 110.890624zm0 0"></path>
                </svg>
                <span>RU</span>
            </div>
            <div class="mvw-wrapper">
                <div class="mvww-div owner" style="display: flex;">
                    <video autoplay="" playsinline="playsinline" id="mvww-user-0" class="mvww-owner"></video>
                </div>
            </div>
            <div class="mvw-meetform">
                <div class="mvwm-overlay"></div>
                <div class="mvwm-box">
                    <div class="mvwmb-url">
                        <div class="mvwmb-copy"></div>
                        <div data-language="CLICK_TO_COPY_AND_SHARE" class="mvwmb-placeholder"></div>
                        <div class="input-only-view"></div>
                    </div>
                    <button data-language="JOIN_MEETING" class="btn btn-primary mvwmb-join-btn"></button>
                    <button class="btn btn-secondary mvwmb-back-btn">
                        Back to chat list
                    </button>
                    <div class="mvwmb-group-btn">
                        <button class="btn-round mvwmb-btn-mic">
                            <span></span>
                            <i class="xm icon-microphone"></i>
                        </button>
                        <button class="btn-round mvwmb-btn-camera">
                            <span></span>
                            <i class="xm icon-video-camera btn-camera"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mvwm-settings">
                <div class="mvwms-settings">
                    <div class="mvwmss-utility">
                        <button data-lang-type="tooltip" data-language="SHARE_YOUR_SCREEN" class="mvwmss-btn-share-screen" data-toggle="tooltip" data-placement="top" title="Share your screen">
                            <i class="xm icon-desktop xm-fw" aria-hidden="true"></i>
                        </button>
                        <button data-lang-type="tooltip" data-language="INVITE_PEOPLE" class="mvwmss-btn-add-people" data-toggle="tooltip" data-placement="top" title="Invite people">
                            <i class="xm icon-send xm-fw" aria-hidden="true"></i>
                        </button>
                        <button class="mvwmss-btn-left-conference" data-toggle="tooltip" data-placement="top" title="Left the conference">
                            <i class="xm icon-mail-forward xm-fw" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="mvwmss-group-btn">
                        <button class="btn-round mvwmb-btn-mic">
                            <span></span>
                            <i class="xm icon-microphone"></i>
                        </button>
                        <button class="btn-round mvwmb-btn-camera">
                            <span></span>
                            <i class="xm icon-video-camera btn-camera"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mvw-collapse-btn">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
                    <g>
                        <g id="_x36_">
                            <g>
                                <path d="M248.542,343.929H78.879c-10.452,0-18.917,8.428-18.917,18.842c0,10.395,8.465,18.84,18.917,18.84h125.351L0,584.979
                        l26.751,26.639l204.019-203.18l-0.592,123.822c0,10.395,8.465,18.84,18.917,18.84c10.452,0,18.917-8.426,18.917-18.84v-169.51
                        c0-5.58-2.312-10.09-5.981-13.186C258.573,346.126,253.815,343.929,248.542,343.929z M533.141,230.388H407.79L612,27.019
                        L585.248,0.382l-204,203.178l0.593-123.822c0-10.395-8.465-18.841-18.917-18.841s-18.917,8.427-18.917,18.841v169.51
                        c0,5.58,2.312,10.089,5.961,13.166c3.439,3.478,8.179,5.675,13.472,5.675h169.662c10.452,0,18.918-8.427,18.918-18.841
                        C552.038,238.834,543.573,230.388,533.141,230.388z" />
                            </g>
                        </g>
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                </svg>
            </div>
        </div>    
    `,
}));
