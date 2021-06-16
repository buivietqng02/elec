define(() => {
    const ob = {};
    const className = 'active';
    let $chatsItem;
    let $cartItem;
    let $chatsMobileItem;
    let $cartMobileItem;
    let $chatsContent;
    let $cartContent;

    const switchToChat = () => {
        $chatsItem.addClass(className);
        $chatsMobileItem.addClass(className);
        $cartItem.removeClass(className);
        $cartMobileItem.removeClass(className);
        $chatsContent.show();
        $cartContent.hide();
    };

    const switchToCart = () => {
        $cartItem.addClass(className);
        $cartMobileItem.addClass(className);
        $chatsItem.removeClass(className);
        $chatsMobileItem.removeClass(className);
        $chatsContent.hide();
        $cartContent.show();
    };

    ob.onInit = () => {
        $chatsItem = $('#leftbar .lbi-chats');
        $chatsMobileItem = $('#leftbar-mobile .lbmi-chats');
        $cartItem = $('#leftbar .lbi-cart');
        $cartMobileItem = $('#leftbar-mobile .lbmi-cart');
        $chatsContent = $('#frame');
        $cartContent = $('#cart-packages');

        switchToChat();

        $chatsItem.off().click(switchToChat);
        $chatsMobileItem.off().click(switchToChat);
        $cartItem.off().click(switchToCart);
        $cartMobileItem.off().click(switchToCart);
    };

    return ob;
});
