define(() => ({
    onInit: () => {
        const $frame = $('#frame');
        const $lCollapse = $('.lbog-collapse');
        const $searchMessAllRooms = $('.search-mess-all-rooms');
        const $sidebar = $('#frame .sidebar');
        const $contacts = $('#frame .contacts');

        $('.sidebar .btn-sidebar-collapse, .lbog-collapse .btn-sidebar-collapse').off().click(() => {
            if ($frame.hasClass('indent')) {
                $contacts.attr('style', '');
                $frame.removeClass('indent');
                $lCollapse.removeClass('indent');

                if ($sidebar.hasClass('mobile')) {
                    $searchMessAllRooms.addClass('hidden');
                } else {
                    $searchMessAllRooms.removeClass('hidden');
                }
            } else {
                $frame.addClass('indent');
                $lCollapse.addClass('indent');

                if ($searchMessAllRooms.hasClass('searching')) {
                    $contacts.css('height', 'calc(100% - 228px)');
                    if ($sidebar.hasClass('mobile')) {
                        $searchMessAllRooms.removeClass('hidden');
                    } else {
                        $searchMessAllRooms.addClass('hidden');
                    }
                }
            }
        });
    }
}));
