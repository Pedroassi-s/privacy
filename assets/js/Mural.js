var teste = 0;
var carregaScroll = true;
var position = $(window).scrollTop();
var rotacao = 0;
var ehImagem = true;
var agendado = false;
var arquivado = false;

$(function () {
    "use strict"; //Highlight current profile menu item

    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > position) {
            var scrollPosition = window.pageYOffset;
            var windowSize = window.innerHeight;
            var bodyHeight = document.body.offsetHeight;
            var distanceOfBottom = Math.max(bodyHeight - (scrollPosition + windowSize), 0);
            var qtdAtual, url, nomePerfil, filterMosaico;
            
            
            if (distanceOfBottom < 300 && carregaScroll && $("#bodyPosts").length === 1) {
                carregaScroll = false;
                qtdAtual = $(".card.is-post").length;
                url = "/Index?handler=PartialPosts";



                nomePerfil = null;

                if ($("#nomePerfil") !== null)
                    nomePerfil = $("#nomePerfil").val();

                $.ajax({
                    url: url,
                    data: { skip: qtdAtual, take: 10, nomePerfil: nomePerfil, agendado: agendado, arquivado: arquivado },
                    cache: false,
                    async: true,
                    type: "GET",
                    success: function (data) {
                        $("#bodyPosts").append(data);
                        carregaScroll = true;
                    },
                    error: function (reponse) {
                    }
                });
            }

            if (distanceOfBottom < 300 && carregaScroll && $("#bodyPostsMosaico").length === 1) {
                carregaScroll = false;
                var postIds = [];

                for (var i = 0; i < $(".postIds").length; i++) {
                    postIds.push($(".postIds").eq(i).val());
                }
                var unique = postIds.filter(onlyUnique);
                qtdAtual = unique.length//$("#bodyPostsMosaico .column").length;

                url = "/Profile?handler=PartialPosts";

                nomePerfil = null;
                if ($("#nomePerfil") !== null)
                    nomePerfil = $("#nomePerfil").val();

                filterMosaico = null;
                if ($("#filterMosaico") !== null)
                    filterMosaico = $("#filterMosaico").val();

                $.ajax({
                    url: url,
                    data: { skip: qtdAtual, take: 10, nomePerfil: nomePerfil, filter: filterMosaico  },
                    cache: false,
                    async: true,
                    type: "GET",
                    success: function (data) {
                        $("#bodyPostsMosaico").append(data);
                        organizarMosaico();
                        carregaScroll = true;
                        if (data == '\r\n\r\n\r\n')
                            carregaScroll = false;
                    },
                    error: function (reponse) {
                    }
                });
            }
        }

        $('video').each(function () {
            if (!$(this).get(0).paused) {
                if (!isVisible($(this))) {
                    $(this)[0].pause();
                }
            }
        });

        $('audio').each(function () {
            if (!$(this).get(0).paused) {
                if (!isVisible($(this))) {
                    $(this)[0].pause();
                }
            }
        });

        position = scroll;
    });

    $.fancybox.defaults.infobar = false;
    $.fancybox.defaults.buttons = ["close"];




    $(window).resize(function () {
        organizarMosaico();
    });
});




function isVisible($el) {
    var winTop = $(window).scrollTop();
    var elTop = $el.offset().top;
    var elHeigth = $el.height();
    var displayHeigth = $(window).height();
    return (((elTop + elHeigth) >= winTop)) && (((elTop - displayHeigth) < winTop));
}

function CarregarBotoesAmizade() {
    $('a[name="LinkAdicionarAmizade"]').click(function () {
        Adicionar($(this).data('id').toString().split('|')[0], $(this).data('id').toString().split('|')[1])
    });

    $('a[name="LinkRecusarAmizade"]').click(function () {
        Recusar($(this).data('id').toString().split('|')[0], $(this).data('id').toString().split('|')[1])
    });
}

function Like(idPost) {
    var span = $("#countLikes" + idPost);
    var btnLike = $("#btnlike" + idPost);
    var iconLoader = $("#loaderlike" + idPost);


    btnLike.slideUp(400).fadeOut();
    iconLoader.delay(300).fadeIn();

    var url = "/Index?handler=Like";
    $.ajax({
        url: url,
        data: { IdPost: idPost, TotalLike: span.val() },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            if (data.OK) {                
                span.html(data.Likes);
                btnLike.attr("src", (data.curtida) ? "/assets/img/icons/feed/Vectorheartbg.svg" : "/assets/img/icons/feed/Vectorheart.svg");
                iconLoader.fadeOut(200);
                btnLike.delay(400).fadeIn();
                return true;
            }
            iconLoader.fadeOut(200);
            btnLike.delay(400).fadeIn();
            return false;

        },
        error: function (reponse) {
            iconLoader.fadeOut(200);
            btnLike.delay(400).fadeIn()
        }
    });
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function Comentar(idPost, idUsuario, idComentario) {

    var textoComentario = document.getElementById("comentario(" + idPost + ")").value;

    var url = "/Index?handler=Comentar";
    $.ajax({
        url: url,
        data: { IdUsuario: idUsuario, IdPost: idPost, Texto: textoComentario, IdComentario: idComentario },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            ObterComentarios(idPost, false);  //Chama método para atualizar Partial de comentários

            if (!data.ok) {
                alert($i18nShared.post.requiredField);
                return false;
            }
            else {
                //location.reload();
                return true;
            }
        },
        error: function (reponse) {
            //alert("error : " + reponse);
        }
    });
}

function OcultarMostrarComentario(idComentario) {
    var url = "/Index?handler=OcultarMostrarComentario";
    $.ajax({
        url: url,
        data: { IdComentario: idComentario },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {

            if (!data.OK) {
                span.innerHTML = data.Likes;
                return false;
            }
            else {
                location.reload();
                return true;
            }
        },
        error: function (reponse) {
            //alert("error : " + reponse);
        }
    });
}

function OpenCloseComments(post) {
    post.addClass('is-active').closest('.card').find('.comments-wrap').toggleClass('is-hidden');
}

function ObterComentarios(idPost, open = true, i18n) {
    var partialDiv = $("#partialFor" + idPost);

    if (!i18n) i18n = { filters: {} }

    ///$("#partialFor78fff29b-6aa8-46d3-b5a3-fada39ba1113").find(".comments-body").length

    var url = "/Index?handler=PartialComments";
    $.ajax({
        url: url,
        data: { PostId: idPost },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            partialDiv.html(data);
            if (open)
                OpenCloseComments(partialDiv);

            setTimeout(function () {
                var qtdPosts = partialDiv.find(".comments-body").length;
                partialDiv.parent("div").find(".comments-heading h4 small").html(qtdPosts);
                partialDiv.parent("div").parent("div").find(".card-footer .social-count .comments-count span").html(qtdPosts);
            }, 200);

            $(".comment-textarea").emojioneArea({
                pickerPosition: "bottom",
                placeholder: i18n.placeholder,
                searchPlaceholder: i18n.searchPlaceholder,
                buttonTitle: i18n.buttonTitle,
                filters: {
                    tones: { title: i18n.filters.tones },
                    recent: { title: i18n.filters.recent },
                    smileys_people: { title: i18n.filters.smileys_people },
                    animals_nature: { title: i18n.filters.animals_nature },
                    food_drink: { title: i18n.filters.food_drink },
                    activity: { title: i18n.filters.activity },
                    travel_places: { title: i18n.filters.travel_places },
                    objects: { title: i18n.filters.objects },
                    symbols: { title: i18n.filters.symbols },
                    flags: { title: i18n.filters.flags }
                }
            });

            return true;
        },
        error: function (reponse) {
        }
    });
}

function RemoverPostagem(postId, title, text, btnCancel, btnConfirm) {


    swal({
        title: title,
        text: text,
        icon: "warning",
        buttons: {
            cancel: {
                text: btnCancel,
                value: false,
                visible: true,
                className: "",
                closeModal: true
            },
            confirm: {
                text: btnConfirm,
                value: true,
                visible: true,
                className: "",
                closeModal: true
            }
        }
    }).then(function (okay) {

        if (okay) {
            initPageloader();
            var url = "/Index?handler=RemovePost";
            $.ajax({
                url: url,
                data: { PostId: postId },
                cache: false,
                async: true,
                type: "GET",
                success: function (data) {
                    alert(data.message);
                    window.location.reload();
                    return true;
                },
                error: function (reponse) {
                }
            });
        }
    });
}

function RemoverComentario(comentarioId, postId) {
    initPageloader();
    var url = "/Index?handler=RemoveComentario";
    $.ajax({
        url: url,
        data: { ComentarioId: comentarioId },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            ObterComentarios(postId, false);
            initPageloader();
        },
        error: function (reponse) {
        }
    });
}

function ArquivaDesarquivaPublicacao(postId) {
    initPageloader();
    var url = "/Index?handler=ArquivarPublicacao";
    $.ajax({
        url: url,
        data: { _PostId: postId },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            alert(data.message);
            window.location.reload();
            return true;
        },
        error: function (reponse) {
        }
    });
}

function HabilitaDesabilitaComentario(postId) {
    initPageloader();

    var url = "/Index?handler=DesabilitarComentarios";
    $.ajax({
        url: url,
        data: { _PostId: postId },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            alert(data.message);
            window.location.reload();
            return true;
        },
        error: function (reponse) {
        }
    });
}

function FixaDesafixaPost(postId) {
    initPageloader();

    var url = "/Index?handler=FixaDesafixaPost";
    $.ajax({
        url: url,
        data: { _PostId: postId },
        cache: false,
        async: true,
        type: "GET",
        success: function (data) {
            alert(data.message);
            window.location.reload();
            return true;
        },
        error: function (reponse) {
        }
    });
}

function organizarMosaico() {
    $("#bodyPostsMosaico .column").each(function (i) {
        $(this).css("height", $(this).css("width"));
    });
}



