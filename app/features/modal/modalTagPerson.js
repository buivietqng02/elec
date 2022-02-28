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
    let tagPersonItem;
    
    let input;

    // let selectedTagList = [];
    
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
        console.log('close modal');
        isOpenTag = false;
        tagPersonContainer.innerHTML = '';
    };

    const selectTagPerson = (e) => {
        // console.log(e.currentTarget);
        const tagPerson = e.currentTarget;
        const namePerson = tagPerson.querySelector('span').textContent;
        closeModalTag();
        // console.log(namePerson);
        // console.log(currentInputText);

        console.log(input.value.lastIndexOf(' @'));

        const replaceText = input.value.substring(0, input.value.lastIndexOf(' @') + 2);
        console.log(replaceText);
        const newValue = replaceText.concat(namePerson);

        const startPosition = input.value.lastIndexOf(' @');
        const lengthName = namePerson.length;

        console.log(lengthName);
        console.log(startPosition);
        console.log(input.value.substring(startPosition, startPosition + lengthName));

        input.value = newValue;
    };

    const renderTemplate = (search) => {
        tagPersonContainer.innerHTML = '';

        let arrMemberHTML = '';
        const filteredList = membersList.filter(mem => mem.user.name.includes(search));
        console.log(filteredList);
        let renderList = [];

        if (filteredList.length === 0) {
            renderList = [...membersList];
            console.log('not match');            
            isMatch = false;
        } else {
            renderList = [...filteredList];
            console.log('match');
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

        tagPersonItem = document.querySelectorAll('.tag-person-item');
        tagPersonItem.forEach(item => {
            item.addEventListener('click', selectTagPerson);
        });
    };
    
    const getGroupMembers = () => {
        console.log('call API');

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

        const searchText = text.substring(text.lastIndexOf(' @') + 2, text.length);

        letterBeforeDelete = lastLetter;
        lastLetter = text.charAt(text.length - 1);
        letterBeforeLast = text.charAt(text.length - 2);
        
        // console.log(`letterBeforeDelete: ${letterBeforeDelete}, lastLetter: ${lastLetter}, 
        // letterBeforeLast: ${letterBeforeLast}, isMatch: ${isMatch}, isOpenTag: ${isOpenTag}`);
        // console.log(searchText);
        
        // Open tag modal
        if (lastLetter === '@' && letterBeforeLast.trim() === '' && !isOpenTag) {
            if (!text.includes('@')) return;
            
            const sidebarRoomListComp = require('features/sidebar/sidebarRoomList');
            const roomInfo = sidebarRoomListComp.getRoomInfoOnClick();
           
            if (!roomInfo.group || roomInfo.channel) return;

            console.log('open modal');
            isOpenTag = true;
            tagPersonContainer.innerHTML = tagModal;
            getGroupMembers();
        }
        
        // close tag modal
        if (((letterBeforeDelete === '@' && e.keyCode === 8) || (!isMatch && lastLetter !== '@' && searchText.length > 1)) && isOpenTag) {
            closeModalTag();
        }

        if (text === '' && e.keyCode === 8) closeModalTag();

        if (isOpenTag && letterBeforeDelete !== '@') {
            renderTemplate(searchText);
        }
    };

    return {
        onInit: () => {
            console.log('hello tag');
            tagPersonContainer = document.querySelector('.js-tag-person');
            isLoading = false;
            isOpenTag = false;
            input = document.querySelector('.js_endter_mess');
            console.log(isLoading);
        },

        onRenderTagModal: (e) => {
            toggleTagModal(e);
        }
    };
});
