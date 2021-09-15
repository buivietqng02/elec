define([
    'shared/data',
    'app/constant', 
    'shared/functions',
    'shared/offlineData',
    'features/logout/logout',
    'axios'
], (
    GLOBAL,
    constant, 
    functions,
    offlineData,
    Logout,
    axios
) => {
    const {
        TOKEN,
        API_URL,
    } = constant;

    const getHeaderJson = () => ({
        'Accept-Language': GLOBAL.getLanguage(),
        'Content-Type': 'application/json',
        'X-Authorization-Token': functions.getDataToLocalApplication(TOKEN) || '',
        Authorization: `Bearer ${(functions.getDataToLocalApplication(TOKEN) || '')}`
    });

    const getHeaderForm = () => ({
        'Accept-Language': GLOBAL.getLanguage(),
        'Content-Type': 'application/x-www-form-urlencoded'
    });

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
            Logout.cleanSession();
        }

        if (error.response.status === 403) {
            
        }

        return Promise.reject(error);
    });
    
    return {
        get: (endpoint = '', params = {}, headers) => axios.get(`${API_URL}/${endpoint}${toQueryString(params)}`, {
            headers: headers ? headers : getHeaderJson()
        }),

        post: (endpoint = '', params = {}, headers) => axios.post(`${API_URL}/${endpoint}`, params, {
            headers: headers ? headers : getHeaderJson()
        }),

        put: (endpoint = '', params = {}, headers) => axios.put(`${API_URL}/${endpoint}`, params, {
            headers: headers ? headers : getHeaderJson()
        }),

        delete: (endpoint = '', headers) => axios.delete(`${API_URL}/${endpoint}`, {
            headers: headers ? headers : getHeaderJson()
        }),

        postForm: (endpoint = '', formData, headers) => axios.post(`${API_URL}/${endpoint}`, formData, {
            headers: headers ? headers : getHeaderForm()
        })
    };
});
