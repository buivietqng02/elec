define([
    'shared/data',
    'app/constant',
    'axios',
    'shared/functions',
    'shared/offlineData'
], (
    GLOBAL,
    constant,
    axios,
    functions,
    offlineData
) => {
    const ob = {};
    const {
        SESSION_ID,
        ACCESS_TOKEN,
        REFRESH_TOKEN,
        USER_ID,
        ROUTE,
        API_URL
    } = constant;

    const getHeaderJson = () => ({
        'Accept-Language': GLOBAL.getLanguage(),
        'Content-Type': 'application/json'
    });

    const { removeDataInLocalApplication, navigate } = functions;

    ob.onLogout = () => {
        const sessionId = functions.getDataToLocalApplication(SESSION_ID) || '';

        axios.post(`${API_URL}/logout?sessionId=${sessionId}`, null, {
            headers: getHeaderJson()
        }).then(() => { ob.cleanSession(); }).catch(err => {
            console.error(err);
            ob.cleanSession();
        });
    };

    ob.cleanSession = () => {
        offlineData.clear();
        removeDataInLocalApplication(SESSION_ID);
        removeDataInLocalApplication(ACCESS_TOKEN);
        removeDataInLocalApplication(USER_ID);
        removeDataInLocalApplication(REFRESH_TOKEN);
        navigate(ROUTE.login);
    };

    return ob;
});
