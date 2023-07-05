var validateMonth, validateYearJuno, validateYearWire;
var emailValido = false;
var elementCheckout, elementCreditCard;

$(document).ready(function () {

    $("#CardCpf").mask("000.000.000-00");
    $("#CPF").mask("000.000.000-00");

    if ($("#mensagem").lenght > 0 && $("#mensagem").html() != "") {
        if ($("#mensagem").html().indexOf("CPF") != -1 && $("#mensagem").html().toString().indexOf("cartão") != -1) {
            AlertaErro($i18nShared.payment.checkout.validation.cpfHolderIncorrect, $("#mensagem").html(), $("#CardCpf"), false);
        }
        else if ($("#mensagem").html().indexOf("CPF") != -1) {
            AlertaErro($i18nShared.payment.checkout.validation.cpfIncorrect, $("#mensagem").html(), $("#CPF"), false);
        }
        else if ($("#mensagem").html().indexOf("já está sendo utilizado.") != -1) {
            AlertaErro($i18nShared.payment.checkout.validation.emailUsedTitle, $i18nShared.payment.checkout.validation.emailUsedText, $("#Email"), false);
        }
        else {
            AlertaErro($("#mensagem").val(), $i18nShared.payment.checkout.validation.fillCardDetails, $("#CardHolderName"));
        }

        $("#saveCard").removeClass('is-loading');
        $(".saveCheckout").removeClass('is-loading');
    }

    $(".close-inserir-cartao").click(function () {
        LimparCamposCartao();
        $("#insert-card-modal").removeClass("is-active");
    });

    $("#Email").change(function () {
        emailValido = false;
        ValidaEmail();
    });

    $("#CardExpiration").change(function () {
        ValidaValidadeCartao();
    });

    $("#CardCpf").change(function () {
        ValidaCpf(this, $i18nShared.payment.checkout.validation.cpfHolderRequired);
    });

    $("#CPF").change(function () {
        ValidaCpf(this, $i18nShared.payment.checkout.validation.cpfRequired);
    });

    $("#CardHolderName").change(function () {
        ValidaNomeCompleto(this, $i18nShared.payment.checkout.validation.nameHolderTitle, $i18nShared.payment.checkout.validation.nameHolderText);
    });

    $("#SenhaCadastro").change(function () {
        let count = 0;

        if ($(this).val().length >= 8)
            count += 1;

        if ($(this).val().match(/[A-Z]/g))
            count += 1;

        if ($(this).val().match(/[a-z]/g))
            count += 1;

        if ($(this).val().match(/[0-9]/g))
            count += 1;

        if ($(this).val().match(/[\`|\~\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\<|\,|\.|\>|\?|\;|\:|\-|\""|\']/g))
            count += 1;

        if (count < 5)
            AlertaErro($i18nShared.payment.checkout.validation.passwordTitle, $i18nShared.payment.checkout.validation.passwordText, $("#SenhaCadastro"));
    });

    $("#NomeVerdadeiro").change(function () {
        ValidaNomeCompleto(this, $i18nShared.payment.checkout.validation.fullNameTitle, $i18nShared.payment.checkout.validation.fullNameText);
    });

    $("#CardCpf, #CardHolderName").change(function () {
        if ($("#CardHolderName").length > 0 && $("#CardHolderName").val() != "" && $("#CardCpf").length > 0 && $("#CardCpf").val() != "")
            ValidarCpfNome($("#CardHolderName"), $("#CardCpf"), false);
    });

    $("#CPF, #NomeVerdadeiro").change(function () {
        if ($("#NomeVerdadeiro").length > 0 && $("#NomeVerdadeiro").val() != "" && $("#CPF").length > 0 && $("#CPF").val() != "")
            ValidarCpfNome($("#NomeVerdadeiro"), $("#CPF"), true);
    });

    $("#Cep").change(function () {
        ConsultaCepSimples($(this).val(), function (data) {
            if (data !== null) {
                $("#Rua").val(data.logradouro);
                $("#Bairro").val(data.bairro);
                $("#Cidade").val(data.localidade);
                $("#Estado").val(data.uf);
            }
            else {
                $(".restanteEndereco").show();
            }
        });
    });


    // Abrir o modal ao clicar no botão
    $("#saveCard").click(function () {
        elementCreditCard = $(this);
        $("#PagSmileCard").submit();
    });

    $(".btn-back-top").click(function () {
        $("#beneficios_assinatura").hide();
        $(".btn-back-top").hide();
        $("#preencheDados").slideUp();
        $(".profile-description").show();
        $(".profile-img-checkout").show();
        $(".profile-signatures").show();
        $(".profile-sale-value").show();
        $("#btnMensal").focus();
    });

    $(".saveCheckout").click(function () {
        elementCheckout = $(this);
        if (elementCheckout) {
            $("#Recorrencia").val(elementCheckout.data("recorrencia"));
            $(".btnCheckoutRecorrencia").attr("data-recorrencia", elementCheckout.data("recorrencia"));
            $(".btnCheckoutRecorrencia").attr("data-valor", elementCheckout.data("valor"));
            $("#valorinscricaoselecionadopix").html(elementCheckout.data("valor"));
            $("#valorinscricaoselecionadocartao").html(elementCheckout.data("valor"));
        }

        if (!$('#Nome').is(":visible")) {
            $(".btn-back-top").show();
            $("#preencheDados").slideDown();
            $(".profile-description").hide();
            $("#beneficios_assinatura").show();
            $(".profile-img-checkout").hide();
            $(".profile-signatures").hide();
            $(".profile-sale-value").hide();
            $("#Nome").focus();
        }
        else {
            $("#PagSmile").submit();
        }
    });

    if ($("#mensagem").lenght > 0 && $("#mensagem").html() != "") {
        swal({
            title: $i18nShared.modal.notice,
            text: $("#mensagem").html(),
            icon: "info"
        });
    }

    $("#PagSmile").submit(function (e) {
        e.preventDefault();
        SubmitPagsmile();
    });

    $("#PagSmileCard").submit(function (e) {
        e.preventDefault();
        SubmitPagsmileCard();
    });
});

async function SubmitPagsmile() {
    $(".saveCheckout").addClass('is-loading');

    var validacaoCheckout = await ValidacoesCheckout();

    if (!validacaoCheckout) {
        $(".saveCheckout").removeClass('is-loading');
        return;
    }

    if (!$("#aceiteTermos")[0].checked) {

        $("#aceiteTermos").find(".wave").removeClass("is-hidden");
        $(".saveCheckout").removeClass('is-loading');

        AlertaErro($i18nShared.checkout.acceptTerms.Title, $i18nShared.checkout.acceptTerms.Text, $("#aceiteTermos")[0]);

        return;
    }

    if ($("#AceiteDesconto").is(":visible") && !$("#aceiteDesconto")[0].checked) {
        $("#aceiteDesconto").find(".wave").removeClass("is-hidden");
        $(".saveCheckout").removeClass('is-loading');

        AlertaErro($i18nShared.checkout.acceptDiscount.Title, $i18nShared.checkout.acceptDiscount.Text, $("#aceiteDesconto")[0]);

        return;
    }
    if ($("#CardHolderName").is(":visible")) {
        var validDueDate = await ValidaValidadeCartao();

        return new Promise(resolve => {
            if (validDueDate) {
                $("#pagsmileCard").val($("#CardNumber").val());
                $("#pagsmileCVV").val($("#CardCvv").val());
                $("#pagsmileYear").val(validateYearJuno);
                $("#pagsmileMonth").val(validateMonth);
                $("#pagsmileName").val($("#CardHolderName").val());
                $("#pagsmileDoc").val($("#CardCpf").val());

                Pagsmile.createToken($(this), function (res) {
                    SaveCheckout();
                });
            }
            resolve();
        });
    }
    else {
        SaveCheckout();
    }
}

async function SaveCheckout() {


    if (elementCheckout.data("valor") !== undefined)
        var valor = elementCheckout.data("valor").replace(',', '.') * 1;

    if ($(".ehPix").is(":visible"))
        $("#FormaPagamento").val("3");
    else if ($(".ehBoleto").is(":visible")) {
        if (valor >= 19)
            $("#FormaPagamento").val("2");
        else {
            alert($i18nShared.payment.checkout.validation.amountMin);
            $(".saveCheckout").removeClass('is-loading');
            return;
        }
    }
    else
        $("#FormaPagamento").val("1");

    if ($("#CardHolderName").is(":visible")) {
        var cardData = {
            cardNumber: $("#CardNumber").val().replace(/( )+/g, ''),
            holderName: $("#CardHolderName").val(),
            securityCode: $("#CardCvv").val(),
            expirationMonth: validateMonth,
            expirationYear: validateYearJuno
        };

        checkout.getCardHash(cardData, function (hashCard) {
            /* Sucesso - A variável cardHash conterá o hash do cartão de crédito */
            $("#NomeCartao").val($("#CardHolderName").val());
            $("#HashCardJuno").val(hashCard);
            $("#CpfCartao").val($("#CardCpf").val());
            $("#Ultimos4DigitosCartao").val($("#CardNumber").val().replace(/( )+/g, '').substring(12));
            $("#Primeiros6DigitosCartao").val($("#CardNumber").val().replace(/( )+/g, '').substring(0, 6));
            $("#MesCartao").val(validateMonth);
            $("#AnoCartao").val(validateYearWire);

            cardData.document = $("#CpfCartao").val();

            var encrypt = new JSEncrypt();

            encrypt.setPrivateKey(creditCardPubKey);

            $("#HashData").val(encrypt.encrypt(JSON.stringify({
                name: cardData.holderName,
                document: cardData.document,
                cardNumber: cardData.cardNumber,
                expireDate: validateMonth + '/' + validateYearJuno,
                securityCode: cardData.securityCode
            })));

            MoipSdkJs.MoipCreditCard
                .setPubKey($("#CardCpf").val() != "" ? pubKeyBr : pubKeyOutro)
                .setCreditCard({
                    number: $("#CardNumber").val().replace(/( )+/g, ''),
                    cvc: $("#CardCvv").val(),
                    expirationMonth: validateMonth,
                    expirationYear: validateYearWire
                })
                .hash()
                .then(function (hash) {
                    $("#HashCardWire").val(hash);
                    $("#formCheckout").submit();
                    return;
                });
        }, function (error) {
            elementCheckout.removeClass('is-loading');
            switch (error.message) {
                case 'Invalid card number':
                    AlertaErro($i18nShared.payment.cardError.numberTitle, $i18nShared.payment.cardError.numberText, $("#CardNumber"));
                    break;
                case 'Invalid expire date':
                    AlertaErro($i18nShared.payment.cardError.expireTitle, $i18nShared.payment.cardError.expireText, $("#CardExpiration"));
                    break;
                case 'Invalid security code':
                    AlertaErro($i18nShared.payment.cardError.cvvTitle, $i18nShared.payment.cardError.cvvText, $("#CardCvv"));
                    break;
                default:
                    $("#NomeCartao").val($("#CardHolderName").val());
                    $("#HashCardJuno").val(hashCard);
                    $("#CpfCartao").val($("#CardCpf").val());
                    $("#Ultimos4DigitosCartao").val($("#CardNumber").val().replace(/( )+/g, '').substring(12));
                    $("#Primeiros6DigitosCartao").val($("#CardNumber").val().replace(/( )+/g, '').substring(0, 6));
                    $("#MesCartao").val(validateMonth);
                    $("#AnoCartao").val(validateYearWire);

                    cardData.document = $("#CpfCartao").val();

                    var encrypt = new JSEncrypt();
                    encrypt.setPrivateKey(creditCardPubKey);
                    $("#HashData").val(encrypt.encrypt(JSON.stringify(cardData)));

                    MoipSdkJs.MoipCreditCard
                        .setPubKey($("#CardCpf").val() != "" ? pubKeyBr : pubKeyOutro)
                        .setCreditCard({
                            number: $("#CardNumber").val().replace(/( )+/g, ''),
                            cvc: $("#CardCvv").val(),
                            expirationMonth: validateMonth,
                            expirationYear: validateYearWire
                        })
                        .hash()
                        .then(function (hash) {
                            $("#HashCardWire").val(hash);
                            $("#formCheckout").submit();
                            return;
                        });
                    break;
            }
            return;
        });
    }
    else {
        $("#NomeCartao").val("");
        $("#HashCard").val("");
        $("#CpfCartao").val("");
        $("#formCheckout").submit();
        return;
    }
}

async function SubmitPagsmileCard() {
    var validacoesCartao = await ValidacoesCartao();
    elementCreditCard.addClass('is-loading');

    var validDueDate = await ValidaValidadeCartao();

    return new Promise(resolve => {
        if (!validacoesCartao) {
            elementCreditCard.removeClass('is-loading');
            resolve();
            return;
        }

        if (validDueDate) {
            $("#pagsmileCard").val($("#CardNumber").val());
            $("#pagsmileCVV").val($("#CardCvv").val());
            $("#pagsmileYear").val(validateYearJuno);
            $("#pagsmileMonth").val(validateMonth);
            $("#pagsmileName").val($("#CardHolderName").val());
            $("#pagsmileDoc").val($("#CardCpf").val());

            Pagsmile.createToken($(this), function (res) {
                SaveCreditCard(); // Verificar possíveis problemas ao fazer esta alteração
            });
        }
        resolve();
        return;
    });
}

/*$("#PagSmile").submit(); */


async function SaveCreditCard() {
    return new Promise(resolve => {
        var cardData = {
            cardNumber: $("#CardNumber").val().replace(/( )+/g, ''),
            holderName: $("#CardHolderName").val(),
            securityCode: $("#CardCvv").val(),
            expirationMonth: validateMonth,
            expirationYear: validateYearJuno
        };

        checkout.getCardHash(cardData, function (hashCard) {
            /* Sucesso - A variável cardHash conterá o hash do cartão de crédito */
            $("#NomeCartao").val($("#CardHolderName").val());
            $("#HashCardJuno").val(hashCard);
            $("#CpfCartao").val($("#CardCpf").val());
            $("#Ultimos4DigitosCartao").val($("#CardNumber").val().replace(/( )+/g, '').substring(12));
            $("#Primeiros6DigitosCartao").val($("#CardNumber").val().replace(/( )+/g, '').substring(0, 6));
            $("#MesCartao").val(validateMonth);
            $("#AnoCartao").val(validateYearWire);
            //$("#TelefoneCartao").val($("#Telefone").val());
            //$("#DataNascimentoCartao").val($("#DataNascimento").val());

            cardData.document = $("#CpfCartao").val();
            var encrypt = new JSEncrypt();
            encrypt.setPrivateKey(creditCardPubKey);

            $("#HashData").val(encrypt.encrypt(JSON.stringify({
                name: cardData.holderName,
                document: cardData.document,
                cardNumber: cardData.cardNumber,
                expireDate: validateMonth + '/' + validateYearWire,
                securityCode: cardData.securityCode
            })));


            MoipSdkJs.MoipCreditCard
                .setPubKey($("#CardCpf").val() != "" ? pubKeyBr : pubKeyOutro)
                .setCreditCard({
                    number: $("#CardNumber").val().replace(/( )+/g, ''),
                    cvc: $("#CardCvv").val(),
                    expirationMonth: validateMonth,
                    expirationYear: validateYearWire
                })
                .hash()
                .then(function (hash) {
                    $("#HashCardWire").val(hash);

                    var form = $("#formCard");
                    var url = form.attr('action'); // Verificar possivel problema na url

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: form.serialize(), // serializes the form's elements.
                        success: function (data) {
                            $("#insert-card-modal").removeClass("is-active");

                            if (data.ok) {
                                alert(data.message);
                                LimparCamposCartao();
                                //Atualizar Grid Cartões
                                CarregarCartoes();
                                $("#saveCard").removeClass('is-loading');
                            }
                            else {
                                AlertaErro($i18nShared.modal.warning, data.message, $("#CardNumber"));
                            }
                        }
                    });

                });
        }, function (error) {
            elementThis.removeClass('is-loading');
            switch (error.message) {
                case 'Invalid card number':
                    AlertaErro($i18nShared.payment.cardError.numberTitle, $i18nShared.payment.cardError.numberText, $("#CardNumber"));
                    break;
                case 'Invalid expire date':
                    AlertaErro($i18nShared.payment.cardError.expireTitle, $i18nShared.payment.cardError.numberText, $("#CardExpiration"));
                    break;
                case 'Invalid security code':
                    AlertaErro($i18nShared.payment.cardError.cvvTitle, $i18nShared.payment.cardError.cvvText, $("#CardCvv"));
                    break;
                default:
                    AlertaErro($i18nShared.payment.cardError.generic, error.message, $("#CardHolderName"));
                    break;
            }
        });
    });
}

async function LimparCamposCartao() {
    return new Promise(resolve => {
        $("#NomeCartao").val("");
        $("#HashCard").val("");
        $("#CpfCartao").val("");
        $("#CardCpf").val("");
        $("#CardNumber").val("");
        $("#CardHolderName").val("");
        $("#CardExpiration").val("");
        $("#CardCvv").val("");
        resolve();
    });
}

async function ValidaValidadeCartao() {
    return new Promise(resolve => {
        var input = $("#CardExpiration");
        if (input.val().length === 5) {
            validateMonth = input.val().split('/')[0];
            validateYearJuno = '20' + input.val().split('/')[1];
            validateYearWire = input.val().split('/')[1];
            $(input).parent(".control").parent(".field-group").removeClass("is-danger");
            resolve(true);
        }
        else {
            AlertaErro($i18nShared.payment.card.validation.expirationTitle, $i18nShared.payment.card.validation.expirationMsg, input);
            $(".saveCheckout").removeClass('is-loading');
            resolve(false);
        }
    });
}

async function ValidaEmail(success, error, finish) {
    return new Promise(resolve => {
        var input = $("#Email");

        if (!isEmail($(input).val())) {
            AlertaErro($i18nShared.payment.card.validation.emailTitle, $i18nShared.payment.card.validation.emailMsg, $(input));
            resolve(false);
        }

        if (emailValido != true) {

            $(".pageloader").show();
            $('.pageloader').toggleClass('d-flex');
            $.ajax({
                url: "/Checkout?handler=ValidarEmail",
                data: { _Email: $(input).val(), _nomePerfil: $("#Nome").val() },
                cache: false,
                async: true,
                type: "GET",
                success: function (data) {
                    $(".pageloader").hide();
                    $('.pageloader').toggleClass('d-flex');
                    if (!data.ok) {
                        if (data.message) {
                            AlertaErroEmail(data.message.titulo, data.message.mensagem, input);
                        }
                        resolve(false);
                    }
                    else if (data.message != null && data.message.ehBume == true) {
                        emailValido = true;
                        swal({
                            title: data.message.titulo,
                            text: data.message.mensagem,
                            icon: "warning",
                            buttons: {
                                confirm: {
                                    text: $i18nShared.payment.card.validation.emailUseDiscount,
                                    value: true,
                                    visible: true,
                                    className: "",
                                    closeModal: true
                                }
                            }
                        }).then(function (okay) {
                            $(".DivTrimestralSemestral").hide();
                            $("#btnMensal").html($i18nShared.payment.card.validation.emailSubscribeBy + data.message.valor.toFixed(2).replace(".", ","));
                            $(".btnObterAcesso").attr("data-recorrencia", "Mensal");
                            $("#Recorrencia").val("Mensal");
                            $("#valorAssinaturaMensal").html(data.message.valor.toFixed(2).replace(".", ","));
                            $("#AceiteDesconto").removeClass("is-hidden");
                            resolve(true);
                        }).catch(function (err) {
                            resolve(false);
                        });
                    }
                    else {
                        emailValido = true;
                        input.parent(".control").parent(".field-group").removeClass("is-danger");
                        resolve(true);
                    }
                },
                error: function (reponse) {
                    console.log(reponse);
                    resolve(false);
                }
            });
        }
        else
            resolve(true);
    });

}

async function AlertaErroEmail(titulo, mensagem, elemento, reseta = true, elementoMensagem = $("#mensagem")) {
    return new Promise(resolve => {
        swal({
            title: titulo,
            text: mensagem,
            icon: "warning",
            buttons: {
                cancel: {
                    text: "OK",
                    value: false,
                    visible: true,
                    className: "",
                    closeModal: true
                },
                confirm: {
                    text: $i18nShared.payment.card.validation.emailConfirmLogin,
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                }
            }
        }).then(function (okay) {

            if (okay) {
                $("#Usuario").val($("#Email").val());
                $("#loginURL")[0].click();

            }

            if (elemento == "undefined")
                resolve();

            $(elemento).focus();
            $(elemento).parent(".control").parent(".field-group").addClass("is-danger");

            if (reseta)
                $(elemento).val('');

            $(elementoMensagem).val(titulo);
            resolve();
        });
    });

}

async function ValidarCpfNome(_nome, _cpf, perfil) {
    return new Promise(resolve => {
        $.ajax({
            url: "/Checkout?handler=ValidarCPF",
            data: { _nome: $(_nome).val(), _cpf: $(_cpf).val(), _perfil: perfil },
            cache: false,
            async: true,
            type: "GET",
            success: function (data) {
                if (!data.ok) {
                    swal({
                        title: $i18nShared.payment.card.validation.cpfNomeTitle,
                        text: data.message,
                        icon: "warning"
                    }).then(function () {
                        $(_nome).focus();
                        $(_nome).parent(".control").parent(".field-group").addClass("is-danger");
                        $(_cpf).parent(".control").parent(".field-group").addClass("is-danger");

                        $(_nome).val('');
                        $(_cpf).val('');
                        resolve();
                    });
                } else {
                    $(_nome).parent(".control").parent(".field-group").removeClass("is-danger");
                    $(_cpf).parent(".control").parent(".field-group").removeClass("is-danger");
                    resolve();
                }
            },
            error: function (reponse) {
                resolve();
            }
        });
    });
}

function ValidaCpf(elemento, mensagem) {
    var input = $(elemento);

    if (!TestaCPF(input.val())) {
        AlertaErro($i18nShared.payment.card.validation.cpf, mensagem, input);
        return false;
    }

    $(input).parent(".control").parent(".field-group").removeClass("is-danger");
    return true;
}

async function ValidaNomeCompleto(elemento, titulo, mensagem) {
    var input = $(elemento)

    if (input.val().split(' ').length <= 1) {
        AlertaErro(titulo, mensagem, input, false);
        return false;
    }

    $(input).parent(".control").parent(".field-group").removeClass("is-danger");
    return true;
}

async function ValidaRequeridos() {
    return new Promise(resolve => {
        var faltouPreencher = false;
        var primeiroInput;
        $("input[type='text'][required],input[type='date'][required],select[required]").each(function () {
            if ($(this).is(":visible") && $(this).val() == "") {
                $(this).parent(".control").parent(".field-group").addClass("is-danger");

                if (!faltouPreencher) {
                    primeiroInput = this;
                }

                faltouPreencher = true;
            }
        });
        if (faltouPreencher) {
            AlertaErro($i18nShared.payment.card.validation.fieldRequireTitle, $i18nShared.payment.card.validation.fieldRequireText, $(primeiroInput));
            resolve(false);
        }
        else
            resolve(true);
    });


}

async function ValidacoesCartao() {
    var validaNomeCompleto = await ValidaNomeCompleto($("#CardHolderName"), $i18nShared.payment.card.validation.nameTitle, $i18nShared.payment.card.validation.nameText);

    var validadeCartao = await ValidaValidadeCartao();

    return new Promise(resolve => {
        if ($("#CardCpf").val() != "")
            if (!ValidaCpf($("#CardCpf"), $i18nShared.payment.card.validation.cpfRequired))
                resolve(false);

        if (!validaNomeCompleto)
            resolve(false);

        if (!validadeCartao)
            resolve(false);

        if (!ValidaRequeridos()) {
            resolve(false);
        }

        resolve(true);
    });
}

async function ValidacoesCheckout() {
    var validacaoEmail = await ValidaEmail();
    var validaRequiridos = await ValidaRequeridos();

    return new Promise(resolve => {
        if ($('#Nome').val() === "") {
            AlertaErro($i18nShared.payment.checkout.validation.nameTitle, $i18nShared.payment.checkout.validation.nameText, $("#Nome"));
            resolve(false);
            return;
        }

        if (!ValidaNomeCompleto($("#NomeVerdadeiro"), $i18nShared.payment.checkout.validation.fullNameTitle, $i18nShared.payment.checkout.validation.fullNameText)) {
            resolve(false);
            return;
        }

        if ($("#CPF").val() != "")
            if (!ValidaCpf($("#CPF"), $i18nShared.payment.checkout.validation.cpfRequired)) {
                resolve(false);
                return;
            }

        let count = 0;

        if ($('#SenhaCadastro').val().length >= 8)
            count += 1;

        if ($('#SenhaCadastro').val().match(/[A-Z]/g))
            count += 1;

        if ($('#SenhaCadastro').val().match(/[a-z]/g))
            count += 1;

        if ($('#SenhaCadastro').val().match(/[0-9]/g))
            count += 1;

        if ($('#SenhaCadastro').val().match(/[\`|\~\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\<|\,|\.|\>|\?|\;|\:|\-|\""|\']/g))
            count += 1;

        if (count < 5) {
            AlertaErro($i18nShared.payment.checkout.validation.passwordTitle, $i18nShared.payment.checkout.validation.passwordText, $("#SenhaCadastro"));
            resolve(false);
            return;
        }

        if (!validacaoEmail) {
            resolve(false);
            return;
        }

        if ($("#CardHolderName").is(":visible")) {

            if ($("#CardCpf").val() != "")
                if (!ValidaCpf($("#CardCpf"), $i18nShared.payment.checkout.validation.cpfHolderRequired)) {
                    resolve(false);
                    return;
                }

            if (!ValidaNomeCompleto($("#CardHolderName"), $i18nShared.payment.checkout.validation.nameHolderTitle, $i18nShared.payment.checkout.validation.nameHolderText)) {
                resolve(false);
                return;
            }

            if (!ValidaValidadeCartao()) {
                resolve(false);
                return;
            }
        }

        if ($("#btnMensal").length > 0 && $("#Recorrencia").val() == "" && $("#PostPago").val() == "false") {
            swal({
                title: $i18nShared.payment.checkout.plan.title,
                text: $i18nShared.payment.checkout.plan.text,
                icon: "warning",
                buttons: {
                    mensal: {
                        text: $i18nShared.payment.checkout.plan.month1 + " " + $("#btnMensal").html(),
                        value: "mensal",
                    },
                    trimestral: {
                        text: $i18nShared.payment.checkout.plan.months3 + " " + $("#btnTrimestral").html(),
                        value: "trimestral",
                    },
                    semestral: {
                        text: $i18nShared.payment.checkout.plan.months6 + " " + $("#btnSemestral").html(),
                        value: "semestral",
                    }
                }
            }).then((value) => {
                $("#Recorrencia").val(value);
                resolve(false);
                SaveCheckout();
                return;
            });

            setInterval(function () {
                $(".swal-button-container").css("width", "100%");
                $(".swal-button-container button").addClass("button");
                $(".swal-button-container button").addClass("btnPagamento");
                $(".swal-button-container button").addClass("preenchido");

                //  
            }, 200);

        }

        if (!validaRequiridos) {
            resolve(false);
            return;
        }

        resolve(true);
    });

}