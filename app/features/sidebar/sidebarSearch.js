define([
    'app/constant',
    'shared/data', 
    'shared/functions',
    'features/sidebar/sidebarService'
], (
    constant,
    GLOBAL,
    functions,
    sidebarService
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
        const value = $input.val().trim().toUpperCase();
        sidebarService.onChangeSearch(value);
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
        } else {
            $frame.addClass('indent');
        }
        
        setTimeout(() => $input.focus(), 100);
    };

    const resetInput = () => {
        $input.val('');
        sidebarService.onChangeSearch('');
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
