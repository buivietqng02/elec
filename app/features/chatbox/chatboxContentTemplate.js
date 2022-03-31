define(['app/constant', 'shared/data'], (constant, GLOBAL) => {
    const template = {
        unread: `
            <li class="not-mess-li">
                <div class="messages__unreadLine">
                    unread messages
                </div>
            </li>
        `,
        call: `
            <li class="not-mess-li call-mess" ${constant.ATTRIBUTE_MESSAGE_ID}="{id}">
                <div class="messages__unreadLine">
                    {mess}
                </div>
            </li>
        `,
        rangeDate: `
            <li class="not-mess-li">
                <div class="messages__time-chat" data-mess-date-code="{dateCode}">
                    {date}
                </div>
             </li>
        `,
        leftGroup: `
            <li class="js_li_list_mess" ${constant.ATTRIBUTE_MESSAGE_ID}="{id}">
                <div class="messages__left-chat">
                    {who}
                </div>
            </li>
        `,
        joinGroup: `
            <li class="js_li_list_mess" ${constant.ATTRIBUTE_MESSAGE_ID}="{id}">
                <div class="messages__join-chat">
                    {who}
                </div>
            </li>
        `,
        pinMessage: `
            <li class="js_li_list_mess" ${constant.ATTRIBUTE_MESSAGE_ID}="{id}" type="{type}">
                <div class="messages__pin-unpin-chat">
                    {who}
                </div>
            </li>
        `,

        file: `<i class="xm icon-download"></i> <a href="{src}" target="_blank">{fileName}</a> {fileSize}`,
        quotedFile: `<i class="xm icon-download"></i> <b>{fileName}</b> {fileSize}`,

        image: '<img class="p-cur --click-show-popup-up-img" src="{src}">',
        quotedImage: '<img class="p-cur" src="{src}">',
        // audio: `<audio controls autoplay>source src="{src}" type="audio/wav">Your browser does not support the audio element.</audio>`,

        audio: `<div class="audio-main-content">
                    <div class="clip">
                        <audio id="{audioId}" class="audio-recorder" duration="{duration}">
                            <source src="{src}" type="audio/webm">
                            <source src="{src}" type="audio/mpeg">
                            <source src="{src}" type="audio/mp4">
                            <source src="{src}" type="audio/m4a">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                    <div class="audio-controler">
                        <button id="{buttonId}" class="audio-playStop">
                            <div class="audio-circular">
                                <div class="audio-inner"></div>
                                <div class="audio-number">
                                    <i class="icon-microphoneVoice icon-mic-js"></i>
                                    <div class="audio-timeIndicate">{durationTime}</div>
                                </div>

                                <div class="audio-circle">
                                    <div class="audio-bar audio-left">
                                        <div class="audio-progress"></div>
                                    </div>
                                    <div class="audio-bar audio-right">
                                        <div class="audio-progress"></div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                `,
        quotedAudio: `<div class="audio-main-content">
        <div class="clip">
            <audio class="audio-recorder">
            </audio>
        </div>
            <div class="audio-controler">
                <button class="audio-playStop">
                    <div class="audio-circular">
                        <div class="audio-inner"></div>
                        <div class="audio-number">
                            <i class="icon-microphoneVoice icon-mic-js"></i>

                            <div class="audio-timeIndicate">{durationTime}</div>
                        </div>

                        <div class="audio-circle">
                            <div class="audio-bar audio-left">
                                <div class="audio-progress"></div>
                            </div>
                            <div class="audio-bar audio-right">
                                <div class="audio-progress"></div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        `,

        video: `<video width="400" controls><source src="{src}" type="video/mp4">Your browser does not support HTML video.</video>`,
        mess: `
            <li class="js_li_list_mess {who} {classLocal} messages__item {isFile} {bookmark} {pinned} {haveReactions}" data-id-local="{idLocal}" ${constant.ATTRIBUTE_MESSAGE_ID}="{id}" data-chat-type="{chatType}">
                <div class="--content">
                    <div class="--heading">
                        <img ${constant.ATTRIBUTE_CHANGE_IMAGE}="{userId}" class="--img avatar" src="{src}" onerror="this.src='/assets/images/user.jpg'">
                        <div class="--name" ${constant.ATTRIBUTE_CHANGE_NAME}="{userId}" data-user-officially-name="{officially_name}">{name}</div>
                        <div class="messages--internal {show_internal}">Internal</div>
                    </div>
                    {comment}
                    <div class="above-of-mess {forward}">Forwarded message:</div>
                    <div class="--mess {forward} {class_removed}">{mess}</div>

                    <div class="conference-link {is_conference_link} {hide_when_removed} text-right" confId="{confRoom_chat_Id}">
                        <small data-language="INVITE_CONFERENCE">{Invite_conference_call}: </small>
                        <button class="btn btn-success" data-language="JOIN">
                            {JOIN}
                        </button>
                    </div>

                    <div class="messages__bottom">
                        <div class="--date" date-value="{dateTimestamp}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="--double-check {class_read_by_partners} {hide_for_partner}" viewBox="0 0 16 16">
                                <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                            </svg>
                            {date}
                            <span class="--edited {show_edited}">(Edited)</span>
                        </div>
                        <div class="xm icon-bars --bars --menu p-cur btn-message-settings {hide_when_removed}"></div>
                    </div>

                    <div class="pin-mess-icon">
                        <i class="icon-pin"></i>
                    </div>

                    <div class="message-bookmark-icon">
                        <i class="icon-bookmarks"></i>
                    </div>

                    <div class="message-reactions">
                        {reactions}
                    </div>
                </div>

                <div class="show_origin_mess hidden">
                    <button type="button" class="show_origin_btn btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Show message" sequence_number="{messSequence}">
                        <i class="icon-comment-o"></i>
                    </button>
                </div>
            </li>
        `
    };

    return Object.freeze(template);
});
