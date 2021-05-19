define(() => ({
    onInit: () => {
        const $frame = $('#frame');

        $('.sidebar .sidebar-collapse-btn').off().click(() => {
            if ($frame.hasClass('indent')) {
                $frame.removeClass('indent');
            } else {
                $frame.addClass('indent');
            }
        });
    }
}));
