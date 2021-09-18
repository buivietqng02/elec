define(['app/constant'], (constant) => {
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
        file: `<i class="xm xm-download"></i> <a href="{src}" target="_blank">{fileName}</a> {fileSize}`,
        image: '<img class="p-cur --click-show-popup-up-img" src="{src}">',
        // audio: `<audio controls autoplay>source src="{src}" type="audio/wav">Your browser does not support the audio element.</audio>`,

        audio: `<div class="audio-main-content">
                    <div class="clip">
                        <audio id="{audioId}" class="audio-recorder" controls src="{src}" type="audio/webm">
                          
                        </audio>
                    </div>
                    <div class="audio-controler">
                        <button id="{buttonId}" class="audio-playStop">
                            <div class="audio-circular">
                                <div class="audio-inner"></div>
                                <div class="audio-number">
                                    <img class="audio-microPic" src="/assets/images/microphone.svg" alt="">

                                    <div class="audio-timeIndicate">00:00</div>
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
            <li class="js_li_list_mess {who} {classLocal} messages__item {isFile}" data-id-local="{idLocal}" ${constant.ATTRIBUTE_MESSAGE_ID}="{id}" data-chat-type="{chatType}">
                <div class="--content">
                    <div class="--heading">
                        <img ${constant.ATTRIBUTE_CHANGE_IMAGE}="{userId}" class="--img avatar" src="{src}" onerror="this.src='/assets/images/user.jpg'">
                        <div class="--name" ${constant.ATTRIBUTE_CHANGE_NAME}="{userId}" data-user-officially-name="{officially_name}">{name}</div>
                        <div class="messages--internal {show_internal}">Internal</div>
                    </div>
                    {comment}
                    <div class="above-of-mess {forward}">Forwarded message:</div>
                    <div class="--mess {forward} {class_removed}">{mess}</div>
                    <div class="messages__bottom">
                        <div class="--date" date-value="{dateTimestamp}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="--double-check {class_read_by_partners} {hide_for_partner}" viewBox="0 0 16 16">
                                <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                            </svg>
                            {date}
                            <span class="--edited {show_edited}">(Edited)</span>
                        </div>
                        <div class="xm xm-bars --bars --menu p-cur btn-message-settings {hide_when_removed}"></div>
                    </div>
                </div>
            </li>
        `
    };

    return Object.freeze(template);
});
