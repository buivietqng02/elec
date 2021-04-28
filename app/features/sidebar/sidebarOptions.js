define([
    'app/constant',
    'shared/offlineData',
    'shared/functions',
    'features/modal/modalUserInterface',
    'features/modal/modalInvite',
    'features/modal/modalSendErp',
    'features/modal/modalVersion',
    'features/modal/modalCreateGroup',
    'features/modal/modalChangeLanguage'
], (
    constant,
    offlineData,
    functions,
    modalUserInterfaceComp,
    modalInviteComp,
    modalSendErpComp,
    modalVersionComp,
    modalCreateGroupComp,
    modalChangeLanguageComp
) => {
    const { SESSION_ID, TOKEN, USER_ID } = constant;
    const $slide = $('#user-option');
    const $optionsBtn = $('#sidebar-options-btn');
    const $groupChatBtn = $('#group-chat-options-btn');
    const $changeLanguageBtn = $('#change-lang-btn');
    const $startConferenceBtn = $slide.find('.--start-conference');
    const $userInterFaceBtn = $slide.find('.--use-interface');
    const $sendInviteBtn = $slide.find('.--send-invite');
    const $erpContactBtn = $slide.find('.--erp-contact');
    const $aboutBtn = $slide.find('.--about');
    const $logoutBtn = $slide.find('.--logout');
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

    const showMeetingPage = () => {
        const win = window.open('/meeting.html', '_blank');
        win.focus();
    };

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

    const onLogout = () => {
        offlineData.clear();
        functions.removeDataInLocalApplication(SESSION_ID);
        functions.removeDataInLocalApplication(TOKEN);
        functions.removeDataInLocalApplication(USER_ID);
        window.location = 'login.html';
    };

    return {
        onInit: () => {
            $optionsBtn.off().click(showSlide);
            $changeLanguageBtn.off().click(showModalChangeLanguage);
            $groupChatBtn.off().click(showModalCreateGroup);
            $userInterFaceBtn.off().click(showModalUserInterFace);
            $startConferenceBtn.off().click(showMeetingPage);
            $sendInviteBtn.off().click(showModalSendInvite);
            $erpContactBtn.off().click(showModalERPContact);
            $aboutBtn.off().click(showModalAbout);
            $logoutBtn.off().click(onLogout);
        }
    };
});
