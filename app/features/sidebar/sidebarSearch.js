define([
    'app/constant',
    'shared/data', 
    'shared/functions'
], (
    constant,
    GLOBAL,
    functions
) => {
    const { debounce } = functions;
    let currentOptions = 1;
    const $frame = $('#frame');
    const $wrapper = $('#search');
    const $searchBtnCollapse = $wrapper.find('.search-toggle');
    const $slide = $wrapper.find('.js-menu');
    const $options = $wrapper.find('[data-s]');
    const $optionsBtn = $wrapper.find('.search__option');
    const $input = $wrapper.find('.search__input');
    const $resetInputBtn = $wrapper.find('.clearable__clear');

    const onSearch = debounce(() => {
        const $rooms = $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`);
        const value = $input.val().trim().toUpperCase();

        $rooms.removeAttr('data-search-sidebar-hide');
        if (!value) {
            return;
        }

        $rooms.each(i => {
            const $room = $rooms.eq(i);
            const name = $room.find('[data-userid-name]').html();

            if (String(name).toUpperCase().indexOf(value) > -1) {
                $room.removeAttr('data-search-sidebar-hide');
            } else {
                $room.attr('data-search-sidebar-hide', true);
            }
        });
    }, 300);

    const offEventClickOutside = () => {
        $slide.hide();
        $(document).off('.hideSearchFilter');
    };

    const handleClickOutside = () => $(document).on('click.hideSearchFilter', (e) => {
        if (!$slide.is(e.target) && $slide.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        $slide.show();
        handleClickOutside();
    };

    const onChangeFilter = (e) => {
        const $rooms = $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`);
        const $this = $(e.currentTarget);
        const { s } = $this.data();
        offEventClickOutside();

        if (s === currentOptions) {
            return;
        }

        currentOptions = s;
        $options.removeClass('active');
        $this.addClass('active');
        $rooms.removeAttr('data-filter-sidebar-hide');

        // filter with all
        if (s === 1) {
            return;
        }

        $rooms.each(i => {
            const $room = $rooms.eq(i);
            const { isGroup } = $room.data();
            // filter with unread
            if (s === 2 && !$room.find('.badge.badge-orange').html()) {
                $room.attr('data-filter-sidebar-hide', true);
                return;
            }

            // filter with group
            if (s === 3 && !isGroup) {
                $room.attr('data-filter-sidebar-hide', true);
                return;
            }

            // filter with direct
            if (s === 4 && isGroup) {
                $room.attr('data-filter-sidebar-hide', true);
            }
        });
    };

    const onExpandSidebar = () => {
        if (window.outerWidth > 767) {
            $frame.removeClass('indent');
        } else {
            $frame.addClass('indent');
        }
        
        setTimeout(() => $input.focus(), 100);
    };

    const resetInput = () => {
        $(`[${constant.ATTRIBUTE_SIDEBAR_ROOM}]`).removeAttr('data-search-sidebar-hide');
        $input.val('');
    };

    return {
        onInit: () => {
            $input.val('');
            $options.off().click(onChangeFilter);
            $optionsBtn.off().click(showSlide);
            $resetInputBtn.off().click(resetInput);
            $searchBtnCollapse.off().click(onExpandSidebar);
            $(document).off('.sidebarSearch').on('input.sidebarSearch', '#search .search__input', onSearch);
        }
    };
});
