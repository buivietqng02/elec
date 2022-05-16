define([
    'app/constant',
    'shared/data', 
    'shared/functions',
    'features/sidebar/sidebarService',
    'features/modal/modalSearchMessage',
    'features/modal/modalLabelMessage'
], (
    constant,
    GLOBAL,
    functions,
    sidebarService,
    modalSearchMessage,
    modalLabelMessageComp
) => {
    const { debounce } = functions;
    let currentOptions = 1;
    let $frame;
    let $wrapper;
    let $searchBtnCollapse;
    let $slide;
    let $options;
    let $optionsBtn;
    let $input;
    let $resetInputBtn;
    let $lCollapse;
    let $sidebar;
    let $contacts;
    let $viewSearchAllRoomBtn;
    let $searchAllRoomContainer;
    let $searchAllRoomInitBtn;
    let $searchAllRoomsText;

    let $viewLabelAllRoom;

    const onToggleSearchMessAllRooms = (value) => {
        $searchAllRoomsText.text(value);
        if (value.length >= 3 && $viewSearchAllRoomBtn.hasClass('active')) {
            $searchAllRoomContainer.addClass('searching');
            $searchAllRoomContainer.removeClass('hidden');

            if ($sidebar.hasClass('mobile') && $frame.hasClass('indent')) {
                $contacts.css('height', 'calc(100% - 228px)');
            }

            $searchAllRoomInitBtn.off().click(() => {
                if ($sidebar.hasClass('mobile')) {
                    $searchAllRoomContainer.addClass('hidden');
                    $searchAllRoomContainer.removeClass('searching');
                    $frame.removeClass('indent');
                    $lCollapse.removeClass('indent');
                    $contacts.attr('style', '');
                }
               
                sidebarService.onChangeSearch('');
                modalSearchMessage.onInitSearchAllRooms(value);
            });
        } else {
            $searchAllRoomContainer.removeClass('searching');
            $searchAllRoomContainer.addClass('hidden');

            if ($sidebar.hasClass('mobile') && $frame.hasClass('indent')) {
                $contacts.css('height', 'calc(100% - 196px)');
            }
        }
    };

    const offEventClickOutsideLabelAllRoomBtn = () => {
        $viewLabelAllRoom.addClass('hidden');
        $(document).off('.hideViewLabelAllRoomBtn');
    };

    const onSearch = debounce(() => {
        const value = $input.val().trim().toUpperCase();
        sidebarService.onChangeSearch(value);
        onToggleSearchMessAllRooms($input.val().trim());
        if (value) offEventClickOutsideLabelAllRoomBtn();
    }, 300);

    const offEventClickOutside = () => {
        $slide.hide();
        $(document).off('.hideSearchFilter');
    };

    const handleClickOutsideLabelAllRoomBtn = () => $(document).on('click.hideViewLabelAllRoomBtn', (e) => {
        if (!$viewLabelAllRoom.is(e.target) && $viewLabelAllRoom.has(e.target).length === 0) {
            offEventClickOutsideLabelAllRoomBtn();
        }
    });

    const handleClickOutside = () => $(document).on('click.hideSearchFilter', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showViewLabelAllRoomBtn = (e) => {
        if ($input.val().trim()) return;

        e.preventDefault();
        e.stopPropagation();

        $viewLabelAllRoom.removeClass('hidden');
        handleClickOutsideLabelAllRoomBtn();
    };

    const showSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        $slide.show();
        handleClickOutside();
    };

    const onChangeFilter = (e) => {
        const $this = $(e.currentTarget);
        const { s } = $this.data();
        offEventClickOutside();

        if (s === currentOptions) {
            return;
        }

        currentOptions = s;
        $options.removeClass('active');
        $this.addClass('active');
        sidebarService.onChangeFilter(Number(s));
    };

    const onExpandSidebar = () => {
        if (window.outerWidth > 767) {
            $frame.removeClass('indent');
            $lCollapse.removeClass('indent');
        } else {
            $frame.addClass('indent');
            $lCollapse.addClass('indent');
        }
        $searchAllRoomContainer.addClass('hidden');
        $searchAllRoomContainer.remove('searching');
        
        setTimeout(() => $input.focus(), 100);
    };

    const resetInput = () => {
        $input.val('');
        sidebarService.onChangeSearch('');
        $searchAllRoomContainer.addClass('hidden');
        $searchAllRoomContainer.removeClass('searching');

        if ($sidebar.hasClass('mobile') && $frame.hasClass('indent')) {
            $contacts.css('height', 'calc(100% - 196px)');
        }
    };

    const onViewLabelAllRooms = () => {
        modalLabelMessageComp.onClickViewLabelsAllRooms();
        offEventClickOutsideLabelAllRoomBtn();
        if ($sidebar.hasClass('mobile')) {
            $frame.removeClass('indent');
            $lCollapse.removeClass('indent');
        }
    };

    return {
        onInit: () => {
            currentOptions = 1;
            $sidebar = $('#frame .sidebar');
            $contacts = $('#frame .contacts');
            $frame = $('#frame');
            $lCollapse = $('.lbog-collapse');
            $wrapper = $('#search');
            $searchBtnCollapse = $wrapper.find('.search-toggle');
            $slide = $wrapper.find('.js-menu');
            $options = $wrapper.find('[data-s]');
            $optionsBtn = $wrapper.find('.search__option');
            $input = $wrapper.find('.search__input');
            $resetInputBtn = $wrapper.find('.clearable__clear');
            $searchAllRoomContainer = $('.search-mess-all-rooms');
            $searchAllRoomInitBtn = $('.search-all-room-link');
            $searchAllRoomsText = $('.search-all-room-text');
            $viewSearchAllRoomBtn = $('.menu__item.--s-all');
            $viewLabelAllRoom = $('.view-label-all-room');

            $input.val('');
            $options.off().click(onChangeFilter);
            $optionsBtn.off().click(showSlide);
            $input.off().click(showViewLabelAllRoomBtn);
            $viewLabelAllRoom.off().click(onViewLabelAllRooms);
            $resetInputBtn.off().click(resetInput);
            $searchBtnCollapse.off().click(onExpandSidebar);
            $(document).off('.sidebarSearch').on('input.sidebarSearch', '#search .search__input', onSearch);
        }
    };
});
