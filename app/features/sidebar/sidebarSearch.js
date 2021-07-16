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
    let $frame;
    let $wrapper;
    let $searchBtnCollapse;
    let $slide;
    let $options;
    let $optionsBtn;
    let $input;
    let $resetInputBtn;
    let $lCollapse;

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
            $lCollapse.removeClass('indent');
        } else {
            $frame.addClass('indent');
            $lCollapse.addClass('indent');
        }
        
        setTimeout(() => $input.focus(), 100);
    };

    const resetInput = () => {
        $input.val('');
        sidebarService.onChangeSearch('');
    };

    return {
        onInit: () => {
            currentOptions = 1;
            $frame = $('#frame');
            $lCollapse = $('.lbog-collapse');
            $wrapper = $('#search');
            $searchBtnCollapse = $wrapper.find('.search-toggle');
            $slide = $wrapper.find('.js-menu');
            $options = $wrapper.find('[data-s]');
            $optionsBtn = $wrapper.find('.search__option');
            $input = $wrapper.find('.search__input');
            $resetInputBtn = $wrapper.find('.clearable__clear');

            $input.val('');
            $options.off().click(onChangeFilter);
            $optionsBtn.off().click(showSlide);
            $resetInputBtn.off().click(resetInput);
            $searchBtnCollapse.off().click(onExpandSidebar);
            $(document).off('.sidebarSearch').on('input.sidebarSearch', '#search .search__input', onSearch);
        }
    };
});
