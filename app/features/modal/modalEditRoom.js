define([
    'app/constant',
    'shared/alert', 
    'shared/api', 
    'shared/data', 
    'shared/functions'
], (
    constant,
    ALERT, 
    API, 
    GLOBAL, 
    functions
) => {
    const { render, getAvatar, getDataToLocalApplication } = functions;
    const {
 API_URL, TOKEN, ATTRIBUTE_CHANGE_NAME, ATTRIBUTE_CHANGE_IMAGE_GROUP 
} = constant;
    const token = getDataToLocalApplication(TOKEN) || '';
    let roomInfo;
    let isProcessing;
    let isModalRendered = false;
    let $modal;
    let $img;
    let $userId;
    let $chatId;
    let $name;
    let $des;
    let $save;
    let $closeBtn;
    let $inputFile;
    const template = `
        <div class="modal fade xmmc-modal" id="editRoomModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Edit Room
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label class="erm-image-wrapper input-freeze">
                            <input class="ermiw-file" type="file" accept="image/*" style="display: none" />
                            <img />
                            <div class="ermiw-icon">
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16" height="16" viewBox="0 0 36.174 36.174" style="filter: grayscale(1) invert(1);" xml:space="preserve"><g><path d="M23.921,20.528c0,3.217-2.617,5.834-5.834,5.834s-5.833-2.617-5.833-5.834s2.616-5.834,5.833-5.834 S23.921,17.312,23.921,20.528z M36.174,12.244v16.57c0,2.209-1.791,4-4,4H4c-2.209,0-4-1.791-4-4v-16.57c0-2.209,1.791-4,4-4h4.92 V6.86c0-1.933,1.566-3.5,3.5-3.5h11.334c1.934,0,3.5,1.567,3.5,3.5v1.383h4.92C34.383,8.244,36.174,10.035,36.174,12.244z M26.921,20.528c0-4.871-3.963-8.834-8.834-8.834c-4.87,0-8.833,3.963-8.833,8.834s3.963,8.834,8.833,8.834 C22.958,29.362,26.921,25.399,26.921,20.528z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </div>
                        </label>
                        <div class="xmmcm-form-group erm-userid">
                            <label>User Id</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view"></div>
                        </div>
                        <div class="xmmcm-form-group erm-chatid">
                            <label>Chat Id</label>
                            <input class="input-freeze" tabindex="-1" />
                            <div class="input-only-view"></div>
                        </div>
                        <div class="xmmcm-form-group erm-name">
                            <label>Name</label>
                            <input tabindex="-1" placeholder="Enter name" maxlength="50" />
                        </div>
                        <div class="xmmcm-form-group erm-des">
                            <label>Description</label>
                            <textarea style="margin-bottom: 0" placeholder="Enter description"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary">
                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onErrNetWork = () => {
        $closeBtn.click();
        ALERT.show('Unable to connect to the Internet');
    };

    const onUpdateInfomation = () => {
        if (isProcessing) {
            return;
        }

        const obRoomEdited = { ...GLOBAL.getRoomInfoWasEdited() };
        isProcessing = true;
        $save.addClass('loading-btn');

        if (roomInfo.group) {
            obRoomEdited[roomInfo.id] = obRoomEdited[roomInfo.id] || {};
            obRoomEdited[roomInfo.id].user_des = $des.val();
        } else {
            const { user } = roomInfo.members[0];
            obRoomEdited[user.id] = obRoomEdited[user.id] || {};
            obRoomEdited[user.id].user_des = $des.val();
            obRoomEdited[user.id].user_name = $name.val();
        }

        API.put('users/preferences', { user_chat_info: obRoomEdited }).then(() => {
            $closeBtn.click();
            GLOBAL.setRoomInfoWasEdited(obRoomEdited);
            
            if (!roomInfo.group) {
                const { user } = roomInfo.members[0];
                const name = $name.val() || user.name;
                $(`[${ATTRIBUTE_CHANGE_NAME}="${user.id}"]`).html(name);
            }
        }).catch(onErrNetWork);
    };

    const uploadFile = () => {
        const file = $inputFile.get(0).files[0];
        const fd = new FormData();
        const FR = new FileReader();

        if (!file) {
            return;
        }
        
        FR.addEventListener('load', (e) => {
            $img.attr('src', e.target.result);
            $(`[${ATTRIBUTE_CHANGE_IMAGE_GROUP}="${GLOBAL.getCurrentRoomId()}"]`).attr('src', e.target.result);
        }); 
        FR.readAsDataURL(file);

        fd.append('avatarfile', file);
        fd.append('id', GLOBAL.getCurrentRoomId());
        $.ajax({
            type: 'POST',
            url: `${API_URL}/uploadgroupavatar`,
            data: fd,
            headers: {
                'X-Authorization-Token': token
            },
            cache: false,
            contentType: false,
            processData: false,
            success: () => {},
            error: () => {}
        });
    };

    return {
        onInit: () => {
            if (!isModalRendered) {
                isModalRendered = true;
                $('body').append(template);
                $modal = $('#editRoomModal');
                $img = $modal.find('.erm-image-wrapper img');
                $userId = $modal.find('.erm-userid input');
                $chatId = $modal.find('.erm-chatid input');
                $name = $modal.find('.erm-name input');
                $des = $modal.find('.erm-des textarea');
                $save = $modal.find('.btn-outline-primary');
                $inputFile = $modal.find('.erm-image-wrapper .ermiw-file');
                $closeBtn = $modal.find('.close');

                $save.click(onUpdateInfomation);
                $inputFile.change(uploadFile);
            }

            const obRoomEdited = GLOBAL.getRoomInfoWasEdited();
            const id = GLOBAL.getCurrentRoomId();
            roomInfo = GLOBAL.getRooms().filter((room) => (room.id === id))[0] || {};
            isProcessing = false;
            $img.off('error');
            $chatId.val(roomInfo.id);
            $save.removeClass('loading-btn');
            $modal.modal('show');

            if (roomInfo.group) {
                $img.closest('.erm-image-wrapper').removeClass('input-freeze');
                $img.on('error', () => $img.attr('src', '/assets/images/group.svg'));
                $img.attr('src', getAvatar(roomInfo.id, true));
                $name.closest('.erm-name').hide();
                $userId.closest('.erm-userid').hide();

                $des.val(obRoomEdited[roomInfo.id]?.user_des || '');
            } else {
                const { user } = roomInfo.members[0];
                
                $img.closest('.erm-image-wrapper').addClass('input-freeze');
                $img.attr('src', getAvatar(user.id));
                $img.on('error', () => $img.attr('src', '/assets/images/user.jpg'));
                $name.closest('.erm-name').show();
                $userId.closest('.erm-userid').show();
                $userId.val(user.id);
                $name.val(obRoomEdited[user.id]?.user_name || user.name);
                $des.val(obRoomEdited[user.id]?.user_des || '');
            }
        }
    };
});
