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
        TOKEN,
        USER_ID,
        ROUTE,
        API_URL
    } = constant;

    const getHeaderJson = () => ({
        'Accept-Language': GLOBAL.getLanguage(),
        'Content-Type': 'application/json',
        'X-Authorization-Token': functions.getDataToLocalApplication(TOKEN) || '',
        Authorization: `Bearer ${(functions.getDataToLocalApplication(TOKEN) || '')}`
    });

    const { removeDataInLocalApplication, navigate } = functions;

    ob.onLogout = () => {
        const sessionId = functions.getDataToLocalApplication(SESSION_ID) || '';

        axios.post(`${API_URL}/logout?sessionId=${sessionId}`, null, {
            headers: getHeaderJson()
        }).then(() => { }).catch(err => console.error(err));

        ob.cleanSession();
    };

    ob.cleanSession = () => {
        offlineData.clear();
        removeDataInLocalApplication(SESSION_ID);
        removeDataInLocalApplication(TOKEN);
        removeDataInLocalApplication(USER_ID);
        navigate(ROUTE.login);
    };

    return ob;
});
