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
    var recordAtual =0;
    var recordSalvo = localStorage.getItem('recordSalvo') ? parseInt(localStorage.getItem('recordSalvo')) : 0;
    // Cores do jogo
    var snakeColor = generateColor(); // Cor inicial da cobrinha
    var backgroundColor = "black"; // Cor inicial do fundo do jogo
    var gameInterval; // Intervalo do jogo
    var mapColors = ["#2E8B57", "#8FBC8F", "#FF4500", "#6A5ACD", "#4682B4"]; // Cores do mapa por fase

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

    function checkCollision() {
        // Verifica se a cobra colidiu com as bordas do canvas
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
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Seu Record: " + recordAtual, stage.width / 20 - 50, stage.height - 10); // Alinha o "Seu Record" à direita
        ctx.fillText("New Recod: " + recordSalvo, stage.height  + 625,  700); // Alinha o "Record Salvo" logo abaixo
        
    }

    // Função para gerar a posição da maçã
    function generateApple() {
        ax = Math.floor(Math.random() * qpX);
        ay = Math.floor(Math.random() * qpY);
    }

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
        checkCollision();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Colisão com bordas
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
            generateApple();
            // Gera uma nova posição para a comida

            // Verifica se passou de fase
            if (applesEaten >= 10 + (level - 1) * 5) { // Aumenta a contagem de maçãs conforme o nível
                level++;//cont == cont+ level
                applesEaten = 0; // Reinicia a contagem de maçãs
                clearInterval(gameInterval); // Pausa temporária no jogo
                backgroundColor = mapColors[(level - 1) % mapColors.length]; // Muda a cor do mapa
                ctx.fillStyle = "white";
                ctx.font = "50px Arial";
                ctx.fillText("Parabens Você passou de fase!", stage.width / 2, stage.height / 2);
                generateWalls(Math.random); // Gera mais paredes
                gameInterval = setInterval(game, 180 - (level * 20)); // Aumenta a velocidade
                
            }
        
            if (gameOver) 
                if (recordAtual > recordSalvo) {
                    recordSalvo = recordAtual;
                    localStorage.setItem('recordSalvo', recordSalvo);
                }
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

    // Controle de movimento
    function keyPush(e) {
        if (gameOver && e.keyCode === 13) {
            resetGame();
            return;
        }
        if (gameOver && e.keyCode === 83) { // 83 é o código da tecla "S"
            window.location.href = '../index.html'; // Altere para o caminho correto da sua página inicial
            return;
        }

        if (!gameOver) {
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
        gameOver = false;
        applesEaten = 0;
        recordAtual =0; //Reseta o record autal
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
        showGameOver = false; // Reinicia o controle de exibição de "Game Over"
        showRestartMessage = false; // Reinicia o controle da mensagem de reinício

        
    }

    document.addEventListener("keydown", keyPush);
    resetGame();
};