define([
    'features/modal/lagBlaster/modalLBAddMoney',
    'features/modal/lagBlaster/modalLBChangePlan',
    'features/modal/lagBlaster/modalLBRenewPackage'
], (
    lbAddMoneyComp,
    lbChangePlanComp,
    lbRenewPackageComp
) => {
    let lbTabItem;
    let lbTabContent;
    let lbIcons;
    let lbTabContentWraper;
    let lbBottomBar;

    let lbAddMoneyBtn;
    let lbAddMoneyBtnTop;
    let lbChangePlanBtn;
    let lbRenewBtn;

    const removeActiveAll = (type, elements) => {
        if (type === 'lbTabItem') {
            elements.forEach(item => {
                item.classList.remove('active');
            });
        }

        if (type === 'lbTabContent') {
            elements.forEach(item => {
                item.classList.remove('show');
                item.classList.remove('fade');
                item.classList.add('fade');
            });
        }

        if (type === 'lbIcons') {
            elements.forEach(item => {
                if (item.className.includes('active')) {
                    item.className = item.className.substring(0, item.className.length - 7);
                }
            });
        }
    };

    const changingTab = () => {
        lbTabItem.forEach(item => {
            item.addEventListener('click', () => {
                const idContent = item.id.substring(3, item.id.length - 4);
                console.log(idContent);
                const lbContent = document.querySelector(`#lb-${idContent}-content`);
                const lbIcon = document.querySelector(`#lb-${idContent}-icon`);

                removeActiveAll('lbTabItem', lbTabItem);
                removeActiveAll('lbTabContent', lbTabContent);
                removeActiveAll('lbIcons', lbIcons);

                item.classList.add('active');
                lbContent.classList.remove('fade');
                lbContent.classList.add('show');
                lbIcon.className = `${lbIcon.className}-active`;
            });
        });
    };

    const calcHeightOfTabContent = () => {
        const bottomBarHeight = lbBottomBar.offsetHeight;

        if (window.innerWidth <= 768) {
            lbTabContentWraper.style.height = `${window.innerHeight - bottomBarHeight - 40}px`;
        } else {
            lbTabContentWraper.style.height = `${window.innerHeight - bottomBarHeight}px`;
        }
    };

    // Add Money Function 
    const lbAddMoneyFunc = () => {
        lbAddMoneyBtn.addEventListener('click', () => {
            lbAddMoneyComp.onInit();
        });

        lbAddMoneyBtnTop.addEventListener('click', () => {
            lbAddMoneyComp.onInit();
        });
    };

    // Change Plan function
    const lbChangePlanFunc = () => {
        lbChangePlanBtn.addEventListener('click', () => {
            lbChangePlanComp.onInit();
        });
    };

    // Renew Package Function
    const lbRenewPackageFunc = () => {
        lbRenewBtn.addEventListener('click', () => {
            lbRenewPackageComp.onInit();
        });
    };

    // Convert an URL with string query back to an object 
    const covertUrlToObj = (url) => {
        const objParam = {};
        if (url.includes('?')) {
            const arrayURLs = url.split('?');
            const arrayParams = arrayURLs[1].split('&');
            arrayParams.forEach((item) => {
                const keyValueArr = item.split('=');
                const [keyValueArrName, keyValueArrValue] = [...keyValueArr];
                objParam[keyValueArrName] = keyValueArrValue;
            });
        }
        return objParam;
    };

    const getReturnData = async () => {
        let returnedData;
        const url = window.location.href;
        const returnedParamObj = covertUrlToObj(url);

        if (returnedParamObj) {
            if (returnedParamObj.merTrxId) {
                returnedData = returnedParamObj;
            }
        }
        return returnedData;
    };

    // Listen to load event for routing
    const listeningReturnedParams = () => {
        getReturnData().then(result => {
            if (result?.trxId) {
                lbAddMoneyComp.onInit(result);
            }
        });
    };

    return {
        onInit: () => {
            lbTabContentWraper = document.querySelector('#lb-tabContent');
            lbBottomBar = document.querySelector('#lb-tab');

            lbTabItem = document.querySelectorAll('.lb-tab-item');
            lbTabContent = document.querySelectorAll('.lb-content');
            lbIcons = document.querySelectorAll('#lb-tab i');

            lbAddMoneyBtn = document.querySelector('#lb-home-btnList-addMoney');
            lbAddMoneyBtnTop = document.querySelector('.lb-home-content__item__wrap__addMoney');
            lbChangePlanBtn = document.querySelector('#lb-home-btnList-changePlan');
            lbRenewBtn = document.querySelector('#lb-home-btnList-renew');

            calcHeightOfTabContent();
            changingTab();

            lbAddMoneyFunc();
            lbChangePlanFunc();
            lbRenewPackageFunc();

            window.addEventListener('resize', calcHeightOfTabContent);

            listeningReturnedParams();
        }
    };
});
