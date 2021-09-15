define(['shared/icon'], (ICON) => ({
    main: `
        <div id="leftbar-mobile">
            <button class="btn lbm-item lbmi-chats">
                <i class="icon-comments"></i>
            </button>
            <button class="btn lbm-item lbmi-cart">
                <i class="icon-cart"></i>
            </button>
        </div>
        <div id="leftbar">
            <div class="lb-cuser-avatar"></div>
            <div class="lb-item lbi-chats">
                <i class="icon-comments"></i>
            </div>
            <div class="lb-item lbi-cart">
                <i class="icon-cart"></i>
            </div>
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
                        <div class="sodi-conference">
                            <i class="icon-video-camera"></i>
                            <lang data-language="START_CONFERENCE"></lang>
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
        <div id="cart-packages" style="display: none">
            <div class="row">
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
        <div id="frame">
            <div class="sidebar">
                <div class="profile profile--mini js_info_you" id="sidebarProfile">
                    <a title="Edit Profile">
                        <img class="--avatar avatar p-cur" src="" alt="" style="display:none">
                    </a>
                    <p class="--name"></p>
                </div>
                <div id="search" class="search">
                    <button class="search-toggle">
                        <i class="xm xm-search --icon"></i>
                    </button>
                    <div class="--item js-menu menu" style="display:none;">
                        <button type="button" class="menu__item --s-all active" data-s="1" data-language="ALL"></button>
                        <button type="button" class="menu__item --s-unread" data-s="2" data-language="UNREAD"></button>
                        <button type="button" class="menu__item --s-group" data-s="3" data-language="GROUP"></button>
                        <button type="button" class="menu__item --s-personal" data-s="4" data-language="PERSONAL"></button>
                    </div>
                    <span class="clearable xs-search">
                        <button class="search__option" title="Option">
                            <i class="xm xm-sliders" aria-hidden="true"></i>
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
            <div class="main-right content">
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
                        <img class="--img avatar" src="" alt="" style="cursor: pointer;" />
                        <div class="toolbar-name">
                            <div class="--name"></div>
                            <div class="--online"></div>
                            <div class="--typing"></div>
                        </div>
                        <button class="btn-toggle-search-box">
                            <i class="xm xm-search"></i>
                        </button>
                        <a class="js-group-option btn__option" data-target="#group-option"><i class="xm xm-ellipsis-v xm-fw p-cur" aria-hidden="true"></i></a>
                        <div id="chatbox-group-option" class="--option menu js-dismiss-menu">
                            <button class="--edit-group menu__item">
                                <i class="xm xm-edit"></i>
                                <lang data-language="EDIT_GROUP"></lang>
                            </button>
                            <button class="--internal menu__item">
                                <i class="xm xm-comments"></i>
                                <span data-language="ENABLE_INTERNAL_MESSAGES"></span>
                            </button>
                            <button class="--disabled menu__item">
                                <i class="xm xm-volume-mute" aria-hidden="true"></i>
                                <span data-language="DISABLE_NOTIFICATIONS"></span>
                            </button>
                            <button class="--leave menu__item">
                                <i class="xm xm-mail-forward" aria-hidden="true"></i>
                                <lang data-language="LEAVE_GROUP"></lang>
                            </button>
                            <button class="--remove menu__item">
                                <i class="xm xm-trash" aria-hidden="true"></i>
                                <lang data-language="REMOVE"></lang>
                            </button>
                        </div>
                    </div>
                    <div class="mess-search-box">
                        <div class="msb-group">
                            <i class="xm xm-search"></i>
                            <input type="text" id="msbg-input" placeholder="Please enter at least 3 letters..." />
                            <div class="pulse"></div>
                        </div>
                        <div class="msb-close">
                            Close
                        </div>
                    </div>
                    <div class="js_con_list_mess messages scroll__wrap">
                        <div class="--load-mess">
                            <div class="pulse"></div>
                        </div>
                        <a class="scroll-to scroll-to__bottom p-cur show" style="display:none">
                            <span class="unread-message-scroll">0</span>
                            <i class="xm xm-angle-down"></i>
                        </a>
                        <ul class="js_ul_list_mess messages__list scroll__inner">
                            <li class="messages__item">
                                <div></div>
                            </li>
                        </ul>
                        <div class="--menu-item menu js-menu-messages">
                            <button class="--cmt menu__item js-menu-messages-cmt">
                                <i class="xm xm-comment-o"></i>
                                <lang data-language="COMMENT"></lang>
                            </button>
                            <button class="--fw menu__item js-menu-messages-forward">
                                <i class="xm xm-mail-forward"></i>
                                <lang data-language="FORWARD"></lang>
                            </button>
                            <button class="--fw menu__item js-menu-messages-copytext">
                                <i class="xm xm-file-o"></i>
                                <lang data-language="COPY_TEXT"></lang>
                            </button>
                            <button class="--fw menu__item js-menu-messages-info">
                                <i class="xm xm-info-circle"></i>
                                <lang data-language="INFO"></lang>
                            </button>
                            <button class="--update menu__item js-menu-messages-edit">
                                <i class="xm xm-edit"></i>
                                <lang data-language="EDIT"></lang>
                            </button>
                            <button class="--remove menu__item js-menu-messages-remove">
                                <i class="xm xm-close"></i>
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
                        <div class="js-cmt-mess messages__item comment message-input-calc" style="display: none;">
                            <div class="--heading">
                                <img class="--img avatar" src="" alt="" />
                                <div class="--name"></div>
                                <div class="--real_name" hidden></div>
                            </div>
                            <div class="--mess p-2-line"></div>
                            <button type="button" class="--close btn__edit--close"><i class="xm xm-close"></i></button>
                        </div>
                        <div class="wrap-enter-mess messages-input-wrap">
                            <div class="wrap-tag-member" style="display: none;"></div>
                            <div class="col-xs-12 mess-comment-box" style="display: none;">
                                <div class="mess-fw-box"></div>
                                <i class="xm xm-close mess-fw-box-close" role="button" tabindex="0"></i>
                            </div>
                            <textarea class="js_endter_mess messages__input" data-language="WRITE_A_MESSAGE" data-lang-type="placeholder" placeholder="Write a message..."></textarea>
                            <div class="input-wrap-group-btn">
                                <button class="btn__send js_send_mess"><i class="xm xm-paper-plane xm-fw"></i></button>
                                <button class="btn__attach" data-target="#media-menu"><svg height="20px" viewBox="0 0 426.66667 426.66667" width="20px" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m410.667969 229.332031h-394.667969c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h394.667969c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
                                        <path d="m213.332031 426.667969c-8.832031 0-16-7.167969-16-16v-394.667969c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v394.667969c0 8.832031-7.167969 16-16 16zm0 0" /></svg></button>
                                
                                <!-- Voice chat btn -->

                                <button id="init-voiceChat"" class="btn__voice-chat js_voice-chat">📣</button>

                                <!-- End Voice chat btn -->

                            </div>
                            <button type="button" class="js_close_update_mess btn__edit--close" style="display: none;"><i class="xm xm-close"></i></button>
                            
                            
                            <button class="js-emoji btn__emoji"><i class="xm xm-smile-o"></i></button>
                            <div class="wrap-emojis">
                                <div class="emojis-tab-content">
                                    <div class="wrap-emoji active wrap-emojis-calc">
                                        <div class="--menu">
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-1" class="active">😄</a>
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-2">🙏</a>
                                            <a href="javascript:void(0)" data-em-tab-btn="--tab-3">➡</a>
                                        </div>
                                        <div class="--list">
                                            <div data-em-tab-content="--tab-1" class="--tab active">
                                            </div>
                                            <div data-em-tab-content="--tab-2" class="--tab">
                                            </div>
                                            <div data-em-tab-content="--tab-3" class="--tab">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="chatbox-progress-upload">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                                    <path fill="none" stroke-width="2" stroke-linecap="square" d="M10,1A9,9 0 1 1 1,10A9,9 0 0 1 10,1" stroke-dasharray="56.548667764616276" stroke-dashoffset="56.548667764616276" transform="rotate(0 10 10)"></path>
                                </svg>
                                <lang data-language="UPLOADING"></lang>... (<span>0</span>%)
                            </div>
                            <div id="media-menu" class="menu js-dismiss-menu">
                                <label class="js-up-file menu__item" data-trigger=".--input-up-file" data-dismiss=".menu">
                                    <i class="xm xm-file-o xm-fw"></i>
                                    <lang data-language="UP_FILE"></lang>
                                    <input type="file" hide class="--input-up-file --hide" />
                                </label>
                                <label class="js-up-media menu__item" data-trigger=".--input-up-media" data-dismiss=".menu">
                                    <input type="file" hide class="--input-up-media --hide" accept="image/*,video/*,audio/*" />
                                    <i class="xm xm-photo xm-fw"></i>
                                    <lang data-language="UP_MEDIA"></lang>
                                </label>
                                <li class="js-up-phone menu__item" data-dismiss=".menu">
                                    <i class="xm xm-phone xm-fw"></i>
                                    <lang data-language="PHONE"></lang>
                                </li>
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
                                        <img src="/assets/images/microphone.svg" alt="">
                                        <div class="record__start-stop-pulse-ring"></div>
                                    </button>
                                </div>
                            </div>

                            <!-- End Voice chat wrap -->

                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    login: `
        <div class="wrap-login">
            <div class="login js-global js-login active">
                <div class="login__header">
                    <img class="login__logo" src="/assets/images/icon.png" alt="Cross messenger logo">
                    <h1 class="login__title" data-language="CROSS_MESSENGER"></h1>
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
                    <div>
                        <button type="button" class="login-erp-btn">
                            ${ICON.ERP_LOGO}
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

                <button data-language="SIGN_UP" class="xmbtn login__btn-signup js-btn-signup"></button>    
            </div>

            <div class="sign-up form-style js-global js-signup">
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

            <div class="download-app"></div>
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
                            <i class="xm xm-microphone"></i>
                        </button>
                        <button class="btn-round mvwmb-btn-camera">
                            <span></span>
                            <i class="xm xm-video-camera btn-camera"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mvwm-settings">
                <div class="mvwms-settings">
                    <div class="mvwmss-utility">
                        <button data-lang-type="tooltip" data-language="SHARE_YOUR_SCREEN" class="mvwmss-btn-share-screen" data-toggle="tooltip" data-placement="top" title="Share your screen">
                            <i class="xm xm-desktop xm-fw" aria-hidden="true"></i>
                        </button>
                        <button data-lang-type="tooltip" data-language="INVITE_PEOPLE" class="mvwmss-btn-add-people" data-toggle="tooltip" data-placement="top" title="Invite people">
                            <i class="xm xm-send-plus xm-fw" aria-hidden="true"></i>
                        </button>
                        <button class="mvwmss-btn-left-conference" data-toggle="tooltip" data-placement="top" title="Left the conference">
                            <i class="xm xm-mail-forward xm-fw" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="mvwmss-group-btn">
                        <button class="btn-round mvwmb-btn-mic">
                            <span></span>
                            <i class="xm xm-microphone"></i>
                        </button>
                        <button class="btn-round mvwmb-btn-camera">
                            <span></span>
                            <i class="xm xm-video-camera btn-camera"></i>
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
