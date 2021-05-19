define([
    'app/constant', 
    'shared/functions',
    'shared/offlineData'
], (
    constant, 
    functions,
    offlineData
) => {
    const ob = {};
    const { 
        SESSION_ID,
        TOKEN,
        USER_ID,
        ROUTE
    } = constant;
    const { removeDataInLocalApplication, navigate } = functions;

    ob.onLogout = () => {
        offlineData.clear();
        removeDataInLocalApplication(SESSION_ID);
        removeDataInLocalApplication(TOKEN);
        removeDataInLocalApplication(USER_ID);
        navigate(ROUTE.login);
    };
    
    return ob;
});
