/* eslint no-underscore-dangle: 0 */
define([
    'app/constant', 
    'shared/data',
    'shared/api',
    'shared/functions'
    // 'shared/alert', 
    // 'features/chatbox/chatboxContentChatList'
], (
    constant, 
    GLOBAL,
    API,
    functions
    // ALERT, 
    // chatboxContentChatListComp
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
    
    const { 
        render, getAvatar, htmlEncode 
    } = functions;

    const tagModal = `
    <div class="tag-person-item" tabindex="-1" role="dialog">
        <img class="--img avatar" src="{src}">
        <span ${constant.ATTRIBUTE_CHANGE_NAME}="{id}">{currentName}</span>
    </div>
    `;

    const renderTemplate = (members) => {
        let arrMemberHTML = '';
        members.forEach(member => {
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
                renderTemplate(res.members);
            }
        });
    };

    const toggleTagModal = (e) => { 
        const text = e.target.value;

        letterBeforeDelete = lastLetter;
        lastLetter = text.charAt(text.length - 1);
        letterBeforeLast = text.charAt(text.length - 2);
        
        console.log(`letterBeforeDelete: ${letterBeforeDelete}, lastLetter: ${lastLetter}, letterBeforeLast: ${letterBeforeLast}`);
       
        if (lastLetter === '@' && letterBeforeLast.trim() === '' && !isOpenTag) {
            console.log('open modal');
            isOpenTag = true;
            tagPersonContainer.innerHTML = tagModal;
            getGroupMembers();
        }
        
        if (((letterBeforeDelete === '@' && e.keyCode === 8) || lastLetter.trim() === '') && isOpenTag) {
            console.log('close modal');
            isOpenTag = false;
            tagPersonContainer.innerHTML = '';
        }
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
