define(['features/logout/logout'], (logout) => {
    const ob = {};
    let versions;
    let newWorker;
    let refreshing;
    let isUpdate;

    const reloadPage = () => {
        if (refreshing) {
            return;
        }

        refreshing = true;

         // Clear cache
         window.self.caches.keys().then((keys) => {
            keys.map(key => window.self.caches.delete(key));
        });

        // Test logout when update 
        logout.onLogout();

        try {
            window.location.reload(true);
        } catch {
            console.log('something went wrong');
            window.location.reload();
        }
    };

    const refreshCache = () => {
         // Clear cache
         window.self.caches.keys().then((keys) => {
            keys.map(key => window.self.caches.delete(key));
        });

         // Test logout when update 
        logout.onLogout();
        console.log('test 3');

        try {
            newWorker.postMessage({ action: 'skipWaiting' });
        } catch {
            console.log('something went wrong');
            window.location.reload();
        }
    };

    const showUpdateBar = (force) => {
        console.log(force);

        if (isUpdate) {
            return;
        }

        isUpdate = true;

        const popup = `
            <style id="snackbar-style">
                #snackbar {
                    display: none;
                    min-width: 250px;
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    border-radius: 2px;
                    padding: 16px;
                    position: fixed;
                    z-index: 9999999;
                    left: 15px;
                    bottom: 30px;
                    font-size: 14px;
                }
            
                #snackbar.show {
                    display: block;
                }
    
                #reload {
                    color: #3e97f3;
                    cursor: pointer;
                }

                #close-snackbar {
                    position: absolute;
                    top: 3px;
                    right: 3px;
                    background-color: transparent;
                    border: none;
                    color: white;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                }
            </style>
            <div id="snackbar">
                A new version of this app is available. Click <a id="reload">here</a> to update.
                <button id="close-snackbar" type="button" class="btn-close" aria-label="Close">
                    <i class="icon-close"></i>
                </button>
            </div>
        `;
        const $body = $('body');
        $body.append(popup);

        setTimeout(() => {
            const $reloadBtn = $('#reload');
            const $snackbar = $('#snackbar');
            const $snackbarStyle = $('#snackbar-style');
            const $closeSnackbarBtn = $('#close-snackbar');

            $snackbar.addClass('show');

            $closeSnackbarBtn.off('click').click(() => {
                $snackbar.remove();
                $snackbarStyle.remove();
            });
            if (force) {
                $reloadBtn.off('click').click(reloadPage);
            } else {
                $reloadBtn.off('click').click(refreshCache);
            }
        }, 50);
    };

    ob.onInit = () => {
        if ('serviceWorker' in navigator) {
            if (!window.self.caches) {
                return;
            }

            window.self.caches.keys().then((keys) => {
                versions = keys;
            });

            navigator.serviceWorker.register('/sw.js').then((reg) => {
                reg.addEventListener('updatefound', () => {
                    newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        // eslint-disable-next-line default-case
                        switch (newWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    showUpdateBar();
                                }
                                break;
                        }
                    });
                });

                setInterval(() => {
                    if (!(versions || []).length) {
                        window.self.caches.keys().then((keys) => {
                            versions = keys;
                        });

                        return;
                    }

                    window.self.caches.keys().then((keys) => {
                        setTimeout(() => {
                            if (versions.length > 1 && !isUpdate) {
                                showUpdateBar(true);
                                // keys.map(key => window.self.caches.delete(key));
                            }

                            if (versions.length === 1 && keys.length === 1) {
                                if (versions[0] !== keys[0] && !isUpdate) {
                                    showUpdateBar(true);
                                }
                            }
                        }, 4000);
                    });

                    reg.update();
                }, 30000);
            }, (err) => {
                console.log('ServiceWorker registration failed: ', err);
            });

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    window.location.reload();
                    refreshing = true;
                }
            });
        }
    };

    return ob;
});
