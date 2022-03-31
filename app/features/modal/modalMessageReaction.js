define(['shared/api'], (API) => {
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
    let $modal;
    let $tabBtn;
    let $tabContentOne;
    let $tabContentTwo;
    let $tabContentThree;
    let $tabContentFour;
    let $messageReactions;
    let $reactionSelected;

    const renderButton = (entity) => (`<button data-re-btn="${entity}" class="btn-em">${entity}</button>`);

    const renderOftenUsedReactions = () => {
        API.get('users/preferences').then((data) => {
            if (data.often_used_reaction) {
                const reSorted = Object.keys(data.often_used_reaction);
                reSorted.sort((a, b) => (data.often_used_reaction[a]
                    - data.often_used_reaction[b]) * -1);
                $tabContentOne.html(reSorted.map(renderButton).join(''));
            } else {
                $tabContentOne.html(tabOneDefault.map(renderButton).join(''));
            }
        });
    };

    const initEmoji = () => {
        $tabBtn = $modal.find('[data-re-tab-btn]');
        $tabContentOne = $modal.find('[data-re-tab-content="--tab-1"]');
        $tabContentTwo = $modal.find('[data-re-tab-content="--tab-2"]');
        $tabContentThree = $modal.find('[data-re-tab-content="--tab-3"]');
        $tabContentFour = $modal.find('[data-re-tab-content="--tab-4"]');

        renderOftenUsedReactions();
        $tabContentTwo.html(tabTwo.map(renderButton).join(''));
        $tabContentThree.html(tabThree.map(renderButton).join(''));
        $tabContentFour.html(tabFour.map(renderButton).join(''));
    };

    const switchTab = (e) => {
        const $this = $modal.find(e.currentTarget);
        const { reTabBtn } = $this.data();
        $tabBtn.removeClass('active');
        $this.addClass('active');
        $('[data-re-tab-content]').removeClass('active');
        $(`[data-re-tab-content="${reTabBtn}"]`).addClass('active');
    };

    const changeStateButton = (clickable) => {
        $.each($messageReactions.find('.message-reaction'), (id, btn) => {
            $(btn).css('pointer-events', clickable ? 'auto' : 'none');
        });
    };

    const addReaction = (e) => {
        const $this = $(e.currentTarget);
        changeStateButton(false);
        const chatId = e.data.chId;
        const messageId = e.data.messId;
        const reContent = e.data.reaction ? e.data.reaction : $this.data().reBtn;
        if ($reactionSelected.length > 0 && $reactionSelected.data().reContent === reContent) {
            API.delete(`chats/${chatId}/messages/${messageId}/react`).then(() => {
                changeStateButton(true);
            }).catch(() => {
                changeStateButton(true);
            });
            return;
        } 
        API.get('users/preferences').then((data) => {
            const re = data.often_used_reaction ? data.often_used_reaction : {};
            re[reContent] = re[reContent] > 0 ? re[reContent] + 1 : 1;
            API.put('users/preferences', { often_used_reaction: re }).then(() => { });
        }).catch(() => {
            changeStateButton(true);
        });
        API.post(`chats/${chatId}/messages/${messageId}/react`, reContent).then(() => {
            changeStateButton(true);
        }).catch(() => {
            changeStateButton(true);
        });
        if ($modal) {
            $modal.modal('hide');
        }
    };
    
    const renderTemplate = () => `
        <div class="modal fade" id="messageReactionModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="wrap-reactions">
                        <div class="emojis-tab-content">
                            <div class="wrap-emoji active wrap-emojis-calc">
                                <div class="--menu">
                                    <a href="javascript:void(0)" data-re-tab-btn="--tab-1" class="active">🕓</a>
                                    <a href="javascript:void(0)" data-re-tab-btn="--tab-2">😄</a>
                                    <a href="javascript:void(0)" data-re-tab-btn="--tab-3">🙏</a>
                                    <a href="javascript:void(0)" data-re-tab-btn="--tab-4">➡</a>
                                </div>
                                <div class="--list">
                                    <div data-re-tab-content="--tab-1" class="--tab active">
                                    </div>
                                    <div data-re-tab-content="--tab-2" class="--tab">
                                    </div>
                                    <div data-re-tab-content="--tab-3" class="--tab">
                                    </div>
                                    <div data-re-tab-content="--tab-4" class="--tab">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onInit = (messageId) => {
        $modal = $('#messageReactionModal');
        $messageReactions = $('.js_ul_list_mess').find(`[data-chat-id="${messageId}"]`).find('.message-reactions');
        $reactionSelected = $messageReactions.find('.--selected');
    };

    return {
        onInit,
        onModal: async (chatId, messageId) => {
            $('body').append(renderTemplate());
            onInit(messageId);
            initEmoji();
            $tabBtn.off().click(switchTab);
            $modal.modal('show');
            $modal.off('.emoji').on('click.emoji', '[data-re-btn]', { chId: chatId, messId: messageId }, addReaction);
        },

        onUpdate: (e, chatId) => {
            const $this = $(e.currentTarget);
            const { reContent } = $this.data();
            const messageId = $this.closest('[data-chat-id').data().chatId;
            onInit(messageId);
            addReaction({ data: { chId: chatId, messId: messageId, reaction: reContent } });
        }
    };
});
