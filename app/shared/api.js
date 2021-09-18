define([
    'shared/data',
    'app/constant',
    'shared/functions',
    'features/logout/logout',
    'axios'
], (
    GLOBAL,
    constant,
    functions,
    Logout,
    axios
) => {
    const {
        BASE_URL,
        TOKEN,
        REFRESH_TOKEN,
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

    const instance = axios.create({
        baseURL: `${BASE_URL}xm/`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    const refreshToken = () => {
        return instance.post('oauth/token', `grant_type=refresh_token&refresh_token=${functions.getDataToLocalApplication(REFRESH_TOKEN) || ''}`);
    };

    // Interceptors
    axios.interceptors.response.use((response) => {
        GLOBAL.setNetworkStatus(true);
        return response.data;
    }, async (error) => {
        const originalConfig = error.config;
        if (error.response) {
            GLOBAL.setNetworkStatus(true);
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const response = await refreshToken();

                    functions.setDataToLocalApplication(TOKEN, response.data.token);
                    functions.setDataToLocalApplication(REFRESH_TOKEN, response.data.refresh_token);
                    functions.setCookie(response.data.token, 3650);

                    originalConfig.headers["Authorization"] = `Bearer ${response.data.token}`;

                    return axios(originalConfig);
                } catch (_error) {
                    Logout.cleanSession();
                    if (_error.response && _error.response.data) {
                        return Promise.reject(_error.response.data);
                    }
                    return Promise.reject(_error);
                }
            }
        }
        GLOBAL.setNetworkStatus(false);
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
