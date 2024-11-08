var stage = document.getElementById("stage");
var ctx = stage.getContext("2d");


const canvas = document.querySelector('canvas');
const botaoIniciar = document.querySelector('#botaoIniciar');
const startGame = document.getElementById('#startGame');
var stage =document.querySelectorI('canva');

// Captura das áreas de toque
const toqueCima = document.getElementById("toqueCima");
const toqueBaixo = document.getElementById("toqueBaixo");
const toqueEsquerda = document.getElementById("toqueEsquerda");
const toqueDireita = document.getElementById("toqueDireita");
let direcao = 'baixo'; // Direção inicial da cobra
// Adiciona eventos de toque



MenuItens.style.maxHeight = "0px";



function moverCobra(novaDirecao) {
    // Verifica se a nova direção não é oposta à direção atual
    if ((direcao === 'cima' && novaDirecao !== 'baixo') || 
        (direcao === 'baixo' && novaDirecao !== 'cima') || 
        (direcao === 'esquerda' && novaDirecao !== 'direita') || 
        (direcao === 'direita' && novaDirecao !== 'esquerda')) {
        
        direcao = novaDirecao; // Atualiza a direção
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
// Adiciona o evento de toque ao canvas
stage.addEventListener("touchstart", handleTouch);


toqueCima.addEventListener("click", () => moverCobra('cima'));
toqueBaixo.addEventListener("click", () => moverCobra('baixo'));
toqueEsquerda.addEventListener("click", () => moverCobra('esquerda'));
toqueDireita.addEventListener("click", () => moverCobra('direita'));
// Adicionando eventos de toque às áreas de toque
document.getElementById("toqueCima").onclick = function() {
    moverCobra('cima');
};

document.getElementById("toqueBaixo").onclick = function() {
    moverCobra('baixo');
};

document.getElementById("toqueEsquerda").onclick = function() {
    moverCobra('esquerda');
};

document.getElementById("toqueDireita").onclick = function() {
    moverCobra('direita');
};
document.getElementById("up").onclick = function() {
    if (vy === 0) { // não pode ir para cima se já estiver movendo para baixo
        vx = 0; 
        vy = -1; 
    }
};

document.getElementById("down").onclick = function() {
    if (vy === 0) { // não pode ir para baixo se já estiver movendo para cima
        vx = 0; 
        vy = 1; 
    }
};

document.getElementById("left").onclick = function() {
    if (vx === 0) { // não pode ir para a esquerda se já estiver movendo para a direita
        vx = -1; 
        vy = 0; 
    }
};

document.getElementById("right").onclick = function() {
    if (vx === 0) { // não pode ir para a direita se já estiver movendo para a esquerda
        vx = 1; 
        vy = 0; 
    }
};

// Função para lidar com o toque na tela
function handleTouch(event) {
    // Previne o comportamento padrão de rolagem
    event.preventDefault();
    
    // Obtém a posição do toque
    const touch = event.touches[0];
    
    // Calcula a posição do toque em relação à área de jogo
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Obtém a posição da cobrinha (assumindo que snake é um array com as coordenadas)
    const snakeHead = snake[0]; // A cabeça da cobrinha é a primeira parte do array

    // Calcula a direção com base na posição do toque
    if (touchX < snakeHead.x * blockSize) {
        // Toque à esquerda da cobrinha
        if (snakeDirection !== 'RIGHT') {
            snakeDirection = 'LEFT';
        }
    } else {
        // Toque à direita da cobrinha
        if (snakeDirection !== 'LEFT') {
            snakeDirection = 'RIGHT';
        }
    }

    if (touchY < snakeHead.y * blockSize) {
        // Toque acima da cobrinha
        if (snakeDirection !== 'DOWN') {
            snakeDirection = 'UP';
        }
    } else {
        // Toque abaixo da cobrinha
        if (snakeDirection !== 'UP') {
            snakeDirection = 'DOWN';
        }
    }
}

// Função para exibir a tela de Game Over com os botões
function showGameOverScreen() {
    // Esconde a tela de jogo
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
    window.location.href = '/asets/html/index.html'; // Substitua com a URL da sua página inicial
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
    window.location.href = '/assets/html/index.html'; // Alterar para o link da sua página inicial
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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    desenharTexto(); // Redesenha o texto
}

// Desenha um texto no canvas
function desenharTexto() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    ctx.fillStyle = "white";
    ctx.font = `${canvas.width / 25}px Sans-Serif`;
    ctx.textAlign = "left";
    ctx.fillText("Record: 0", canvas.width / 20, canvas.height - 10);
    ctx.fillText("New Record: 100", canvas.width / 2, canvas.height - 10);
}

function ajustarLayout() {
    const larguraTela = window.innerWidth;

    // Exemplo de lógica para ajustar elementos
    const logo = document.querySelector('.logo');
    const menuCelular = document.querySelector('.menu-celular');

    if (larguraTela < 500) {
        // Ajustes para telas menores
        logo.style.Width = '100%'; // Ajuste a largura da logo
        menuCelular.style.display = 'block'; // Mostra o menu celular
    } else {
        // Ajustes para telas maiores
        logo.style.maxWidth = 'none'; // Remove a restrição de largura
        menuCelular.style.display = 'none'; // Esconde o menu celular
    }
}


canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("mousedown", handleTouch);
// Adiciona o evento de toque à área de jogo
const gameArea = document.getElementById('stage'); // Substitua pelo ID do seu elemento
gameArea.addEventListener('touchstart', handleTouch);
window.addEventListener('touchstart', handleTouch);
window.addEventListener("resize", resizeCanvas);

// Chama a função uma vez ao carregar a página
resizeCanvas();
// Chama a função no carregamento da página para garantir que o layout esteja correto
ajustarLayout();


