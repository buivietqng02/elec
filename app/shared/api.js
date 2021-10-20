define([
    'shared/data',
    'app/constant',
    'shared/functions',
    'axios',
    'features/modal/modalLogout',
    'rxjs',
    'rxjs/operators'
], (
    GLOBAL,
    constant,
    functions,
    axios,
    modalLogout,
    Rx,
    operators
) => {
    const {
        BASE_URL,
        ACCESS_TOKEN,
        REFRESH_TOKEN,
        API_URL,
    } = constant;

    const {
        filter,
        take,
        switchMap
    } = operators;

    const refreshTokenSubject = new Rx.BehaviorSubject(null);

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
    axios.interceptors.request.use(
        (request) => {
            if (request.url.includes('xm/api/') && functions.getDataToLocalApplication(ACCESS_TOKEN)) {
                request.headers['Authorization'] = `Bearer ${functions.getDataToLocalApplication(ACCESS_TOKEN)}`;
                request.headers['Accept-Language'] = GLOBAL.getLanguage();
            }
            return request;
        },
        (error) => {
            return Promise.reject(error);
        });

    let isRefreshing = false;
    axios.interceptors.response.use((response) => {
        GLOBAL.setNetworkStatus(true);
        return response.data;
    }, async (error) => {
        const originalConfig = error.config;
        if (error.response) {
            GLOBAL.setNetworkStatus(true);
            if (error.config.url.includes('/auth/') || error.config.url.includes('/logout')) {
                isRefreshing = false;
                return Promise.reject(error);
            } else if (error.response.status === 401) { // request has failed with 401 (token expired)
                try {
                    if (!isRefreshing) { // there is NOT a refreshing-token process in progress:
                        isRefreshing = true;
                        refreshTokenSubject.next(null);

                        // refresh the token in API and wait for response
                        const response = await refreshToken();

                        // after successfull response, store values on local storage
                        functions.setDataToLocalApplication(ACCESS_TOKEN, response.data.access_token);
                        functions.setDataToLocalApplication(REFRESH_TOKEN, response.data.refresh_token);
                        functions.setCookie(response.data.access_token, 3650);

                        // and send the response data to the subject
                        // (data will be multicasted to observers subscribed to this subject)
                        refreshTokenSubject.next(response.data);

                        // refreshing process is finished
                        isRefreshing = false;

                        // retry the failed request
                        return axios(originalConfig);
                    } else { // there is a refreshing process in progress:
                        // don't refresh token, instead suscribe to the 
                        // refresh token subject and wait for a response
                        const req = await refreshTokenSubject.pipe(
                            filter(data => data != null), // wait for data to not be null
                            take(1), // take the first value
                            switchMap((data) => Rx.of(data)))
                            .subscribe(() => originalConfig);

                        // retry the failed request 
                        return axios(req);
                    }
                } catch (_error) {
                    isRefreshing = false;
                    if (error.response) {
                        modalLogout.onInit(_error.response.data?.details || 'Unexpected error while refreshing token.');
                        return Promise.reject(new Error('Error refreshing token'));
                    }
                    return Promise.reject(_error);
                }
            } else {
                return Promise.reject(error);
            }
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
