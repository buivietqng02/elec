define(['app/constant', 'shared/functions'], (constant, functions) => {
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
    const originalFetch = fetch;
    fetch = function () {
        return originalFetch.apply(this, arguments).then((res) => {
            if (res.status === 401) {
                functions.removeDataInLocalApplication(SESSION_ID);
                functions.removeDataInLocalApplication(TOKEN);
                window.location = 'login.html';
                return res.json().then(err => { throw err; });
            }

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return res.json();
            } 
            
            return res.text();
        });
    };
    
    return {
        get: (endpoint = '', params = {}) => fetch(`${API_URL}/${endpoint}${toQueryString(params)}`, {
            method: 'GET',
            headers: headerJson
        }),

        post: (endpoint = '', params = {}) => fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: headerJson,
            body: JSON.stringify(params)
        }),

        put: (endpoint = '', params = {}) => fetch(`${API_URL}/${endpoint}`, {
            method: 'PUT',
            headers: headerJson,
            body: JSON.stringify(params)
        }),

        delete: (endpoint = '') => fetch(`${API_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: headerJson
        }),

        postForm: (endpoint = '', formData) => fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: headerForm,
            body: formData
        })
    };
});
