window.onload = function () {
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");

    // Variáveis de controle
    const vel = 1;
    var vx = 0, vy = 1; // A cobrinha começa sempre descendo
    var px, py; // Posição inicial da cobrinha
    var lp, tp, qpX, qpY;
    var ax, ay; // Posição inicial da comida
    var trail = [];
    var tail = 5;
    var gameOuver = false;
    var level = 1; // Nível inicial
    var applesEaten = 0; // Contagem de maçãs comidas para fase
    var walls = []; // Paredes
    var showGameOuver = false; // Controle para exibir "Game Ouver"
    var showRestartMessage = false; // Controle para exibir a mensagem de reinício
    
    // Cores do jogo
    var snakeColor = generateColor(); // Cor inicial da cobrinha
    var backgroundColor = "black"; // Cor inicial do fundo do jogo
    var gameInterval; // Intervalo do jogo
    var mapColors = ["#2E8B57", "#8FBC8F", "#FF4500", "#6A5ACD", "#4682B4"]; // Cores do mapa por fase

    // Função para redimensionar o canvas
    function resizeCanvas() {
        stage.width = window.innerWidth;
        stage.height = window.innerHeight;

        // Ajuste dos blocos para o novo tamanho
        lp = Math.floor(stage.width / 65); // Ajusta a largura
        tp = lp; // Garantindo que a altura seja igual à largura
        qpX = Math.floor(stage.width / lp);
        qpY = Math.floor(stage.height / tp);
    }

    resizeCanvas(); // Chama ao carregar a página
    window.onresize = resizeCanvas; // Atualiza ao redimensionar a janela

    // Função para gerar uma cor aleatória
    function generateColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Função para gerar paredes em posições aleatórias
    function generateWalls() {
        walls = [];
        if (level === 1) return; // Sem obstáculos na primeira fase

        for (let i = 0; i < level * 3; i++) {
            let wallLength = Math.floor(2 + Math.random() * 4);
            let wallX = Math.floor(Math.random() * (qpX - wallLength));
            let wallY = Math.floor(Math.random() * qpY);
            for (let j = 0; j < wallLength; j++) {
                walls.push({ x: wallX + j, y: wallY });
            }
            // Gera paredes verticais
            wallLength = Math.floor(2 + Math.random() * 4);
            wallX = Math.floor(Math.random() * qpX);
            wallY = Math.floor(Math.random() * (qpY - wallLength));
            for (let j = 0; j < wallLength; j++) {
                walls.push({ x: wallX, y: wallY + j });
            }
        }
    }

    // Função para gerar a posição da maçã
    function generateApple() {
        ax = Math.floor(Math.random() * qpX);
        ay = Math.floor(Math.random() * qpY);
    }

    // Função principal do jogo
    function game() {
        if (gameOuver) {
            if (!showGameOuver) {
                // Exibe "Game Ouver" no centro do mapa
                ctx.fillStyle = "white";
                ctx.font = "100px sans-serif";
                ctx.textAlign = "center"; // Alinha o texto ao centro
                ctx.fillText("Game Ouver", stage.width / 2 - 50, stage.height / 2);
                showGameOuver = true;
            }

            // Exibe a mensagem para voltar à página inicial
            if (!showRestartMessage) {
                ctx.fillStyle = "white";
                ctx.font = "30px Arial";
                ctx.textAlign = "center"; // Alinha o texto ao centro
                ctx.fillText("Pressione Enter para Continuar ou S para sair! ", stage.width / 2 - 50, stage.height / 2 + 50);
                showRestartMessage = true;
            }
            clearInterval(gameInterval);
            return;
        }

        px += vx;
        py += vy;

        // Colisão com bordas
        if (px < 0 || px >= qpX || py < 0 || py >= qpY) {
            gameOuver = true;
        }

        // Limpa o canvas
        ctx.fillStyle = backgroundColor; // Preenche o fundo com a cor atual do nível
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Ajuste de cores para a maçã e a cabeça se o fundo for vermelho
        let appleColor = "red";
        let headColor = "#FF4500"; // Laranja para a cabeça

        if (backgroundColor === "red") {
            appleColor = "yellow"; // Muda a maçã para amarelo
            headColor = "blue"; // Muda a cabeça para azul
        }

        // Desenha a comida
        ctx.fillStyle = appleColor;
        ctx.beginPath(); // Inicia um novo caminho
        ctx.arc(ax * lp + lp / 2, ay * tp + tp / 2, lp / 2, 0, Math.PI * 2); // Desenha um círculo
        ctx.fill(); // Preenche o círculo

        // Desenha paredes
        ctx.fillStyle = "blue";
        for (let i = 0; i < walls.length; i++) {
            ctx.fillRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
            if (px === walls[i].x && py === walls[i].y) {
                gameOuver = true;
            }
        }

        // Desenha a cobrinha
        ctx.fillStyle = headColor; // Cor da cabeça
        ctx.fillRect(px * lp, py * tp, lp, tp);
        ctx.fillStyle = snakeColor; // Cor do corpo
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * lp, trail[i].y * tp, lp, tp);
        }

        // Verifica colisão com o corpo
        for (let i = 0; i < trail.length; i++) {
            if (trail[i].x === px && trail[i].y === py) {
                gameOuver = true;
                break; // Adicionado break para sair do loop após a colisão
            }
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        // Verifica se a cobra comeu a comida
        if (ax === px && ay === py) {
            tail++;
            applesEaten++;

            // Gera uma nova posição para a comida
            generateApple();

            // Verifica se passou de fase
            if (applesEaten >= 10 + (level - 1) * 5) { // Aumenta a contagem de maçãs conforme o nível
                level++;
                applesEaten = 0; // Reinicia a contagem de maçãs
                clearInterval(gameInterval); // Pausa temporária no jogo
                backgroundColor = mapColors[(level - 1) % mapColors.length]; // Muda a cor do mapa
                generateWalls(); // Gera mais paredes
                gameInterval = setInterval(game, 180 - (level * 20)); // Aumenta a velocidade
            }
        }

        // Exibe o nível no rodapé
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("Fase " + level, stage.width / 2 - 50, stage.height - 10);
    }

    // Controle de movimento
    function keyPush(e) {
        if (gameOuver && e.keyCode === 13) {
            resetGame();
            return;
        }
        if (gameOuver && e.keyCode === 83) { // 83 é o código da tecla "S"
            window.location.href = '../index.html'; // Altere para o caminho correto da sua página inicial
            return;
        }

        if (!gameOuver) {
            switch (e.keyCode) {
                case 37:
                    if (vx === 0) {
                        vx = -vel;
                        vy = 0;
                    }
                    break;
                case 38:
                    if (vy === 0) {
                        vx = 0;
                        vy = -vel;
                    }
                    break;
                case 39:
                    if (vx === 0) {
                        vx = vel;
                        vy = 0;
                    }
                    break;
                case 40:
                    if (vy === 0) {
                        vx = 0;
                        vy = vel;
                    }
                    break;
            }
        }
    }

    // Função para reiniciar o jogo
    function resetGame() {
        clearInterval(gameInterval);

        gameOuver = false;
        applesEaten = 0;
        level = 1;
        tail = 5;
        vx = 0;
        vy = 1;
        trail = [];
        px = 0; // Cobra começa no canto superior esquerdo
        py = 0;

        generateWalls();
        generateApple();
        backgroundColor = "black"; // Cor inicial do nível 1

        gameInterval = setInterval(game, 200);
        showGameOuver = false; // Reinicia o controle de exibição de "Game Ouver"
        showRestartMessage = false; // Reinicia o controle da mensagem de reinício
    }

    document.addEventListener("keydown", keyPush);
    resetGame();
};
