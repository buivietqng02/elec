define([
    'app/constant',
    'shared/offlineData',
    'shared/functions',
    'features/modal/modalUserInterface',
    'features/modal/modalInvite',
    'features/modal/modalCreateChannel',
    'features/modal/modalSendErp',
    'features/modal/modalVersion',
    'features/modal/modalCreateGroup',
    'features/modal/modalChangeLanguage',
    'features/logout/logout'
], (
    constant,
    offlineData,
    functions,
    modalUserInterfaceComp,
    modalInviteComp,
    modalCreateChannelComp,
    modalSendErpComp,
    modalVersionComp,
    modalCreateGroupComp,
    modalChangeLanguageComp,
    Logout
) => {
    let $slideOptions;
    let $slideContacts;
    let $optionsBtn; 
    let $contactsBtn;
    let $groupChatBtn; 
    let $changeLanguageBtn; 
    let $startConferenceBtn;
    let $createChannelBtn; 
    let $userInterFaceBtn;
    let $sendInviteBtn;
    let $erpContactBtn;
    let $aboutBtn; 
    let $logoutBtn;
    let isShowOptions = false;
    let isShowContacts = false;

    const offEventClickOutside = () => {
        isShowOptions = false;
        isShowContacts = false;
        $slideOptions.hide();
        $slideContacts.hide();
        $(document).off('.hideOptionsSlide');
        $(document).off('.hideContactsSlide');
    };

    const handleOptionsClickOutside = () => $(document).on('click.hideOptionsSlide', (e) => {
        if (!$slideOptions.is(e.target) && $slideOptions.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const handleContactsClickOutside = () => $(document).on('click.hideContactsSlide', (e) => {
        if (!$slideContacts.is(e.target) && $slideContacts.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showSlideOptions = (e) => {
        e.preventDefault();
        e.stopPropagation();
        offEventClickOutside();

        if (!isShowOptions) {
            isShowOptions = true;
            $slideOptions.show();
            handleOptionsClickOutside();
        }
    };

    const showSlideContacts = (e) => {
        e.preventDefault();
        e.stopPropagation();
        offEventClickOutside();

        if (!isShowContacts) {
            isShowContacts = true;
            $slideContacts.show();
            handleContactsClickOutside();
        }
    };

    const showModalChangeLanguage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        offEventClickOutside();
        modalChangeLanguageComp.onInit();
    };

    const showModalCreateGroup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        offEventClickOutside();
        modalCreateGroupComp.onInit();
    };

    const showModalUserInterFace = (e) => {
        e.preventDefault();
        e.stopPropagation();

        offEventClickOutside();
        modalUserInterfaceComp.onInit();
    };

    const showMeetingPage = () => {
        offEventClickOutside();
        const id = `f${(+new Date).toString(16)}`.toUpperCase();
        window.open(constant.ROUTE.meeting+'/'+id, '_blank').focus();
    };

    const showModalSendInvite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        modalInviteComp.onInit();
        offEventClickOutside();
    };

    const showModalCreateChannel = (e) => {
        e.preventDefault();
        e.stopPropagation();

        modalCreateChannelComp.onInit();
        offEventClickOutside();
    };

    const showModalERPContact = (e) => {
        e.preventDefault();
        e.stopPropagation();

        modalSendErpComp.onInit();
        offEventClickOutside();
    };

    const showModalAbout = (e) => {
        e.preventDefault();
        e.stopPropagation();

        modalVersionComp.onInit();
        offEventClickOutside();
    };

    return {
        onInit: () => {
            isShowOptions = false;
            $slideOptions = $('.dropdown-soo');
            $slideContacts = $('.dropdown-soc');
            $optionsBtn = $('.btn-sidebar-options');
            $contactsBtn = $('.btn-sidebar-contacts');
            $groupChatBtn = $slideContacts.find('.sodi-startchat');
            $startConferenceBtn = $slideContacts.find('.sodi-conference');
            $createChannelBtn = $slideContacts.find('.sodi-channel');
            $sendInviteBtn = $slideContacts.find('.sodi-invite');
            $erpContactBtn = $slideContacts.find('.sodi-erpcontacrt');
            $changeLanguageBtn = $slideOptions.find('.sodi-language');
            $userInterFaceBtn = $slideOptions.find('.sodi-interface');
            $aboutBtn = $slideOptions.find('.sodi-about');
            $logoutBtn = $slideOptions.find('.sodi-logout');

            $optionsBtn.off().click(showSlideOptions);
            $contactsBtn.off().click(showSlideContacts);
            $changeLanguageBtn.off().click(showModalChangeLanguage);
            $groupChatBtn.off().click(showModalCreateGroup);
            $userInterFaceBtn.off().click(showModalUserInterFace);
            $startConferenceBtn.off().click(showMeetingPage);
            $createChannelBtn.off().click(showModalCreateChannel);
            $sendInviteBtn.off().click(showModalSendInvite);
            $erpContactBtn.off().click(showModalERPContact);
            $aboutBtn.off().click(showModalAbout);
            $logoutBtn.off().click(Logout.onLogout);
        }
    };
});
