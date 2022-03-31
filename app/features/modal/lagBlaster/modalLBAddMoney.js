/* eslint-disable */
// define([
//     'shared/functions',
//     './modalLBMobileTemplate.js',
//     'features/lagblaster/epay',
//     'features/lagblaster/config',
//     'features/lagblaster/epayClient'
// ], (
//     functions,
//     modalLBMobileTemplate,
//     epayPayment,
//     epayConfig,
//     epayClient
// ) => {
//     const {
//         onGetParamEPAY,
//         onConverseDDMMYYY,
//         onSwitchPayType,
//         onSha256
//     } = epayPayment;
//     const { onGetLbConfig } = epayConfig;
//     const { getFormData } = functions;
//     const CONFIG_EPAY = onGetLbConfig();

//     let addMoneyModal;
//     let formEPay;

//     let addMoneyLBForm;
//     let inputAddMoneyLB;
//     let addMoneySubmit;
//     let inputValueCover;
//     let lbQuickFill;
//     let clearInputAmount;
//     let inputNotify;
//     let loading = false;
//     let loadingSpinCircle;
//     const NORMAL_TYPE = 'normal';
//     const NOTIFY_TYPE = 'notify';

//     let notiResultAmount;
//     let notiResultIcon;
//     let notiResultText;
//     let notiResultPaytime;
//     let notiResultTransNum;
//     let notiResultTransDescript;
//     let notiResultPmMethod;
//     let notiResultBackhomeBtn;

//     const TITLE = 'Your Balance in Lagblaster';
//     const MODALNAME = 'addMoneyModal';
//     const CONTENT = `
//     <div class="addMoneyModal-amount">
//         <div class="addMoneyModal-amount__title">BALANCE</div>
//         <div class="addMoneyModal-amount__number">2,000,000 đ</div>
//     </div>
    
//     <form id="lb-addMoneyModal-form">
//         <div class="form-group">
//             <label for="lb-inputAddMoney">Amount:</label>

//             <input inputmode="numeric" pattern="[0-9]*" type="number" class="form-control" id="lb-inputAddMoney" placeholder="Fill in the amount of money (đ)" name="inputAddMoneyAmount" onKeyPress="if(this.value.length >= 8) return false;">

//             <span class="lb-inputValueCover">0đ</span>
//             <span class="lb-clearInputAmount"><i class="icon-close"></i></span>

//             <small id="lb-input-min-amount" class="form-text text-muted">Minimum 10.000đ</small>

//             <div class="lb-inputAddMoney-notify"></div>

//             <div class="lb-inputAddMoney-quickFill d-flex justify-content-around">
//                 <div quickFillAmount="1000000" class="lb__quickFill">1.000.000đ</div>
//                 <div quickFillAmount="2000000" class="lb__quickFill">2.000.000đ</div>
//                 <div quickFillAmount="3000000" class="lb__quickFill">3.000.000đ</div>
//             </div>
//         </div>
    
//         <div id="addMoneyModal-payment-method">
//             <h4>Choose payment method</h4>
            
//             <label class="form-check d-flex justify-content-between" for="epay-ew-momo">    
//                 <div>
//                     <img class="epay-logo" src="/assets/images/momo-logo.png" alt="">
                    
//                     <span class="form-check-label">MOMO</span>
//                 </div>
                
//                 <input class="form-check-input payInput" type="radio" name="gateWay" id="epay-ew-momo" value="EPAY-EW-MOMO" checked>
//             </label>

//             <label class="form-check d-flex justify-content-between" for="epay-ew-zalopay">
//                 <div>
//                     <img class="epay-logo" src="/assets/images/ZaloPay-logo.png" alt="">
                    
//                     <span class="form-check-label">ZaloPay</span>
//                 </div>
                
//                 <input class="form-check-input payInput" type="radio" name="gateWay" id="epay-ew-zalopay" value="EPAY-EW-ZALO">
//             </label>

//             <label class="form-check d-flex justify-content-between" for="epay-dc">
//                 <div>
//                     <img class="epay-logo" src="/assets/images/napas-logo.jpeg" alt="">
                    
//                     <span class="form-check-label">Domestic card ATM</span>
//                 </div>
                
//                 <input class="form-check-input payInput" type="radio" name="gateWay" id="epay-dc" value="EPAY-DC">
//             </label>


//             <label class="form-check d-flex justify-content-between" for="epay-ic">
//                 <div>
//                     <img class="epay-logo" src="/assets/images/ic-logo.png" alt="">
                    
//                     <span class="form-check-label">Visa/ Mastercard/ JBC</span>
//                 </div>
                
//                 <input class="form-check-input payInput" type="radio" name="gateWay" id="epay-ic" value="EPAY-IC">
//             </label>              
//         </div>
//     </form> 

//     <button id="addMoneyModal-submit" disabled>Continue</button>

//     <div class="lb-loading-circle lb-loading-active">
//         <div class="spinner-border" role="status">
//             <span class="sr-only">Loading...</span>
//         </div>
//     </div>

//     <!-- Epay form -->
//     <form id="megapayForm" name="megapayForm" method="post" ></form>
//     <!-- End Epay form -->
//     `;

//     const NOTIFY_RESULT = `
//     <div id="lb-noti-addMoney">
//         <h4 class="text-center">Transaction Result</h4>
//         <div class="lb-noti-addMoney-wrap">
//             <div class="lb-noti-addMoney__balance d-flex justify-content-between">
//                 <span>Your balance</span>
//                 <b>20,100,000đ</b>
//             </div>
//             <div class="lb-noti-addMoney-result">
//                 <div class="lb-noti-addMoney-result__icon">
//                     <i class="icon-transaction"></i>
//                 </div>
//                 <div class="lb-noti-addMoney-result__text text-center"></div>
//                 <div class="lb-noti-addMoney-result__amount text-center"></div>
//                 <div class="lb-noti-addMoney-result__details lb-noti-addMoney-result__paytime d-flex justify-content-between">
//                     <span>Payment time</span>
//                     <b></b>
//                 </div>
//                 <hr>
//                 <div class="lb-noti-addMoney-result__details lb-noti-addMoney-result__transNum d-flex justify-content-between">
//                     <span>Transaction number</span>
//                     <b></b>
//                 </div>
//                 <hr>
//                 <div class="lb-noti-addMoney-result__details lb-noti-addMoney-result__description d-flex justify-content-between">
//                     <span>Service</span>
//                     <b></b>
//                 </div>
//                 <hr>
//                 <div class="lb-noti-addMoney-result__details lb-noti-addMoney-result__pmMethod d-flex justify-content-between">
//                     <span>Payment method</span>
//                     <b></b>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `;

//     // Convert the money in to VND templete
//     const displayAmountVND = (value) => {
//         const actualValue = value;
//         const formatter = new Intl.NumberFormat('vi-VN', {
//             style: 'currency',
//             currency: 'VND'
//         });
//         return formatter.format(actualValue);
//     };

//     const getMapQuickfillAmount = (value) => {
//         let amount;
//         switch (value) {
//             case '1000000':
//                 amount = 1000000;
//                 break;
//             case '2000000':
//                 amount = 2000000;
//                 break;
//             case '3000000':
//                 amount = 3000000;
//                 break;
//             default:
//                 amount = 0;
//         }
//         return amount;
//     };

//     const styleEmptyInput = (value) => {
//         if (value !== '') {
//             addMoneySubmit.disabled = false;
//             clearInputAmount.style.display = 'inline-block';
//         } else {
//             addMoneySubmit.disabled = true;
//             clearInputAmount.style.display = 'none';
//         }
//     };

//     const lbQuickFillFunc = () => {
//         lbQuickFill.forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const attributeAmount = item.getAttribute('quickFillAmount');
//                 const moneyAmmount = getMapQuickfillAmount(attributeAmount);
//                 const selectedAmount = document.querySelectorAll(`[quickFillAmount="${attributeAmount}"]`);

//                 lbQuickFill.forEach(ele => ele.classList.remove('quickFill-active'));
//                 selectedAmount[0].classList.add('quickFill-active');

//                 inputAddMoneyLB.value = 0;
//                 inputAddMoneyLB.value = moneyAmmount;

//                 const displayAmount = displayAmountVND(moneyAmmount);
//                 inputValueCover.style.visibility = 'visible';
//                 inputValueCover.textContent = displayAmount;

//                 styleEmptyInput(moneyAmmount);
//             });
//         });
//     };

//     const clearInputAmountFunc = () => {
//         clearInputAmount.addEventListener('click', () => {
//             inputAddMoneyLB.value = '';
//             inputValueCover.textContent = '';
//             inputValueCover.style.visibility = 'hidden';
//             clearInputAmount.style.display = 'none';
//             addMoneySubmit.disabled = true;
//             lbQuickFill.forEach(ele => ele.classList.remove('quickFill-active'));
//         });
//     };

//     const lbFormInputAmountFunc = () => {
//         lbQuickFillFunc();
//         clearInputAmountFunc();

//         inputAddMoneyLB.addEventListener('keyup', () => {
//             const selectedAmount = document.querySelectorAll(`[quickFillAmount="${inputAddMoneyLB.value}"]`);

//             if (selectedAmount[0]) {
//                 lbQuickFill.forEach(ele => ele.classList.remove('quickFill-active'));
//                 selectedAmount[0].classList.add('quickFill-active');
//             } else {
//                 lbQuickFill.forEach(ele => ele.classList.remove('quickFill-active'));
//             }

//             if (inputAddMoneyLB.value === '') {
//                 inputValueCover.style.visibility = 'visible';
//             }

//             const displayAmount = displayAmountVND(inputAddMoneyLB.value);
//             inputValueCover.textContent = displayAmount;

//             styleEmptyInput(inputAddMoneyLB.value);
//         });

//         inputAddMoneyLB.addEventListener('focus', () => {
//             if (inputAddMoneyLB.value === '') {
//                 inputValueCover.textContent = '0 đ';
//                 inputValueCover.style.visibility = 'visible';
//             }

//             inputValueCover.classList.add('blinking');
//             inputAddMoneyLB.classList.add('lb-inputAddMoney-class');
//         });

//         inputAddMoneyLB.addEventListener('blur', () => {
//             if (inputAddMoneyLB.value === '') {
//                 inputValueCover.style.visibility = 'hidden';
//             }

//             inputValueCover.classList.remove('blinking');
//             inputAddMoneyLB.classList.remove('lb-inputAddMoney-class');
//         });
//     };

//     const formValidation = (value) => {
//         const AMOUNT_MONEY = window.parseInt(value.inputAddMoneyAmount);
//         const NUMBER_TEST = /^\d+$/;

//         if (value.inputAddMoneyAmount === '' || value.gateWay === '') {
//             return false;
//         }

//         if (!NUMBER_TEST.test(value.inputAddMoneyAmount)) {
//             return false;
//         }

//         if (AMOUNT_MONEY < 10000) {
//             inputNotify.textContent = 'The Amout can not be less than 10.000đ';
//             return false;
//         }

//         inputNotify.textContent = '';
//         return true;
//     };

//     const onResetForm = () => {
//         addMoneyLBForm.reset();
//         inputAddMoneyLB.value = '';
//         inputValueCover.textContent = '';
//         inputValueCover.style.visibility = 'hidden';
//         lbQuickFill.forEach(ele => ele.classList.remove('quickFill-active'));
//         styleEmptyInput(inputAddMoneyLB.value);
//     };

//     const onLoadingProcess = (isLoading) => {
//         if (isLoading) {
//             loadingSpinCircle.classList.remove('lb-loading-active');
//         } else {
//             loadingSpinCircle.classList.add('lb-loading-active');
//         }
//     };

//     const addMoneyModalSubmit = () => {
//         addMoneySubmit.addEventListener('click', (e) => {
//             e.preventDefault();
//             const formResult = getFormData($(addMoneyLBForm));
//             if (!formValidation(formResult)) return;

//             loading = true;
//             onLoadingProcess(loading);

//             // console.log(formResult);
//             // console.log(window.parseInt(formResult.inputAddMoneyAmount));

//             onGetParamEPAY(formResult.inputAddMoneyAmount, formResult.gateWay).then(result => {
//                 const paramsArray = Object.keys(result);
//                 // console.log(result);
//                 // formEPay = document.querySelector('#megapayForm');
//                 paramsArray.forEach(item => {
//                     const input = document.createElement('input');
//                     input.name = item;
//                     input.value = result[item];
//                     formEPay.appendChild(input);
//                 });
//             }).then(() => {
//                 // sendUserSelectionsToBackend()
//                 epayClient.openPaymentFunc(1, CONFIG_EPAY.DOMAIN);
//                 loading = false;
//                 onResetForm();
//                 onLoadingProcess(loading);
//             });
//         });
//     };

//     const verifyTransaction = async (returnedParamObj) => {
//         const sha256Response = await onSha256(`${returnedParamObj.resultCd}${returnedParamObj.timeStamp}${returnedParamObj.merTrxId}${returnedParamObj.trxId}${returnedParamObj.merId}${returnedParamObj.amount}${CONFIG_EPAY.ENCODE_KEY}`);

//         if (returnedParamObj.merchantToken === sha256Response) {
//             // console.log('correct, send API to LB backend');
//             return true;
//         }
//         // console.log('Something went wrong');
//         return false;
//     };

//     const backToHomeFunc = () => {
//         notiResultBackhomeBtn.addEventListener('click', () => {
//             const body = document.querySelector('body');
//             body.removeChild(addMoneyModal);
//             formEPay.reset();
//         });
//     };

//     const onGetReturnedResult = (returnedData) => {
//         if (returnedData) {
//             modalLBMobileTemplate.onAddModal('Back to home', 'addMoneyNotifyResult', NOTIFY_RESULT, NOTIFY_TYPE);

//             notiResultAmount = document.querySelector('.lb-noti-addMoney-result__amount');

//             notiResultIcon = document.querySelector('.lb-noti-addMoney-result__icon i');
//             notiResultText = document.querySelector('.lb-noti-addMoney-result__text');
//             notiResultPaytime = document.querySelector('.lb-noti-addMoney-result__paytime b');
//             notiResultTransNum = document.querySelector('.lb-noti-addMoney-result__transNum b');
//             notiResultTransDescript = document.querySelector('.lb-noti-addMoney-result__description b');
//             notiResultPmMethod = document.querySelector('.lb-noti-addMoney-result__pmMethod b');

//             notiResultBackhomeBtn = document.querySelector('#addMoneyNotifyResult__returnBtn');

//             backToHomeFunc();

//             verifyTransaction(returnedData).then(result => {
//                 if (result) {
//                     const timeStampConverted = onConverseDDMMYYY(returnedData.timeStamp);
//                     switch (returnedData.resultCd) {
//                         case '00_000':
//                             // console.log('Transaction success');
//                             notiResultIcon.setAttribute('class', 'icon-transaction-success');
//                             notiResultText.textContent = 'Add money success';
//                             notiResultPaytime.textContent = timeStampConverted;
//                             notiResultTransNum.textContent = returnedData.merTrxId;
//                             notiResultTransDescript.textContent = returnedData.goodsNm.replace(/%20/g, ' ');
//                             notiResultAmount.textContent = displayAmountVND(returnedData.amount);
//                             notiResultPmMethod.textContent = `${onSwitchPayType(returnedData.payType)} ${returnedData.cardNo.substring(returnedData.cardNo.length - 4, returnedData.cardNo.length)}`;

//                             window.history.pushState({}, document.title, window.location.pathname);

//                             break;

//                         case 'FL_900':
//                             notiResultText.textContent = 'Connection error';
//                             notiResultIcon.setAttribute('class', 'icon-transaction-fail');
//                             break;

//                         case 'FL_901':
//                             notiResultText.textContent = 'Socket connection error.';
//                             notiResultIcon.setAttribute('class', 'icon-transaction-fail');
//                             break;

//                         default:
//                             notiResultText.textContent = 'Something went wrong.';
//                             notiResultIcon.setAttribute('class', 'icon-transaction-fail');
//                             break;
//                     }
//                 } else {
//                     // console.log('Transaction NOT verified');
//                     notiResultText.textContent = 'Something went wrong.';
//                     notiResultIcon.setAttribute('class', 'icon-transaction-fail');
//                 }
//             });
//         }
//     };

//     return {
//         onInit: (returnedData) => {
//             modalLBMobileTemplate.onAddModal(TITLE, MODALNAME, CONTENT, NORMAL_TYPE);

//             addMoneyModal = document.querySelector('#addMoneyModal');

//             addMoneySubmit = document.querySelector('#addMoneyModal-submit');
//             addMoneyLBForm = document.querySelector('#lb-addMoneyModal-form');
//             inputAddMoneyLB = document.querySelector('#lb-inputAddMoney');
//             inputValueCover = document.querySelector('.lb-inputValueCover');
//             lbQuickFill = document.querySelectorAll('.lb__quickFill');
//             clearInputAmount = document.querySelector('.lb-clearInputAmount');
//             inputNotify = document.querySelector('.lb-inputAddMoney-notify');
//             loadingSpinCircle = document.querySelector('.lb-loading-circle');

//             formEPay = document.querySelector('#megapayForm');

//             lbFormInputAmountFunc();
//             addMoneyModalSubmit();

//             onGetReturnedResult(returnedData);
//         }
//     };
// });
