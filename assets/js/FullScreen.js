// Seleciona o canvas e o botão de início
const canvas = document.querySelector('canvas');
var botaoIniciar = document.querySelector('#botaoIniciar');

// Cria um botão de saída de tela cheia para dispositivos móveis
const botaoSairTelaCheia = document.createElement('button');
botaoSairTelaCheia.innerText = 'Sair da Tela Cheia';
botaoSairTelaCheia.id = 'botaoSairTelaCheia';
botaoSairTelaCheia.style.display = 'none'; // Oculto por padrão
document.body.appendChild(botaoSairTelaCheia);

// Função para entrar em tela cheia e iniciar o jogo
function iniciarJogo() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    canvas.msRequestFullscreen();
  }

  // Mostra o botão "Sair da Tela Cheia" em dispositivos móveis
  botaoSairTelaCheia.style.display = 'block';

  // Chama a lógica principal do jogo
  iniciarLogicaDoJogo();
}

// Função de exemplo para iniciar a lógica do jogo (substitua pela lógica real)
function iniciarLogicaDoJogo() {
  console.log("Jogo iniciado!");
  // Aqui você colocaria o código para iniciar o seu jogo
}

// Função para sair do modo de tela cheia
function sairDaTelaCheia() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// Evento para iniciar o jogo com clique no botão
botaoIniciar.addEventListener('click', iniciarJogo);

// Evento para iniciar o jogo pressionando a tecla "Enter"
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    iniciarJogo();
  }
});

// Evento para o botão "Sair da Tela Cheia"
botaoSairTelaCheia.addEventListener('click', () => {
  sairDaTelaCheia();
});

// Evento para esconder o botão "Sair da Tela Cheia" quando sair da tela cheia
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    botaoSairTelaCheia.style.display = 'none'; // Esconde o botão ao sair do modo tela cheia
  }
});


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

// Seleciona o botão de início usando o ID
const botaoIniciar = document.getElementById('botaoIniciar');

// Adiciona o evento de clique para o botão
botaoIniciar.addEventListener('click', () => {
  // Executa a função que inicia o jogo
  iniciarJogo();
});

// Função para iniciar o jogo (exemplo)
function iniciarJogo() {
  console.log("Iniciando o jogo...");
  window.location.href = '/assets/html/index.html'; // Redireciona para a página do jogo
}
