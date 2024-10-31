// Captura das áreas de toque
const toqueCima = document.getElementById("toqueCima");
const toqueBaixo = document.getElementById("toqueBaixo");
const toqueEsquerda = document.getElementById("toqueEsquerda");
const toqueDireita = document.getElementById("toqueDireita");
let direcao = 'baixo'; // Direção inicial da cobra
// Adiciona eventos de toque

function moverCobra(novaDirecao) {
    // Verifica se a nova direção não é oposta à direção atual
    if ((direcao === 'cima' && novaDirecao !== 'baixo') || 
        (direcao === 'baixo' && novaDirecao !== 'cima') || 
        (direcao === 'esquerda' && novaDirecao !== 'direita') || 
        (direcao === 'direita' && novaDirecao !== 'esquerda')) {
        
        direcao = novaDirecao; // Atualiza a direção
    }
}

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
