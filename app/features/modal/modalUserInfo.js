define([
    'shared/api',
    'shared/data',
    'shared/functions',
    'shared/alert'
], (
    API,
    GLOBAL,
    functions,
    ALERT
) => {
    const { getAvatar } = functions;
    let $modal;
    let $sendMessageBtn;
    let $sendInviteBtn;
    let $img;

    const renderTemplate = () => `
        <div class="modal fade xmmc-modal" id="userInfoModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
            </div>
        </div>
    `;

    const renderContentWithErp = (langJson, userInfo) => `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" data-language="USER_INFO">
                    ${langJson.USER_INFO}
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label class="image-wrapper">
                    <img src="${getAvatar(userInfo.id)}">
                </label>
                <div class="xmmcm-form-group erm-userid">
                    <label data-language="USER_ID">${langJson.USER_ID}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.id}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-email">
                    <label data-language="EMAIL">${langJson.EMAIL}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.email}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-name">
                    <label data-language="NAME">${langJson.NAME}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.name}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-fullname">
                    <label data-language="FULL_NAME">${langJson.FULL_NAME}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.erpInfo.fullName}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-role">
                    <label data-language="ROLE">${langJson.ROLE}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.erpInfo.role.name}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-groups">
                    <label data-language="GROUPS">${langJson.GROUPS}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.erpInfo.groups[0].name}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-mobile">
                    <label data-language="MOBILE">${langJson.MOBILE}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.erpInfo.mobile}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-ext">
                    <label>Ext</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.erpInfo.extension}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-skype">
                    <label>Skype</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.erpInfo.skype}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-primary send-message">
                    <lang data-language="SEND_MESSAGE">
                        ${langJson.SEND_MESSAGE}
                    </lang>
                </button>
                <button type="button" class="btn btn-outline-primary send-invite">
                    <lang data-language="SEND_INVITE">
                        ${langJson.SEND_INVITE}
                    </lang>
                </button>
            </div>
        </div>
    `;
    
    const renderContentWithoutErp = (langJson, userInfo) => `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" data-language="USER_INFO">
                    ${langJson.USER_INFO}
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label class="image-wrapper">
                    <img src="${getAvatar(userInfo.id)}">
                </label>
                <div class="xmmcm-form-group erm-userid">
                    <label data-language="USER_ID">${langJson.USER_ID}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.id}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-email">
                    <label data-language="EMAIL">${langJson.EMAIL}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.email}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
                <div class="xmmcm-form-group erm-name">
                    <label data-language="NAME">${langJson.NAME}</label>
                    <input class="input-freeze" tabindex="-1" value="${userInfo.name}"/>
                    <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-primary send-message">
                    <lang data-language="SEND_MESSAGE">
                        ${langJson.SEND_MESSAGE}
                    </lang>
                </button>
                <button type="button" class="btn btn-outline-primary send-invite">
                    <lang data-language="SEND_INVITE">
                        ${langJson.SEND_INVITE}
                    </lang>
                </button>
            </div>
        </div>
    `;

    const openPrivateChat = (roomId) => {
        $('.contact-list').append(`
            <div class="js_li_list_user-container" hidden>
                <li class="js_li_list_user contact-list__item p-cur slide-menu active" data-room-id="${roomId}" data-is-group="false">
                </li>
            </div>
        `);

        $(`.js_li_list_user[data-room-id="${roomId}"]`).click();
        $(`.js_li_list_user[data-room-id="${roomId}"]`).remove();
    };

    const findPrivateChat = (userId) => {
        const neededRoom = GLOBAL.getRooms().find(room => (room.partner.id === userId));
        $modal.modal('hide');
        openPrivateChat(neededRoom.id);
    };

    const sendInvite = (email) => {
        API.post(`contacts/invite?email=${email}`).then(() => {
            ALERT.show('Invitation sent', 'success');
        }).catch((e) => {
            ALERT.show(e.response?.data?.details || e);
        });
        $modal.modal('hide');
    };

    const getUserInfo = (userId) => {
        API.get(`users/${userId}`).then(res => {
            if (res.erpInfo != null) {
                $modal.find('.modal-dialog').html(renderContentWithErp(GLOBAL.getLangJson(), res));
            } else {
                $modal.find('.modal-dialog').html(renderContentWithoutErp(GLOBAL.getLangJson(), res));
            }
            const neededRoom = GLOBAL.getRooms().find(room => (room.partner.id === userId));
            $img = $modal.find('.image-wrapper img');
            $sendMessageBtn = $modal.find('.send-message');
            $sendInviteBtn = $modal.find('.send-invite');
            if (neededRoom === undefined) {
                $sendMessageBtn.hide();
                $sendInviteBtn.show();
            } else {
                $sendMessageBtn.show();
                $sendInviteBtn.hide();
            }
            console.log($sendMessageBtn);
            console.log($sendInviteBtn);

            $sendMessageBtn.off().on('click', () => findPrivateChat(userId));
            $sendInviteBtn.off().on('click', () => sendInvite(res.email));
            $img.on('error', () => $img.attr('src', '/assets/images/user.jpg'));
        });
    };

    return {
        onInit: (e) => {
            const userId = $(e.currentTarget).data('userid-image');
            $('body').append(renderTemplate());
            getUserInfo(userId);
            $modal = $('#userInfoModal');
            $modal.modal('show');
        }
    };
});
