define([], (
) => {
    let element = '';

    function payment_open(el) {
        console.log(el);
        element = el;
        let payment_box = $('#' + el);
        let payment_bg = payment_box.prev().hasClass('payment_bg');

        if (payment_bg) {
            $('.payment_layer').fadeIn();
        } else {
            payment_box.fadeIn();
        }

        // 화면의 중앙에 레이어를 띄운다.
        if (payment_box.outerHeight() < $(document).height()) payment_box.css('margin-top', '-' + payment_box.outerHeight() / 2 + 'px');
        else payment_box.css('top', '0px');
        if (payment_box.outerWidth() < $(document).width()) payment_box.css('margin-left', '-' + payment_box.outerWidth() / 2 + 'px');
        else payment_box.css('left', '0px');
    }

    function closeLayer() {
        $('.payment_layer').fadeOut();
    }

    function openPayment(sel, domain) {
        let paymentForm;
        let paymentFormJquery;
        if (sel === '1') {
            paymentForm = document.getElementById('megapayForm');
            paymentFormJquery = $('#megapayForm');
            const desc = paymentForm.elements.description;
            if (desc == null || desc.value === '' || desc.value == null) {
                window.alert('description should not be empty or undefined. please check this field in your form');
                return;
            }
            //
        } else {
            paymentForm = document.getElementById('requestForm2');
            paymentFormJquery = $('#requestForm2');
            paymentForm.elements.version.value = 'true';
        }

        const windowType = paymentForm.elements.windowType.value;
        const payType = paymentForm.elements.payType.value;

        const payOption = !!paymentForm.elements.payOption ? paymentForm.elements.payOption.value : '';

        console.log(`windowType = ${windowType}`);
        console.log(`payType = ${payType}`);
        console.log(`payOption = ${payOption}`);

        $('.whb-main-header').css('z-index', '0');
        if (!!paymentForm.elements.payType && paymentForm.elements.payType.value === 'EW' && !!paymentForm.elements['bankCode'] && paymentForm.elements['bankCode'].value === 'MOMO') {
            paymentForm.elements['payType'].value = 'EW1';
        }
        if (!!paymentForm.elements['payType'] && paymentForm.elements['payType'].value === 'EW' && !!paymentForm.elements['bankCode'] && paymentForm.elements['bankCode'].value == 'MOCA') {
            paymentForm.elements['payType'].value = 'EW2';
        }

        if (!!$('#megapayForm_submit').length) {
            if (windowType != null && windowType !== '') {
                console.log('Have windowType');
                if (windowType === '0') {
                    $('#megapayForm').attr('action', `${domain}/pg_was/order/init.do`);
                    init(paymentForm);
                    setTimeout(function () { paymentForm.submit(); }, 100);
                } else if (windowType === '1') {
                    if ((payType === 'NO' && (!paymentForm.elements['payOption'] || paymentForm.elements['payOption'].value !== 'PURCHASE_OTP')) || (payType === 'EW' && (paymentForm.elements['bankCode'] === undefined || paymentForm.elements['bankCode'].value === ''))) {
                        $('#megapayForm').attr('action', `${domain}/pg_was/order/Minit.do`);
                    } else {
                        if (!!paymentForm.elements['payOption'] && paymentForm.elements['payOption'].value === 'PURCHASE_OTP') {
                            paymentForm.elements['payType'].value = 'DC';
                        }
                        $('#megapayForm').attr('action', `${domain}/pg_was/order/init.do`);
                    }

                    setTimeout(function () { paymentForm.submit(); }, 100);
                }
            } else {
                console.log('None windowType');
                window.mobileAndTabletCheck = function () {
                    let check = false;
                    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                    return check;
                };

                paymentFormJquery.append("<input type ='hidden' name='mobileCheck' value=''>");
                paymentForm.elements['mobileCheck'].value = navigator.platform;
                if (navigator.platform) {
                    paymentForm.elements['mobileCheck'].value += ' - ' + mobileAndTabletCheck();

                    const ua = window.navigator.userAgent.toLowerCase();
                    const isiPad = ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;

                    if (!isiPad) {
                        checkIpad = "false";
                    } else {
                        checkIpad = "true";
                        /*if(checkIpad == false) 
                            checkIpad = "false";*/
                    }

                    $('#checkIpad').remove(); // Khi merchant goi sang MGP se xoa the checkIpad di, sau do se duoc them lai nhu ben duoi. tranh truong hop duoi Java nhan dc gia tri --> checkIpad = [false, false, true ...]
                    paymentFormJquery.append("<input id='checkIpad' type ='hidden' name='checkIpad' value=''>");
                    paymentForm.elements['checkIpad'].value = checkIpad;

                    console.log("Ipad:__::::" + isiPad + "   mobileAndTabletCheck::::::::" + mobileAndTabletCheck());
                    if (checkIpad === 'true') {
                        if ((payType === 'NO' && (!paymentForm.elements['payOption'] || paymentForm.elements['payOption'].value !== 'PURCHASE_OTP')) || (payType === 'EW' && (paymentForm.elements['bankCode'] === undefined || paymentForm.elements['bankCode'].value === ''))) {
                            console.log('ipad_Minit.do');
                            $('#megapayForm').attr('action', `${domain}/pg_was/order/Minit.do`);
                        } else {
                            if (!!paymentForm.elements['payOption'] && paymentForm.elements['payOption'].value === 'PURCHASE_OTP') {
                                paymentForm.elements['payType'].value = 'DC';
                            }
                            console.log('ipad_init.do');
                            $('#megapayForm').attr('action', `${domain}/pg_was/order/init.do`);
                        }

                        setTimeout(function () { paymentForm.submit(); }, 100);
                    } else {
                        if (mobileAndTabletCheck()) {
                            if ((payType === 'NO' && (!paymentForm.elements['payOption'] || paymentForm.elements['payOption'].value !== 'PURCHASE_OTP')) || (payType === 'EW' && (paymentForm.elements['bankCode'] === undefined || paymentForm.elements["bankCode"].value === ''))) {
                                $('#megapayForm').attr('action', `${domain}/pg_was/order/Minit.do`);
                            } else {
                                if (!!paymentForm.elements["payOption"] && paymentForm.elements["payOption"].value == 'PURCHASE_OTP') {
                                    paymentForm.elements["payType"].value = "DC";
                                }
                                $('#megapayForm').attr('action', `${domain}/pg_was/order/init.do`);
                            }
                            setTimeout(function () { paymentForm.submit(); }, 100);
                        } else {
                            $('#megapayForm').attr('action', `${domain}/pg_was/order/init.do`);
                            init(paymentForm);
                            setTimeout(function () { paymentForm.submit(); }, 100);
                        }
                    }
                }
            }
        } else {
            $.ajax({
                url: 'https://www.cloudflare.com/cdn-cgi/trace',
                success: function (data) {
                    paymentFormJquery.append("<input type ='hidden' name='ipinfo' value=''>");
                    paymentForm.elements["ipinfo"].value = data.substring(data.indexOf('ip'), data.indexOf('ts')) + '&' + data.substring(data.indexOf('loc'), data.indexOf('tls'));
                },
                complete: function () {
                    if (windowType != null && windowType !== '') {
                        console.log('Have windowType');
                        if (windowType === '0') {
                            $('#megapayForm').attr('action', `${domain}/pg_was/order/init.do`);
                            init(paymentForm);
                            setTimeout(function () { paymentForm.submit(); }, 100);


                        } else if (windowType == "1") {
                            if ((payType == "NO" && (!paymentForm.elements["payOption"] || paymentForm.elements["payOption"].value != 'PURCHASE_OTP')) || (payType == "EW" && (paymentForm.elements["bankCode"] == undefined || paymentForm.elements["bankCode"].value == ''))) {
                                $("#megapayForm").attr("action", domain + "/pg_was/order/Minit.do");
                            } else {
                                if (!!paymentForm.elements["payOption"] && paymentForm.elements["payOption"].value == 'PURCHASE_OTP') {
                                    paymentForm.elements["payType"].value = "DC";
                                }
                                $("#megapayForm").attr("action", domain + "/pg_was/order/init.do");
                            }

                            setTimeout(function () {
                                paymentForm.elements["payType"].value = payType;
                                if (!!paymentForm.elements["payOption"]) {
                                    paymentForm.elements["payOption"].value = payOption;
                                }

                                paymentForm.submit();
                            }, 100);
                        }
                    }
                    else {
                        console.log("None windowType");

                        //		var filter = "win16|win32|win64|mac|macintel";
                        window.mobileAndTabletCheck = function () {
                            let check = false;
                            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                            return check;
                        };


                        paymentFormJquery.append("<input type ='hidden' name='mobileCheck' value=''>");
                        paymentForm.elements["mobileCheck"].value = navigator.platform;
                        if (navigator.platform) {
                            paymentForm.elements["mobileCheck"].value += ' - ' + mobileAndTabletCheck();

                            const ua = window.navigator.userAgent.toLowerCase();
                            const isiPad = ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;
                            //alert("Ipad::"+isiPad);
                            //let checkIpad =  getiPadVersion(window);
                            //alert(checkIpad);

                            if (!isiPad)
                                checkIpad = "false";
                            else
                                checkIpad = "true";
                            /*if(checkIpad == false) 
                                checkIpad = "false";*/
                            $("#checkIpad").remove(); // Khi merchant goi sang MGP se xoa the checkIpad di, sau do se duoc them lai nhu ben duoi. tranh truong hop duoi Java nhan dc gia tri --> checkIpad = [false, false, true ...] 			
                            paymentFormJquery.append("<input id='checkIpad' type ='hidden' name='checkIpad' value=''>");
                            paymentForm.elements["checkIpad"].value = checkIpad;

                            /*if(checkIpad=="true"){
                            	
                            }else{
                            	
                            }*/
                            console.log("Ipad:__::::" + isiPad + "   mobileAndTabletCheck::::::::" + mobileAndTabletCheck());
                            if (checkIpad == "true") {

                                if ((payType == "NO" && (!paymentForm.elements["payOption"] || paymentForm.elements["payOption"].value != 'PURCHASE_OTP')) || (payType == "EW" && (paymentForm.elements["bankCode"] == undefined || paymentForm.elements["bankCode"].value == ''))) {
                                    console.log("ipad_Minit.do");
                                    $("#megapayForm").attr("action", domain + "/pg_was/order/Minit.do");
                                } else {
                                    if (!!paymentForm.elements["payOption"] && paymentForm.elements["payOption"].value == 'PURCHASE_OTP') {
                                        paymentForm.elements["payType"].value = "DC";
                                    }
                                    console.log("ipad_init.do");
                                    $("#megapayForm").attr("action", domain + "/pg_was/order/init.do");
                                }

                                setTimeout(function () { paymentForm.submit(); }, 100);
                            } else {
                                if (mobileAndTabletCheck()) {

                                    if ((payType == "NO" && (!paymentForm.elements["payOption"] || paymentForm.elements["payOption"].value != 'PURCHASE_OTP')) || (payType == "EW" && (paymentForm.elements["bankCode"] == undefined || paymentForm.elements["bankCode"].value == ''))) {
                                        $("#megapayForm").attr("action", domain + "/pg_was/order/Minit.do");
                                    } else {
                                        if (!!paymentForm.elements["payOption"] && paymentForm.elements["payOption"].value == 'PURCHASE_OTP') {
                                            paymentForm.elements["payType"].value = "DC";
                                        }
                                        $("#megapayForm").attr("action", domain + "/pg_was/order/init.do");
                                    }

                                    setTimeout(function () { paymentForm.submit(); }, 100);
                                } else {

                                    $("#megapayForm").attr("action", domain + "/pg_was/order/init.do");
                                    init(paymentForm);
                                    setTimeout(function () { paymentForm.submit(); }, 100);
                                }
                            }

                            /*if(mobileAndTabletCheck()){
                                            	
                                if( payType == "NO" && (!paymentForm.elements["payOption"] || paymentForm.elements["payOption"].value != 'PURCHASE_OTP')) {
                                    $("#megapayForm").attr("action", domain + "/pg_was/order/Minit.do");
                                }else {
                                    if(!!paymentForm.elements["payOption"] && paymentForm.elements["payOption"].value == 'PURCHASE_OTP' ) {
                                        paymentForm.elements["payType"].value = "DC";
                                    }
                                    $("#megapayForm").attr("action", domain + "/pg_was/order/init.do");
                                }
                            	
                                setTimeout(function(){ paymentForm.submit(); }, 100);
                            }else{
                            	
                                $("#megapayForm").attr("action", domain + "/pg_was/order/init.do");
                                init( paymentForm );
                                setTimeout(function(){ paymentForm.submit(); }, 100);
                            }*/
                        }
                    }
                },
                timeout: 3000 // sets timeout to 3 seconds
            });
        }

        return false;
    }

    function init(paymentForm) {
        var div_paymentLayer = document.getElementById('paymentLayer');
        if (div_paymentLayer == null || div_paymentLayer == undefined) {
            var temp = document.createElement('div');

            innerData = '<div id="paymentLayer" class="payment_layer">';
            innerData += '<div class="payment_bg"></div>';
            innerData += '<div id="payment_box" class="payment_pop_layer">';
            innerData += '<div class="payment_pop_container">';
            innerData += '<div class="payment_pop_conts">';
            innerData += '<iframe name="paymentF" id="paymentF" width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="no" style="background-image: url(../images/progress.gif); background-repeat: no-repeat; background-position: center center;" ></iframe>';
            innerData += '</div>';
            innerData += '</div>';
            innerData += '</div>';
            innerData += '</div>';

            temp.innerHTML = innerData;
            paymentForm.appendChild(temp);

        }
        payment_open('payment_box');

        //$("#paymentF").attr('src', $("#megapayForm").attr("action") );
        $("#megapayForm").attr("target", "paymentF");
    }

    function deleteToken() {
        var deleteForm = document.deleteTokenForm;
        if (deleteForm.payToken.value != "" && deleteForm.payToken.value != null
            || deleteForm.merId.value != ""
            && deleteForm.merId.value != null || deleteForm.payType.value != ""
            && deleteForm.payType.value != null) {
            makeMerchantToken('delete');
            $.post("/pg_was/deleteTokenAPI.do", $('#deleteTokenForm').serialize(), function (data) {
                var param = "trxId=&merId=" + data.merId +
                    "&merTrxId=&resultCd=" + data.resultCd +
                    "&resultMsg=" + data.resultMsg +
                    "&invoiceNo=&amount=&userFee=&currency=&goodsNm=" +
                    "&payType=" + data.payType +
                    "&domesticToken=" +
                    "&merchantToken=" + data.merchantToken +
                    "&transDt=&transTm=&buyerFirstNm=&buyerLastNm=&timeStamp=&instmntType=&instmntMon=" +
                    "&vaNumber=&vaName=&bankId=&bankName=&cardNo=&startDt=&issueBankName=&cardType=" +
                    "&endDt=&subappid=&termIs=&userFeeIs=&payOption=&nextAmount=&firstAmount=";
                window.top.location.href = "/pg_was/new/sampleMerchant.do?" + param;
            });

        } else {
            return;
        }
    }

    function inquiryTrans() {
        var inquiryForm = document.inqTransForm;
        if (inquiryForm.trxId.value != "" && inquiryForm.trxId.value != null
            || inquiryForm.merId.value != ""
            && inquiryForm.merId.value != null) {
            inquiryForm.submit();
        } else {
            return;
        }
    }


    window.addEventListener('message', function (e) {
        //console.log('Sample Listener');
        if (e.data.closeLayer == 'close') {
            //window.top.closeLayer();
            closeLayer();
        }
    });


    var gl;
    var iPadVersion = false;

    window.ondevicemotion = function (event) {
        if (!iPadVersion && navigator.platform.indexOf("iPad") != -1) {
            iPadVersion = 1;
            if (event.acceleration) iPadVersion = window.devicePixelRatio;
        }
        window.ondevicemotion = null;
    }

    function initWebGL(canvas) {
        gl = null;

        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch (e) { }

        if (!gl) {
            gl = null;
        }

        return gl;
    }

    function checkMaxAnisotropy() {
        var max = 0;

        var canvas = document.getElementById('webGLCanvasTest');
        gl = initWebGL(canvas);

        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch (e) { }

        if (gl) {
            var ext = (
                gl.getExtension('EXT_texture_filter_anisotropic') ||
                gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
            );

            if (ext) {
                max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            }
        }
        return max;
    }

    function isiPad($window) {
        var ua = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
        return (/iPad/).test(ua);
    }


    function getiPadVersion($window) {
        if (isiPad(window) && window.devicePixelRatio === 2) {
            if (checkMaxAnisotropy() < 4) {
                iPadVersion = 3;
            } else {
                iPadVersion = 4;
            }
        }
        return iPadVersion;
    }


    /* BONUS CODE 
       isSmartDevice() - Detect most mobile devices
       isOldDevice() - Detect older devices that have poor video card performance
    */

    function isSmartDevice($window) {
        var ua = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

    function isOldDevice() {
        if (isSmartDevice(window) && window.devicePixelRatio === 1 && checkMaxAnisotropy() < 4 || isiPad(window) && checkMaxAnisotropy() < 4) {
            return true;
        } else {
            return false;
        }
    }

    return {
        openPaymentFunc: (sel, domain) => openPayment(sel, domain)
    };
});
