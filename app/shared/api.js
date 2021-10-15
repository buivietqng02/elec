define([
    'shared/data',
    'app/constant',
    'shared/functions',
    'axios',
    'features/modal/modalLogout'
], (
    GLOBAL,
    constant,
    functions,
    axios,
    modalLogout
) => {
    const {
        BASE_URL,
        ACCESS_TOKEN,
        REFRESH_TOKEN,
        API_URL,
    } = constant;

    const getHeaderJson = () => ({
        'Accept-Language': GLOBAL.getLanguage(),
        'Content-Type': 'application/json',
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
        baseURL: `${BASE_URL}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    const refreshToken = () => {
        return instance.post('oauth2/token', `grant_type=refresh_token&refresh_token=${functions.getDataToLocalApplication(REFRESH_TOKEN) || ''}`);
    };

    // Interceptors
    axios.interceptors.request.use((request) => {
        if (request.url.includes('xm/api/')) {
            request.headers['Authorization'] = `Bearer ${(functions.getDataToLocalApplication(ACCESS_TOKEN) || '')}`;
            request.headers['Accept-Language'] = GLOBAL.getLanguage();
        }
        return request;
    },
        (error) => {
            return Promise.reject(error);
        });

    axios.interceptors.response.use((response) => {
        GLOBAL.setNetworkStatus(true);
        return response.data;
    }, async (error) => {
        const originalConfig = error.config;
        if (error.response) {
            GLOBAL.setNetworkStatus(true);
            if (error.response.status === 401 && !error.config.url.includes('/auth/') && !error.config.url.includes('/logout') && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const response = await refreshToken();

                    functions.setDataToLocalApplication(ACCESS_TOKEN, response.data.access_token);
                    functions.setDataToLocalApplication(REFRESH_TOKEN, response.data.refresh_token);
                    functions.setCookie(response.data.access_token, 3650);

                    return axios(originalConfig);
                } catch (_error) {
                    if (error.response) {
                        modalLogout.onInit(_error.response.data?.details || 'Unexpected error while refreshing token.');
                        return Promise.reject(new Error('Error refreshing token'));
                    }
                    return Promise.reject(_error);
                }
            }
            return Promise.reject(error);
        }
        GLOBAL.setNetworkStatus(false);
        return Promise.reject(19940402);
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
        })
    };
});
