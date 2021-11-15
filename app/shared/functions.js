let router;

const convertToJSView = (html) => html.replace(/{([^}]+)}/g, (m, s) => {
    const key = s.replace(/\./g, '^');
    return `{^{:${key}}}`;
});

const getRndInteger = (min, max) => (
    Math.floor(Math.random() * (max - min + 1)) + min
);

const modalConfirmTemplate = (object) => `
    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <h2>${object.title || 'Are you sure?'}</h2>
                    <p>${object.des || 'Are you sure you want to do this?'}</p>
                    <button type="button" class="btn btn-outline-primary btn-small float-right" style="margin-left: 5px">
                        ${object.textOk || 'Ok'}
                    </button>
                    <button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary btn-small float-right">
                        ${object.textCancel || 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

define(['moment', 'app/constant', 'navigo'], (moment, constant, Navigo) => ({
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

    sortBy: (arr, p) => arr.sort((a, b) => {
        if (a[p] < b[p]) {
            return -1;
        }

        if (a[p] > b[p]) {
            return 1;
        }

        return 0;
    }),

    stripTags: (text) => text.replace(/(<([^>]+)>)/gi, ''),

    convertMessagetime: (time, langJson, isSearch) => {
        const timeMessage = moment(time);
        const today = moment();
        const yesterday = moment().subtract(1, 'days');
        let dateFormat = 'D MMM';
        if (isSearch) {
            dateFormat = 'D MMM YYYY';
        }

        if (today.isSame(timeMessage, 'date')) {
            return `${langJson.TODAY} ${timeMessage.format('H:mm')}`;
        }

        if (yesterday.isSame(timeMessage, 'date')) {
            return `${langJson.YESTERDAY} ${timeMessage.format('H:mm')}`;
        }

        return timeMessage.format(`${dateFormat}, H:mm`);
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

    decodeStringBase64: (string) => {
        let text;

        try {
            const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
            if (base64regex.test(string)) {
                text = decodeURIComponent(escape(window.atob(string)));
            } else {
                text = string;
            }
        } catch (err) {
            text = string;
            console.log(err);
        }

        return text;
    },

    encodeStringBase64: (string) => {
        let text;

        try {
            text = window.btoa(unescape(encodeURIComponent(string)));
        } catch (err) {
            text = string;
            console.log(err);
        }

        return text;
    },

    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
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

    highlightText: (text, query) => {
        let lastIndex = 0;
        const words = query.split(/\s+/).filter((word) => (word.length > 0)).map(string => string.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'));

        if (words.length === 0) {
            return text;
        }

        const regexp = new RegExp(words.join('|'), 'gi');
        const tokens = [];

        while (true) {
            const match = regexp.exec(text);
            if (!match) {
                break;
            }
            const length = match[0].length;
            const before = text.slice(lastIndex, regexp.lastIndex - length);
            if (before.length > 0) {
                tokens.push(before);
            }
            lastIndex = regexp.lastIndex;
            tokens.push(`<span class="highlight-text">${match[0]}</span>`);
        }

        const rest = text.slice(lastIndex);

        if (rest.length > 0) {
            tokens.push(rest);
        }

        return tokens.join('')
    },

    confirm: (settings) => {
        $('#confirmModal').remove();
        $('body').append(modalConfirmTemplate(settings || {}));

        const $modal = $('#confirmModal');
        $modal.modal('show');
        $modal.find('.btn-outline-primary').off().click(() => {
            $modal.find('.btn-outline-secondary').click();

            if (settings.onOk) {
                settings.onOk();
            }
        });
    },

    generateId: () => Math.random().toString(36).substr(2, 9),

    getRouter: () => {
        if (!router) {
            router = new Navigo('/');
        }

        return router;
    },

    navigate: (path) => {
        if (!router) {
            router = new Navigo('/');
        }

        return router.navigate(path);
    },

    getFormData: ($form) => {
        const unindexedArray = $form.serializeArray();
        const indexedArray = {};

        $.map(unindexedArray, (n) => {
            indexedArray[n.name] = n.value;
        });

        return indexedArray;
    },

    dragElement: (element, drag=false) => {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (drag) {
            drag.mousedown(dragMouseDown);
        } else {
            element.mousedown(dragMouseDown);
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            newTop = (element.offset().top - pos2) <= 0 || (element.offset().top - pos2 + element.innerHeight()) >= window.innerHeight ? `${element.offset().top}px` : `${element.offset().top - pos2}px`;
            newLeft = (element.offset().left - pos1 + element.innerWidth()) <= window.innerWidth && (element.offset().left - pos1) >= 0 ? `${element.offset().left - pos1}px` : `${element.offset().left}px`;
            element.css({ top: newTop, left: newLeft });
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },
    render: (html, data) => $.templates(convertToJSView(html)).render(data)
}));
