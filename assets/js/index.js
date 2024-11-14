window.onload = function () {
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");

    // Variáveis de controle

    let highScores = JSON.parse(localStorage.getItem("highScores")) || []; // Lista de recordes
    var finalizarJogo;
    var restartButton;
    var homeButton;
    var botaoIniciar = document.getElementById('botaoIniciar');
    const vel = 1; // Velocidade da cobra
    var vx = 0, vy = 1; // Direção inicial (cobrinha começa descendo)
    var px, py; // Posição inicial da cobrinha
    var lp, tp, qpX, qpY; // Tamanhos de bloco e quantidades no canvas
    var ax, ay; // Posição da maçã
    var trail = []; // Rastro da cobrinha
    var tail = 5; // Comprimento inicial da cobrinha
    var gameOver = false; // Controle de estado do jogo
    var exibirRecord = false;
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
    var mapColors = [" rondown", "#2E8B57", "#8FBC8F", "#FF4500", "#6A5ACD", "#4682B4"]; // Cores do mapa por fase

    // Sons do jogo
    var backgroundMusic = new Audio('/asset/audio/fundo.mp3');
    var moveSound = new Audio('/assets/audio/move.mp3');
    var eatSound = new Audio('/assets/audio/comida.mp3');
    var gameOverSound = new Audio('/assets/audio/gameover.mp3');
    var levelUpSound = new Audio('/assets/audio/levelup.mp3');
    var fundoTela = new Audio('/assets/audio/fundo.mp3');

    // Configurações de volume
    backgroundMusic.volume = 0.3; // volume baixo para a música de fundo
    moveSound.volume = 0.2; // volume normal para o som de movimento
    eatSound.volume = 0.3; // volume normal para o som de comer
    gameOverSound.volume = 0.3; // volume normal para o som de game over
    levelUpSound.volume = 0.3; // volume normal para o som de passar de fase
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

    function iniciarJogo() {
        console.log("Iniciando o jogo...");
        window.location.href = '/assets/html/index.html'; // Redireciona para a página do jogo
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

    function handleTouch(event) {
        event.preventDefault();
        const touch = event.touches ? event.touches[0] : event; // Detecta o toque ou clique
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Define a direção com base no toque: esquerda, direita, cima ou baixo
        if (touchX < window.innerWidth / 2 && vx === 0) {
            vx = -1; vy = 0; // Esquerda
        } else if (touchX > window.innerWidth / 2 && vx === 0) {
            vx = 1; vy = 0; // Direita
        } else if (touchY < window.innerHeight / 2 && vy === 0) {
            vx = 0; vy = -1; // Cima
        } else if (touchY > window.innerHeight / 2 && vy === 0) {
            vx = 0; vy = 1; // Baixo
        }
    }

    // Adiciona o evento de toque ao canvas
    stage.addEventListener("touchstart", handleTouch);


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

    function ajustarCanvas() {
        let largura = window.innerWidth * 0.9;
        let altura = Math.min(window.innerHeight * 0.9, 800); // Limita a altura a 800px

        // Aplicando diferentes limites com base na largura da tela
        if (window.innerWidth <= 600) { // Smartphones
            altura = Math.min(window.innerHeight * 0.9, 500);
        } else if (window.innerWidth <= 1023) { // Tablets
            altura = Math.min(window.innerHeight * 0.9, 600);
        }

        canvas.width = largura;
        canvas.height = altura;
    }

    // Evento para redimensionar o canvas ao carregar e ao redimensionar a tela
    window.addEventListener('load', ajustarCanvas);
    window.addEventListener('resize', ajustarCanvas);
    window.addEventListener("orientationchange", ajustarCanvas); // Captura a mudança de orientação
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
        ctx.font = `${lp / 4} 15px Sans-Serif`; // Tamanho responsivo
        ctx.textAlign = "left";
        ctx.fillText(" Record: " + recordAtual, stage.width - lp / 20, stage.height - 10);
        ctx.fillText("New Record: " + recordSalvo, stage.width - lp / 20, stage.height - 10);


    }

    let isMoving = false; // Variável de controle para o som de movimento

    function displayScores() {
        ctx.fillStyle = "white";
        ctx.font = `${lp / 4} 15px Sans-Serif`; // Tamanho responsivo
        ctx.textAlign = "left";
        ctx.fillText("Record: " + recordAtual, - lp / 20, stage.height - 10);
        ctx.textAlign = "right"; // Alinhamento à direita para o novo recorde
        ctx.fillText("New Record: " + recordSalvo, stage.width - lp / 20, stage.height - 10);



    }



    function game() {
        if (gameOver) {
            if (!showGameOver) {
                ctx.fillStyle = "white";
                ctx.font = `${lp / 4} 40px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.fillText("Game Over", stage.width / 2 - 50, stage.height / 2);
                showGameOver = true;

                if (recordAtual > recordSalvo) {
                    recordSalvo = recordAtual;
                    localStorage.setItem('recordSalvo', recordSalvo);



                }


                gameOverSound.play();
            }
            showGameOverScreen();


            if (!showRestartMessage) {
                ctx.fillStyle = "white";
                ctx.font = `${lp / 4} 17px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.fillText("Pressione Enter para Continuar ou S para sair!", stage.width / 2 - 2, stage.height / 2 + 50);
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

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Desenha o fundo do mapa com bordas pixeladas
        for (let x = 0; x < qpX; x++) {
            for (let y = 0; y < qpY; y++) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x * lp, y * tp, lp, tp); // Preenche cada célula do mapa

                ctx.strokeStyle = "darkgray"; // Cor da borda das células
                ctx.lineWidth = 1;
                //ctx.strokeRect(x * lp, y * tp, lp, tp); // Desenha a borda de cada célula
            }
        }

        checkCollision();
        if (px < 0 || px >= qpX || py < 0 || py >= qpY) {
            gameOver = true;
        }

        let appleColor = "red";
        let headColor = "#FF4500";

        if (backgroundColor === "red") {
            appleColor = "yellow";
            headColor = "blue";
        }

        // Desenha a maçã com borda
        ctx.fillStyle = appleColor;
        ctx.beginPath();
        ctx.arc(ax * lp + lp / 2, ay * tp + tp / 2, lp / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Desenha as paredes com bordas
        ctx.fillStyle = "blue";
        for (let i = 0; i < walls.length; i++) {
            ctx.fillRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
            ctx.strokeStyle = "darkgray";
            ctx.strokeRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
            if (px === walls[i].x && py === walls[i].y) {
                gameOver = true;
            }
        }

        // Desenha a cobrinha com bordas
        ctx.fillStyle = headColor;
        ctx.fillRect(px * lp, py * tp, lp, tp);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(px * lp, py * tp, lp, tp);

        ctx.fillStyle = snakeColor;
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * lp, trail[i].y * tp, lp, tp);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeRect(trail[i].x * lp, trail[i].y * tp, lp, tp);
        }

        for (let i = 0; i < trail.length; i++) {
            if (trail[i].x === px && trail[i].y === py) {
                gameOver = true;
                break;
            }
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        if (ax === px && ay === py) {
            tail++;
            applesEaten++;
            recordAtual = applesEaten * 100;
            eatSound.play();
            generateApple();

            if (applesEaten >= 10 + (level - 1) * 20) {
                level++;
                levelUpSound.play();
                clearInterval(gameInterval);
                backgroundColor = mapColors[(level - 1) % mapColors.length];
                ctx.fillStyle = "white";
                ctx.font = `${lp / 4} 25px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.fillText("Parabéns! Você passou de fase!", stage.width / 2, stage.height / 2);
                setTimeout(() => {
                    generateWalls();
                    gameInterval = setInterval(game, Math.max(50, 185 - (level * 10)));
                }, 2000);
                levelUpSound.play();
            }

            if (gameOver) {
                if (recordAtual > recordSalvo) {
                    recordSalvo = recordAtual;
                    localStorage.setItem('recordSalvo', recordSalvo);


                }


            }


        }
        // Inicialize o array de recordes do localStorage ou crie um novo
        // Variáveis de recorde



        //AQUI A LISTA DE RECOR APARECE MAIS ANTES DO JOGO 


        // Inicialize o array de recordes com objetos que armazenam nome e pontuação

        // Função para atualizar os recordes ao final do jogo


        // Função para exibir a lista de recordes na tela


        // Exemplo de uso no gameOver

        // Verifica se bateu o recorde mais alto
        // Inicialize o array de recordes do localStorage ou crie um novo

        // Função para atualizar os recordes ao final do jogo


        //AQUI A LISTA DE RECOR APARECE MAIS ANTES DO JOGO 


        ctx.fillStyle = "white";
        ctx.font = `${lp / 4} 17px Sans-Serif`;
        ctx.fillText("Fase " + level, stage.width / 2 - 10, stage.height - 10);
        displayScores();
        displayLevel();

    }
    // Definindo variáveis globais


    // Função principal de game over


    // Verifica se o jogador quebrou o recorde



    // Função para salvar o novo recorde com iniciais






    // Executa quando a página carrega para exibir recordes previamente salvos




    //===========================================================================//
    function showGameOverScreen() {
        // Esconde a tela de jogo
        const gameOverScreen = document.getElementById("game-over-screen");
        gameOverScreen.style.display = "block"; // Exibe a tela de game over
        document.getElementById('stage').style.display = 'none';

        // Exibe a tela de Game Over
        const restartButton = document.getElementById("restart-button");
        const homeButton = document.getElementById("back-to-home-button");

        document.getElementById('game-over-screen').style.display = 'block';
        restartButton.addEventListener("click", () => location.reload());
        // Adiciona a funcionalidade aos botões
        document.getElementById('restart-button').addEventListener('click', restartGame);
        document.getElementById('back-to-home-button').addEventListener('click', goToHomePage);
        homeButton.addEventListener("click", () => {
            window.location.href = "/index.html";
        });


    }

    //========================================================//


    // Exemplo de uso da função para exibir os controles ao final do jogo
    //================================================================


    function showMobileControls(stage, lp) {
        // Verifica se o dispositivo é móvel
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Cria o botão "Reiniciar Jogo"
            showGameOverScreen();
            const restartButton = document.createElement("restart-button");
            restartButton.innerText = "Reiniciar Jogo";
            restartButton.style.position = "absolute";
            restartButton.style.top = `${stage.height / 2 - 20}px`;
            restartButton.style.left = `${stage.width / 2 - 60}px`;
            restartButton.style.padding = "10px";
            restartButton.style.fontSize = "16px";
            restartButton.style.display = "none"; // Inicialmente escondido
            document.body.appendChild(restartButton);
            restartButton.addEventListener("click", () => location.reload());
            // Cria o botão "Voltar ao Início"


            const homeButton = document.createElement("homeButton");
            homeButton.innerText = "Voltar ao Início";
            homeButton.style.position = "absolute";
            homeButton.style.top = `${stage.height / 2 + 40}px`;
            homeButton.style.left = `${stage.width / 2 - 60}px`;
            homeButton.style.padding = "10px";
            homeButton.style.fontSize = "16px";
            restartButton.style.display = "none"; // Inicialmente escondido
            // Adiciona ações aos botões
            document.body.appendChild(homeButton);

            homeButton.addEventListener("click", () => {
                window.location.href = "/index.html";
            });

            // Adiciona os botões ao corpo do documento
            document.body.appendChild(restartButton);
            document.body.appendChild(homeButton);
        } else {
            // Exibe a mensagem de texto para desktop
            const ctx = stage.getContext("2d");
            ctx.fillStyle = "white";
            ctx.font = `${lp / 4} 17px Sans-Serif`; // Tamanho responsivo
            ctx.textAlign = "center"; // Alinha o texto ao centro
            ctx.fillText("Pressione Enter para Continuar ou S para sair!", stage.width / 2 - 2, stage.height / 2 + 50);
        }

    }



    //================================================================

    //========================================================//



    // Controle de teclado
    document.addEventListener("keydown", function (e) {
        if (gameOver) {
            if (e.key === "Se precisar colocar a lentra enter aqui") {
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

        function handleTouch(event) {
            event.preventDefault(); // Previne o comportamento padrão
            const touch = event.touches[0];
            const snakeHead = { x: px, y: py }; // Posição da cabeça da cobrinha

            // Lógica de direção com base na posição do toque
            if (touch.clientX < snakeHead.x * lp) {
                if (vx === 0) { vx = -vel; vy = 0; } // Mover para a esquerda
            } else {
                if (vx === 0) { vx = vel; vy = 0; } // Mover para a direita
            }
            if (touch.clientY < snakeHead.y * tp) {
                if (vy === 0) { vx = 0; vy = -vel; } // Mover para cima
            } else {
                if (vy === 0) { vx = 0; vy = vel; } // Mover para baixo
            }
        }

        // Adiciona evento de toque ao canvas

    });

    function enterFullscreen() {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) { // Firefox
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) { // Chrome e Safari
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { // IE/Edge
            canvas.msRequestFullscreen();
        }
    }

    // Chamando a função para ativar a tela cheia
    enterFullscreen();
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
        gameInterval = setInterval(game, 185); // Reinicia o intervalo do jogo
        snakeColor = generateColor(); // Gera nova cor para a cobrinha
    }

    // Inicia o jogo
    resetGame();


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        // Estilo do texto
        ctx.fillStyle = "white";
        ctx.font = `${lp / 4} 25px Sans-Serif`; // Tamanho responsivo
        ctx.textAlign = "center"; // Centraliza o texto
        // Renderiza as mensagens no canvas
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); s
        ctx.fillText("  Record: " + recordAtual, canvas.width / 4, canvas.height - 30);
        ctx.fillText("  New Record: " + recordSalvo, (canvas.width / 4) * 3, canvas.height - 30);
    }

    // Chame a função draw para renderizar o texto
    draw();

    window.addEventListener('resize', () => {
        // Ajustar o tamanho do canvas ao redimensionar a janela
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        draw(); // Redesenhar o canvas

    });

    botaoIniciar.addEventListener('click', () => {
        // Executa a função que inicia o jogo
        iniciarJogo();
    });

    // Função para reiniciar o jogo
    function restartGame() {
        // Aqui você pode reiniciar o estado do jogo, como reiniciar o canvas, pontuação, etc.
        document.getElementById('game-canvas').style.display = 'block'; // Mostrar novamente o canvas
        document.getElementById('game-over-screen').style.display = 'none'; // Esconder a tela de game over

        // Aqui você pode chamar a função que reinicia o jogo
        startGame();
    }




    function addGameOverButtonEvents() {
        // Obtem os botões de reiniciar e voltar
        const restartButton = document.getElementById('restart-button');
        const backButton = document.getElementById('back-button');

        // Adiciona evento de clique para o botão de reiniciar
        restartButton.addEventListener('click', restartGame);

        // Adiciona evento de clique para o botão de voltar
        backButton.addEventListener('click', goToHomePage);

        // Para dispositivos móveis, também adicionamos eventos de toque
        restartButton.addEventListener('touchstart', restartGame);
        backButton.addEventListener('touchstart', goToHomePage);
    }

    function restartGame() {
        // Lógica para reiniciar o jogo
        location.reload(); // Simplesmente recarrega a página (ou você pode resetar o estado do jogo aqui)
    }

    function goToHomePage() {
        // Lógica para voltar à página inicial
        window.location.href = '/index.html'; // Alterar para o link da sua página inicial
    }
    // Função para voltar à página principal
    function goToHomePage() {
        window.location.href = '/index.html'; // Substitua com a URL da sua página inicial
    }


    // Chama a função para exibir os recordes ao carregar a página

    // Chama a função para exibir os recordes ao carregar a página

};

canvas.addEventListener("touchstart", handleTouch);
document.addEventListener("DOMContentLoaded", exibirRecordes);
document.addEventListener("DOMContentLoaded", recordSalvo)



