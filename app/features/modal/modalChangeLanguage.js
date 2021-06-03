define([
    'shared/data',
    'shared/icon',
    'app/constant',
    'features/language/language'
], (
    GLOBAL,
    ICON,
    constant,
    languageComp
) => {
    const { LANGUAGES } = constant;
    let $modal;
    let $langs;
    let $submitBtn;
    let $cancelBtn;
    let currentLang = '';
    const renderTemplate = (langJson) => `
        <div class="modal fade xmmc-modal" id="changeLanguage" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-language="CHANGE_LANGUAGE">
                            ${langJson.CHANGE_LANGUAGE}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="change-language-wrapper">
                            <div class="clm-item" data-type="${LANGUAGES.chinese_simplified}">
                                <span class="clmi-radio"></span>
                                ${ICON.CHINESE}
                                <span class="clmi-text">简化字</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.chinese_traditional}">
                                <span class="clmi-radio"></span>
                                ${ICON.CHINESE}
                                <span class="clmi-text">正體字</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.english}">
                                <span class="clmi-radio"></span>
                                ${ICON.ENGLISH}
                                <span class="clmi-text">English</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.japanese}">
                                <span class="clmi-radio"></span>
                                ${ICON.JAPANESE}
                                <span class="clmi-text">日本語</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.portuguese}">
                                <span class="clmi-radio"></span>
                                ${ICON.PORTUGUESE}
                                <span class="clmi-text">Portugues</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.russian}">
                                <span class="clmi-radio"></span>
                                ${ICON.RUSSIAN}
                                <span class="clmi-text">русский</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.spanish}">
                                <span class="clmi-radio"></span>
                                ${ICON.SPANISH}
                                <span class="clmi-text">Español</span>
                            </div>
                            <div class="clm-item" data-type="${LANGUAGES.vietnamese}">
                                <span class="clmi-radio"></span>
                                ${ICON.VIETNAMESE}
                                <span class="clmi-text">Tiếng Việt</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary">
                            <lang data-language="SAVE">
                                ${langJson.SAVE}
                            </lang>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const onSwitchLang = (e) => {
        const $item = $(e.currentTarget);
        const { type } = $item.data();
        $langs.removeClass('active');
        $item.addClass('active');

        currentLang = type;
    };

    const onChangeLang = () => {
        setTimeout(() => languageComp.onChange(currentLang), 500);
        $cancelBtn.click();
    };

    return {
        onInit: () => {
            if (!$('#changeLanguage').length) {
                $('body').append(renderTemplate(GLOBAL.getLangJson()));
                $modal = $('#changeLanguage');
                $langs = $modal.find('.clm-item');
                $submitBtn = $modal.find('.btn-outline-primary');
                $cancelBtn = $modal.find('.close');

                $submitBtn.off().click(onChangeLang);
                $langs.off().click(onSwitchLang);
            }

            currentLang = GLOBAL.getLanguage();
            // eslint-disable-next-line func-names
            $langs.each(function () {
                const $this = $(this);
                const { type } = $this.data();

                if (type === currentLang) {
                    $this.addClass('active');
                } else {
                    $this.removeClass('active');
                }
            });
            $modal.modal('show');
        }
    };
});
