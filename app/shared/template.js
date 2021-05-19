define(() => ({
    main: `
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
                    <ul class="contact-list js_ul_list_user" id="sidebar_room_list">
                        <a class="sidebar__toggle"><i class="xm xm-search --icon p-cur"></i></a>
                    </ul>
                </div>
                <div class="p-r">
                    <div class="sidebar__option">
                        <button id="sidebar-options-btn" title="Option" data-target="#user-option">
                            <i class="xm xm-cog xm-fw" aria-hidden="true"></i>
                            <span class="--text" data-language="OPTIONS"></span>
                        </button>
                        <button id="group-chat-options-btn" class="js-op-new-group" title="New Group Chat">
                            <i class="xm xm-comments xm-fw" aria-hidden="true"></i>
                            <span class="--text" data-language="START_CHAT"></span>
                        </button>
                        <button type="button" id="change-lang-btn">
                            <svg height="14px" viewBox="0 0 480 480" width="14px" xmlns="http://www.w3.org/2000/svg">
                                <path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm207.566406 324.078125-68.253906 11.777344c7.8125-28.652344 12.03125-58.164063 12.558594-87.855469h71.929687c-.902343 26.117188-6.398437 51.871094-16.234375 76.078125zm-431.367187-76.078125h71.929687c.527344 29.691406 4.746094 59.203125 12.558594 87.855469l-68.253906-11.777344c-9.835938-24.207031-15.332032-49.960937-16.234375-76.078125zm16.234375-92.078125 68.253906-11.777344c-7.8125 28.652344-12.03125 58.164063-12.558594 87.855469h-71.929687c.902343-26.117188 6.398437-51.871094 16.234375-76.078125zm215.566406-27.472656c28.746094.367187 57.421875 2.984375 85.761719 7.832031l28.238281 4.871094c8.675781 29.523437 13.34375 60.078125 13.878906 90.847656h-127.878906zm88.488281-7.9375c-29.238281-4.996094-58.828125-7.695313-88.488281-8.0625v-96c45.863281 4.40625 85.703125 46.398437 108.28125 107.511719zm-104.488281-8.0625c-29.660156.367187-59.242188 3.066406-88.480469 8.0625l-19.800781 3.425781c22.578125-61.128906 62.417969-103.136719 108.28125-107.523438zm-85.753906 23.832031c28.335937-4.847656 57.007812-7.464844 85.753906-7.832031v103.550781h-127.878906c.535156-30.769531 5.203125-61.324219 13.878906-90.847656zm-42.125 111.71875h127.878906v103.550781c-28.746094-.367187-57.421875-2.984375-85.761719-7.832031l-28.238281-4.871094c-8.675781-29.523437-13.34375-60.078125-13.878906-90.847656zm39.390625 111.488281c29.238281 5.003907 58.824219 7.714844 88.488281 8.105469v96c-45.863281-4.410156-85.703125-46.402344-108.28125-107.515625zm104.488281 8.105469c29.660156-.390625 59.242188-3.101562 88.480469-8.105469l19.800781-3.425781c-22.578125 61.128906-62.417969 103.136719-108.28125 107.523438zm85.753906-23.875c-28.335937 4.847656-57.007812 7.464844-85.753906 7.832031v-103.550781h127.878906c-.535156 30.769531-5.203125 61.324219-13.878906 90.847656zm58.117188-111.71875c-.527344-29.691406-4.746094-59.203125-12.558594-87.855469l68.253906 11.777344c9.835938 24.207031 15.332032 49.960937 16.234375 76.078125zm47.601562-93.710938-65.425781-11.289062c-11.761719-38.371094-33.765625-72.808594-63.648437-99.601562 55.878906 18.648437 102.21875 58.457031 129.074218 110.890624zm-269.871094-110.890624c-29.882812 26.792968-51.886718 61.230468-63.648437 99.601562l-65.425781 11.289062c26.855468-52.433593 73.195312-92.242187 129.074218-110.890624zm-129.074218 314.3125 65.425781 11.289062c11.761719 38.371094 33.765625 72.808594 63.648437 99.601562-55.878906-18.648437-102.21875-58.457031-129.074218-110.890624zm269.871094 110.890624c29.882812-26.792968 51.886718-61.230468 63.648437-99.601562l65.425781-11.289062c-26.855468 52.433593-73.195312 92.242187-129.074218 110.890624zm0 0" /></svg>
                            <span>VI</span>
                        </button>
                    </div>
                    <div id="user-option" class="js-op user-option js-dismiss-menu menu">
                        <button type="button" class="--use-interface menu__item" data-dismiss=".menu">
                            <i class="xm xm-desktop xm-fw" aria-hidden="true"></i>
                            <span data-language="USER_INTERFACE"></span>
                        </button>
                        <button type="button" class="--start-conference menu__item" data-dismiss=".menu">
                            <i class="xm xm-video-camera xm-fw" aria-hidden="true"></i>
                            <span data-language="START_CONFERENCE"></span>
                        </button>
                        <button type="button" class="--send-invite menu__item" data-dismiss=".menu">
                            <i class="xm xm-send-plus xm-fw" aria-hidden="true"></i>
                            <span data-language="SEND_INVITE"></span>
                        </button>
                        <button type="button" class="--erp-contact menu__item" data-dismiss=".menu">
                            <i class="xm xm-users xm-fw" aria-hidden="true"></i>
                            <span data-language="ERP_CONTACTS"></span>
                        </button>
                        <button type="button" class="--about menu__item" data-dismiss=".menu">
                            <i class="xm xm-info-circle xm-fw ng-scope" aria-hidden="true"></i>
                            <span data-language="ABOUT"></span>
                        </button>
                        <button type="button" class="--logout menu__item" data-dismiss=".menu">
                            <i class="xm xm-sign-out xm-fw" aria-hidden="true"></i>
                            <span data-language="LOGOUT"></span>
                        </button>
                    </div>
                </div>
                <button class="sidebar-collapse-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.293 7.293l5-5a1 1 0 0 1 1.497 1.32l-.083.094L4.414 8l4.293 4.293a1 1 0 0 1-1.32 1.497l-.094-.083-5-5a1 1 0 0 1-.083-1.32l.083-.094 5-5-5 5zm5 0l5-5a1 1 0 0 1 1.497 1.32l-.083.094L9.414 8l4.293 4.293a1 1 0 0 1-1.32 1.497l-.094-.083-5-5a1 1 0 0 1-.083-1.32l.083-.094 5-5-5 5z"></path>
                    </svg>
                    <span data-language="COLLAPSE_SIDEBAR"></span>
                </button>
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
                                <span data-language="ENABLE"></span>&nbsp;
                                <lang data-language="INTERNAL_MESSAGES"></lang>
                            </button>
                            <button class="--disabled menu__item">
                                <i class="xm xm-volume-mute" aria-hidden="true"></i>
                                <span data-language="DISABLE"></span>&nbsp;
                                <lang data-language="NOTIFICATIONS"></lang>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    login: `
        <div class="login js-global js-login active">
            <div class="login__header">
                <img class="login__logo" src="assets/images/icon.png" alt="Cross messenger logo">
                <h1 class="login__title" data-language="CROSS_MESSENGER"></h1>
                <div class="language-select" id="change-lang-btn">
                    <svg height="14px" viewBox="0 0 480 480" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm207.566406 324.078125-68.253906 11.777344c7.8125-28.652344 12.03125-58.164063 12.558594-87.855469h71.929687c-.902343 26.117188-6.398437 51.871094-16.234375 76.078125zm-431.367187-76.078125h71.929687c.527344 29.691406 4.746094 59.203125 12.558594 87.855469l-68.253906-11.777344c-9.835938-24.207031-15.332032-49.960937-16.234375-76.078125zm16.234375-92.078125 68.253906-11.777344c-7.8125 28.652344-12.03125 58.164063-12.558594 87.855469h-71.929687c.902343-26.117188 6.398437-51.871094 16.234375-76.078125zm215.566406-27.472656c28.746094.367187 57.421875 2.984375 85.761719 7.832031l28.238281 4.871094c8.675781 29.523437 13.34375 60.078125 13.878906 90.847656h-127.878906zm88.488281-7.9375c-29.238281-4.996094-58.828125-7.695313-88.488281-8.0625v-96c45.863281 4.40625 85.703125 46.398437 108.28125 107.511719zm-104.488281-8.0625c-29.660156.367187-59.242188 3.066406-88.480469 8.0625l-19.800781 3.425781c22.578125-61.128906 62.417969-103.136719 108.28125-107.523438zm-85.753906 23.832031c28.335937-4.847656 57.007812-7.464844 85.753906-7.832031v103.550781h-127.878906c.535156-30.769531 5.203125-61.324219 13.878906-90.847656zm-42.125 111.71875h127.878906v103.550781c-28.746094-.367187-57.421875-2.984375-85.761719-7.832031l-28.238281-4.871094c-8.675781-29.523437-13.34375-60.078125-13.878906-90.847656zm39.390625 111.488281c29.238281 5.003907 58.824219 7.714844 88.488281 8.105469v96c-45.863281-4.410156-85.703125-46.402344-108.28125-107.515625zm104.488281 8.105469c29.660156-.390625 59.242188-3.101562 88.480469-8.105469l19.800781-3.425781c-22.578125 61.128906-62.417969 103.136719-108.28125 107.523438zm85.753906-23.875c-28.335937 4.847656-57.007812 7.464844-85.753906 7.832031v-103.550781h127.878906c-.535156 30.769531-5.203125 61.324219-13.878906 90.847656zm58.117188-111.71875c-.527344-29.691406-4.746094-59.203125-12.558594-87.855469l68.253906 11.777344c9.835938 24.207031 15.332032 49.960937 16.234375 76.078125zm47.601562-93.710938-65.425781-11.289062c-11.761719-38.371094-33.765625-72.808594-63.648437-99.601562 55.878906 18.648437 102.21875 58.457031 129.074218 110.890624zm-269.871094-110.890624c-29.882812 26.792968-51.886718 61.230468-63.648437 99.601562l-65.425781 11.289062c26.855468-52.433593 73.195312-92.242187 129.074218-110.890624zm-129.074218 314.3125 65.425781 11.289062c11.761719 38.371094 33.765625 72.808594 63.648437 99.601562-55.878906-18.648437-102.21875-58.457031-129.074218-110.890624zm269.871094 110.890624c29.882812-26.792968 51.886718-61.230468 63.648437-99.601562l65.425781-11.289062c-26.855468 52.433593-73.195312 92.242187-129.074218 110.890624zm0 0"/></svg>
                    <span></span>
                </div>
            </div>

            <form name="loginForm" class="login__form js_login__form" method="post">
                <input data-lang-type="placeholder" data-language="EMAIL" required="Please enter a email" type="email" name="email" class="form-control" />
                <input data-lang-type="placeholder" data-language="PASSWORD" required="Please enter the password" type="password" name="password" class="form-control" />
                <div class="mess"></div>
                <button type="submit" class="login__btn-submit js-btn-spin">
                    <span class="--spin" style="display:none">◉</span>
                    <lang data-language="LOGIN"></lang>
                </button>
            </form>

            <button data-language="SIGN_UP" class="xmbtn login__btn-signup js-btn-signup"></button>
            <button data-language="FORGOT_PASSWORD" class="xmbtn login__btn-forgot js-btn-forget"></button>    
        </div>
    `
}));
