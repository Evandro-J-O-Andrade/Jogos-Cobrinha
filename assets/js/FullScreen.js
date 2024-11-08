var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');
const canvas = document.querySelector('canvas');
const botaoIniciar = document.querySelector('#botaoIniciar');
const startGame = document.getElementById('#startGame');
const stage =document.querySelectorI('canva');

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
    // Aqui você pode redefinir qualquer variável de estado do jogo, por exemplo:
    // resetar a pontuação, reiniciar a posição da cobra, etc.
  
    // Mostrar novamente o canvas e esconder a tela de Game Over
    document.getElementById('game-canvas').style.display = 'block';
    document.getElementById('game-over-screen').style.display = 'none';
  
    // Chamar função para reiniciar o jogo (exemplo)
    startGame();  // Certifique-se de que startGame() reinicia o jogo adequadamente
  }
  
  // Função para voltar à página principal
  function goToHomePage() {
    window.location.href = '/assets/html/index.html'; // Substitua pela URL da sua página inicial
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

// Função para mostrar a tela de Game Over
function showGameOverScreen() {
  const gameOverScreen = document.getElementById("game-over-screen");
  gameOverScreen.style.display = "block"; // Exibe a tela de Game Over

  // Ações para os botões
  const restartButton = document.getElementById("button");
  const homeButton = document.getElementById("button");

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
