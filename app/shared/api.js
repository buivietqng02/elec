define([
    'shared/data',
    'app/constant', 
    'shared/functions',
    'shared/offlineData',
    'axios'
], (
    GLOBAL,
    constant, 
    functions,
    offlineData,
    axios
) => {
    const {
        TOKEN,
        SESSION_ID,
        API_URL,
        USER_ID,
    } = constant;

    const sessionId = functions.getDataToLocalApplication(SESSION_ID) || '';
    const token = functions.getDataToLocalApplication(TOKEN) || '';
    const userId = functions.getDataToLocalApplication(USER_ID) || '';

    const getHeaderJson = () => {
        return {
            'Accept-Language': GLOBAL.getLanguage(),
            'Content-Type': 'application/json',
            'X-Authorization-Token': token
        }
    };

    const getHeaderForm = () => {
        return {
            'Accept-Language': GLOBAL.getLanguage(),
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Authorization-Token': token
        }
    };

    const onLogout = () => {
        offlineData.clear();
        functions.removeDataInLocalApplication(SESSION_ID);
        functions.removeDataInLocalApplication(TOKEN);
        functions.removeDataInLocalApplication(USER_ID);
        window.location = 'login.html';
    };
    
    if (!sessionId || !token || !userId) {
        onLogout();
    }

    const toQueryString = (params = {}) => {
        const parts = [];
        for (const i in params) {
            if (params.hasOwnProperty(i)) {
                parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(params[i])}`);
            }
        }

        if (!parts.length) {
            return '';
        }

        return `?${parts.join('&')}`;
    };

    // Interceptors
    axios.interceptors.response.use((response) => {
        GLOBAL.setNetworkStatus(true);
        return response.data;
    }, (error) => {
        if (!error.response) {
            GLOBAL.setNetworkStatus(false);
            return Promise.reject(19940402);
        } else {
            GLOBAL.setNetworkStatus(true);
        }

        if (error.response.status === 401) {
            onLogout();
        }

        if (error.response.status === 403) {
            
        }

        return Promise.reject(error);
    });
    
    return {
        get: (endpoint = '', params = {}) => axios.get(`${API_URL}/${endpoint}${toQueryString(params)}`, {
            headers: getHeaderJson()
        }),

        post: (endpoint = '', params = {}) => axios.post(`${API_URL}/${endpoint}`, params, {
            headers: getHeaderJson()
        }),

        put: (endpoint = '', params = {}) => axios.put(`${API_URL}/${endpoint}`, params, {
            headers: getHeaderJson()
        }),

        delete: (endpoint = '') => axios.delete(`${API_URL}/${endpoint}`, {
            headers: getHeaderJson()
        }),

        postForm: (endpoint = '', formData) => axios.post(`${API_URL}/${endpoint}`, formData, {
            headers: getHeaderForm(),
        })
    };
});
