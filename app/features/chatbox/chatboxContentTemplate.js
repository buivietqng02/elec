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
            <li class="not-mess-li call-mess" data-chat-id="{id}">
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
            <li class="js_li_list_mess" data-chat-id="{id}">
                <div class="messages__left-chat">
                    {who} - left chat
                </div>
            </li>
        `,
        joinGroup: `
            <li class="js_li_list_mess" data-chat-id="{id}">
                <div class="messages__join-chat">{who}  - joined chat
                </div>
            </li>
        `,
        file: `<i class="xm xm-download"></i> <a href="{src}" target="_blank">{fileName}</a> {fileSize}`,
        image: '<img class="p-cur --click-show-popup-up-img" src="{src}">',
        audio: `
            <audio controls>
                <source src="{audio}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `,
        video: `
            <div class="p-p-re">
                <video width="400" controls>
                    <source src="{video}" type="video/mp4">
                    Your browser does not support HTML video.
                </video>
            </div>
        `,
        mess: `
            <li class="js_li_list_mess {who} messages__item {isFile}" data-chat-id="{id}" data-chat-type="{chatType}">
                <div class="--content">
                    <div class="--heading">
                        <img ${constant.ATTRIBUTE_CHANGE_IMAGE}="{userId}" class="--img avatar" src="{src}" onerror="this.src='/assets/images/user.jpg'">
                        <div class="--name" ${constant.ATTRIBUTE_CHANGE_NAME}="{userId}" data-user-officially-name="{officially_name}">{name}</div>
                        <div class="messages--internal {show_internal}">Internal</div>
                    </div>
                    {comment}
                    <div class="--mess">{mess}</div>
                    <div class="messages__bottom">
                        <div class="--date">{date}</div>
                        <div class="xm xm-bars --bars --menu p-cur btn-message-settings"></div>
                    </div>
                </div>
            </li>
        `
    };

    return Object.freeze(template);
});
