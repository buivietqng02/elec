define(() => ({
    onInit: () => {
        const $frame = $('#frame');

        $('.sidebar .btn-sidebar-collapse').off().click(() => {
            if ($frame.hasClass('indent')) {
                $frame.removeClass('indent');
            } else {
                $frame.addClass('indent');
            }
        });
    }
}));
