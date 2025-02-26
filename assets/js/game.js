var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');
const canvas = document.querySelector('canvas');
const botaoIniciar = document.querySelector('#botaoIniciar');
const startGame = document.getElementById('#startGame');
const stage =document.querySelectorI('canva');

const blockSize = 20;
let snake = [{ x: 9, y: 9 }];
let snakeDirection = 'RIGHT';
let apple = { x: Math.floor(Math.random() * canvas.width / blockSize), y: Math.floor(Math.random() * canvas.height / blockSize) };



// Carregar a imagem de fundo
const backgroundImage = new Image();
backgroundImage.src = "/assets/image/tela4.jpg"; // Substitua pelo caminho da sua imagem

  

// Ajustar o tamanho do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(); // Desenhe novamente após redimensionar
}

// Desenhar a imagem de fundo
function draw() {
    // Desenhar a imagem escalada
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Redimensionar canvas no carregamento da página e ao redimensionar a janela
window.addEventListener("load", () => {
    resizeCanvas();
    backgroundImage.onload = draw; // Desenhar a imagem após ela ter sido carregada
});
window.addEventListener("resize", resizeCanvas);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobra
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
        ctx.strokeRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });

    // Desenhar a maçã
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
}


function update() {
    const head = { ...snake[0] };

    if (snakeDirection === 'LEFT') head.x--;
    if (snakeDirection === 'RIGHT') head.x++;
    if (snakeDirection === 'UP') head.y--;
    if (snakeDirection === 'DOWN') head.y++;

    // Colisão com a maçã
    if (head.x === apple.x && head.y === apple.y) {
        snake.unshift(head);
        apple = { x: Math.floor(Math.random() * canvas.width / blockSize), y: Math.floor(Math.random() * canvas.height / blockSize) };
    } else {
        snake.unshift(head);
        snake.pop();
    }

    // Verificar colisão com as bordas
    if (head.x < 0 || head.x >= canvas.width / blockSize || head.y < 0 || head.y >= canvas.height / blockSize) {
        alert("Game Over!");
        resetGame();
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

// Função para exibir a tela de Game Over com os botões
function showGameOverScreen() {
    // Esconde a tela de jogo
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "block"; // Exibe a tela de game over
    document.getElementById('stage').style.display = 'none';
    
    // Exibe a tela de Game Over
    document.getElementById('game-over-screen').style.display = 'block';
  
    // Adiciona a funcionalidade aos botões
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('back-to-home-button').addEventListener('click', goToHomePage);
  }
  
  // Função para reiniciar o jogo
  function restartGame() {
    // Aqui você pode reiniciar o estado do jogo, como reiniciar o canvas, pontuação, etc.
    document.getElementById('game-canvas').style.display = 'block'; // Mostrar novamente o canvas
    document.getElementById('game-over-screen').style.display = 'none'; // Esconder a tela de game over
    
    // Aqui você pode chamar a função que reinicia o jogo
    startGame();
  }
  
  // Função para voltar à página principal
  function goToHomePage() {
    window.location.href = '/assets/html/index.html'; // Substitua com a URL da sua página inicial
  }
  
// Adiciona o evento de toque ao canvas
stage.addEventListener("touchstart", handleTouch);


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
    window.location.href = '/assets/html/index.html'; // Alterar para o link da sua página inicial
}

function resetGame() {
    snake = [{ x: 9, y: 9 }];
    snakeDirection = 'RIGHT';
    apple = { x: Math.floor(Math.random() * canvas.width / blockSize), y: Math.floor(Math.random() * canvas.height / blockSize) };
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

// Função de toque
function handleTouch(event) {
    event.preventDefault();
    const touch = event.touches ? event.touches[0] : event; // Se for um toque, pega o primeiro toque; se for mouse, usa o evento diretamente.
    const touchX = touch.clientX - stage.offsetLeft;
    const touchY = touch.clientY - stage.offsetTop;
    const snakeHead = snake[0];

    // Lógica de direção com base na posição do toque
    if (touchX < snakeHead.x * blockSize) {
        if (snakeDirection !== 'RIGHT') snakeDirection = 'LEFT';
    } else {
        if (snakeDirection !== 'LEFT') snakeDirection = 'RIGHT';
    }
    if (touchY < snakeHead.y * blockSize) {
        if (snakeDirection !== 'DOWN') snakeDirection = 'UP';
    } else {
        if (snakeDirection !== 'UP') snakeDirection = 'DOWN';
    }
}
// Adicionando eventos de toque
canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("mousedown", handleTouch);
// Iniciar o loop do jogo
gameLoop();

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
  // Seleciona o elemento canvas para o modo tela cheia


// Função para iniciar o jogo e ativar tela cheia
function iniciarJogoTelaCheia() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) { // Firefox
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari e Opera
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) { // IE/Edge
    canvas.msRequestFullscreen();
  }

  // Chama a função de inicialização do jogo (substitua pela função real)
  iniciarLogicaDoJogo();
}

// Função de exemplo para iniciar a lógica do jogo
function iniciarLogicaDoJogo() {
  console.log("Jogo iniciado!");
  // Aqui você colocaria o código para iniciar o seu jogo
}

// Evento para iniciar o jogo automaticamente em tela cheia ao carregar a página
window.addEventListener('load', iniciarJogoTelaCheia);

// Função para mostrar a tela de Game Over
function showGameOverScreen() {
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "block"; // Exibe a tela de Game Over

    // Ações para os botões
    const restartButton = document.getElementById("restart-button");
    const homeButton = document.getElementById("back-to-home-button");

    // Botão Reiniciar
    restartButton.addEventListener("click", () => location.reload());

    // Botão Voltar ao Início
    homeButton.addEventListener("click", () => {
        window.location.href = "/index.html";
    });
}

// Detecta se é um dispositivo móvel e ajusta os controles conforme necessário
function showMobileControls(stage, lp) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Exibe a tela de Game Over com controles específicos
        showGameOverScreen();
    } else {
        // Exibe a mensagem de texto para desktop
        const ctx = stage.getContext("2d");
        ctx.fillStyle = "white";
        ctx.font = `${lp / 4} 17px Sans-Serif`; // Tamanho responsivo
        ctx.textAlign = "center";
        ctx.fillText("Pressione Enter para Continuar ou S para sair!", stage.width / 2 - 2, stage.height / 2 + 50);
    }
}

// Exemplo de uso da função para exibir os controles ao final do jogo
let showRestartMessage = false;
if (!showRestartMessage) {
    showMobileControls(stage, lp);
    showRestartMessage = true;
}
