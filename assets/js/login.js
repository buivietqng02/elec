/* eslint-disable */
// ==============================================================================
//
// ==============================================================================
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('sw.js');
}

jQuery(function ($) {

  require('bootstrap/dist/css/bootstrap.min.css');
  require('bootstrap/js/dist/modal');
  const GLOBAL = require('shared/data');
  const languageComp = require('features/language/language');
  const modalChangeLanguageComp = require('features/modal/modalChangeLanguage');
  const $changeLanguageBtn = $('#change-lang-btn');
  languageComp.onInit();
  $changeLanguageBtn.click(modalChangeLanguageComp.onInit);

  // ==============================================================================
  // global 
  // ==============================================================================    
  // const XM_URL = 'https://xm.iptp.net/';    
  const XM_URL = process.env.NODE_ENV === 'production' ? '' : 'https://xm.iptp.dev/';


  var baseUrl = XM_URL + 'xm';
  var API_URL = baseUrl + '/api';

  var sessionId = localStorage.getItem("sessionId");
  var token = localStorage.getItem("token");


  // ==============================================================================
  // ==============================================================================
  // check refirect
  // ==============================================================================
  // ==============================================================================
  function check_redirect_to_main() {

    // redirect
    if (token && sessionId) {

      window.location = "./";

    }


  }
  check_redirect_to_main();

  // ==============================================================================
  // Show and hide form 
  // ==============================================================================        
  let global = $('.js-global');
  let login = $('.js-login');
  let signup = $('.js-signup');
  let forget = $('.js-forget');
  let requestcode = $('.js-requestcode');

  let loginbtn = $('.js-btn-login');
  let signupbtn = $('.js-btn-signup');
  let forgetbtn = $('.js-btn-forget');
  let requestcodebtn = $('.js-btn-requestcode');
  let cancelbtn = $('.js-btn-cancel');

  let captchaImg = $('.js_forgot__form').find('[name="captcha-img"]');

  setTimeout(function () {
    login.find('[name="email"]').val('').focus();
  }, 200);

  // register new account
  signupbtn.on('click', function () {
    global.removeClass('active');
    signup.addClass('active');

    $('.js_register__form')[0].reset();

    $('.js_register__form').find('[name="name"]').focus();


    $('.js_register__form').find('.form__line_code').hide();
    $('.js_register__form').find('[name="code"]').val('');

    $('.mess').html('');


  });

  // forget password
  var captchaId;
  forgetbtn.on('click', function () {
    global.removeClass('active');
    requestcode.addClass('active');

    $('.js_forgot__form')[0].reset();
    $('.js_forgot__form_code')[0].reset();
    $('.js_forgot__form').find('[name="email"]').focus();

    requestCaptcha();
  });

  captchaImg.on('click', function () {
    requestCaptcha();
  });

  // get captcha from server and set it on image source
  requestCaptcha = function () {
    // clean captcha input
    $('.js_forgot__form').find('[name="captcha"]').val('');
    $.ajax({
      "url": API_URL + `/captcha`,
      "method": "GET",
    }).done(function (response) {
      captchaId = response.captchaId;
      captchaImg.attr('src', `data:image/jpeg;base64,` + response.captchaImage);
    });
  }

  // cancel button all for form
  cancelbtn.on('click', function () {
    global.removeClass('active');
    login.addClass('active');

    $('.js_login__form')[0].reset();
    login.find('[name="email"]').val('').focus();

  });

  // ==============================================================================
  // ==============================================================================
  // login
  // ==============================================================================
  // ==============================================================================

  $(document).on('submit', '.js_login__form', function (e) {
    e.preventDefault();

    var $this = $(this);

    var email = $this.find('[name="email"]').val();
    var password = $this.find('[name="password"]').val();


    $.ajax({
      url: API_URL + '/login',
      data: {

        email: email,
        password: password,
        // sessionId: 

      },
      type: "post",

      dataType: "json",

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      beforeSend: function () {

        $this.find('.js-btn-spin').find('.--spin').show();
        $this.find('.js-btn-spin').attr('disabled', true);


        $this.find('.mess').html('');

      },


      statusCode: {


        200: function (response) {
          localStorage.setItem("sessionId", response.data.sessionId);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);

          token = response.data.sessionId;
          sessionId = response.data.token;


          $this.find('.mess').html(response.message);

          check_redirect_to_main();


          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);



        },

        401: function (response) {

          // console.log( response.responseJSON );

          if (response.responseJSON) {

            response = response.responseJSON;

          }



          $this.find('.mess').html(`
                    <lang data-language="INCORRECT_EMAIL_OR_PASSWORD">${GLOBAL.getLangJson().INCORRECT_EMAIL_OR_PASSWORD}</lang>
                  `);

          $this.find('[name="password"]').val('').focus();


          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);


        },

      },

      success: function (response) {

        if (response.status == 0) {

          localStorage.setItem("sessionId", response.data.sessionId);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);

          token = response.data.sessionId;
          sessionId = response.data.token;


          $this.find('.mess').html(response.message);

          check_redirect_to_main();


          //


        } else {

          $this.find('.mess').html(response.message);

          $this.find('[name="password"]').val('').focus();
        }


        $this.find('.js-btn-spin').find('.--spin').hide();
        $this.find('.js-btn-spin').attr('disabled', false);


      },

      error: function (response) {

        // alert('df');

      }


    });


  });


  // ==============================================================================
  // ==============================================================================
  // register
  // ==============================================================================
  // ==============================================================================

  $(document).on('submit', '.js_register__form', function (e) {
    e.preventDefault();

    var $this = $(this);

    var email = $this.find('[name="email"]').val();
    var name = $this.find('[name="name"]').val();
    var password = $this.find('[name="password"]').val();
    var password2 = $this.find('[name="password2"]').val();

    $this.find('.mess').html('');

    // console.log( password );
    // console.log( password2 );


    if (password != password2) {

      $this.find('.mess').html(GLOBAL.getLangJson().CONFIRM_PASSWORD_WRONG);

      return;
    }


    var data = {
      email: email,
      name: name,
      password: password,
      password2: password2

    };




    var check_reg = false;

    if ($this.find('[name="code"]').is(":visible")) {

      var code = $this.find('[name="code"]').val();

      check_reg = true;

      data.code = code;


      data = JSON.stringify(data);
    }


    $.ajax({
      url: !check_reg ? API_URL + '/validateemail' : API_URL + '/register',
      data: data,
      type: "post",

      dataType: "json",
      headers: {
        'Content-Type': !check_reg ? 'application/x-www-form-urlencoded' : 'application/json',
      },

      beforeSend: function () {


        $this.find('.js-btn-spin').find('.--spin').show();
        $this.find('.js-btn-spin').attr('disabled', true);

        $this.find('.mess').html('');

      },

      statusCode: {


        200: function (response) {
          // console.log( response );


          if (!check_reg) {

            $this.find('.mess').html('Please enter code we sent to email ' + email);

            $this.find('.form__line_code').show();
            $this.find('[name="code"]').val('').focus();

          } else {

            // localStorage.setItem("sessionId", response.data.sessionId);
            // localStorage.setItem("token", response.data.token);
            $this.find('.mess').text(response.message);

            setTimeout(function () {

              window.location = "./";

            }, 500);


          }

          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);




        },

        400: function (response) {


          if (response.responseJSON) {

            response = response.responseJSON;

          }



          $this.find('.mess').text(response.details);


          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);


        },



        500: function (response) {


          if (response.responseJSON) {

            response = response.responseJSON;

          }

          if (check_reg) {

            $this.find('.mess').text(response.message);


            $this.find('.js-btn-spin').find('.--spin').hide();
            $this.find('.js-btn-spin').attr('disabled', false);

          }


        },






      },



      success: function (response) {

        if (response.status == 0) {

          if (!check_reg) {

            $this.find('.mess').html('Please enter code we sent to email ' + email);

            $this.find('.form__line_code').show();
            $this.find('[name="code"]').val('').focus();

          } else {

            // localStorage.setItem("sessionId", response.data.sessionId);
            // localStorage.setItem("token", response.data.token);


            // sessionId = response.data.sessionId;
            //  token = response.data.token;

            $this.find('.mess').text(response.message);

            setTimeout(function () {

              window.location = "./";

            }, 500);

          }


        } else {

          $this.find('.mess').html(response.message);

        }


        $this.find('.js-btn-spin').find('.--spin').hide();
        $this.find('.js-btn-spin').attr('disabled', false);




      },

      error: function (response) {

      }


    });


  });




  // ==============================================================================
  // ==============================================================================
  // forgot
  // ==============================================================================
  // ==============================================================================

  $(document).on('submit', '.js_forgot__form', function (e) {
    e.preventDefault();


    var $this = $(this);

    var email = $this.find('[name="email"]').val();
    var captcha = $this.find('[name="captcha"]').val();

    $.ajax({
      url: API_URL + '/requestcode',
      data: {
        email: email,
        captcha: captcha,
        captchaId: captchaId
      },
      type: "post",

      dataType: "json",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      beforeSend: function () {

        $this.find('.js-btn-spin').find('.--spin').show();
        $this.find('.js-btn-spin').attr('disabled', true);

        $this.find('.mess').html('');


      },


      statusCode: {


        200: function (response) {
          $('.reset-password1').removeClass('active');
          $('.reset-password2').addClass('active');


          $('.reset-password2').find('[name="email"]').val(email);
          $('.reset-password2').find('[name="code"]').val('').focus();
          $('.reset-password2').find('[name="password"]').val('');
          $('.reset-password2').find('[name="confirmpassword"]').val('');
          $('.reset-password2').find('.mess').html('');



          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);


        },

        400: function (response) {
          // show error message
          $this.find('.mess').html(response.responseJSON.details);
          // request new captcha
          requestCaptcha();

          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);
        },

        404: function (response) {


          $this.find('.mess').html('Please again !');

          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);

        },

      },



      success: function (response) {


        if (response.status == 0) {


          $('.reset-password1').removeClass('active');
          $('.reset-password2').addClass('active');


          $('.reset-password2').find('[name="email"]').val(email);
          $('.reset-password2').find('[name="code"]').val('').focus();
          $('.reset-password2').find('[name="password"]').val('');
          $('.reset-password2').find('[name="confirmpassword"]').val('');
          $('.reset-password2').find('.mess').html('');


        } else {

          $this.find('.mess').html(response.message);

        }



        $this.find('.js-btn-spin').find('.--spin').hide();
        $this.find('.js-btn-spin').attr('disabled', false);





      },

      error: function (response) {

      }


    });


  });




  $(document).on('submit', '.js_forgot__form_code', function (e) {
    e.preventDefault();




    var $this = $(this);


    $this.find('.mess').html('');


    var email = $this.find('[name="email"]').val();

    var code = $this.find('[name="code"]').val().trim();
    var password = $this.find('[name="password"]').val();
    var password2 = $this.find('[name="confirmpassword"]').val();

    if (password != password2) {

      $this.find('.mess').html(GLOBAL.getLangJson().CONFIRM_PASSWORD_WRONG);

      return;
    }


    $.ajax({
      url: API_URL + '/reset',
      data: {

        email: email,
        code: code,
        password: password,
        // password2: password2,

      },
      type: "post",

      dataType: "json",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      beforeSend: function () {

        $this.find('.js-btn-spin').find('.--spin').show();
        $this.find('.js-btn-spin').attr('disabled', true);

        $this.find('.mess').html('');


      },


      statusCode: {


        200: function (response) {

          $this.find('.mess').html(response.message);

          setTimeout(function () {

            window.location = location.href;

          }, 1000);

          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);



        },



        404: function (response) {

          if (response.responseJSON) {

            response = response.responseJSON;

          }


          $this.find('.mess').html(response.details);

          $this.find('.js-btn-spin').find('.--spin').hide();
          $this.find('.js-btn-spin').attr('disabled', false);


        },





      },



      success: function (response) {


        if (response.status == 0) {


          $this.find('.mess').html(response.message);

          setTimeout(function () {

            window.location = location.href;

          }, 1000);


        } else {

          $this.find('.mess').html(response.details);

        }

        $this.find('.js-btn-spin').find('.--spin').hide();
        $this.find('.js-btn-spin').attr('disabled', false);



      },

      error: function (response) {

      }


    });


  });


  $(document).on('click', '.js-btn-send-code', function (e) {
    e.preventDefault();


    var $where = $('.js_forgot__form_code');

    var email = $where.find('[name="email"]').val();



    $.ajax({
      url: API_URL + '/requestcode',
      data: {

        email: email,

      },
      type: "post",

      dataType: "json",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      beforeSend: function () {

        $where.find('.mess').html('');

      },


      statusCode: {


        200: function (response) {

          $where.find('.mess').html('Send Code success');



        },


      },




      // success: function(response) {


      //    if (response.status == 0) {

      //       $where.find('.mess').html( 'Send Code success' );

      //     }
      //       $where.find('.mess').html( response.message );

      // },

      error: function (response) {

      }


    });



  });

  /*******Check is mobile********/


  const appendLinkDownloadApp = () => {
    if (!(typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1)) {
      const appDownloadContent = `
      <a class="download-app__link"
          href="https://play.google.com/store/apps/details?id=net.iptp.chat&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
          target="_blank" rel="nofollow">
          <img class="download-app__img" src="assets/images/google-play-badge.png"
              alt="Download Cross Messenger for Android">
      </a>
      <a class="download-app__link" href="https://apps.apple.com/us/app/cross-messenger/id1498791933?ls=1"
          target="_blank" rel="nofollow">
          <img class="download-app__img" src="assets/images/appstore-badge2.png"
              alt="Download Cross Messenger for iOS">
      </a>
      <a class="download-app__link apk" href="https://fstor.iptp.net/files/xm.apk" target="_blank" rel="nofollow">
          Download Android APK
      </a>
    `;

      $('.download-app').html(appDownloadContent);
    }

    return ''
  };

  appendLinkDownloadApp();





})
