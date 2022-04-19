define([
    'shared/api',
    'shared/data',
    'shared/functions'
], (
    API,
    GLOBAL,
    functions
) => {
    const {
        getAvatar,
        convertMessagetime
    } = functions;
    let $modal;

    const renderMembers = (reactions) => {
        let memberElements = '';
        const $members = $('#messageReactionListModal').find('.mim-member-wrapper');
        reactions.forEach(item => {
            const dateConverted = convertMessagetime(item.reactionDate, GLOBAL.getLangJson());
            memberElements += `
            <div class="mim-member">
                <img class="--img avatar" src="${getAvatar(item.user.id)}">
                <span class="--name">${item.user.name}</span>
                <span class="--date">${dateConverted}</span>
                <span class="--reaction">${item.reaction}</span>
            </div>`;
        });
        $members.html(memberElements);
    };

    const getReactions = (chatId, messageId) => {
        API.get(`chats/${chatId}/messages/${messageId}/react`).then((res) => {
            renderMembers(res);
        }).catch(() => {
        });
    };

    const renderTemplate = (langJson) => `
        <div class="modal fade" id="messageReactionListModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                        <lang data-language="REACTION_LIST">${langJson.REACTION_LIST}</lang>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="mim-member-wrapper --reaction-by">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        onInit: (chatId, messageId) => {
            $('body').append(renderTemplate(GLOBAL.getLangJson()));
            $modal = $('#messageReactionListModal');
            $modal.modal('show');
            getReactions(chatId, messageId);
        }
    };
});
