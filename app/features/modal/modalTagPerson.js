define([
    'app/constant', 
    'shared/data',
    'shared/api',
    'shared/functions',
    'features/notification/notification'
    // 'shared/alert',
], (
    constant, 
    GLOBAL,
    API,
    functions,
    notificationComp
    // ALERT, 
    ) => {
    let rId;
    let isOpenTag = false;

    let lastLetter;
    let letterBeforeDelete;
    let letterBeforeLast;
    let tagPersonContainer;
    let isLoading = false;
    let membersList = [];

    let tagPersonItem;
    let input;
    let selectedTagList = [];
    let isPossibleEnterTag = false;
    
    const { 
        render, getAvatar, htmlEncode 
    } = functions;

    const tagModal = `
    <div class="tag-person-item" tabindex="-1" role="dialog">
        <img class="--img avatar" src="{src}">
        <div class="tag-info">
            <div class="tag-name" ${constant.ATTRIBUTE_CHANGE_NAME}="{id}">{currentName}</div>
            <small class="tag-email">{email}</small>
        </div>
    </div>
    `;

    const closeModalTag = () => {
        if (!tagPersonContainer) return;
        isOpenTag = false;
        tagPersonContainer.innerHTML = '';
        tagPersonContainer.classList.remove('active');
    };

    const createNewSpan = (value, className, type) => {
        const newSpan = document.createElement('span');
        newSpan.classList.add(className);

        if (type === 'tag') {
            newSpan.innerHTML = value.name;
            newSpan.setAttribute('userId', value.userId);
        }

        if (type === 'text') {
            newSpan.innerHTML = value;
        }

        input.append(newSpan);
    };

    const setCursorEndOfText = (el) => {
        const selection = window.getSelection();  
        const range = document.createRange();  
        selection.removeAllRanges();  
        range.selectNodeContents(el);  
        range.collapse(false);  
        selection.addRange(range);  
        el.focus();
    };

    const selectTagPerson = (value, type) => {
        let tagPerson;

        if (type === 'click') {
            tagPerson = value.currentTarget;
        }

        if (type === 'enter') {
            tagPerson = value;
        }

        const namePerson = tagPerson.querySelector('.tag-name').textContent;

        const userId = tagPerson.querySelector('.tag-name').getAttribute('data-userid-name');
        closeModalTag();
    
        const selectedPerson = {
            userId, 
            name: namePerson
        };

        selectedTagList.push(selectedPerson);

        const inputText = input.textContent;
        
         // Remove <br> tag for Firefox
        if (navigator.userAgent.indexOf('Firefox') !== -1) {
            const brs = input.getElementsByTagName('br');
            for (let i = 0; i < brs.length; i += 1) { brs[i].parentNode.removeChild(brs[i]); }
        }

        // Append tag
        const findSpan = input.querySelector('.tagged');
        if (!findSpan) {
            const startPo = inputText.lastIndexOf(' @');
            input.innerText = input.innerText.substring(0, startPo + 2);
        } else {
            const textArr = input.querySelectorAll('.text');
            // Fix bug for firefox
            if (navigator.userAgent.indexOf('Firefox') !== -1) {
                let inputHTML = input.innerHTML;
                const nextSiblingText = textArr[textArr.length - 1]?.nextSibling?.data;
                const afterAtSign = nextSiblingText?.substring(nextSiblingText.indexOf(' @') + 2, nextSiblingText.length) || '';
                textArr[textArr.length - 1].innerText = ' ';
                inputHTML = inputHTML.substring(0, inputHTML.length - afterAtSign.length);
                input.innerHTML = inputHTML;
            } else {
                // Other browsers
                const lastTextBeforeTag = textArr[textArr.length - 1].innerText;
                let startPo = lastTextBeforeTag.lastIndexOf(' @');
                startPo = startPo < 0 ? 0 : startPo;
                textArr[textArr.length - 1].innerText = lastTextBeforeTag.substring(0, startPo + 2);
            }
        }

        createNewSpan(selectedPerson, 'tagged', 'tag');
        createNewSpan('&nbsp;', 'text', 'text');

        isPossibleEnterTag = false;

        setCursorEndOfText(input);
    };

    const renderTemplate = (list) => {
        if (!document.querySelector('.js_endter_mess').textContent.includes('@')) return;

        tagPersonContainer.innerHTML = '';

        tagPersonContainer.classList.add('active');

        let arrMemberHTML = '';

        list.forEach(member => {
            const arrItem = {
                id: member.user.id,
                currentName: htmlEncode(member.user.name),
                src: getAvatar(member.user.id),
                email: member.user.email
            };

            arrMemberHTML += render(tagModal, arrItem);

            tagPersonContainer.innerHTML = arrMemberHTML;
        });

        tagPersonItem = document.querySelectorAll('.tag-person-item');
        tagPersonItem.forEach(item => {
            item.addEventListener('click', (e) => selectTagPerson(e, 'click'));
        });
    };

    const renderFilter = (search) => {
        if (membersList.length === 0) return;
       
        const filteredList = membersList.filter(
            mem => mem.user.name.trim().toLowerCase().includes(search)
        );
        
        if (filteredList.length === 0) {
            closeModalTag();
        }

        if (filteredList.length === 1) {
            isPossibleEnterTag = true;
        } else {
            isPossibleEnterTag = false;
        }
        
        renderTemplate(filteredList);
    };
    
    const getGroupMembers = () => {
        console.log('call API');
        rId = GLOBAL.getCurrentRoomId();
        API.get(`chats/${rId}`).then((res) => {
            if (res.members) {
                isLoading = false;
                membersList = res.members;
                
                renderTemplate(membersList);
            }
        }).catch(err => {
            isLoading = false;
            console.log(err);
        });
    };

    const toggleTagModal = (e) => { 
        const text = document.querySelector('.js_endter_mess').textContent; 
        // console.log(text);

        let searchText = '';
        
        // Get search text
        const findSpan = input.querySelector('.tagged');
        if (!findSpan) {
            const startPo = text.lastIndexOf(' @');
            searchText = text.substring(startPo + 2, text.length);
        } else {
            const textArr = input.querySelectorAll('.text');

            if (navigator.userAgent.indexOf('Firefox') !== -1) {
                // Fix bug for firefox
                const nextSiblingText = textArr[textArr.length - 1]?.nextSibling?.data;
                searchText = nextSiblingText?.substring(nextSiblingText.indexOf(' @') + 2, nextSiblingText.length) || '';
            } else {
                // Other browsers
                const lastTextBeforeTag = textArr[textArr.length - 1]?.innerText;
                let startPo = lastTextBeforeTag?.lastIndexOf(' @');
                startPo = startPo < 0 ? 0 : startPo;
                searchText = lastTextBeforeTag?.substring(startPo + 2, lastTextBeforeTag?.length) || '';
            }
        }

        // console.log(text.charAt(text.length - 1));
        letterBeforeDelete = lastLetter;
        lastLetter = text.charAt(text.length - 1);
        letterBeforeLast = text.charAt(text.length - 2);
        
        // Open tag modal
        if (lastLetter === '@' && letterBeforeLast.trim() === '' && !isOpenTag) {
            if (!text.includes('@') || isLoading) return;
            
            const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
            const roomInfo = sidebarRoomListComp.getRoomInfoOnClick();
           
            if (!roomInfo.group || roomInfo.channel) return;

            isOpenTag = true;
            isLoading = true;
            getGroupMembers();
        }

        // Delete all will close tag
        if (text === '' && e.keyCode === 8) closeModalTag();
        
        // Search name
        if (isOpenTag && e.keyCode !== 13) {
            renderFilter(searchText?.trim()?.toLowerCase());
        }

        // Enter to tag
        if (isPossibleEnterTag && e.keyCode === 13) {
            selectTagPerson(tagPersonContainer.querySelector('.tag-person-item'), 'enter');
        } 

        // close tag modal
        if (((letterBeforeDelete === '@' && e.keyCode === 8) || e.keyCode === 13) && isOpenTag) {
            closeModalTag();
        }
    };

    const removeTag = (e) => {
        if (e.target.textContent === '') {
            selectedTagList = [];
            return;
        }

        const newArr = [];
        document.querySelectorAll('.tagged').forEach((item) => {
            newArr.push(item);
        });

        if (selectedTagList.length === 0 || newArr.length === 0) return;

        // Remove not match
        selectedTagList.forEach((ite, index) => {
            if (selectedTagList[index]?.name !== newArr[index]?.innerHTML) {
                selectedTagList.splice(index, 1);
                if (!newArr[index]) return;
                newArr[index].classList.remove('tagged');
                newArr[index].removeAttribute('userid');
                newArr[index].classList.add('text');
            } 
        });
    };

    const onSyncTag = (res) => {
        let roomInfo = GLOBAL.getRooms().filter((room) => {
            if (String(room.id) === String(res[0].chat.id)) {
                return true;
            }

            return false;
        })[0] || {};
        roomInfo = JSON.parse(JSON.stringify(roomInfo));

        res[0].type = 'tag';
        notificationComp.pushNotificationForMessage(res[0], roomInfo);

        const roomElement = document.querySelector(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}="${res[0].chat.id}"]`);
        const badgeTag = roomElement.querySelector('.badge-tag');

        if (!roomElement.classList.contains('active')) badgeTag.classList.remove('hidden');
    };

    const viewTaggedProfileTemp = (langJson, userInfo) => `
        <div class="modal fade xmmc-modal" id="view-tagged-profile" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="EDIT_ROOM">
                            ${langJson.INFO}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body not-live-assistance">
                        <label class="erm-image-wrapper input-freeze">
                            <img class="--img avatar" src="{src}">
                        </label>
                        <div class="xmmcm-form-group erm-name">
                            <label data-language="NAME">${langJson.NAME}</label>
                            <input class="tag-name input-freeze" data-language="ENTER_NAME" data-lang-type="placeholder" tabindex="-1" maxlength="50" value="${userInfo.name}" />
                        </div>
                        <div class="xmmcm-form-group erm-userid">
                            <label data-language="USER_ID">${langJson.USER_ID}</label>
                            <input class="tag-userid input-freeze" tabindex="-1" value="${userInfo.userid}" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                        </div>
                        <div class="xmmcm-form-group erm-email">
                            <label data-language="EMAIL">${langJson.EMAIL}</label>
                            <input class="tag-email input-freeze" tabindex="-1" value="${userInfo.email}" />
                            <div class="input-only-view" data-toggle="tooltip" data-placement="top" data-lang-type="tooltip" data-language="COPY_TO_CLIPBOARD" title="${langJson.COPY_TO_CLIPBOARD}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const setModalProfileValue = ($modal, userInfo) => {
        $modal.find('.tag-name').val(userInfo.name);
        $modal.find('.tag-userid').val(userInfo.userid);
        $modal.find('.tag-email').val(userInfo.email);
        $modal.find('.avatar').attr('src', userInfo.avatarSrc);
    };

    const handleViewTagProfile = (e) => {
        const userid = e.currentTarget.getAttribute('userid');
        const roomId = GLOBAL.getCurrentRoomId();

        const userInfo = {
            name: 'Loading info...',
            email: 'Loading info...',
            userid,
            isMember: 'Loading info...',
            avatarSrc: getAvatar(userid)
        };
        let $modal = $('#view-tagged-profile');
        
        if (!$modal.length) {
            $('body').append(viewTaggedProfileTemp(GLOBAL.getLangJson(), userInfo));
            $modal = $('#view-tagged-profile');
        }

        $modal.modal('show');

        setModalProfileValue($modal, userInfo);

        API.get(`chats/${roomId}/members/${userid}`).then((res) => {
            userInfo.name = res.user.name;   
            userInfo.email = res.user.email;
            userInfo.isMember = res.member;
            setModalProfileValue($modal, userInfo);
        }); 
    };

    return {
        onInit: () => {
            tagPersonContainer = document.querySelector('.js-tag-person');
            isLoading = false;
            isOpenTag = false;
            input = document.querySelector('.js_endter_mess');
        },

        onRenderTagModal: (e) => {
            toggleTagModal(e);
            removeTag(e);
        },

        getSelectedTagList: () => selectedTagList,
        setSelectedTagList: (value) => {
            selectedTagList = value;
        },

        closeTagModalAndReset: () => {
            closeModalTag();
            selectedTagList = [];
            membersList = [];
        },

        getPossibleEnter: () => isPossibleEnterTag,

        onSyncTag,

        handleViewTagProfile
    };
});
