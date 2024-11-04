
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");


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

// Chama a função no carregamento da página para garantir que o layout esteja correto
ajustarLayout();
