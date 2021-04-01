define([
    'moment',
    'shared/data',
    'shared/functions',
    'app/constant'
], (
    moment,
    GLOBAL,
    functions,
    constant
) => {
    const {
        setDataToLocalApplication, 
        getDataToLocalApplication 
    } = functions;

    const {
        LANGUAGE_KEY,
        LANGUAGES,
        ATTRIBUTE_LANGUAGE
    } = constant;

    const langTypeOb = {
        placeholder: 'placeholder'
    };

    let currentLang = getDataToLocalApplication(LANGUAGE_KEY) || LANGUAGES.english;
    let langJson;

    const handleRenderLang = (elements) => {
        // eslint-disable-next-line func-names
        elements.each(function () {
            const $this = $(this);
            const {
                language,
                langType
            } = $this.data();

            switch (langType) {
                case langTypeOb.placeholder:
                    $this.attr('placeholder', langJson[language]);
                    break;
                default: 
                    $this.text(langJson[language]);
            }
        });
    };

    const onInit = () => {
        try {
            langJson = require(`app/i18n/${currentLang}.json`); // eslint-disable-line import/no-dynamic-require

            if (LANGUAGES.english !== currentLang) {
                require(`moment/locale/${currentLang}`); // eslint-disable-line import/no-dynamic-require
            } else {
                moment.locale(currentLang);
            }

            setDataToLocalApplication(LANGUAGE_KEY, currentLang);
            GLOBAL.setLangJson(langJson);
            GLOBAL.setLanguage(currentLang);
            moment.locale(currentLang);
            handleRenderLang($(`[${ATTRIBUTE_LANGUAGE}]`));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            currentLang = LANGUAGES.english;
            onInit();
        }
    };

    const onChange = (newLanguage) => {
        currentLang = newLanguage;
        onInit();
    };

    return {
        onInit,
        onChange
    };
});
