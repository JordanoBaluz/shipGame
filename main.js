function start() {
    //so e possivel essa chamada devido o jquery
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
}

// variaveis do jogo
var jogo = {};
var tecla = {
    W: 87,
    S: 83,
    D: 68
}

var velocidade = 5;
var posicaoY = parseInt(Math.random() * 334);

var podeAtirar = true;

var fimdejogo = false;

jogo.pressionou = [];

//Verifica se o usuário pressionou alguma tecla	
$(document).keydown(function (e) {
    jogo.pressionou[e.which] = true;
});


$(document).keyup(function (e) {
    jogo.pressionou[e.which] = false;
});

moveJogador();

//executa a cada 30 milisegundo
jogo.timer = setInterval(loop, 30);

function loop() {
    moveFundo();
    moveJogador();
    moveInimigo1();
    moveInimigo2();
    moveAmigo();
    colisao();
}

//pega 
function moveFundo() {
    //convertendo o valor atual do fundo que por padrao e 0
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
}

function moveJogador() {

    if (jogo.pressionou[tecla.W]) {
        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo - 10);

        if (topo <= 0) {

            $("#jogador").css("top", topo + 10);
        }
    }

    if (jogo.pressionou[tecla.S]) {

        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo + 10);

        if (topo >= 434) {
            $("#jogador").css("top", topo - 10);

        }
    }

    if (jogo.pressionou[tecla.D]) {
        disparo();
    }

}

function moveInimigo1() {
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX - velocidade);
    $("#inimigo1").css("top", posicaoY);

    //reseta a posicao para o lado direito
    if (posicaoX <= 0) {
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", posicaoY);
    }
}

function moveInimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - 3);

    if (posicaoX <= 0) {
        $("#inimigo2").css("left", 775);
    }
}

function moveAmigo() {
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX + 1);

    if (posicaoX > 906) {
        $("#amigo").css("left", 0);
    }
}

function disparo() {
    if (podeAtirar == true) {

        podeAtirar = false;

        //pega a posicao do helicoptero para posicionar o disparo
        topo = parseInt($("#jogador").css("top"))
        posicaoX = parseInt($("#jogador").css("left"))
        //coloca o tiro na frente do helicoptero
        tiroX = posicaoX + 190;
        topoTiro = topo + 37;
        //exibe o disparo na tela
        $("#fundoGame").append("<div id='disparo'></div");
        $("#disparo").css("top", topoTiro);
        $("#disparo").css("left", tiroX);
        //movimento o disparo na tela
        var tempoDisparo = window.setInterval(executaDisparo, 30);

    }

    function executaDisparo() {
        posicaoX = parseInt($("#disparo").css("left"));
        $("#disparo").css("left", posicaoX + 15);

        if (posicaoX > 900) {
            window.clearInterval(tempoDisparo);
            tempoDisparo = null;
            $("#disparo").remove();
            podeAtirar = true;

        }
    }
}

//identifica a colisão entre os helicopteros
function colisao() {
    var colisao1 = ($("#jogador").collision($("#inimigo1")));
    var colisao2 = ($("#jogador").collision($("#inimigo2")));
    var colisao3 = ($("#disparo").collision($("#inimigo1")));
    var colisao4 = ($("#disparo").collision($("#inimigo2")));
    var colisao5 = ($("#jogador").collision($("#amigo")));
    var colisao6 = ($("#inimigo2").collision($("#amigo")));

    // jogador com o inimigo1
    // se for maior que 0 houve colisão
    if (colisao1.length > 0) {

        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X, inimigo1Y);

        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", posicaoY);
    }
    //colisao do jogador com o inimigo 2
    if (colisao2.length > 0) {

        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        explosao2(inimigo2X, inimigo2Y);

        $("#inimigo2").remove();

        reposicionaInimigo2();

    }
    //colisão entre o disparo e o helicoptero inimigo
    if (colisao3.length > 0) {


        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));

        explosao1(inimigo1X, inimigo1Y);
        $("#disparo").css("left", 950);

        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", posicaoY);

    }
    //colisão entre disparo e caminhão inimigo
    if (colisao4.length > 0) {

        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        $("#inimigo2").remove();

        explosao2(inimigo2X, inimigo2Y);
        $("#disparo").css("left", 950);

        reposicionaInimigo2();

    }
    //colisão entre helicoptero e amigo
    if (colisao5.length > 0) {

        reposicionaAmigo();
        $("#amigo").remove();
    }
    //colisão entre amigo e caminhão
    if (colisao6.length > 0) {

        amigoX = parseInt($("#amigo").css("left"));
        amigoY = parseInt($("#amigo").css("top"));
        explosao3(amigoX, amigoY);
        $("#amigo").remove();

        reposicionaAmigo();
    }

}

//Explosão 1
function explosao1(inimigo1X, inimigo1Y) {
    $("#fundoGame").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(imgs/explosao.png)");
    var div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 300, opacity: 0 }, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 1000);

    function removeExplosao() {

        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao = null;

    }

}
//reposiciona o caminhão após 5s
function reposicionaInimigo2() {

    var tempoColisao4 = window.setInterval(reposiciona4, 5000);

    function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4 = null;

        if (fimdejogo == false) {

            $("#fundoGame").append("<div id=inimigo2></div");

        }

    }
}
//explosão entre o helicoptero amigo e o caminhão inimigo
function explosao2(inimigo2X, inimigo2Y) {

    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(imgs/explosao.png)");
    var div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    function removeExplosao2() {

        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2 = null;
    }
}

function reposicionaAmigo() {

    var tempoAmigo = window.setInterval(reposiciona6, 6000);

    function reposiciona6() {
        window.clearInterval(tempoAmigo);
        tempoAmigo = null;

        if (fimdejogo == false) {

            $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
        }
    }
}

function explosao3(amigoX, amigoY) {
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);

    var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

    function resetaExplosao3() {
        $("#explosao3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3 = null;

    }

}