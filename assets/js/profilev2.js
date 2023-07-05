"use strict";

var imgSrc = '', $uploadCrop, readFile, popupResult;
var coverSrc = '', $coverCrop, popupCoverResult, readCoverFile, cropAlg, daT;
var swalExplicit = { title: $i18nShared.modal.wait, text: $i18nShared.profile.updatePhoto.msgAlert, icon: "warning" };

$(document).ready(function () {

    if ($('#upload-cover').length) {
        
        readCoverFile = function readCoverFile(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $coverCrop.croppie('bind', {
                        url: e.target.result
                    }).then(function () {
                        coverSrc = e.target.result;
                        console.log('jQuery bind complete'); //console.log(e.target.result);
                    });
                };

                reader.readAsDataURL(input.files[0]);
            } else {
                swal("Sorry - you're browser doesn't support the FileReader API");
            }
        };

        popupCoverResult = function popupCoverResult(result) {
            
            var html;

            if (result.html) {
                html = result.html;
                console.log('HTML RESULT', html);
            }

            if (result.src) {
                html = '<img src="' + result.src + '" />';
                console.log(html);
                $('.cover-image').attr('src', result.src);
                $('#submit-cover-picture').removeClass('is-loading');
                $('#upload-crop-cover-modal').removeClass('is-active');
                $('#FotoCapa').val(encodeURIComponent(result.src));
            }

        };

        coverSrc = '';
        $coverCrop = $('#upload-cover').croppie({
            enableExif: true,
            url: '',
            viewport: {
                width: 640,
                height: 184,
                type: 'square'
            },
            boundary: {
                width: '100%',
                height: 300
            },
            enableOrientation: true
        });

        $('#upload-cover-picture').on('change', function () {
            readCoverFile(this);
            $(this).closest('.modal').find('.cover-uploader-box, .upload-demo-wrap-cover, .cover-reset').toggleClass('is-hidden');
            $('#submit-cover-picture').removeClass('is-disabled');
        });

        $('#cover-upload-reset').on('click', function () {
            $(this).addClass('is-hidden');
            $('.cover-uploader-box, .upload-demo-wrap-cover').toggleClass('is-hidden');
            $('#submit-cover-picture').addClass('is-disabled');
            $('#upload-cover-picture').val('');
        });

        $("#rotateLeftCapa").click(function () {
            $coverCrop.croppie('rotate', parseInt($(this).data('deg')));
        });

        $("#rotateRightCapa").click(function () {
            $coverCrop.croppie('rotate', parseInt($(this).data('deg')));
        });

    } //Pofile picture cropper

    if ($('#upload-profile').length) {

        readFile = function readFile(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $uploadCrop.croppie('bind', {
                        url: e.target.result
                    }).then(function () {
                        imgSrc = e.target.result;
                        console.log('jQuery bind complete');
                    });
                };

                reader.readAsDataURL(input.files[0]);
            } else {
                swal("Sorry - you're browser doesn't support the FileReader API");
            }
        };

        popupResult = function popupResult(result) {
            var html;

            if (result.html) {
                html = result.html;
            }

            if (result.src) {
                html = '<img src="' + result.src + '" />';
                $('.cover-bg .avatar .avatar-image').attr('src', result.src);
                $('#submit-profile-picture').removeClass('is-loading');
                $('#upload-crop-profile-modal').removeClass('is-active');

                $('#FotoPerfil').val(encodeURIComponent(result.src));
            }
        };

        imgSrc = '';
        $uploadCrop = $('#upload-profile').croppie({
            enableExif: true,
            url: '/assets/img/logo_redondo.png',
            viewport: {
                width: 260,
                height: 260,
                type: 'circle'
            },
            boundary: {
                width: '100%',
                height: 300
            },
            enableOrientation: true

        });

        $('#upload-profile-picture').on('change', function () {
            readFile(this);
            $(this).closest('.modal').find('.profile-uploader-box, .upload-demo-wrap-profile, .profile-reset').toggleClass('is-hidden');
            $("#rotateLeft").removeClass('is-hidden');
            $("#rotateRight").removeClass('is-hidden');
            $('#submit-profile-picture').removeClass('is-disabled');
        });

        $("#rotateLeft").click(function () {
            $uploadCrop.croppie('rotate', parseInt($(this).data('deg')));
        });

        $("#rotateRight").click(function () {
            $uploadCrop.croppie('rotate', parseInt($(this).data('deg')));
        });

        $('#profile-upload-reset').on('click', function () {
            $(this).addClass('is-hidden');
            $('.profile-uploader-box, .upload-demo-wrap-profile').toggleClass('is-hidden');
            $('#submit-profile-picture').addClass('is-disabled');
            $('#upload-profile-picture').val('');
        });

    } //Nested photos

    if ($('#profile-about.configuracoes').length) {
        //Vertical tabs
        $('.left-menu .menu-item').on('click', function () {
            var targetContent = $(this).attr('data-content');
            $('.left-menu .menu-item').removeClass('is-active');
            $(this).addClass('is-active');
            $('.content-section').removeClass('is-active');
            $('.' + targetContent).addClass('is-active');

            window.history.pushState("", "", '#' + targetContent);
        }); //Mini like button

        if (window.location.hash) {
            $('.menu-item[data-content=' + window.location.hash.replace("#", "") + ']').click();
        }
    }

    $("#ClickImagemPerfil").click(function(){
        swal(swalExplicit).then(function() {
            $("#upload-profile-picture").click();
        });
    });

    $("#ClickImagemCover").click(function(){
        swal(swalExplicit).then(function() {
            $("#upload-cover-picture").click();
        });
    });




});

function send_profile_v1(ev){
    var $this = $(this);
    $this.addClass('is-loading');
    $uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport',
        enableOrientation: true
    }).then(function (resp) {
        popupResult({
            src: resp
        });
    });
}

function send_cover_v1(ev) {
    var $this = $(this);
    $this.addClass('is-loading');
    $coverCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport',
        format: 'jpeg',
        enableOrientation: true
    }).then(function (resp){
        console.log('RESP:', resp);
        popupCoverResult({ src: resp });
    });
}

function send_profile_v7_2(ev){
    daT = new Date();
    $(ev).addClass('is-loading');
    $uploadCrop.croppie('result', {
        type: 'blob',
        size: 'viewport',
        format: 'png'
    }).then(function (resp){
        $.get("https://6h1nper8ef.execute-api.us-east-1.amazonaws.com/upload/post?ext=png&typ=image&_=" + daT.getTime())
            .done(async (dt) => {
                 $.ajax({
                    type: "PUT", processData: false, contentType: false, crossDomain: true, cache: false,
                    headers: { "Content-Type": "multipart/form-data" }, url: dt.url, data: resp,
                    error : (er) => {
                        console.log("Error");
                        console.log(er);
                    },
                    success : () => {

                        cropAlg = "https://image.privacy.com.br/";
                        cropAlg += btoa('{"bucket":"serverlessimagehandlersourceprivacy","key":"'+dt.filename+'"}');

                        $.get("https://6h1nper8ef.execute-api.us-east-1.amazonaws.com/upload/moderate?file="+dt.filename)
                            .always(function(vr1){
                                
                                if(Number(vr1.status) === 200){
                                    $('.cover-bg .avatar .avatar-image').attr('src', cropAlg);
                                    $('#FotoPerfil').val(cropAlg);
                                    $("form#frProfile").submit();
                                }

                                if(Number(vr1.status) === 401){
                                    $('#submit-profile-picture').removeClass('is-loading');
                                    $("#profile-upload-reset").click();
                                    swal(swalExplicit);
                                }

                            });

                    }
                });
            });
    });
}

function send_cover_v7_2(obj) {
    daT = new Date();
    $(obj).addClass('is-loading');
    $coverCrop.croppie('result', {
        type: 'blob',
        size: 'viewport',
        format: 'jpeg'
    }).then(function (resp){
        $.get("https://6h1nper8ef.execute-api.us-east-1.amazonaws.com/upload/post?ext=jpeg&typ=image&_=" + daT.getTime())
            .done(async (dt) => {
                $.ajax({
                    type: "PUT", processData: false, contentType: false, crossDomain: true, cache: false,
                    headers: { "Content-Type": "multipart/form-data" }, url: dt.url, data: resp,
                    error : (er) => {
                        console.log("Error");
                        console.log(er);
                    },
                    success : () => {

                        cropAlg = "https://image.privacy.com.br/";
                        cropAlg += btoa('{"bucket":"serverlessimagehandlersourceprivacy","key":"'+dt.filename+'"}');

                        $.get("https://6h1nper8ef.execute-api.us-east-1.amazonaws.com/upload/moderate?file="+dt.filename)
                            .always(function(vr2){

                                if(Number(vr2.status) === 200){
                                    $('#FotoCapa').val(cropAlg);
                                    $("form#frCover").submit();
                                }

                                if(Number(vr2.status) === 401){
                                    $(obj).removeClass('is-loading');
                                    $("#cover-upload-reset").click();
                                    swal(swalExplicit);
                                }

                            });

                    }
                });
            });
    });
}

