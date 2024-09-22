window.onload = function () {
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");

    // Variáveis de controle
    const vel = 1;
    var vx = 0, vy = 1; // A cobrinha começa sempre descendo
    var px, py; // Posição inicial da cobrinha no canto
    var lp, tp, qpX, qpY;
    var ax = 15, ay = 15; // Posição inicial da comida
    var trail = [];
    var tail = 5;
    var gameOver = false;
    var level = 1; // Nível inicial
    var score = 0; // Pontuação
    var applesEaten = 0; // Contagem de maçãs comidas para fase
    var walls = []; // Paredes
    var showGameOver = false; // Controle para exibir "Game Over"

    // Imagem da cobrinha
    var snakeImage = new Image();
    snakeImage.src = '' // Caminho correto da imagem

    var gameInterval; // Intervalo do jogo

    // Função para redimensionar o canvas
    function resizeCanvas() {
        stage.width = window.innerWidth;
        stage.height = window.innerHeight;

        // Ajuste dos blocos para o novo tamanho
        lp = Math.floor(stage.width / 30);
        tp = Math.floor(stage.height / 30);
        qpX = Math.floor(stage.width / lp);
        qpY = Math.floor(stage.height / tp);
    }

    resizeCanvas(); // Chama ao carregar a página
    window.onresize = resizeCanvas; // Atualiza ao redimensionar a janela

    // Função para gerar paredes em posições aleatórias, com blocos entre 2 e 5
    function generateWalls() {
        walls = [];
        if (level === 1) return; // Sem obstáculos na primeira fase

        for (let i = 0; i < level * 3; i++) { // Mais paredes conforme o nível
            let wallLength = Math.floor(2 + Math.random() * 4); // Paredes com 2 a 5 blocos
            let wallX = Math.floor(Math.random() * (qpX - wallLength));
            let wallY = Math.floor(Math.random() * qpY);
            for (let j = 0; j < wallLength; j++) {
                walls.push({
                    x: wallX + j,
                    y: wallY
                });
            }
        }
    }

    generateWalls(); // Gera paredes para o nível 1

    function game() {
        if (gameOver) {
            if (!showGameOver) {
                // Exibe "Game Over" no centro do mapa
                ctx.fillStyle = "white";
                ctx.font = "50px Arial";
                ctx.fillText("Game Over", stage.width / 2 - 100, stage.height / 2);
                showGameOver = true;

                // Aguarda 3 segundos antes de exibir "Aperte Enter"
                setTimeout(() => {
                    ctx.clearRect(0, 0, stage.width, stage.height); // Limpa a mensagem "Game Over"
                    ctx.fillStyle = "white";
                    ctx.font = "40px Arial";
                    ctx.fillText("Aperte Enter para começar", stage.width / 4, stage.height / 2);
                }, 3000);
            }
            clearInterval(gameInterval);
            return;
        }

        px += vx;
        py += vy;

        // Colisão com bordas
        if (px < 0 || px >= qpX || py < 0 || py >= qpY) {
            gameOver = true;
        }

        // Limpa o canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Exibe o nível atual
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Fase: " + level, 10, 30);

        // Desenha a comida
        ctx.fillStyle = "red";
        ctx.fillRect(ax * lp, ay * tp, lp, tp);

        // Desenha paredes (obstáculos)
        ctx.fillStyle = "blue";
        for (let i = 0; i < walls.length; i++) {
            ctx.fillRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
            if (px === walls[i].x && py === walls[i].y) {
                gameOver = true; // A cobrinha não pode tocar nas paredes
            }
        }

        // Desenha a cobrinha com a imagem inteira
        let snakeLength = tail * tp; // Comprimento da cobrinha baseado no rabo
        ctx.drawImage(snakeImage, 0, 0, snakeImage.width, snakeImage.height, px * lp, py * tp, lp, snakeLength);

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        // Verifica se a cobra comeu a comida
        if (ax == px && ay == py) {
            tail++;
            applesEaten++; // Contagem de maçãs comidas
            score++;

            // Verifica se é hora de mudar de fase
            if (applesEaten % 15 === 0) {
                level++; // Passa para a próxima fase
                clearInterval(gameInterval); // Pausa temporária no jogo
                gameInterval = setInterval(game, 160 - (level * 10)); // Aumenta a velocidade
                generateWalls(); // Gera mais paredes
                resizeCanvas(); // Ajusta o tamanho do canvas na nova fase

                // Ajusta os blocos de acordo com o novo tamanho da fase
                lp = Math.floor(stage.width / 30);
                tp = Math.floor(stage.height / 30);
                qpX = Math.floor(stage.width / lp);
                qpY = Math.floor(stage.height / tp);
            }

            // Gera uma nova posição para a comida
            ax = Math.floor(Math.random() * qpX);
            ay = Math.floor(Math.random() * qpY);
        }
    }

    // Controle de movimento
    function keyPush(e) {
        if (gameOver && e.keyCode === 13) { // Se der Game Over e pressionar Enter
            resetGame();
            return;
        }

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
    }

    // Função para iniciar o jogo
    function startGame() {
        ctx.clearRect(0, 0, stage.width, stage.height); // Limpa o texto "Aperte Enter"
        document.addEventListener("keydown", keyPush); // Ativa controle
        resetGame();
    }

    // Função para reiniciar o jogo
    function resetGame() {
        gameOver = false;
        showGameOver = false;
        px = 1; // Inicia a cobrinha no canto superior esquerdo
        py = 1;
        vx = 0;
        vy = 1; // Começa para baixo
        tail = 5;
        applesEaten = 0;
        score = 0;
        level = 1;
        generateWalls(); // Gera novas paredes
        clearInterval(gameInterval);
        gameInterval = setInterval(game, 200); // Inicia o intervalo do jogo
    }

    // Exibir "Aperte Enter para começar"
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Aperte Enter para começar", stage.width / 4, stage.height / 2);

    // Aguarda o jogador apertar Enter para iniciar o jogo
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) { // Tecla Enter
            startGame();
        }
    });
};
