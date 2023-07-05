$(document).ready(function () {

    
    $("#confirm-payment-modal-content > * .close-wrap").click(function () {
        $("#btnGerarPix").removeClass('is-loading');
        $("#btnGerarPix").show();
    });


    CarregaClickCartao();

    $("#copiarCodigo").click(function () {
        $("#txtCodigoBoleto").removeAttr("disabled");
        var copyText = document.getElementById("txtCodigoBoleto");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        $("#txtCodigoBoleto").attr("disabled", "disabled");
        $("#msgCodigo").show();
        setTimeout(function () {
            $("#msgCodigo").hide();
        }, 1000);
    });

    $("#copiarCodigoPix").click(function () {
        $("#txtCodigoPix").removeAttr("readonly");
        var copyText = document.getElementById("txtCodigoPix");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        $("#txtCodigoPix").attr("readonly", "readonly");
        $("#msgCodigoPix").show();
        setTimeout(function () {
            $("#msgCodigoPix").hide();
        }, 2000);
    });

    //Add Inactive Class To All Accordion Headers
    $('.accordion-header').toggleClass('inactive-header');

    //Open The First Accordion Section When Page Loads
    $('.accordion-header').first().toggleClass('active-header').toggleClass('inactive-header');
    $('.accordion-content').first().slideDown().toggleClass('open-content');

    // The Accordion Effect
    $('.accordion-header').click(function () {
        if ($(this).is('.inactive-header')) {
            $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
            $(this).toggleClass('active-header').toggleClass('inactive-header');
            $(this).next().slideToggle().toggleClass('open-content');
        }
        else {
            $('.inactive-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
            $(this).toggleClass('active-header').toggleClass('inactive-header');
            $(this).next().slideToggle().toggleClass('open-content');
        }
    });
});

var idCobranca = "";

function EfetuarPagamento(clienteId, postId, valor, chatId, chatMessageId, Recorrencia) {
    $("#txtClienteIdPagamento").val(clienteId);
    $("#txtPostIdPagamento").val(postId);
    $("#txtChatMessageId").val(chatMessageId);
    $("#txtChatId").val(chatId);
    $("#boletoGerado").hide();
    $("#pixGerado").hide();
    $(".txtValor span").html(valor);
    $("#Recorrencia").val(Recorrencia);

    idCobranca = uuidv4();

    if (valor.replace(',', '.') >= 19) {
        $("#btnGerarBoleto").removeClass("is-disabled");
        $("#msgMinimo").hide();
    }
    else {
        $("#btnGerarBoleto").addClass("is-disabled");
        $("#msgMinimo").show();
    }

    CarregarCartoes();
}

function CarregarCartoes() {
    //$('.pageloader').toggleClass('is-active');    
    $.ajax({
        url: "/CartaoCredito?handler=Cartoes",
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            $("#divCartoes").html(data);
            //$('.pageloader').toggleClass('is-active');
            CarregaClickCartao();
        },
        error: function (reponse) {
            //$('.pageloader').toggleClass('is-active');
        }
    });
}

function CarregaClickCartao() {
    $(".principal").click(function () {
        if (!$(this).is(":checked")) {
            alert($i18nShared.payment.cardIsAlteradyPrimary);
            $(this).prop("checked", true);
        }
        else {
            var element = $(this);
            initPageloader();
            $.ajax({
                url: "/CartaoCredito?handler=CartaoPrincipal",
                data: { GuidCartao: $(this).data("idcartao") },
                cache: false,
                async: true,
                type: "GET",
                success: function (data) {
                    $('.pageloader').toggleClass('is-active');
                    if (data.ok) {
                        $(".principal").prop('checked', false);
                        element.prop('checked', true);
                    }
                    else {
                        alert(data.message);
                    }
                },
                error: function (reponse) {
                    $('.pageloader').toggleClass('is-active');
                    element.prop('checked', false);
                    alert($i18nShared.payment.cardErrorOnRemove);
                    //alert("error : " + reponse);
                }
            });
        }
    });

    $(".excluirCartao").click(function () {
        if ($(this).parent().parent().parent().find("tr").length > 2 && $(this).parent().parent().find(".principal").is(":checked"))
            alert($i18nShared.payment.unableToDeletePrimaryCard)
        else {
            //initPageloader();
            $.ajax({
                url: "/CartaoCredito?handler=Delete",
                data: { GuidCartao: $(this).data("idcartao") },
                cache: false,
                async: true,
                type: "GET",
                success: function (data) {
                    if (data.ok)
                        CarregarCartoes();
                    else {
                        $('.pageloader').toggleClass('is-active');
                        alert(data.message);
                    }
                },
                error: function (reponse) {
                    //alert("error : " + reponse);
                }
            });
        }
    });
}

var pagamentoCartao = true;

function PagamentoCartao() {
    if ($("#InserirCartao").length > 0) {
        $("#InserirCartao").click();
    }
    else {
        $("#btnPagamentoCartao").addClass('is-loading');
        if (pagamentoCartao) {
            pagamentoCartao = false;
            if ($("#txtPostIdPagamento").val() !== "") {
                initPageloader();
                var partialDiv = $("#Postagem" + $("#txtPostIdPagamento").val());
                var url = "/Index?handler=PayPost";
                $.ajax({
                    url: url,
                    data: { PostId: $("#txtPostIdPagamento").val(), CobrancaId: idCobranca, VisitorID: $("#VisitorID").val() },
                    cache: false,
                    async: true,
                    type: "GET",
                    success: function (data) {
                        $('.pageloader').toggleClass('is-active');
                        if ($.type(data) === "string") {
                            partialDiv.html(data);
                            $("#confirm-payment-modal .close-modal").click();
                        }
                        else if (!data.cadastroFinalizado) {
                            swal({
                                title: $i18nShared.modal.warning,
                                text: data.message,
                                icon: "warning",
                                buttons: {
                                    confirm: {
                                        text: $i18nShared.payment.finish,
                                        value: true,
                                        closeModal: true
                                    },
                                    cancel: $i18nShared.cancel
                                }
                            }).then(function (value) {
                                if (value) {
                                    window.location.href = "/v2/info/personal";
                                }
                            });
                        }
                        else {
                            alert(data.message);
                            CarregarCartoes();
                        }
                            


                        $("#btnPagamentoCartao").removeClass('is-loading');

                        pagamentoCartao = true;
                        return true;
                    },
                    complete: function (data) {
                        idCobranca = uuidv4();
                    },
                    error: function (reponse) {
                        pagamentoCartao = true;
                    }
                });
            }
            else if ($("#txtClienteIdPagamento").val() !== "") {
                $("#btnPagamentoCartao").addClass('is-loading');
                initPageloader();
                $.ajax({
                    url: "/Profile?handler=SeguirPerfil",
                    data: { ClienteId: $("#txtClienteIdPagamento").val(), CobrancaId: idCobranca, Recorrencia: $("#Recorrencia").val(), VisitorID: $("#VisitorID").val() },
                    cache: false,
                    async: true,
                    type: "GET",
                    success: function (data) {
                        $("#confirm-payment-modal").toggleClass('is-active');
                        if (data.ok) {
                            $('.pageloader').toggleClass('is-active');
                            alert(data.message, function () {
                                window.location.reload();
                            });
                        }
                        else {
                            $('.pageloader').toggleClass('is-active');
                            alert(data.message, function () {
                                if (data.redirectUrl)
                                    window.location.href = data.redirectUrl;
                                else
                                    window.location.reload();
                            });
                        }
                        $("#btnPagamentoCartao").removeClass('is-loading');
                        pagamentoCartao = true;
                    },
                    error: function (reponse) {
                        pagamentoCartao = true;
                    }
                });
            }
            else {
                $("#btnPagamentoCartao").removeClass('is-loading');
                ChatPagamentoCartao(idCobranca);
            }
        }
    }
}

function GerarBoleto() {
    initPageloader();

    var url = "/CartaoCredito?handler=GerarBoleto";
    $.ajax({
        url: url,
        data: { _clienteId: $("#txtClienteIdPagamento").val(), _postId: $("#txtPostIdPagamento").val(), _chatMessageId: $("#txtChatMessageId").val(), Recorrencia: $("#Recorrencia").val(), VisitorID: $("#VisitorID").val() },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            $('.pageloader').toggleClass('is-active');
            if (data.ok) {
                console.log(data.data);
                $("#txtCodigoBoleto").val(data.data.codigoBarras);
                $("#downloadBoleto").attr("href", data.data.urlBoleto);
                $("#boletoGerado").show();
            }
            else {
                alert(data.message, function () {
                    if (data.redirectUrl)
                        window.location.href = data.redirectUrl;
                    else
                        window.location.reload();
                });
                $("#boletoGerado").hide();
            }

            return true;
        },
        complete: function (data) {
            idCobranca = uuidv4();
        },
        error: function (reponse) {
        }
    });
}

function GerarPix() {    
    $("#btnGerarPix").addClass('is-loading');
    
    var url = "/CartaoCredito?handler=GerarPix";
    $.ajax({
        url: url,
        data: { _clienteId: $("#txtClienteIdPagamento").val(), _postId: $("#txtPostIdPagamento").val(), _chatMessageId: $("#txtChatMessageId").val(), Recorrencia: $("#Recorrencia").val(), VisitorID: $("#VisitorID").val() },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {            
            if (data.ok) {                
                $("#btnGerarPix").hide();

                $("#txtCodigoPix").val(data.data.codigoBarras);
                
                $("#qrcodePix").html("");

                $("#qrcodePix").qrcode({ width: 200, height: 200, text: data.data.codigoBarras });

                $("#pixGerado").show();
            }
            else {
                alert(data.message, function () {
                    if (data.redirectUrl)
                        window.location.href = data.redirectUrl;
                    else
                        window.location.reload();
                }); 

                $("#pixGerado").hide();

                $("#btnGerarPix").show();
            }

            $("#btnGerarPix").removeClass('is-loading');

            return true;
        },
        complete: function (data) {
            idCobranca = uuidv4();
        },
        error: function (reponse) {
            $("#btnGerarPix").removeClass('is-loading');
            $("#btnGerarPix").show();
        }
    });
}