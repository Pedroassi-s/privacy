function AbrirModalAssinatura(clienteId) {
    CarregarMotivoCancelamento();
    $("#ClienteCancelamentoId").val(clienteId);
    $("#cancelamento-modal").toggleClass('is-active');
}

function CarregarMotivoCancelamento() {
    if ($("#MotivoCancelamentoId option").length <= 1) {
        initPageloader();
        $.ajax({
            url: "/Profile?handler=ListarMotivoCancelamento",
            cache: false,
            async: true,
            type: "GET",
            success: function (data) {
                if (data.ok) {
                    for (var i = 0; i < data.data.length; i++) {
                        $("#MotivoCancelamentoId").append("<option value=\"" + data.data[i].id + "\" selected=\"\">" + data.data[i].motivo + "</option>");
                    }
                    $("#MotivoCancelamentoId option").removeAttr('selected').eq(0).attr('selected', true);
                }
                initPageloader();
            }
        });
    }
}

function ConfirmarCancelamento() {

    if ($("#MotivoCancelamentoId").val() != "") {
        initPageloader();
        //Chama o método de inserir denuncia
        $.ajax({
            url: "/Profile?handler=DesseguirPerfil",
            data: {
                ClienteId: $("#ClienteCancelamentoId").val(),
                MotivoCancelamentoId: $("#MotivoCancelamentoId").val()
            },
            cache: false,
            async: true,
            type: "GET",
            success: function (data) {
                $('.pageloader').toggleClass('is-active');
                $("#cancelamento-modal").toggleClass('is-active');
                if (data.ok) {
                    swal({
                        title: $i18nShared.profile.unsubscription.title,
                        text: data.message,
                        icon: "success",
                        buttons: {
                            confirm: {
                                text: "Ok",
                                value: true,
                                visible: true,
                                className: "",
                                closeModal: true
                            }
                        }
                    }).then(function () {
                        window.location.reload();
                    });
                }
                else {
                    swal({
                        title: $i18nShared.profile.unsubscription.title,
                        text: data.message,
                        icon: "warning",
                        buttons: {
                            confirm: {
                                text: "Ok",
                                value: true,
                                visible: true,
                                className: "",
                                closeModal: true
                            }
                        }
                    });
                }
            }
        });
    } else {
        alert($i18nShared.profile.unsubscription.requiredFields);
    }
}

function ReativarRecorrencia(amigoId) {
    initPageloader();
    $.ajax({
        url: "/Profile?handler=ReativarRecorrencia",
        data: {
            amigoId: amigoId
        },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            $('.pageloader').toggleClass('is-active');
            if (data.ok) {
                swal({
                    title: $i18nShared.profile.unsubscription.title,
                    text: data.message,
                    icon: "success",
                    buttons: {
                        confirm: {
                            text: "Ok",
                            value: true,
                            visible: true,
                            className: "",
                            closeModal: true
                        }
                    }
                }).then(function () {
                    window.location.reload();
                });
            }
            else {
                swal({
                    title: $i18nShared.profile.unsubscription.title,
                    text: data.message,
                    icon: "warning",
                    buttons: {
                        confirm: {
                            text: "Ok",
                            value: true,
                            visible: true,
                            className: "",
                            closeModal: true
                        }
                    }
                });
            }
        }
    });
}