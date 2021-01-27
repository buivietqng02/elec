define(() => {
    const $frame = $('#frame');

    return {
        onInit: () => {
            $('.sidebar .sidebar-collapse-btn').click(() => {
                if ($frame.hasClass('indent')) {
                    $frame.removeClass('indent');
                } else {
                    $frame.addClass('indent');
                }
            });
        }
    };
});
