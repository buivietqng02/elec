define(() => ({
    onInit: () => {
        const $frame = $('#frame');
        const $lCollapse = $('.lbog-collapse');

        $('.sidebar .btn-sidebar-collapse, .lbog-collapse .btn-sidebar-collapse').off().click(() => {
            if ($frame.hasClass('indent')) {
                $frame.removeClass('indent');
                $lCollapse.removeClass('indent');
            } else {
                $frame.addClass('indent');
                $lCollapse.addClass('indent');
            }
        });
    }
}));
