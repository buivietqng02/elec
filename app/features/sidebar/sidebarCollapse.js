define(() => ({
    onInit: () => {
        const $frame = $('#frame');
        const $lCollapse = $('.lbog-collapse');
        const $searchMessAllRooms = $('.search-mess-all-rooms');
        const $contacts = $('#frame .contacts');

        $('.sidebar .btn-sidebar-collapse, .lbog-collapse .btn-sidebar-collapse').off().click(() => {
            if ($frame.hasClass('indent')) {
                $frame.removeClass('indent');
                $lCollapse.removeClass('indent');
            } else {
                $frame.addClass('indent');
                $lCollapse.addClass('indent');
            }
            $searchMessAllRooms.addClass('hidden');
            $searchMessAllRooms.removeClass('searching');
            $contacts.attr('style', '');
        });
    }
}));
