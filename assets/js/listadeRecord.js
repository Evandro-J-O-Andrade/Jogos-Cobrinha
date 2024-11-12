




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
        window.location.href = "../index.html";
    });


}


function restartGame() {
    // Aqui você pode reiniciar o estado do jogo, como reiniciar o canvas, pontuação, etc.
    document.getElementById('game-canvas').style.display = 'block'; // Mostrar novamente o canvas
    document.getElementById('game-over-screen').style.display = 'none'; // Esconder a tela de game over

    // Aqui você pode chamar a função que reinicia o jogo
    startGame();
}


function restartGame() {
    // Lógica para reiniciar o jogo
    location.reload(); // Simplesmente recarrega a página (ou você pode resetar o estado do jogo aqui)
}

function goToHomePage() {
    // Lógica para voltar à página inicial
    window.location.href = "assets/html/index.html"; // Alterar para o link da sua página inicial
}
// Função para voltar à página principal
function goToHomePage() {
    window.location.href = "assets/html/index.html"; // Substitua com a URL da sua página inicial
}





function openRecordPage() {
    window.location.href = "/assets/html/record.html";
}
