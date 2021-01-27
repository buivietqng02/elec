const convertToJSView = (html) => html.replace(/{([^}]+)}/g, (m, s) => {
    const key = s.replace(/\./g, '^');
    return `{^{:${key}}}`;
});

const getRndInteger = (min, max) => (
    Math.floor(Math.random() * (max - min + 1)) + min
);

define(['moment', 'app/constant'], (moment, constant) => ({
    setCookie: (value, days) => {
        let expires = '';

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }

        document.cookie = `token=${(value || '')}${expires}; path=/`; // android-delete
        // Android.setCookie(baseUrl, "token=" + (value || "") + expires + "; path=/"); //android-add
    },

    setDataToLocalApplication: (property, value) => {
        localStorage.setItem(property, value);
    },

    getDataToLocalApplication: (property) => localStorage.getItem(property),

    removeDataInLocalApplication: (property) => {
        localStorage.removeItem(property);
    },

    getAvatar: (id, isGroup) => {
        if (!id) {
            return;
        }
        
        return `${constant.API_URL}/${isGroup ? 'chats' : 'users'}/${id}/avatar`;
    },

    stripTags: (text) => text.replace(/(<([^>]+)>)/gi, ''),

    convertMessagetime: (time) => {
        const timeMessage = moment(time);
        const today = moment();
        const yesterday = moment().subtract(1, 'days');

        if (today.isSame(timeMessage, 'date')) {
            return `Today ${timeMessage.format('H:mm')}`;
        }

        if (yesterday.isSame(timeMessage, 'date')) {
            return `Yesterday ${timeMessage.format('H:mm')}`;
        }

        return timeMessage.format('D MMM, H:mm');
    },

    humanFileSize: (bytes) => {
        const thresh = 1000;
        const dp = 1;

        if (Math.abs(bytes) < thresh) {
            return `${bytes} B`;
        }

        const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return `${bytes.toFixed(dp)} ${units[u]}`;
    },

    htmlDecode: (string) => {
        const e = document.createElement('textarea');
        
        e.innerHTML = string;
        // handle case of empty string
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
    },

    htmlEncode: (string) => {
        const e = document.createElement('textarea');

        e.textContent = string;
        return e.innerHTML;
    },

    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this; const 
args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    transformLinkTextToHTML: (string) => {
        if (!string) {
            return '';
        }
        
        const regexp = /(www|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
        const content = string.replace(regexp, url => {
            const html = `<a href='${url}' target='_blank' rel='noopener noreferrer'>${url}</a>`;
    
            return html;
        });

        return content;
    },

    truncate: (string, numOfLetter = 1000) => {
        if (string.length > numOfLetter) {
            return `${string.substring(0, numOfLetter - 3)}...`;
        }
        
        return string;
    },

    generateId: () => Math.random().toString(36).substr(2, 9),

    render: (html, data) => $.templates(convertToJSView(html)).render(data)
}));
