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
        THEMES, 
        FONTSIZES 
    } = constant;
    let theme;
    let fontsize;
    let $modal;
    let $closeBtn;
    let $themes;
    let $fontsizes;
    let $saveBtn;
    let isModalRendered = false;
    const themeTemplate = '<div class="uimw-theme-item" data-uimw-theme="{name}" style="background: {color}"></div>';
    const fontTemplate = '<div class="uimw-font-item" data-uimw-font="{size}" style="font-size: {size}">Aa</div>';
    const renderTemplate = (themeHtml, fontHtml, langJson) => `
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
    };

    const onChangeFontsize = (e) => {
        $this = $(e.currentTarget);
        $fontsizes.removeClass('active');
        $this.addClass('active');
        fontsize = $this.data().uimwFont;
    };

    const onSave = () => {
        const body = $('body');
        $closeBtn.click();
        body.removeClass(GLOBAL.getBodyBgTheme());
        body.addClass(theme);
        body.css('font-size', fontsize);
        GLOBAL.setBodyBgTheme(theme);
        GLOBAL.setBodyFontSize(fontsize);
        setDataToLocalApplication(BODY_BG_THEME, theme);
        setDataToLocalApplication(BODY_FZ, fontsize);

        API.put('users/preferences', { body_bg_theme: theme, body_fz: fontsize }).then(() => {});
    };
    
    return {
        onInit: () => {
            if (!isModalRendered) {
                const themeHtml = THEMES.map(theme => render(themeTemplate, theme)).join('');
                const fontHtml = FONTSIZES.map(font => render(fontTemplate, { size: font })).join('');
                isModalRendered = true;
                $('body').append(renderTemplate(themeHtml, fontHtml, GLOBAL.getLangJson()));
                $modal = $('#userInterfaceModal');
                $closeBtn = $modal.find('.close');
                $themes = $('[data-uimw-theme]');
                $fontsizes = $('[data-uimw-font]');
                $saveBtn = $modal.find('.btn-outline-primary');
                $themes.click(onChangeTheme);
                $fontsizes.click(onChangeFontsize);
                $saveBtn.click(onSave);
            }

            theme = GLOBAL.getBodyBgTheme() || THEMES[0].name;
            fontsize = GLOBAL.getBodyFontSize() || FONTSIZES[2];

            $themes.removeClass('active');
            $fontsizes.removeClass('active');

            $(`[data-uimw-theme="${theme}"]`).addClass('active');
            $(`[data-uimw-font="${fontsize}"]`).addClass('active');

            $modal.modal('show');
        }
    };
});
