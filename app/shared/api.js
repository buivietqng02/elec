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
        API_URL
    } = constant;

    const sessionId = functions.getDataToLocalApplication(SESSION_ID) || '';
    const token = functions.getDataToLocalApplication(TOKEN) || '';
    const headerForm = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Authorization-Token': token
    };
    const headerJson = {
        'Content-Type': 'application/json',
        'X-Authorization-Token': token
    };
    
    if (!sessionId || !token) {
        window.location = 'login.html';
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
        if (!error.status) {
            GLOBAL.setNetworkStatus(false);
            return Promise.reject(19940402);
        } else {
            GLOBAL.setNetworkStatus(true);
        }

        if (error.response.status === 401) {
            offlineData.clear();
            functions.removeDataInLocalApplication(SESSION_ID);
            functions.removeDataInLocalApplication(TOKEN);
            window.location = 'login.html';
        }

        if (error.response.status === 403) {
            
        }

        return Promise.reject(error);
    });
    
    return {
        get: (endpoint = '', params = {}) => axios.get(`${API_URL}/${endpoint}${toQueryString(params)}`, {
            headers: headerJson
        }),

        post: (endpoint = '', params = {}) => axios.post(`${API_URL}/${endpoint}`, params, {
            headers: headerJson
        }),

        put: (endpoint = '', params = {}) => axios.put(`${API_URL}/${endpoint}`, params, {
            headers: headerJson
        }),

        delete: (endpoint = '') => axios.delete(`${API_URL}/${endpoint}`, {
            headers: headerJson
        }),

        postForm: (endpoint = '', formData) => axios.post(`${API_URL}/${endpoint}`, formData, {
            headers: headerForm,
        })
    };
});
