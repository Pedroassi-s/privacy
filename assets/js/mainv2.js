"use strict";

/*! main.js | Friendkit | © Css Ninja. 2019-2020 */

/* ==========================================================================
Main js file
========================================================================== */
var isSharing = false;
$(document).ready(function () {
    "use strict"; //Code highlight init

    initNavbar(); //Mobile menu toggle

    initResponsiveMenu(); //Navbar dropdown

    initNavDropdowns(); //Navbar Cart

    initNavbarCart(); //Common Dropdown

    initDropdowns(); //Sidebars

    initSidebar(); //Tabs

    initTabs(); //Modals

    initModals(); //Subnavbar search

    initSubSearch(); //Attribute background images

    initShareModal(); //Init Plus Menu

    initPlusMenu(); //Init Tipuedrop

    initMask();

    registerEvents();

    RegisterSearch();
});



var toasts = {};
toasts.service = {
    info: function info(title, icon, message, position, t) {
        iziToast.show({
            class: 'toast',
            icon: icon,
            title: title,
            message: message,
            titleColor: '#fff',
            messageColor: '#fff',
            iconColor: "#fff",
            backgroundColor: '#FF754D',
            progressBarColor: '#bc7aff',
            position: position,
            transitionIn: 'fadeInDown',
            close: false,
            timeout: t,
            zindex: 99999
        });
    },
    success: function success(title, icon, message, position, t) {
        iziToast.show({
            class: 'toast',
            icon: icon,
            title: title,
            message: message,
            titleColor: '#fff',
            messageColor: '#fff',
            iconColor: "#fff",
            backgroundColor: '#FF754D',
            progressBarColor: '#fafafa',
            position: position,
            transitionIn: 'fadeInDown',
            close: false,
            timeout: t,
            zindex: 99999
        });
    },
    error: function error(title, icon, message, position, t) {
        iziToast.show({
            class: 'toast',
            icon: icon,
            title: title,
            message: message,
            titleColor: '#fff',
            messageColor: '#fff',
            iconColor: "#fff",
            backgroundColor: '#ff533d',
            progressBarColor: '#fff',
            position: position,
            transitionIn: 'fadeInDown',
            close: false,
            timeout: t,
            zindex: 99999
        });
    }
};

function initMask() {
    $(".cpf").mask("999.999.999-99");
    $(".celular").mask("(99) 99999-9999");
    $('.money').mask("#.##0,00", { reverse: true });
    $(".cep").mask("99999-999");
    $(".tel").mask("(99) 9999-99999");
    $(".soletrasenumeros").mask('Z', { translation: { 'Z': { pattern: /[0-9a-zA-Z]/, recursive: true } } });
    $(".sonumeros").mask('Z', { translation: { 'Z': { pattern: /[0-9]/, recursive: true } } });
    $('.email').mask("A", { translation: { "A": { pattern: /[\w@\-.+]/, recursive: true } } });
    $(".cartaoCredito").mask("9999 9999 9999 9999");
    $(".validadeCartao").mask("99/99");
    $(".porcentagem").mask("##%", { reverse: true });
}

function initEmojis() {
    $("textarea").emojioneArea({
        pickerPosition: "bottom",
        placeholder: "Digite o texto aqui",
        searchPlaceholder: "PESQUISAR",
        buttonTitle: "Use a tecla TAB para inserir emoji mais rápido",
        filters: {
            tones: { title: "Diversos" },
            recent: { title: "Recentes" },
            smileys_people: { title: "Smiles & Pessoas" },
            animals_nature: { title: "Animais & Natureza" },
            food_drink: { title: "Comida & Bebida" },
            activity: { title: "Atividades" },
            travel_places: { title: "Viagens & Lugares" },
            objects: { title: "Objetos" },
            symbols: { title: "Simbolos" },
            flags: { title: "Bandeiras" }
        }
    });

}

function AlertaErro(titulo, mensagem, elemento, reseta = true, elementoMensagem = $("#mensagem")) {
    swal({
        title: titulo,
        text: mensagem,
        icon: "warning"
    }).then(function () {
        if (elemento == "undefined")
            return;

        $(elemento).focus();
        $(elemento).parent(".control").parent(".field-group").addClass("is-danger");

        if (reseta)
            $(elemento).val('');
    });

    $(elementoMensagem).val(titulo);
}

function ConsultaCep(cep, retMethod, elemento) {
    var cepValido = true;
    ConsultaCepSimples(cep, function (data) {
        if (data != null) {
            if (data.logradouro != "") {
                $("#Endereco").val(data.logradouro);
                $("#Bairro").val(data.bairro);
                $("#Cidade").val(data.localidade);
                $("#IdEstado").val($("#IdEstado option:contains('(" + data.uf + ")')").val());
                $(elemento).parent(".control").parent(".field-group").removeClass("is-danger");
            }
            retMethod();
        }
        else {
            AlertaErro("CEP Inválido", "Por favor, digite um CEP válido", elemento);
            cepValido = false;
        }
    });

    return cepValido;
}

function ConsultaCepSimples(cep, retMethod) {
    var cepValido = true;

    $.ajax({
        url: "https://viacep.com.br/ws/" + cep.replace("-", "") + "/json/",
        async: true,
        type: "GET",
        success: function (data) {
            if (!data.erro) {
                retMethod(data);
            }
            else {
                retMethod(null);
            }
        },
        error: function (data) {
            retMethod(null);
        }
    });

    return cepValido;
}

function FindAddress(cep, retMethod) {
    $.ajax({
        url: "https://viacep.com.br/ws/" + cep.replace("-", "") + "/json/",
        async: true,
        type: "GET",
        success: function (data) {
            if (!data.erro) {
                if (data.logradouro != "") {
                    retMethod(data);
                }
            }
            else {
                retMethod(null);
            }
        },
        error: function (data) {
            retMethod(null);
        }
    });
}

function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
}

function TestaCPF(strCPF) {
    if (strCPF === "")
        return false;

    strCPF = strCPF.replace(/[^0-9]/gi, '');
    var Soma;
    var Resto;
    var i;
    Soma = 0;
    if (strCPF === "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

function parseDate(s) {
    var b = s.split(/\D/);
    return new Date(b[0], --b[1], b[2]);
}

function retornaIdade(nascimento) {
    return Math.floor(Math.ceil(Math.abs(parseDate(nascimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) / 365.25)
}

function ClickFavoritar() {
     
    $(".click-favoritar").unbind("click");

    $(".click-favoritar").click(function () {

        var dataValue = ($(this).attr("data-value") == "0") ? "1" : "0";
        var srcImg = (dataValue == "0") ? "/assets/img/icons/feed/Vectormark.svg" : "/assets/img/icons/feed/Vectormarkbg.svg";
        var postId = $(this).attr("data-id");
        var iconLoader = $("#loaderItem" + postId);

        var imgMenu = $("#imgMenuFavorit" + postId);
        var imgPost = $("#imgFavorit" + postId);
         
        var textMenuFavorit = $("#textFavorit" + postId);
        var textFavorit = (dataValue == "0") ? $i18nShared.post.addToFavorites : $i18nShared.post.removeFromFavorites;
        var srcMenuImg = (dataValue == "0") ? "/assets/img/icons/feed/Vectoraddfavorit.svg" : "/assets/img/icons/feed/Vectorremovefavorit.svg";


        imgPost.slideUp(400).fadeOut();
        iconLoader.delay(300).fadeIn();

        $.ajax({
            url: "/Index?handler=Favoritar",
            data: { PostId: postId, Valor: dataValue },
            cache: false,
            async: true,
            type: "GET",
            success: function (data) {
                if (data.OK) {
                    imgPost.attr("src", srcImg);
                    imgMenu.attr("src", srcMenuImg);
                    textMenuFavorit.html(textFavorit);
                    $("#favorit" + postId).attr("data-value", dataValue);
                    $("#favoritMenu" + postId).attr("data-value", dataValue);
                    iconLoader.fadeOut(200);
                    imgPost.delay(400).fadeIn();
                    return true;
                }
                iconLoader.delay(400).fadeOut();
                imgPost.delay(400).fadeIn();
                return false;
            },
            error: function (reponse) {
                iconLoader.delay(400).fadeOut();
                imgPost.delay(400).fadeIn();
            }
        });
    });
}
 
var registerEvents = function () {

    ClickFavoritar();

    $('span #clear-search').on('click', function () {
        $(this).siblings('input').val('');
    });

    $(".cpf").change(function () {
        if (!TestaCPF($(this).val())) {
            $(this).val("");
            AlertaErro("CPF Inválido", "Por favor, digite o CPF corretamente", this);
            $(this).parent(".control").parent(".field-group").removeClass("is-danger");
        }
    });

    $(".email").change(function () {
        if (!isEmail($(this).val())) {
            $(this).val("");
            AlertaErro("E-MAIL Inválido", "Por favor, digite um e-mail válido", this);
            $(this).parent(".control").parent(".field-group").removeClass("is-danger");
        }
    });

    $("#frmLogin").submit(function (e) {
        e.preventDefault();
        initPageloader();

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
                if (data.ok) {
                    window.location.href = data.url;
                }
                else {
                    initPageloader();
                    AlertaErro("Atenção", data.message);
                }
            }
        });
    });


    $(".shareProfile").click(function (event) {
        event.stopPropagation();
        if (isSharing) {
            return;
        }
        isSharing = true;
        if (navigator.share) {
            navigator.share({
                title: $(this).data("titulo"),
                url: $(this).data("url"),
                text: $(this).data("descricao")
            }).finally(() => {
                isSharing = false;
            });;
        }
    });
}




function AjustaImagens(element) {
    for (var i = 0; i < element.find('.videopostagem').length; i++) {

        var heightDiv = element.height();
        var heightImage = element.find('.videopostagem').eq(i).find("img").last().height();

        if (heightDiv > heightImage) {
            element.find('.videopostagem').eq(i).find("img").last().css("height", "100%");
            element.find('.videopostagem').eq(i).find("img").last().css("width", "auto");

            var widthDiv = element.find('.videopostagem').eq(i).width();
            var widthImage = element.find('.videopostagem').eq(i).find("img").last().width();

            element.find('.videopostagem').eq(i).animate({
                scrollLeft: (widthImage - widthDiv) / 2
            }, 1);
        }
    }
}


function alert(msg, callback) {
    swal({
        title: $i18nShared.notice,
        text: msg,
        icon: "info",
        buttons: {
            confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "",
                closeModal: true
            }
        }
    }).then(callback);
}

function CopyText(url, msgAlert = '') {

    let textarea = null;
    let result;

    try {
        textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', 'true');

        textarea.setAttribute('contenteditable', 'true');
        textarea.style.position = 'fixed'; // prevent scroll  from jumping to the bottom when focus is set.
        textarea.value = url;

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const range = document.createRange();
        range.selectNodeContents(textarea);

        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);

        textarea.setSelectionRange(0, textarea.value.length);
        result = document.execCommand('copy');
        document.body.removeChild(textarea);
    } catch (err) {         
        result = null;
    }

    // manual copy fallback using prompt
    if (!result) {
        console.log('userAgent', navigator.userAgent);
        const isMac = navigator.platform.toUpperCase().indexOf('Mac') >= 0;
        const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
        result = prompt(`Press ${copyHotkey}`, url); // eslint-disable-line no-alert
        return false;
    }

    if (msgAlert != '')
        alert(msgAlert);
} 
 



function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function topSearchField() {
    window.location.href = "/v2/search/user/all?term=" + $("#termSearchHeader").val();
}

function RegisterSearch() {
    $("#termSearchHeader").on("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            topSearchField();
        }
    });
}

