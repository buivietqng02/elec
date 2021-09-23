define([
    'axios',
    'app/constant',
    'shared/alert',
    'shared/api',
    'shared/data',
    'shared/functions'
], (
    axios,
    constant,
    ALERT,
    API,
    GLOBAL,
    functions
) => {
    const { getAvatar, getDataToLocalApplication } = functions;
    const {
        API_URL, ACCESS_TOKEN, ATTRIBUTE_CHANGE_NAME, ATTRIBUTE_CHANGE_IMAGE
    } = constant;

    let isProcessing;
    let $modal;
    let $img;
    let $userId;
    let $name;
    let $email;
    let $fullName;
    let $mobile;
    let $extension;
    let $skype;
    let $role;
    let $groups;
    let $closeBtn;
    let $inputFile;
    let $save;
    const renderTemplate = (langJson) => `
        <div class="modal fade xmmc-modal" id="profileModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="EDIT_INFORMATION">
                            ${langJson.EDIT_INFORMATION}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label class="pmm-image-wrapper">
                            <input class="pmmiw-file" type="file" accept="image/*" style="display: none" />
                            <img onerror="this.src = '/assets/images/user.jpg'" />
                            <div class="pmmiw-icon">
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16" height="16" viewBox="0 0 36.174 36.174" style="filter: grayscale(1) invert(1);" xml:space="preserve"><g><path d="M23.921,20.528c0,3.217-2.617,5.834-5.834,5.834s-5.833-2.617-5.833-5.834s2.616-5.834,5.833-5.834 S23.921,17.312,23.921,20.528z M36.174,12.244v16.57c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4v-16.57c0-2.209,1.791-4,4-4h4.92 V6.86c0-1.933,1.566-3.5,3.5-3.5h11.334c1.934,0,3.5,1.567,3.5,3.5v1.383h4.92C34.383,8.244,36.174,10.035,36.174,12.244z M26.921,20.528c0-4.871-3.963-8.834-8.834-8.834c-4.87,0-8.833,3.963-8.833,8.834s3.963,8.834,8.833,8.834 C22.958,29.362,26.921,25.399,26.921,20.528z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </div>
                        </label>
                        <div class="pmm-form-group pmm-userid">
                            <label data-language="USER_ID">${langJson.USER_ID}</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-email">
                            <label data-language="Email">${langJson.EMAIL}</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-name">
                            <label>${langJson.NAME}</label>
                            <input data-language="ENTER_NAME" data-lang-type="placeholder" placeholder="${langJson.ENTER_NAME}" maxlength="50" />
                        </div>
                        <div class="pmm-form-group pmm-fullname">
                            <label data-language="FULL_NAME">${langJson.FULL_NAME}</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-role">
                            <label data-language="ROLE">${langJson.ROLE}</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-groups">
                            <label data-language="GROUPS">${langJson.GROUPS}</label>
                            <textarea class="input-freeze" tabindex="-1" style="margin-bottom: 0"></textarea>
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-mobile">
                            <label data-language="MOBILE">${langJson.MOBILE}</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-extension">
                            <label data-language="Extension">Extension</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                        <div class="pmm-form-group pmm-skype">
                            <label data-language="Skype">Skype</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" title="${langJson.COPY_TO_CLIPBOARD}" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            <lang data-language="SAVE">${langJson.SAVE}</lang>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onErrNetWork = () => {
        $closeBtn.click();
        ALERT.show(GLOBAL.getLangJson().UNABLE_TO_CONNECT);
    };

    const onUpdateInfomation = () => {
        if (isProcessing) {
            return;
        }

        const info = { ...GLOBAL.getInfomation() };
        isProcessing = true;
        $save.addClass('loading-btn');

        API.post('saveprofile', { name: `${$name.val() || info.name}` }).then(() => {
            if ($name.val()) {
                info.name = $name.val();
                $(`[${ATTRIBUTE_CHANGE_NAME}="${info.id}"]`).text($name.val());
            }

            $closeBtn.click();
            GLOBAL.setInfomation(info);
        }).catch(onErrNetWork);
    };

    const uploadFile = () => {
        const file = $inputFile.get(0).files[0];
        const formData = new FormData();
        const FR = new FileReader();

        if (!file) {
            return;
        }

        FR.addEventListener('load', (e) => {
            $img.attr('src', e.target.result);
            $(`[${ATTRIBUTE_CHANGE_IMAGE}="${GLOBAL.getInfomation().id}"]`).attr('src', e.target.result);
        });
        FR.readAsDataURL(file);

        formData.append('file', file);

        axios.post(`${API_URL}/users/avatar`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => { })
            .catch(() => { });
    };

    return {
        onInit: () => {
            const info = GLOBAL.getInfomation();

            if (!$('#profileModal').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson()));
                $modal = $('#profileModal');
                $img = $modal.find('.pmm-image-wrapper img');
                $img.attr('src', getAvatar(info.id));
                $userId = $modal.find('.pmm-form-group.pmm-userid input');
                $userId.val(info.id);
                $name = $modal.find('.pmm-form-group.pmm-name input');
                $email = $modal.find('.pmm-form-group.pmm-email input');
                $email.val(info.email);
                $fullName = $modal.find('.pmm-form-group.pmm-fullname input');
                $fullName.val(info.erpInfo?.fullName);
                $mobile = $modal.find('.pmm-form-group.pmm-mobile input');
                $mobile.val(info.erpInfo?.mobile);
                $extension = $modal.find('.pmm-form-group.pmm-extension input');
                $extension.val(info.erpInfo?.extension);
                $skype = $modal.find('.pmm-form-group.pmm-skype input');
                $skype.val(info.erpInfo?.skype);
                $role = $modal.find('.pmm-form-group.pmm-role input');
                $role.val(info.erpInfo?.role?.name);
                $groups = $modal.find('.pmm-form-group.pmm-groups textarea');
                $groups.val(info.erpInfo?.groups?.map(group => group.name).join('\n'));

                $save = $modal.find('.btn-outline-primary');
                $closeBtn = $modal.find('.close');
                $inputFile = $modal.find('.pmm-image-wrapper .pmmiw-file');
                $modal.find('[data-toggle="tooltip"]').tooltip();

                $save.click(onUpdateInfomation);
                $inputFile.change(uploadFile);
            }

            isProcessing = false;
            $save.removeClass('loading-btn');
            $name.val(info.name);
            $modal.modal('show');
        }
    };
});