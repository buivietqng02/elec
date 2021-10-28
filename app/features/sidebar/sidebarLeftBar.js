// const { Alert } = require('bootstrap');

define([
    'shared/functions',
    'app/constant',
    'shared/data'
], (
    functions,
    constant,
    GLOBAL
) => {
    const ob = {};
    const className = 'active';
    let $chatsItem;
    let $cartItem;
    let $chatsMobileItem;
    let $cartMobileItem;
    let $chatsContent;
    let $cartContent;

    let $lbItem;
    let $lbMobileItem;
    let $lbContent;

    let nameInfo;
    let $lbmiWelcome;

    const {
        ROUTE
    } = constant;

    const {
        render,
        getAvatar,
        htmlEncode
    } = functions;

    const template = `
        <a title="Edit Profile" class="sipr-image">
            <img ${constant.ATTRIBUTE_CHANGE_IMAGE}="{id}" src="{src}" onerror="this.src='/assets/images/user.jpg'">
        </a>
    `;

    const switchToChat = () => {
        $chatsItem.addClass(className);
        $chatsMobileItem.addClass(className);
        $cartItem.removeClass(className);
        $cartMobileItem.removeClass(className);
        $chatsContent.show();
        $cartContent.hide();

        $lbItem.removeClass(className);
        $lbMobileItem.removeClass(className);
        $lbContent.hide();

        $lbmiWelcome.hide();
    };

    const switchToCart = () => {
        $cartItem.addClass(className);
        $cartMobileItem.addClass(className);
        $chatsItem.removeClass(className);
        $chatsMobileItem.removeClass(className);
        $chatsContent.hide();
        $cartContent.show();

        $lbItem.removeClass(className);
        $lbMobileItem.removeClass(className);
        $lbContent.hide();

        $lbmiWelcome.hide();
    };

    const switchToLagBlaster = () => {
        $lbItem.addClass(className);
        $lbMobileItem.addClass(className);
        $lbContent.show();

        $cartItem.removeClass(className);
        $cartMobileItem.removeClass(className);
        $chatsItem.removeClass(className);
        $chatsMobileItem.removeClass(className);
        $chatsContent.hide();
        $cartContent.hide();

        $lbmiWelcome.show();
    };

    ob.onInit = (route) => {
        $chatsItem = $('#leftbar .lbi-chats');
        $chatsMobileItem = $('#leftbar-mobile .lbmi-chats');
        $cartItem = $('#leftbar .lbi-cart');
        $cartMobileItem = $('#leftbar-mobile .lbmi-cart');
        $chatsContent = $('#frame');
        $cartContent = $('#cart-packages');

        $lbItem = $('#leftbar .lbi-lagblaster');
        $lbMobileItem = $('#leftbar-mobile .lbmi-lagblaster');
        $lbContent = $('#lagblaster-content');

        nameInfo = document.querySelector('.lb-welcome__name');
        $lbmiWelcome = $('.lbmi-welcome');

        // Temporary for mobile
        // if (!isRegisterLBAccount) {
        //     switchToLagBlaster();
        //     console.log('icon show');
        // }
        // End Temporary for mobile 

        if (route === ROUTE.lagblaster) {
            switchToLagBlaster();
        }

        if (route === ROUTE.index) {
            switchToChat();
        }

        const info = GLOBAL.getInfomation();
        const data = {
            src: getAvatar(info.id),
            name: htmlEncode(info.name),
            id: info.id
        };
        nameInfo.textContent = info.name;
        $('.lb-welcome__avatar').html(render(template, data));

        $chatsItem.off().click(() => {
            window.history.pushState({}, document.title, window.location.origin);
            switchToChat();
        });
        $chatsMobileItem.off().click(() => {
            window.history.pushState({}, document.title, window.location.origin);
            switchToChat();
        });

        $cartItem.off().click(() => {
            window.history.pushState({}, document.title, window.location.origin);
            switchToCart();
        });
        $cartMobileItem.off().click(() => {
            window.history.pushState({}, document.title, window.location.origin);
            switchToCart();
        });

        $lbItem.off().click(() => {
            window.history.pushState({}, document.title, `${window.location.origin}${ROUTE.lagblaster}`);
            switchToLagBlaster();
        });
        $lbMobileItem.off().click(() => {
            window.history.pushState({}, document.title, `${window.location.origin}${ROUTE.lagblaster}`);
            switchToLagBlaster();
        });
    };

    return ob;
});
