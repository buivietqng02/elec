define([
    'app/constant',
    'shared/api',
    'shared/data',
    'shared/functions'
], (
    constant,
    API,
    GLOBAL,
    functions
) => {
    const {
        render, getAvatar, htmlEncode, convertMessagetime
    } = functions;

    let $modal;

    const template = `
        <div data-mim-room-id="{id}" data-mim-room-name="{name}" class="mim-member">
            <img class="--img avatar" src="{src}">
            <span ${constant.ATTRIBUTE_CHANGE_NAME}="{id}">{name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="--double-check {read}" viewBox="0 0 16 16">
                <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
            </svg>
        </div>
    `;

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="messageInfoModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                        <lang data-language="MESSAGE_INFO">${langJson.MESSAGE_INFO}</lang>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="--date-wrapper">
                            <lang data-language="MESSAGE_SENT">${langJson.MESSAGE_SENT}</lang>
                            <span class="--message-date"></span>
                        </div>
                        <h6 class="--read-by-title"><lang data-language="MESSAGE_READ_BY">${langJson.MESSAGE_READ_BY}</lang></h6>
                        <div class="mim-member-wrapper --read-by"></div>
                        <h6 class="--delivered-to-title"><lang data-language="MESSAGE_DELIVERED_TO">${langJson.MESSAGE_DELIVERED_TO}</lang></h6>
                        <div class="mim-member-wrapper --delivered-to"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const renderMemberList = (chatId, messageDate) => API.get(`chats/${chatId}`).then((res) => {
        if (res.members) {
            const listReadBy = res.members
                .filter(member => member.lastReadTime > messageDate)
                .map(member => render(template, {
                    id: member.user.id,
                    src: getAvatar(member.user.id),
                    name: htmlEncode(member.user.name),
                    read: '--read'
                })).join('');

            const listDeliveredTo = res.members
                .filter(member => member.lastReadTime <= messageDate)
                .map(member => render(template, {
                    id: member.user.id,
                    src: getAvatar(member.user.id),
                    name: htmlEncode(member.user.name),
                    read: ''
                })).join('');

            return { listReadBy, listDeliveredTo };
        }
        return '';
    });

    return {
        onInit: async (chatId, messageDate) => {
            // parse date
            const msgDate = /^\d*$/.test(messageDate) ? new Date(Number(messageDate)) : messageDate;

            const renderedMemberList = await
                renderMemberList(chatId, msgDate instanceof Date ? msgDate.toISOString() : msgDate);

            $('body').append(renderTemplate(GLOBAL.getLangJson()));

            $modal = $('#messageInfoModal');

            // Un-capitalize first letter of formatted date
            const dateConverted = convertMessagetime(msgDate, GLOBAL.getLangJson());
            $modal.find('.--message-date').html(dateConverted.charAt(0).toLowerCase() + dateConverted.slice(1));

            $modal.find('.--read-by').html(renderedMemberList.listReadBy ? renderedMemberList.listReadBy : '');
            $modal.find('.--delivered-to').html(renderedMemberList.listDeliveredTo ? renderedMemberList.listDeliveredTo : '');

            // only show 'read by' title if there are users who read the message
            if (renderedMemberList.listReadBy) {
                $modal.find('.--read-by-title').removeClass('hidden');
            } else {
                $modal.find('.--read-by-title').addClass('hidden');
            }

            // Don't show 'Delivered to' if all users have read the message
            if (!renderedMemberList.listDeliveredTo) {
                $modal.find('.--delivered-to-title').addClass('hidden');
            } else {
                $modal.find('.--delivered-to-title').removeClass('hidden');
            }

            $modal.modal('show');
        }
    };
});
