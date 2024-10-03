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
    var gameOver = false;
    var level = 1; // Nível inicial
    var applesEaten = 0; // Contagem de maçãs comidas para fase
    var walls = []; // Paredes
    var showGameOver = false; // Controle para exibir "Game Over"
    var showRestartMessage = false; // Controle para exibir a mensagem de reinício
    var recordAtual = 0;
    var recordSalvo = localStorage.getItem('recordSalvo') ? parseInt(localStorage.getItem('recordSalvo')) : 0;
    var gameInterval; // Intervalo do jogo
    var snakeColor = generateColor(); // Cor inicial da cobrinha
    var backgroundColor = "black"; // Cor inicial do fundo do jogo
    var mapColors = ["#2E8B57", "#8FBC8F", "#FF4500", 
    "#6A5ACD", "#4682B4"]; // Cores do mapa por fase
    // Função para redimensionar o canvas
    function resizeCanvas() {
        stage.width = window.innerWidth;
        stage.height = window.innerHeight; // Ajuste dos blocos para o novo tamanho
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
    function isAppleOnSnakeOrWall() {
        // Verifica se a maçã está na cobra ou nas paredes
        return trail.some(segment => segment.x === ax && segment.y === ay) || walls.some(wall => wall.x === ax && wall.y === ay);
    }

    function generateWalls() {
        walls = []; // Reinicia as paredes a cada nova fase
        if (level === 1) return;
        for (let i = 0; i < level * 3; i++) {
            let wallLength = Math.floor(2 + Math.random() * 4);
            let wallX = Math.floor(Math.random() * (qpX - wallLength));
            let wallY = Math.floor(Math.random() * qpY);
            for (let j = 0; j < wallLength; j++) {
                walls.push({ x: wallX + j, y: wallY });
            }
            wallLength = Math.floor(2 + Math.random() * 4);
            wallX = Math.floor(Math.random() * qpX);
            wallY = Math.floor(Math.random() * (qpY - wallLength));
            for (let j = 0; j < wallLength; j++) {
                walls.push({ x: wallX, y: wallY + j });
            }
        }
    }

    function generateApple() {
        do {
            ax = Math.floor(Math.random() * qpX);
            ay = Math.floor(Math.random() * qpY);
        } while (isAppleOnSnakeOrWall()); // Garante que a maçã não colida com a cobra ou paredes
    }

    // Função unificada de verificação de colisões
    function checkCollision() {
        // Verifica colisão com bordas
        if (px < 0 || px >= qpX || py < 0 || py >= qpY) {
            gameOver = true;
            return;
        }

        // Verifica colisão com as paredes
        for (let wall of walls) {
            if (px === wall.x && py === wall.y) {
                gameOver = true;
                return;
            }
        }

        // Verifica colisão com o corpo da cobra
        for (let segment of trail) {
            if (px === segment.x && py === segment.y) {
                gameOver = true;
                return;
            }
        }
    }

    function displayScores() {
        ctx.fillStyle = "white";
        ctx.font = "20px Sans-Serif";
        ctx.textAlign = "left";
        ctx.fillText(" Record: " + recordAtual, stage.width / 20 - 50, stage.height - 10);
        ctx.fillText("New Recod: " + recordSalvo, stage.width / 2 + 565, stage.height - 10);
    }

    // Função principal do jogo
    function game() {
        if (gameOver) {
            if (!showGameOver) {
                ctx.fillStyle = "white";
                ctx.font = "100px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Game Over", stage.width / 2 - 50, stage.height / 2);
                showGameOver = true;

                if (recordAtual > recordSalvo) {
                    recordSalvo = recordAtual;
                    localStorage.setItem('recordSalvo', recordSalvo); // Salva no localStorage
                }
            }

            if (!showRestartMessage) {
                ctx.fillStyle = "white";
                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                ctx.fillText("Pressione Enter para Continuar ou S para sair! ", stage.width / 2 - 50, stage.height / 2 + 50);
                showRestartMessage = true;
            }
            clearInterval(gameInterval);
            return;
        }

        px += vx;
        py += vy;

        // Limpa o canvas
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Verifica colisões (bordas, paredes, corpo)
        checkCollision();

        // Desenha a maçã
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ax * lp + lp / 2, ay * tp + tp / 2, lp / 2, 0, Math.PI * 2);
        ctx.fill();

        // Desenha paredes
        ctx.fillStyle = "blue";
        for (let i = 0; i < walls.length; i++) {
            ctx.fillRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
        }

        // Desenha a cobrinha
        ctx.fillStyle = "#FF4500"; // Cor da cabeça
        ctx.fillRect(px * lp, py * tp, lp, tp);
        ctx.fillStyle = snakeColor; // Cor do corpo
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * lp, trail[i].y * tp, lp, tp);
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift(); // Mantém o comprimento da cobra
        }

        // Verifica se a cobra comeu a comida
        if (ax === px && ay === py) {
            tail++;
            applesEaten++;
            recordAtual = applesEaten * 100; // Atualiza o record atual
            generateApple();
            if (applesEaten >= 10 + (level - 1) * 5) {
                level++;
                clearInterval(gameInterval);
                backgroundColor = mapColors[(level - 1) % mapColors.length];
                generateWalls();
                gameInterval = setInterval(game, 180 - (level * 20));
                
            }
        }

        // Exibe o nível no rodapé
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("Fase " + level, stage.width / 2 - 50, stage.height - 10);
        displayScores();
    }

    function keyPush(e) {
        if (gameOver && e.key === 'Enter') {
            // Reinicia o jogo
            resetGame();
        } else if (gameOver && e.key === 's') {
            // Volta ao index.html
            window.location.href = '../index.html';
        } else if (!gameOver) {
            switch (e.key) {
                case "ArrowLeft":
                    vx = -vel;
                    vy = 0;
                    break;
                case "ArrowUp":
                    vx = 0;
                    vy = -vel;
                    break;
                case "ArrowRight":
                    vx = vel;
                    vy = 0;
                    break;
                case "ArrowDown":
                    vx = 0;
                    vy = vel;
                    break;
            }
        }
    }

    function resetGame() {
        px = Math.floor(qpX / 2); // Centraliza a cobra no eixo X
        py = Math.floor(qpY / 2); // Centraliza a cobra no eixo Y
        vx = 0;
        vy = 1; // A cobrinha começa descendo
        tail = 5;
        applesEaten = 0;
        recordAtual = 0;
        gameOver = false;
        showGameOver = false;
        showRestartMessage = false;
        snakeColor = generateColor(); // Gera uma nova cor aleatória
        backgroundColor = mapColors[(level - 1) % mapColors.length]; // Atualiza a cor do mapa para a nova fase
        generateWalls();
        generateApple();
        trail = [];
        clearInterval(gameInterval);
        gameInterval = setInterval(game, 180 - (level * 20)); // Ajusta a velocidade de acordo com a fase
    }

    document.addEventListener("keydown", keyPush);
    resetGame();
};