window.onload = function () {
    var stage = document.getElementById("stage"); // Seleciona o elemento <canvas> pelo id "stage"
    var ctx = stage.getContext("2d"); // Define o contexto de desenho 2D no canvas

    // Variáveis de controle do jogo
    const vel = 1; // Velocidade da cobra
    var vx = 0, vy = 1; // Velocidade inicial, fazendo a cobra se mover para baixo
    var px, py; // Posição atual da cabeça da cobra
    var lp, tp, qpX, qpY; // Largura e altura dos blocos, e quantidade de blocos no eixo X e Y
    var ax, ay; // Posição da maçã
    var trail = []; // Array que contém o corpo da cobra
    var tail = 5; // Tamanho inicial da cobra
    var gameOver = false; // Variável para controlar se o jogo acabou
    var level = 1; // Nível atual do jogo
    var applesEaten = 0; // Contador de maçãs comidas
    var walls = []; // Array para armazenar as posições das paredes
    var showGameOver = false; // Controle para mostrar a mensagem de "Game Over"
    var showRestartMessage = false; // Controle para mostrar a mensagem de reinício
    var score = 0; // Pontuação atual do jogador
    var record = localStorage.getItem("record") || 0; // Armazena o recorde no localStorage

    // Define as cores usadas no jogo
    var snakeColor = generateColor(); // Cor inicial do corpo da cobra, gerada aleatoriamente
    var backgroundColor = "black"; // Cor inicial do fundo do jogo
    var gameInterval; // Intervalo que controla o loop do jogo
    var mapColors = ["#2E8B57", "#8FBC8F", "#FF4500", "#6A5ACD", "#4682B4"]; // Cores diferentes para cada nível

    // Função para redimensionar o canvas de acordo com o tamanho da janela
    function resizeCanvas() {
        stage.width = window.innerWidth; // Define a largura do canvas como a largura da janela
        stage.height = window.innerHeight; // Define a altura do canvas como a altura da janela

        // Ajusta o tamanho dos blocos em função do novo tamanho da janela
        lp = Math.floor(stage.width / 65); // Calcula a largura dos blocos
        tp = lp; // A altura dos blocos é igual à largura
        qpX = Math.floor(stage.width / lp); // Calcula quantos blocos cabem na largura da tela
        qpY = Math.floor(stage.height / tp); // Calcula quantos blocos cabem na altura da tela
    }

    resizeCanvas(); // Chama a função de redimensionamento ao carregar a página
    window.onresize = resizeCanvas; // Chama a função toda vez que a janela for redimensionada

    // Função que gera uma cor aleatória no formato hexadecimal
    function generateColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]; // Adiciona dígitos aleatórios à cor
        }
        return color; // Retorna a cor gerada
    }

    // Função para verificar se a posição é válida (não colide com o corpo da cobra ou as paredes)
    function isPositionValid(x, y) {
        // Verifica se a posição está sobre o corpo da cobra
        for (let i = 0; i < trail.length; i++) {
            if (trail[i].x === x && trail[i].y === y) return false;
        }

        // Verifica se a posição está sobre uma parede
        for (let i = 0; i < walls.length; i++) {
            if (walls[i].x === x && walls[i].y === y) return false;
        }

        // Verifica se a posição está fora dos limites do mapa
        if (x < 0 || x >= qpX || y < 0 || y >= qpY) return false;

        return true; // Se não colidir, a posição é válida
    }

    // Função que gera as paredes de forma aleatória
    function generateWalls() {
        walls = []; // Limpa as paredes antigas
        if (level === 1) return; // Sem paredes na primeira fase

        // Gera várias paredes horizontais e verticais conforme o nível
        for (let i = 0; i < level * 3; i++) {
            let wallLength = Math.floor(2 + Math.random() * 4); // Comprimento da parede
            let wallX = Math.floor(Math.random() * (qpX - wallLength)); // Posição inicial X
            let wallY = Math.floor(Math.random() * qpY); // Posição inicial Y

            // Cria uma parede horizontal
            for (let j = 0; j < wallLength; j++) {
                walls.push({ x: wallX + j, y: wallY });
            }

            // Gera uma parede vertical
            wallLength = Math.floor(2 + Math.random() * 4);
            wallX = Math.floor(Math.random() * qpX);
            wallY = Math.floor(Math.random() * (qpY - wallLength));
            for (let j = 0; j < wallLength; j++) {
                walls.push({ x: wallX, y: wallY + j });
            }
        }
    }

    // Função para gerar uma nova posição para a maçã
    function generateApple() {
        do {
            ax = Math.floor(Math.random() * qpX); // Gera uma posição X aleatória para a maçã
            ay = Math.floor(Math.random() * qpY); // Gera uma posição Y aleatória
        } while (!isPositionValid(ax, ay)); // Continua tentando até achar uma posição válida
    }

    // Função principal que controla o loop do jogo
    function game() {
        if (gameOver) { // Verifica se o jogo acabou
            if (!showGameOver) {
                // Exibe "Game Over" no centro da tela
                ctx.fillStyle = "white";
                ctx.font = "100px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Game Over", stage.width / 2 - 50, stage.height / 2);
                showGameOver = true;
            }

            // Exibe a mensagem de reinício
            if (!showRestartMessage) {
                ctx.fillStyle = "white";
                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                ctx.fillText("Pressione Enter para Continuar ou S para sair!", stage.width / 2 - 50, stage.height / 2 + 50);
                showRestartMessage = true;
            }

            clearInterval(gameInterval); // Pausa o loop do jogo
            return; // Sai da função, já que o jogo acabou
        }

        // Atualiza a posição da cabeça da cobra
        px += vx;
        py += vy;

        // Verifica se a cobra colidiu com as bordas
        if (px < 0 || px >= qpX || py < 0 || py >= qpY) {
            gameOver = true;
        }

        // Limpa o canvas, preenchendo com a cor de fundo atual
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Define as cores da maçã e da cabeça da cobra, ajustando se o fundo for vermelho
        let appleColor = "red";
        let headColor = "#FF4500"; // Laranja para a cabeça da cobra
        if (backgroundColor === "red") {
            appleColor = "yellow"; // Se o fundo for vermelho, a maçã será amarela
            headColor = "blue"; // A cabeça será azul
        }

        // Desenha a maçã como um círculo
        ctx.fillStyle = appleColor;
        ctx.beginPath();
        ctx.arc(ax * lp + lp / 2, ay * tp + tp / 2, lp / 2, 0, Math.PI * 2);
        ctx.fill();

        // Desenha as paredes em azul
        ctx.fillStyle = "blue";
        for (let i = 0; i < walls.length; i++) {
            ctx.fillRect(walls[i].x * lp, walls[i].y * tp, lp, tp);
            if (px === walls[i].x && py === walls[i].y) {
                gameOver = true; // Se a cobra colidir com uma parede, o jogo acaba
            }
        }

        // Desenha a cabeça da cobra
        ctx.fillStyle = headColor;
        ctx.fillRect(px * lp, py * tp, lp, tp);

        // Desenha o corpo da cobra
        ctx.fillStyle = snakeColor;
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * lp, trail[i].y * tp, lp, tp);
        }

        // Verifica se a cobra colidiu com o próprio corpo
        for (let i = 0; i < trail.length; i++) {
            if (trail[i].x === px && trail[i].y === py) {
                gameOver = true; // Se a posição da cabeça da cobra for a mesma de qualquer parte do corpo, o jogo acaba
            }
        }

        // Adiciona a nova posição da cabeça ao início do array do corpo
        trail.push({ x: px, y: py });

        // Limita o tamanho da cobra conforme o valor da variável 'tail'
        while (trail.length > tail) {
            trail.shift(); // Remove a parte mais antiga do corpo da cobra
        }

        // Verifica se a cobra comeu a maçã
        if (ax === px && ay === py) {
            tail++; // Aumenta o tamanho da cobra
            applesEaten++; // Incrementa o contador de maçãs comidas
            score++; // Incrementa a pontuação
            generateApple(); // Gera uma nova maçã em uma posição válida
        }

        // Verifica se o jogador atingiu o número de maçãs necessárias para passar de fase
        if (applesEaten === 15) {
            applesEaten = 0; // Reseta o contador de maçãs
            level++; // Avança para o próximo nível
            tail = 5; // Reseta o tamanho da cobra
            generateWalls(); // Gera novas paredes
            backgroundColor = mapColors[level - 1] || mapColors[mapColors.length - 1]; // Altera a cor do fundo
            snakeColor = generateColor(); // Gera uma nova cor para a cobra
            clearInterval(gameInterval); // Pausa o jogo

            // Exibe a mensagem "Você passou de fase"
            ctx.fillStyle = "white";
            ctx.font = "60px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Você passou de fase!", stage.width / 2, stage.height / 2);
            setTimeout(() => {
                gameInterval = setInterval(game, Math.max(200 - (level * 20), 50)); // Reinicia o jogo com uma velocidade maior
            }, 2000); // Pausa por 2 segundos antes de iniciar a nova fase
        }

        // Exibe o contador de "Score" no canto superior esquerdo
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 20, 40);

        // Exibe o recorde ("Seu Recorde") no canto superior direito
        ctx.fillText("Seu Recorde: " + record, stage.width - 150, 40);

        // Atualiza o recorde, se a pontuação atual for maior
        if (score > record) {
            record = score;
            localStorage.setItem("record", record); // Salva o novo recorde no localStorage
        }
    }

    // Função para resetar o jogo quando ele termina
    function resetGame() {
        px = Math.floor(qpX / 2); // Posição inicial da cobra no centro do canvas (X)
        py = Math.floor(qpY / 2); // Posição inicial da cobra no centro do canvas (Y)
        vx = 0; // A velocidade horizontal começa em 0
        vy = 1; // A velocidade vertical começa para baixo
        trail = []; // Limpa o corpo da cobra
        tail = 5; // Tamanho inicial da cobra
        applesEaten = 0; // Reseta o contador de maçãs comidas
        score = 0; // Reseta o placar
        level = 1; // Reseta o nível para o primeiro
        gameOver = false; // O jogo não está mais acabado
        showGameOver = false; // Oculta a mensagem de "Game Over"
        showRestartMessage = false; // Oculta a mensagem de reinício
        backgroundColor = "black"; // Restaura a cor de fundo para a fase inicial
        snakeColor = generateColor(); // Gera uma nova cor para a cobra
        generateApple(); // Gera uma nova maçã em uma posição válida
        generateWalls(); // Gera novas paredes
        gameInterval = setInterval(game, 200); // Reinicia o jogo com o intervalo padrão de 200ms
    }

    // Captura as teclas pressionadas e ajusta a direção da cobra
    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowLeft": // Mover para a esquerda
                if (vx === 0) {
                    vx = -vel; // Define a velocidade horizontal negativa
                    vy = 0; // Zera a velocidade vertical
                }
                break;
            case "ArrowUp": // Mover para cima
                if (vy === 0) {
                    vx = 0; // Zera a velocidade horizontal
                    vy = -vel; // Define a velocidade vertical negativa
                }
                break;
            case "ArrowRight": // Mover para a direita
                if (vx === 0) {
                    vx = vel; // Define a velocidade horizontal positiva
                    vy = 0; // Zera a velocidade vertical
                }
                break;
            case "ArrowDown": // Mover para baixo
                if (vy === 0) {
                    vx = 0; // Zera a velocidade horizontal
                    vy = vel; // Define a velocidade vertical positiva
                }
                break;
            case "Enter": // Reinicia o jogo
                if (gameOver) {
                    resetGame(); // Se o jogo acabou, reinicia o jogo
                }
                break;
            case "s": // Saída opcional
                if (gameOver) {
                    alert("Saindo do jogo!"); // Exibe um alerta ao pressionar 's'
                    window.close(); // Fecha a janela do navegador
                }
                break;
        }
    });

    // Função inicial de resetar o jogo
    resetGame(); // Chama o reset ao carregar o jogo
}
