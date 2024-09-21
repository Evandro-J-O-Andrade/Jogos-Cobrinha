window.onload = function () {
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");
    document.addEventListener("keydown", keyPush)
    setInterval(game, 120);

    const vel = 1;
    var vx = 0, vy = 0;
    var px = 10, py = 15;
    var lp = 20; // Largura do bloco
    var tp = 20; // Altura do bloco
    var qp = 20; // Quantidade de blocos (quadrado por lado)
    var ax = 15, ay = 15; // Posição inicial da comida
    var trail = [];
    var tail = 5;

    function game() {
        px += vx;
        py += vy;

        // Controle de borda (se a cobra sai da tela, reaparece no lado oposto)
        if (px < 0) {
            px = qp - 1;
        }
        if (px > qp - 1) {
            px = 0;
        }
        if (py < 0) {
            py = qp - 1;
        }
        if (py > qp - 1) {
            py = 0;
        }

        // Desenha o fundo do jogo
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Desenha a comida
        ctx.fillStyle = "red";
        ctx.fillRect(ax * lp, ay * tp, lp, tp);

        // Desenha a cobra
        ctx.fillStyle = "gray";
        for (var i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * lp, trail[i].y * tp, lp, tp);
            // Verifica se a cabeça da cobra colidiu com o corpo
            if (trail[i].x == px && trail[i].y == py) {
                vx = vy = 0; // Parar a cobra em caso de colisão
                tail = 5; // Resetar o tamanho da cauda
                s
            }
        }

        // Adiciona a nova posição da cabeça ao início da trilha
        trail.push({ x: px, y: py });

        // Remove o excesso de segmentos da cauda
        while (trail.length > tail) {
            trail.shift();
        }

        // Verifica se a cobra comeu a comida
        if (ax == px && ay == py) {
            tail++; // Aumenta o tamanho da cauda
            // Gera uma nova posição para a comida
            ax = Math.floor(Math.random() * qp);
            ay = Math.floor(Math.random() * qp);
        }
    }

    // Controle de movimento (teclas)
    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37: // Esquerda
                vx = -vel;
                vy = 0;
                break;
            case 38: // Cima
                vx = 0;
                vy = -vel;
                break;
            case 39: // Direita
                vx = vel;
                vy = 0;
                break;
            case 40: // Baixo
                vx = 0;
                vy = vel;
                break;
        }
    });
};

function keyPush(event){
    switch (event.keyCode){
        case 37: //corresponde a tecla Lefet
        vx=-vel;
        vy=0;
        break
        case 38:// corresponde a tecla up
        vx=-vel;
        vy=0;
        break
        case 39: //corresponde a tecla right
        vx= vel;
        vy= 0;
        break;
        case 40:// corresponde a tecla down
        vx= 0;
        vy= vel;
        break;
        default:
            break
    }
}