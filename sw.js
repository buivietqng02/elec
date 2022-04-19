/* eslint-disable */

const version = '#XM_VERSION';
const urls = [
    '/',
    '/index.html',
    '/manifest.json',
    // '/assets/js/socket.io.js',
    // '/assets/js/easyrtc.js',
    // '/assets/js/wheel-zoom.min.js',
    '/source/index.bundle.js',
    '/source/232.bundle.js',
    '/source/styles.bundle.js',
    '/source/styles.css',
    '/assets/css/icon.css',
    '/source/700-scaled.jpg',
    '/assets/images/login-background.png',
    '/source/check.svg',
    '/source/clear.svg',
    '/source/flowers_bw03.png',
    '/assets/images/icon.png',
    '/assets/images/favicon.ico',
    '/source/marble.png',
    '/source/shopping-cart.svg',
    '/assets/fonts/subset-RobotoCondensed-Light.woff2',
    '/assets/fonts/subset-RobotoCondensed-Light.woff'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(version)
            .then(function (cache) {
                cache.addAll(urls);
            }
        )
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            return ![version].includes(key);
        }).map(function (key) {
            return caches.delete(key);
        }));
    }));
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request)
//         .then(function(res) {
//             if (res) {
//                 return res;
//             } else {
//                 return fetch(event.request);
//             }
//         })
//     );
// });

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method != 'GET' ||
        (request.method == 'GET' && (request.url.includes("xm/api/sync") || request.url.includes("xm/oauth2")))) {
        return;
    }

    if (request.url.includes("xm/api")) {
        var finalResponse = fetch(request).then(function (response) {
            return response;
        });
    } else {
        event.respondWith(fromCache(event.request));
        event.waitUntil(update(event.request).then(refresh));
    }
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

function fromCache(request) {
    return caches.open(version)
        .then(cache => cache.match(request, { ignoreSearch: true }))
        .then(response => {
            return response || fetch(request);
        }
    )
}

function update(request) {
    return fetch(request).then(
        response => cacheRequest(request, response).then(() => response)
    ).catch(err => { throw err });
}


function cacheRequest(request, response) {
    if (response.type === "error" || response.type === "opaque" || response.status != 200 || request.method != 'GET') {
        return Promise.resolve();
    }

    return caches
        .open(version)
        .then(cache => cache.put(request, response.clone()));
}

function refresh(response) {
    return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            const message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            client.postMessage(JSON.stringify(message));
        });
    });
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    }
}

// const main = async () => {
//     const permission = await requestNotificationPermission();
// }

// main();
