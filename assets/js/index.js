window.onload = function () {
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");

    // Variáveis de controle
    const vel = 1; // Velocidade da cobra
    var vx = 0, vy = 1; // Direção inicial (cobrinha começa descendo)
    var px, py; // Posição inicial da cobrinha
    var lp, tp, qpX, qpY; // Tamanhos de bloco e quantidades no canvas
    var ax, ay; // Posição da maçã
    var trail = []; // Rastro da cobrinha
    var tail = 5; // Comprimento inicial da cobrinha
    var gameOver = false; // Controle de estado do jogo
    var level = 1; // Nível inicial
    var applesEaten = 0; // Contagem de maçãs comidas
    var walls = []; // Array para as paredes
    var showGameOver = false; // Controle para exibir "Game Over"
    var showRestartMessage = false; // Controle para exibir mensagem de reinício
    var recordAtual = 0; // Recorde atual
    var recordSalvo = localStorage.getItem('recordSalvo') ? parseInt(localStorage.getItem('recordSalvo')) : 0; // Recorde salvo
    var gameInterval; // Intervalo do jogo
    var snakeColor = generateColor(); // Cor inicial da cobrinha
    var backgroundColor = "black"; // Cor de fundo do jogo
    var mapColors = ["#2E8B57", "#8FBC8F", "#FF4500", "#6A5ACD", "#4682B4"]; // Cores do mapa por fase

    // Sons do jogo
    var backgroundMusic = new Audio('/asset/audio/fundo.mp3');
    var moveSound = new Audio('/assets/audio/move.mp3');
    var eatSound = new Audio('/assets/audio/comida.mp3');
    var gameOverSound = new Audio('/assets/audio/gameover.mp3');
    var levelUpSound = new Audio('/assets/audio/levelup.mp3');
    var fundoTela = new Audio('/assets/audio/fundo.mp3');

    // Configurações de volume
    backgroundMusic.volume = 0.3; // volume baixo para a música de fundo
    moveSound.volume = 1.0; // volume normal para o som de movimento
    eatSound.volume = 1.0; // volume normal para o som de comer
    gameOverSound.volume = 1.0; // volume normal para o som de game over
    levelUpSound.volume = 1.0; // volume normal para o som de passar de fase
    fundoTela.volume = 0.3; // volume normal para o som de fundo da tela 

    // Tocar música de fundo
    backgroundMusic.loop = true; // Repetir a música de fundo
    backgroundMusic.play();
    fundoTela.loop = true;
    fundoTela.play();



    // Função para redimensionar o canvas
    function resizeCanvas() {
        stage.width = window.innerWidth;
        stage.height = window.innerHeight;// Ajuste dos blocos para o novo tamanho
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
    // Função para gerar paredes em posições aleatórias
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

    // Função para verificar se a maçã está em cima da cobra ou das paredes
    function isAppleOnSnakeOrWall() {
        return trail.some(segment => segment.x === ax && segment.y === ay) || walls.some(wall => wall.x === ax && wall.y === ay);
    }

    // Função para gerar a maçã
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


    // Função para exibir os scores na tela
    function displayScores() {
        ctx.fillStyle = "white";
        ctx.font = "20px Sans-Serif";
        ctx.textAlign = "left";
        ctx.fillText(" Record: " + recordAtual, stage.width / 20 - 50, stage.height - 10);
        ctx.fillText("New Record: " + recordSalvo, stage.width / 2 + 565, stage.height - 10);
    }

    let isMoving = false; // Variável de controle para o som de movimento


    // Função principal do jogo
    function game() {
        if (gameOver) {
            if (!showGameOver) {
                // Exibe "Game Over" no centro do mapa
                ctx.fillStyle = "white";
                ctx.font = "100px sans-serif";
                ctx.textAlign = "center"; // Alinha o texto ao centro
                ctx.fillText("Game Over", stage.width / 2 - 50, stage.height / 2);
                showGameOver = true;

                if (recordAtual > recordSalvo) {
                    recordSalvo = recordAtual;
                    localStorage.setItem('recordSalvo', recordSalvo); // Salva no localStorage
                }

                gameOverSound.play(); // Toca som de game over
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
        if (vx !== 0 || vy !== 0) {
            moveSound.play();
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);//colisão com bordas
        checkCollision();
        if (px < 0 || px >= qpX || py < 0 || py >= qpY) {
            gameOver = true;
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
        // Desenha a maçã
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ax * lp + lp / 2, ay * tp + tp / 2, lp / 2, 0, Math.PI * 2);
        ctx.fill();

        // Desenha paredes
        ctx.fillStyle = "blue";
        for (let i = 0; i < walls.length; i++) {
            ctx.fillRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
            if (px === walls[i].x && py === walls[i].y) {
                gameOver = true;
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
                gameOver = true;
                break; // Adicionado break para sair do loop após a colisão
            }
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();//Mantém o comprimento da cobra
        }

        // Verifica se a cobra comeu a comida
        if (ax === px && ay === py) {
            tail++;
            applesEaten++;
            recordAtual = applesEaten * 100; // Atualiza o record atual
            eatSound.play(); // Toca som de comer
            generateApple();
            // Gera uma nova posição para a comida

            // Verifica se passou de fase
            if (applesEaten >= 10 + (level - 1) * 5) { // Aumenta a contagem de maçãs conforme o nível
                level++;//cont == cont+ level
                levelUpSound.play(); // Toca som de nível
                clearInterval(gameInterval); // Pausa temporária no jogo
                backgroundColor = mapColors[(level - 1) % mapColors.length]; // Muda a cor do mapa
                ctx.fillStyle = "white";
                ctx.font = "50px Arial";
                ctx.textAlign = "center";
                ctx.fillText("Parabens Você passou de fase!", stage.width / 2, stage.height / 2);
                setTimeout(() => {
                    generateWalls();
                    gameInterval = setInterval(game, 180 - (level * 20));
                }, 2000); // Aumenta a velocidade
                levelUpSoun.play();
            }

            if (gameOver)
                if (recordAtual > recordSalvo) {
                    recordSalvo = recordAtual;
                    localStorage.setItem('recordSalvo', recordSalvo);
                }
            // Desenha os scores
            displayScores();
            isMoving = false; // Reseta a variável de movimento

        }

        // Exibe o nível no rodapé
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("Fase " + level, stage.width / 2 - 50, stage.height - 10);
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("Fase " + level, stage.width / 2 - 50, stage.height - 10);
        displayScores(); // Chama a função para exibir os scores
        displayLevel(); // Chama a função para exibir o nível apenas se o jogo estiver ativo
    }

    // Controle de teclado
    document.addEventListener("keydown", function (e) {
        if (gameOver) {
            if (e.key === "Enter") {
                resetGame();
            } else if (e.key === "s" || e.key === "S") {
                window.location.href = "/index.html"; // Redireciona para a página inicial
            }
            return;
        }

        if (e.key === "ArrowUp" && vy !== 1) {
            vx = 0;
            vy = -1; // Mover para cima
            if (!isMoving) {
                moveSound.play(); // Toca som de movimento

            }
        } else if (e.key === "ArrowDown" && vy !== -1) {
            vx = 0;
            vy = 1; // Mover para baixo
            if (!isMoving) {
                moveSound.play(); // Toca som de movimento

            }
        } else if (e.key === "ArrowLeft" && vx !== 1) {
            vx = -1;
            vy = 0; // Mover para a esquerda
            if (!isMoving) {
                moveSound.play(); // Toca som de movimento

            }
        } else if (e.key === "ArrowRight" && vx !== -1) {
            vx = 1;
            vy = 0; // Mover para a direita
            if (!isMoving) {
                moveSound.play(); // Toca som de movimento

            }
        }
    });

    // Função para reiniciar o jogo
    function resetGame() {
        gameOver = false;
        showGameOver = false; // Reseta a exibição do game over
        showRestartMessage = false; // Reseta a mensagem de reinício
        px = Math.floor(qpX / 2); // Inicia a cobrinha no centro
        py = Math.floor(qpY / 2);
        trail = []; // Limpa o rastro da cobrinha
        tail = 5; // Reseta o tamanho da cobrinha
        applesEaten = 0; // Reseta contagem de maçãs
        recordAtual = 0; // Reseta o recorde atual
        level = 1; // Reseta o nível
        generateWalls(); // Gera novas paredes
        generateApple(); // Gera nova maçã
        gameInterval = setInterval(game, 180); // Reinicia o intervalo do jogo
        snakeColor = generateColor(); // Gera nova cor para a cobrinha
    }

    // Inicia o jogo
    resetGame();
};
