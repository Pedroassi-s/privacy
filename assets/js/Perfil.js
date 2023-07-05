
//$(function () {
//    $('.avatar-button').on('click', function () {
//        $(this).toggleClass('is-active');
//        $('.pop-button').toggleClass('is-active');
//    });
//});

function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

function mreais(v) {
    v = v.replace(/\D/g, "") //Remove tudo o que não é dígito
    v = v.replace(/(\d{2})$/, ",$1") //Coloca a virgula
    v = v.replace(/(\d+)(\d{3},\d{2})$/g, "$1.$2") //Coloca o primeiro ponto

    if (v.length >= 5) {
        var maximo = v.replace(/\./g, '').replace(',', '.') > 1000;
        var minimo = v.replace(/\./g, '').replace(',', '.') < 0;

        if (maximo) {
            return '1.000,00';
        } else if (minimo) {
            return '1,00';
        } else {
            return v;
        }
    } else {
        return v;
    }
}

function EnviarMensagem(url) {
    if ($("#publish-button").length > 0 && $("#publish-button").html().toLowerCase().indexOf("seguir") > 0) {
        swal({
            title: "Atenção",
            text: "Você precisa seguir o criador de conteúdo para que consiga enviar uma mensagem.",
            icon: "info"
        })
    }
    else {
        window.location.href = url;
    }
}

function SeguirPerfil(ClienteId) {
    initPageloader();

    var TokenV2 = localStorage.getItem("privacy_v2_token").toString();

    $.ajax({
        url: "/Profile?handler=SeguirPerfil",
        data: { "ClienteId": ClienteId, "CobrancaId": '00000000-0000-0000-0000-000000000000', "Recorrencia": null, "VisitorID": null, "TokenV2": TokenV2 },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            if (data.ok)
                location.reload();
            else {
                $('.pageloader').toggleClass('is-active');
                alert(data.message, function () {
                    if (data.redirectUrl)
                        window.location.href = data.redirectUrl;
                    else
                        window.location.reload();
                });
            }
        },
        error: function (reponse) {
            //alert("error : " + reponse);
        }
    });
}