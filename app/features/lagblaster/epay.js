// define([
//     './config'
// ], (
//     EPAY_CONFIG
// ) => {
//     const { onGetLbConfig } = EPAY_CONFIG;
//     const config = onGetLbConfig();
//     const lbUserInfo = {
//         username: 'stevenle',
//         firstName: 'Steven',
//         lastName: 'Le',
//         email: 'steven@iptp.com',
//         phone: '012345678',
//         contract: '0002',
//         address: '123 5ft Evanue',
//         paymentDetails:
//         {
//             package: 'basic',
//             amount: '',
//             gateWay: 'vnpay',
//             bankCode: '',
//             cardType: '',
//             bankTranNo: '',
//             orderInfo: '',
//             payDate: '',
//             placeOrderDate: '',
//             isSucess: false,
//             tranNo: '',
//             orderNumber: '',
//             expirePackageDate: '',
//             duration: '30',
//             deliveryAddress: '',
//             deliveryPhone: '',
//             deliveryName: '',

//             epayResultCd: '',
//             epayInvoiceNo: '',
//             epayCurrency: '',
//             epayPayType: '',
//             epayMerchantToken: '',
//             epayCardNo: ''
//         }
//     };

//     const EPAY_PARAMS = {};

//     // Get current date and time
//     const getCurrentDate = (today) => {
//         const dd = String(today.getDate()).padStart(2, '0');
//         const mm = String((today.getMonth() + 1)).padStart(2, '0');
//         const yyyy = today.getFullYear();
//         const currentDate = `${yyyy}${mm}${dd}`;
//         return currentDate;
//     };

//     const getCurrentTime = (today) => `${((today.getHours() < 10) ? '0' : '')}
// ${today.getHours()}${((today.getMinutes() < 10) ? '0' : '')}
// ${today.getMinutes()}${((today.getSeconds() < 10) ? '0' : '')}${today.getSeconds()}`;

//     const getTimeAndDate = (today) => {
//         const timeAndDate = `${getCurrentDate(today)}${getCurrentTime(today)}`;
//         return timeAndDate;
//     };

//     // Get IP address of the user
//     // const getIPAddress = async () => {
//     //     const response = await window.fetch('https://api.ipify.org?format=json');
//     //     const result = await response.json();
//     //     return result;
//     // };

//     // Crypto the secret key by SHA256
//     // const sha256 = async (message) => {
//     //     // encode as UTF-8
//     //     const msgBuffer = new TextEncoder().encode(message);
//     //     // hash the message
//     //     const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
//     //     // convert ArrayBuffer to Array
//     //     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     //     // convert bytes to hex string                  
//     //     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//     //     return hashHex;
//     // };

//     // convert yyyymmddhhmmss template into separated date & time
//     const getSeparateDate = (date) => {
//         const dateAndTime = {};
//         dateAndTime.year = String(date).substring(0, 4);
//         dateAndTime.month = String(String(date).substring(4, 6) - 1);
//         dateAndTime.day = String(date).substring(6, 8);
//         dateAndTime.hh = String(date).substring(8, 10);
//         dateAndTime.mm = String(date).substring(10, 12);
//         dateAndTime.ss = String(date).substring(12, 14);
//         return dateAndTime;
//     };

//     // Render date & time to hh:mm:ss - dd/mm/yyyy template
//     const converseDDMMYYY = (date) => {
//         const converseDate = getSeparateDate(date);
//         return `${converseDate.hh}:${converseDate.mm}:${converseDate.ss} - 
// ${converseDate.day}/${window.parseInt(converseDate.month) + 1}/${converseDate.year}`;
//     };

//     const switchPayType = (type) => {
//         switch (type) {
//             case 'DC':
//                 return 'Domestic card';
//             case 'IC':
//                 return 'Internation card';
//             case 'EW':
//                 return 'E-wallet';
//             default:
//                 return '';
//         }
//     };

    // const getParamEPAY = async (addAmount, payMethod) => {
    //     lbUserInfo.paymentDetails.amount = addAmount;
    //     lbUserInfo.paymentDetails.gateWay = payMethod;

    //     const today = new Date();
    //     const createDate = getTimeAndDate(today);
    //     const aRamdomNum = Math.floor(Math.random() * 10000);
    //     const timeStamp = createDate;

    //     const merTrxId = `MERTRXID${timeStamp}${aRamdomNum}`;

    //     const invoiceNo = `Order_${timeStamp}_${aRamdomNum}`;
    //     const userFee = 0;
    //     const goodAmount = lbUserInfo.paymentDetails.amount;
    //     const amount = window.parseInt(goodAmount) + userFee;
    //     const payType = lbUserInfo.paymentDetails.gateWay.substring(5, 7);
    //     const buyerEmail = lbUserInfo.email;

    //     const goodsNm = 'Add more money';

    //     const description = `${lbUserInfo.username} add more money - Invoice: ${invoiceNo}`;

    //     const gateWayLengthString = lbUserInfo.paymentDetails.gateWay.length;
    //     const bankCode = lbUserInfo.paymentDetails.gateWay.substring(8, gateWayLengthString);

    //     let windowType;

    //     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry
    // |IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    //         // true for mobile device
    //         windowType = '1';
    //     } else {
    //         // false for not mobile device
    //         windowType = '0';
    //     }

    //     let payOption;
    //     if (payType === 'EW') {
    //         payOption = '';
    //         EPAY_PARAMS.bankCode = bankCode;
    //     }
    //     if (payType === 'DC') {
    //         payOption = '';
    //     }

    //     if (payType === 'IC') {
    //         payOption = '';
    //     }

    //     // EPAY_PARAMS.goodsAmount = goodAmount
    //     EPAY_PARAMS.userFee = userFee;
    //     EPAY_PARAMS.amount = amount;

    //     EPAY_PARAMS.merId = config.MER_ID;
    //     EPAY_PARAMS.currency = 'VND';
    //     EPAY_PARAMS.payType = payType;
    //     EPAY_PARAMS.buyerEmail = buyerEmail;
    //     EPAY_PARAMS.callBackUrl = config.RETURN_URL;
    //     EPAY_PARAMS.notiUrl = config.RETURN_URL;
    //     EPAY_PARAMS.reqDomain = config.RETURN_URL;
    //     EPAY_PARAMS.vat = config.VAT;
    //     EPAY_PARAMS.fee = 0;
    //     EPAY_PARAMS.notax = config.NOTAX;
    //     EPAY_PARAMS.description = description;
    //     EPAY_PARAMS.goodsNm = goodsNm;
    //     EPAY_PARAMS.userLanguage = 'EN';
    //     EPAY_PARAMS.timeStamp = timeStamp;
    //     EPAY_PARAMS.merTrxId = merTrxId;

    //     EPAY_PARAMS.windowType = windowType;
    //     EPAY_PARAMS.vaCondition = '03';
    //     EPAY_PARAMS.invoiceNo = invoiceNo;
    //     EPAY_PARAMS.payOption = payOption;
    //     EPAY_PARAMS.windowColor = '#F3A63B';

    //     EPAY_PARAMS.buyerFirstNm = lbUserInfo.firstName;
    //     EPAY_PARAMS.buyerLastNm = lbUserInfo.lastName;
    //     EPAY_PARAMS.userId = lbUserInfo.username;

    //     const sha256Reponse = 
    // await sha256(`${timeStamp}${merTrxId}${config.MER_ID}${amount}${config.ENCODE_KEY}`);
    //     EPAY_PARAMS.merchantToken = sha256Reponse;

    //     const userIPResponse = await getIPAddress();
    //     EPAY_PARAMS.userIP = userIPResponse.ip;

    //     lbUserInfo.paymentDetails.orderNumber = EPAY_PARAMS.merTrxId;
    //     lbUserInfo.paymentDetails.orderInfo = EPAY_PARAMS.description;
    //     lbUserInfo.paymentDetails.placeOrderDate = EPAY_PARAMS.timeStamp;

    //     return EPAY_PARAMS;
    // };

    // return {
    //     onGetLbUserInfo: () => lbUserInfo,
    //     onGetParamEPAY: (addAmount, payMethod) => getParamEPAY(addAmount, payMethod),
    //     onSha256: (message) => sha256(message),
    //     onConverseDDMMYYY: (date) => converseDDMMYYY(date),
    //     onSwitchPayType: (type) => switchPayType(type)
    // };
// });
