function AbrirModalDenuncia(clienteDenunciadoId, postDenunciadoId) {
    CarregarCategoriasDenuncia();
    $("#ClienteDenunciadoId").val(clienteDenunciadoId);
    $("#PostDenunciadoId").val(postDenunciadoId);
    $("#denuncia-modal").toggleClass('is-active');
}

function CarregarCategoriasDenuncia() {
    if ($("#CategoriaDenunciaId option").length <= 1) {
        $.ajax({
            url: "/Index?handler=ListarCategoriaDenuncia",
            cache: false,
            async: true,
            type: "GET",
            success: function (data) {
                if (data.ok) {
                    for (var i = 0; i < data.data.length; i++) {
                        $("#CategoriaDenunciaId").append("<option value=\"" + data.data[i].id + "\" selected=\"\">" + data.data[i].descricao + "</option>");
                    }
                    $("#CategoriaDenunciaId option").removeAttr('selected').eq(0).attr('selected', true);
                }
            }
        });
    }
}

function InserirDenuncia(clientId) {
    initPageloader();

    if ($("#CategoriaDenunciaId").val() != "") {
        //Chama o método de inserir denuncia
        $.ajax({
            url: "/Index?handler=InserirDenuncia",
            data: {
                ClienteId: clientId,
                CategoriaDenunciaId: $("#CategoriaDenunciaId").val(),
                Mensagem: $("#MensagemDenuncia").val(),
                ClienteDenunciadoId: $("#ClienteDenunciadoId").val(),
                PostId: $("#PostDenunciadoId").val()
            },
            cache: false,
            async: true,
            type: "GET",
            success: function (data) {
                $('.pageloader').toggleClass('is-active');
                $("#denuncia-modal").toggleClass('is-active');
                if (data.ok) {
                    $("#MensagemDenuncia").val('');
                    $("#CategoriaDenunciaId").val('');
                    swal({
                        title: $i18nShared.report.modal.msgTitle,
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
                    });
                }
                else {
                    swal({
                        title: $i18nShared.report.modal.msgTitle,
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
            },
            error: function (reponse) {
                $('.pageloader').toggleClass('is-active');
                $("#denuncia-modal").toggleClass('is-active');
                swal({
                    title: $i18nShared.report.modal.msgTitle,
                    text: $i18nShared.report.modal.msgError,
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
        });
    }
    else
        alert($i18nShared.report.modal.fieldsRequired);
}
