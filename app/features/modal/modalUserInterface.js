define([
    'shared/api',
    'shared/data',
    'shared/functions',
    'app/constant'
], (
    API,
    GLOBAL,
    functions,
    constant
) => {
    const {
        render,
        setDataToLocalApplication
    } = functions;
    const {
        BODY_BG_THEME,
        BODY_FZ,
        ENTER_KEY_PREFERENCE,
        THEMES,
        FONTSIZES,
        ENTER_KEY_PREFERENCES
    } = constant;
    let theme;
    let fontsize;
    let $modal;
    let $closeBtn;
    let $themes;
    let $fontsizes;
    let $saveBtn;
    let btnVoiceChatDescription;
    let initVoiceChat;
    const themeTemplate = '<div class="uimw-theme-item" data-uimw-theme="{name}" style="background: {color}"></div>';
    const fontTemplate = '<div class="uimw-font-item" data-uimw-font="{size}" style="font-size: {size}">Aa</div>';
    const enterKeyTemplate = '<input class="uimw-enter-item-input" type="radio" data-uimw-enter-key="{value}" name="enterKey" id="{value}"></input><label class="uimw-enter-item-label" for="{value}">{name}</label>';
    const renderTemplate = (themeHtml, fontHtml, enterKeyTemplate, langJson) => `
        <div class="modal fade" id="userInterfaceModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="USER_INTERFACE">
                            ${langJson.USER_INTERFACE}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="uim-wrapper">
                            <div class="uimw-title" data-language="THEME">
                                ${langJson.THEME}
                            </div>
                            ${themeHtml}
                        </div>
                        <div class="uim-wrapper">
                            <div class="uimw-title" data-language="FONT">
                                ${langJson.FONT}
                            </div>
                            ${fontHtml}
                        </div>
                        <div class="uim-wrapper">
                            <div class="uimw-title" data-language="FONT">
                                'Enter' key
                            </div>
                            ${enterKeyTemplate}
                        </div>
                        <button data-language="SAVE" type="button" class="btn btn-outline-primary float-right">
                            ${langJson.SAVE}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onChangeTheme = (e) => {
        $this = $(e.currentTarget);
        $themes.removeClass('active');
        $this.addClass('active');
        theme = $this.data().uimwTheme;

        if (theme === 'body_theme_black') {
            initVoiceChat.innerHTML = '<i class="keyboard-vc-dark"></i>';
            btnVoiceChatDescription.style.color = '#fff';
        } else {
            initVoiceChat.innerHTML = '<i class="keyboard-vc"></i>';
            btnVoiceChatDescription.style.color = '#111';
        }
    };

    const onChangeFontsize = (e) => {
        $this = $(e.currentTarget);
        $fontsizes.removeClass('active');
        $this.addClass('active');
        fontsize = $this.data().uimwFont;
    };

    const onChangeEnterKeyPreference = (e) => {
        $this = $(e.currentTarget);
        enterKeyPreference = $this.data().uimwEnterKey;
    };

    const onSave = () => {
        const body = $('body');
        $closeBtn.click();
        body.removeClass(GLOBAL.getBodyBgTheme());
        body.addClass(theme);
        body.css('font-size', fontsize);
        GLOBAL.setBodyBgTheme(theme);
        GLOBAL.setBodyFontSize(fontsize);
        GLOBAL.setEnterKeyPreference(enterKeyPreference);
        setDataToLocalApplication(BODY_BG_THEME, theme);
        setDataToLocalApplication(BODY_FZ, fontsize);
        setDataToLocalApplication(ENTER_KEY_PREFERENCE, enterKeyPreference);

        API.put('users/preferences', { body_bg_theme: theme, body_fz: fontsize, enter_key_preference: enterKeyPreference }).then(() => { });
    };

    return {
        onInit: () => {
            if (!$('#userInterfaceModal').length) {
                const themeHtml = THEMES.map(theme => render(themeTemplate, theme)).join('');
                const fontHtml = FONTSIZES.map(font => render(fontTemplate, { size: font })).join('');
                const enterKeyHtml = ENTER_KEY_PREFERENCES.map(enterKey => render(enterKeyTemplate, enterKey)).join('');

                $('body').append(renderTemplate(themeHtml, fontHtml, enterKeyHtml, GLOBAL.getLangJson()));
                $modal = $('#userInterfaceModal');
                $closeBtn = $modal.find('.close');
                $themes = $('[data-uimw-theme]');
                $fontsizes = $('[data-uimw-font]');
                $enterKeyPreferences = $('[data-uimw-enter-key]');
                $saveBtn = $modal.find('.btn-outline-primary');

                initVoiceChat = document.querySelector('#init-voiceChat');
                btnVoiceChatDescription = document.querySelector('.btn-voice-chat-description');

                $themes.click(onChangeTheme);
                $fontsizes.click(onChangeFontsize);
                $enterKeyPreferences.click(onChangeEnterKeyPreference);
                $saveBtn.click(onSave);
            }

            theme = GLOBAL.getBodyBgTheme() || THEMES[0].name;
            fontsize = GLOBAL.getBodyFontSize() || FONTSIZES[2];
            enterKeyPreference = GLOBAL.getEnterKeyPreference() || ENTER_KEY_PREFERENCES[0].value;

            $themes.removeClass('active');
            $fontsizes.removeClass('active');

            $(`[data-uimw-theme="${theme}"]`).addClass('active');
            $(`[data-uimw-font="${fontsize}"]`).addClass('active');
            $(`[data-uimw-enter-key="${enterKeyPreference}"]`).prop('checked', true);

            $modal.modal('show');
        }
    };
});
