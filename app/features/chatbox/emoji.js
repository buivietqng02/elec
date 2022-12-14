define(['features/chatbox/chatboxInput', 'shared/api'], (chatboxInputComp, API) => {
    const tabOneDefault = ['😄', '😃', '😀', '😊', '😉', '😍', '😘'];
    const tabTwo = ['😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', 
    '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', 
    '😇', '😏', '😑'];
    const tabThree = ['👲', '👳', '👮', '👷', '💂', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾', '👹', '👺', 
    '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '💨', '👂', '👀', '👃', '👅', '👄', '👍', '👎', '👌', '👊', '✊', '✌️', '👋', '✋', '👐', 
    '👆', '👇', '👉', '👈', '🙌', '🙏', '☝️', '👏', '💪', '🚶', '🏃', '💃', '👫', '👪', '👬', '👭', '💏', '💑', '👯', '🙆', '🙅', '💁', '🙋', '💆', '💇', '💅', '👰', '🙎', '🙍', '🙇', 
    '🎩', '👑', '👒', '👟', '👞', '👡', '👠', '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄', '💛', '💙', '💜', '💚', '❤️', 
    '💔', '💗', '💓', '💕', '💖', '💞', '💘', '💌', '💋', '💍', '💎', '👤', '👥', '💬', '👣', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐽', '🐮', 
    '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', 
    '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐲', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '🐾', '💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', 
    '🍃', '🍂', '🌿', '🌾', '🍄', '🌵', '🌴', '🌲', '🌳', '🌰', '🌱', '🌼', '🌐', '🌞', '🌝', '🌚', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌜', '🌛', '🌙', '🌍', '🌎', '🌏', 
    '🌋', '🌌', '🌠', '⭐', '☀️', '⛅', '☁️', '⚡', '☔', '❄️', '⛄', '🌀', '🌁', '🌈', '🌊', '🎍', '💝', '🎎', '🎒', '🎓', '🎏', '🎆', '🎇', '🎐', '🎑', '🎃', '👻', '🎅', '🎄', '🎁', 
    '🎋', '🎉', '🎊', '🎈', '🎌', '🔮', '🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎️', '📞', '📟', '📠', '📡', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '📢', '📣', 
    '⏳', '⌛', '⏰', '⌚', '🔓', '🔒', '🔏', '🔐', '🔑', '🔎', '💡', '🔦', '🔆', '🔅', '🔌', '🔋', '🔍', '🛁', '🛀', '🚿', '🚽', '🔧', '🔩', '🔨', '🚪', '🚬', '💣', '🔫', '🔪', '💊', '💉', 
    '💰', '💴', '💵', '💷', '💶', '💳', '💸', '📲', '📧', '📥', '📤', '✉️', '📩', '📨', '📯', '📫', '📪', '📬', '📭', '📮', '📦', '📝', '📄', '📃', '📑', '📊', '📈', '📉', '📜', '📋', '📅', 
    '📆', '📇', '📁', '📂', '✂️', '📌', '📎', '✒️', '✏️', '📏', '📐', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖', '📛', '🔬', '🔭', '📰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', 
    '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲', '🎯', '🏈', '🏀', '⚽', '⚾️', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣', 
    '☕', '🍵', '🍶', '🍼', '🍺', '🍻', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', 
    '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🏠', '🏡', '🏫', '🏢', '🏣', 
    '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢', '🚢', '⛵', '🚤', '🚣', '⚓', 
    '🚀', '✈️', '💺', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃', '🚎', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚖', '🚛', '🚚', '🚨', '🚓', '🚔', '🚒', '🚑', '🚐', 
    '🚲', '🚡', '🚟', '🚠', '🚜', '💈', '🚏', '🎫', '🚦', '🚥', '⚠️', '🚧', '🔰', '⛽', '🏮', '🎰', '♨️', '🗿', '🎪', '🎭', '📍', '🚩'];
    const tabFour = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣', '🔟', '🔢', '#️⃣', '🔣', 
    '⬆️', '⬇️', '⬅️', '➡️', '🔠', '🔡', '🔤', '↗️', '↖️', '↘️', '↙️', '↔️', '↕️', '🔄', '◀️', '▶️', '🔼', '🔽', '↩️', '↪️', 'ℹ️', '⏪', '⏩', '⏫', '⏬', '⤵️', '⤴️', '🆗', '🔀', '🔁', '🔂', '🆕', '🆙', '🆒', '🆓', 
    '🆖', '📶', '🎦', '🈁', '🈯', '🈳', '🈵', '🈴', '🈲', '🉐', '🈹', '🈺', '🈶', '🈚', '🚻', '🚹', '🚺', '🚼', '🚾', '🚰', '🚮', '🅿️', '♿', '🚭', '🈷️', '🈸', '🈂️', 'Ⓜ️', '🛂', '🛄', '🛅', '🛃', 
    '🉑', '㊙️', '㊗️', '🆑', '🆘', '🆔', '🚫', '🔞', '📵', '🚯', '🚱', '🚳', '🚷', '🚸', '⛔', '✳️', '❇️', '❎', '✅', '✴️', '💟', '🆚', '📳', '📴', '🅰️', '🅱️', '🆎', '🅾️', '💠', '➿', '♻️', '♈', 
    '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '🏧', '💹', '💲', '💱', '©️', '®️', '™️', '❌', '‼️', '⁉️', '❗', '❓', '❕', '❔', '⭕', '🔝', '🔚', '🔙', '🔛', '🔜', '🔃', '🕛', 
    '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '✖️', '➕', '➖', '➗', '♠️', '♥️', '♣️', '♦️', '💮', '💯', 
    '✔️', '☑️', '🔘', '🔗', '➰', '〰️', '〽️', '🔱', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔺', '🔲', '🔳', '⚫', '⚪', '🔴', '🔵', '🔻', '⬜', '⬛', '🔶', '🔷', '🔸', '🔹'];
    let isShow = false;
    let $wrapper;
    let $emojiBtn;
    let $tabBtn;
    let $tabContentOne;
    let $tabContentTwo;
    let $tabContentThree;
    let $tabContentFour;

    const renderButton = (entity) => (`<button data-em-btn="${entity}" class="btn-em">${entity}</button>`);

    const renderOftenUsedEmojis = () => {
        API.get('users/preferences').then((data) => {
            if (data.often_used_emoji) {
                const emSorted = Object.keys(data.often_used_emoji);
                emSorted.sort((a, b) => (data.often_used_emoji[a] - data.often_used_emoji[b]) * -1);
                $tabContentOne.html(emSorted.map(renderButton).join(''));
            } else {
                $tabContentOne.html(tabOneDefault.map(renderButton).join(''));
            }
        });
    };

    const initEmoji = () => {
        isShow = false;
        $wrapper = $('.wrap-emojis');
        $emojiBtn = $('.btn__emoji');
        $tabBtn = $('[data-em-tab-btn]');
        $tabContentOne = $('[data-em-tab-content="--tab-1"]');
        $tabContentTwo = $('[data-em-tab-content="--tab-2"]');
        $tabContentThree = $('[data-em-tab-content="--tab-3"]');
        $tabContentFour = $('[data-em-tab-content="--tab-4"]');
        
        renderOftenUsedEmojis();
        $tabContentTwo.html(tabTwo.map(renderButton).join(''));
        $tabContentThree.html(tabThree.map(renderButton).join(''));
        $tabContentFour.html(tabFour.map(renderButton).join(''));
    };

    const switchTab = (e) => {
        const $this = $(e.currentTarget);
        const { emTabBtn } = $this.data();

        $tabBtn.removeClass('active');
        $this.addClass('active');
        $('[data-em-tab-content]').removeClass('active');
        $(`[data-em-tab-content="${emTabBtn}"]`).addClass('active');
    };

    const offEventClickOutside = () => {
        isShow = false;
        $wrapper.hide();
        $(document).off('.hideEmojiWrapper');
    };

    const handleClickOutside = () => $(document).on('click.hideEmojiWrapper', (e) => {
        if (!$wrapper.is(e.target) && $wrapper.has(e.target).length === 0) {
            offEventClickOutside();
        }
    });

    const showEmoji = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isShow) {
            offEventClickOutside();
        } else {
            renderOftenUsedEmojis();
            isShow = true;
            $wrapper.show();
            handleClickOutside();
        }
    };

    const addEmojiToInput = (e) => {
        const $this = $(e.currentTarget);
        const { emBtn } = $this.data();
        API.get('users/preferences').then((data) => {
                const em = data.often_used_emoji ? data.often_used_emoji : {};
                em[emBtn] = em[emBtn] > 0 ? em[emBtn] + 1 : 1;
                API.put('users/preferences', { often_used_emoji: em }).then(() => { });
        });
        chatboxInputComp.onAddEmoji(emBtn);
    };

    return {
        onInit: () => {
            initEmoji();
            $tabBtn.off().click(switchTab);
            $emojiBtn.off().click(showEmoji);
            $(document).off('.emoji').on('click.emoji', '[data-em-btn]', addEmojiToInput);
        }
    };
});
