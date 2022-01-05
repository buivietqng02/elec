define([], () => {
    let turnBacklBtn;
    let body;
    let touchMovedOnSpot = false;
    let touchStartOnSpot = false;
    const NORMAL_TYPE = 'normal';
    const NOTIFY_TYPE = 'notify';
    let lbTabContentWraper;

    const renderTemplate = (title, content) => `
        <header>
            <button class="returnBtn">
                <i class="icon-chevron-left"></i>
            </button>
            <p class="templateModal__title">${title}</p>
        </header>
        <div class="template-body">
            ${content}
        </div>
    `;

    const notifyTemplate = (title, content) => `
    <div class="notify-template-body">
        ${content}
    </div>
    <div class="notify-template-footer">
        <button class="returnBtn">${title}</button>
    </div>
    `;

    const touchMoveFunc = (e, startX, selectedModal) => {
        const clientX = e.touches[0].clientX;
        // const clientY = e.touches[0].clientY;

        const movedDistance = Math.abs(clientX - startX);

        if (touchStartOnSpot) {
            selectedModal.style.left = `${movedDistance}px`;
        }

        if (clientX >= (window.innerWidth - 150)) {
            touchMovedOnSpot = true;
        } else {
            touchMovedOnSpot = false;
        }
    };

    const touchStartFunc = (e, modalName) => {
        const selectedModal = document.querySelector(`#${modalName}`)
        const startX = e.touches[0].clientX;
        const startY = e.touches[0].clientY;

        if (startX < 60 && startY > 50) {
            e.preventDefault();
            selectedModal.addEventListener('touchmove', (evt) => {
                touchMoveFunc(evt, startX, selectedModal);
            });
            touchStartOnSpot = true;
        } else {
            touchStartOnSpot = false;
        }
    };

    const onResetRemoveComp = (selectedModal) => {
        lbTabContentWraper.classList.remove('no-scroll');
        body.removeChild(selectedModal);
        // selectedModal.removeEventListener('touchstart', touchStartFunc);
        // selectedModal.removeEventListener('touchmove', touchMoveFunc);
        touchMovedOnSpot = false;
        touchStartOnSpot = false;
    };

    const touchEndFunc = (e, modalName) => {
        const selectedModal = document.querySelector(`#${modalName}`)
        if (touchMovedOnSpot && touchStartOnSpot) {
            selectedModal.classList.add('lb-smooth-slide');
            selectedModal.style.left = '100vw';

            setTimeout(() => {
                onResetRemoveComp(selectedModal);
                selectedModal.removeEventListener('touchend', touchEndFunc);
                selectedModal.classList.remove('lb-smooth-slide');
            }, 300);
        } else {
            selectedModal.classList.add('lb-smooth-slide');
            selectedModal.style.left = '0px';

            setTimeout(() => {
                touchMovedOnSpot = false;
                touchStartOnSpot = false;
                selectedModal.removeEventListener('touchmove', touchMoveFunc);
                selectedModal.classList.remove('lb-smooth-slide');
            }, 300);
        }
    };

    const returnBackFunc = (type, selectedModal) => {
        const selectedReturnBtn = document.querySelector(`#${selectedModal.id}__returnBtn`)
        selectedReturnBtn.addEventListener('click', (e) => {
            lbTabContentWraper.classList.remove('no-scroll');
            if (type === NOTIFY_TYPE) {
                selectedModal.classList.remove('sideUpAnimation');
                selectedModal.classList.add('sideDownAnimation');
                setTimeout(() => {
                    body.removeChild(selectedModal);
                }, 600);
            }
            if (type === NORMAL_TYPE) {
                selectedModal.classList.remove('sideLeftAnimation');
                selectedModal.classList.add('sideRightAnimation');
                setTimeout(() => {
                    onResetRemoveComp(selectedModal);
                    // window.removeEventListener('touchend', touchEndFunc);
                }, 600);
            }
        });
    };

    const triggerModal = (title, modalName, content, type) => {
        let templateModal;
        templateModal = document.createElement('div');
        templateModal.id = modalName;
        templateModal.setAttribute('type', type);

        lbTabContentWraper.classList.add('no-scroll');

        if (type === NOTIFY_TYPE) {
            templateModal.classList.add('lbTemplateNotifyModal');
            templateModal.innerHTML = notifyTemplate(title, content);
            templateModal.classList.add('sideUpAnimation');
            templateModal.addEventListener('touchstart', (e) => {
                const startX = e.touches[0].clientX;
                if (startX < 30) {
                    e.preventDefault();
                }
            })
        }
        if (type === NORMAL_TYPE) {
            templateModal.classList.add('lbTemplateMobileModal');
            templateModal.innerHTML = renderTemplate(title, content);
            templateModal.classList.add('sideLeftAnimation');

            templateModal.addEventListener('touchstart', (e) => touchStartFunc(e, modalName));
            templateModal.addEventListener('touchend', (e) => touchEndFunc(e, modalName));
        }

        body.append(templateModal);
    };

    return {
        onAddModal: (title, modalName, content, type) => {
            lbTabContentWraper = document.querySelector('#lb-tabContent');
            body = document.querySelector('body');
            triggerModal(title, modalName, content, type);
            turnBacklBtn = document.querySelector(`#${modalName} .returnBtn`);
            turnBacklBtn.id = `${modalName}__returnBtn`;
            const selectedModal = document.querySelector(`#${modalName}`)
            returnBackFunc(type, selectedModal);
        }
    };
});
