define([
    'app/constant', 
    'shared/data',
    'shared/api',
    'shared/functions'
    // 'shared/alert',
], (
    constant, 
    GLOBAL,
    API,
    functions
    // ALERT, 
    ) => {
        console.log('tag');
    let rId;
    // let roomInfo;
    // let $modal;
    // let $name;
    // let $btnLeave;
    // let $btnCancel;
    // let $caption;
    // let $chatbox;
    let isOpenTag = false;

    let lastLetter;
    let letterBeforeDelete;
    let letterBeforeLast;
    let tagPersonContainer;
    let isLoading = false;
    let membersList = [];
    let isMatch = false;
    
    const { 
        render, getAvatar, htmlEncode 
    } = functions;

    const tagModal = `
    <div class="tag-person-item" tabindex="-1" role="dialog">
        <img class="--img avatar" src="{src}">
        <span ${constant.ATTRIBUTE_CHANGE_NAME}="{id}">{currentName}</span>
    </div>
    `;

    const closeModalTag = () => {
        isOpenTag = false;
        tagPersonContainer.innerHTML = '';
    };

    const renderTemplate = (search) => {
        let arrMemberHTML = '';
        const filteredList = membersList.filter(mem => mem.user.name.includes(search));
        console.log(filteredList);
        let renderList = [];

        if (filteredList.length === 0) {
            renderList = [...membersList];
            isMatch = false;
        } else {
            renderList = [...filteredList];
            isMatch = true;
        }
        renderList.forEach(member => {
            const arrItem = {
                id: member.user.id,
                currentName: htmlEncode(member.user.name),
                src: getAvatar(member.user.id)
            };

            arrMemberHTML += render(tagModal, arrItem);

            tagPersonContainer.innerHTML = arrMemberHTML;
        });
    };
    
    const getGroupMembers = () => {
        isLoading = true;
        rId = GLOBAL.getCurrentRoomId();

        API.get(`chats/${rId}`).then((res) => {
            if (res.members) {
                isLoading = false;
                console.log(res);
                membersList = res.members;
                renderTemplate();
            }
        });
    };

    const toggleTagModal = (e) => { 
        const text = e.target.value;
        console.log(text.substring(1, text.length));

        letterBeforeDelete = lastLetter;
        lastLetter = text.charAt(text.length - 1);
        letterBeforeLast = text.charAt(text.length - 2);
        
        console.log(`letterBeforeDelete: ${letterBeforeDelete}, lastLetter: ${lastLetter}, letterBeforeLast: ${letterBeforeLast}, isMatch: ${isMatch}, isOpenTag: ${isOpenTag}`);
       
        if (lastLetter === '@' && letterBeforeLast.trim() === '' && !isOpenTag) {
            const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
            const roomInfo = sidebarRoomListComp.getRoomInfoOnClick();
           
            if (!roomInfo.group || roomInfo.channel) return;

            console.log('open modal');
            isOpenTag = true;
            tagPersonContainer.innerHTML = tagModal;
            getGroupMembers();
        }
        
        if (((letterBeforeDelete === '@' && e.keyCode === 8) || (lastLetter !== '@' && !isMatch))
         && isOpenTag) {
            console.log('close modal');
            closeModalTag();
        }
        
        if (isOpenTag) renderTemplate(text.substring(1, text.length));
    };

    return {
        onInit: () => {
            console.log('hello tag');
            tagPersonContainer = document.querySelector('.js-tag-person');
            isLoading = false;
            isOpenTag = false;
            console.log(isLoading);
        },

        onRenderTagModal: (e) => {
            toggleTagModal(e);
        }
    };
});
