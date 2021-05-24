define([
    'app/constant',
    'shared/offlineData',
    'shared/functions',
    'features/modal/modalUserInterface',
    'features/modal/modalInvite',
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
    modalSendErpComp,
    modalVersionComp,
    modalCreateGroupComp,
    modalChangeLanguageComp,
    Logout
) => {
    let $slide;
    let $optionsBtn; 
    let $groupChatBtn; 
    let $changeLanguageBtn; 
    let $startConferenceBtn; 
    let $userInterFaceBtn;
    let $sendInviteBtn;
    let $erpContactBtn;
    let $aboutBtn; 
    let $logoutBtn;
    let isShow = false;

    const offEventClickOutside = () => {
        isShow = false;
        $slide.hide();
        $(document).off('.hideOptionsSlide');
    };

    const handleClickOutside = () => $(document).on('click.hideOptionsSlide', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isShow) {
            offEventClickOutside();
        } else {
            isShow = true;
            $slide.show();
            handleClickOutside();
        }
    };

    const showModalChangeLanguage = () => modalChangeLanguageComp.onInit();

    const showModalCreateGroup = () => modalCreateGroupComp.onInit();

    const showModalUserInterFace = () => {
        modalUserInterfaceComp.onInit();
        offEventClickOutside();
    };

    const showMeetingPage = () => functions.navigate(constant.ROUTE.meeting);

    const showModalSendInvite = () => {
        modalInviteComp.onInit();
        offEventClickOutside();
    };

    const showModalERPContact = () => {
        modalSendErpComp.onInit();
        offEventClickOutside();
    };

    const showModalAbout = () => {
        modalVersionComp.onInit();
        offEventClickOutside();
    };

    return {
        onInit: () => {
            isShow = false;
            $slide = $('#user-option');
            $optionsBtn = $('#sidebar-options-btn');
            $groupChatBtn = $('#group-chat-options-btn');
            $changeLanguageBtn = $('#change-lang-btn');
            $startConferenceBtn = $slide.find('.--start-conference');
            $userInterFaceBtn = $slide.find('.--use-interface');
            $sendInviteBtn = $slide.find('.--send-invite');
            $erpContactBtn = $slide.find('.--erp-contact');
            $aboutBtn = $slide.find('.--about');
            $logoutBtn = $slide.find('.--logout');

            $optionsBtn.off().click(showSlide);
            $changeLanguageBtn.off().click(showModalChangeLanguage);
            $groupChatBtn.off().click(showModalCreateGroup);
            $userInterFaceBtn.off().click(showModalUserInterFace);
            $startConferenceBtn.off().click(showMeetingPage);
            $sendInviteBtn.off().click(showModalSendInvite);
            $erpContactBtn.off().click(showModalERPContact);
            $aboutBtn.off().click(showModalAbout);
            $logoutBtn.off().click(Logout.onLogout);
        }
    };
});
