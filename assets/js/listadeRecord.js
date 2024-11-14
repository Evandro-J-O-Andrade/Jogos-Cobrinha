
var recordSalvo = localStorage.getItem('recordSalvo') ? parseInt(localStorage.getItem('recordSalvo')) : 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || []; // Lista de recordes
let recordes = JSON.parse(localStorage.getItem("recordes")) || [];
// Funções de navegação
function restartGame() {
    window.location.href = '../html/index.html';
}

function goToHomePage() {
    window.location.href = '/index.html';
}

function openRecordPage() {
    window.location.href = '/assets/html/record.html';
}

// Adiciona os eventos aos botões
document.getElementById("restart-button").addEventListener("click", restartGame);
document.getElementById("back-to-home-button").addEventListener("click", goToHomePage);




// Função para salvar recordes no localStorage



function salvarRecorde(nome, pontuacao) {
    // Obtém a lista de recordes existente ou cria uma lista vazia
    let recordes = JSON.parse(localStorage.getItem("recordes")) || [];
    
    // Adiciona o novo recorde
    recordes.push({ nome: nome, pontuacao: pontuacao });
    
    // Ordena os recordes em ordem decrescente de pontuação e mantém os 15 melhores
    recordes.sort((a, b) => b.pontuacao - a.pontuacao);
    recordes = recordes.slice(0, 15); // Mantém apenas os 15 primeiros
    
    // Salva a lista atualizada de volta no localStorage
    localStorage.setItem("recordes", JSON.stringify(recordes));
}


function exibirRecordes() {
    // Obtém a lista de recordes do localStorage
    const recordes = JSON.parse(localStorage.getItem("recordes")) || [];

    // Seleciona o elemento UL onde os recordes serão exibidos
    const listaRecordes = document.getElementById("lista-recordes");

    // Gera o HTML da lista de recordes
    listaRecordes.innerHTML = recordes.map(recorde => 
        `<li>${recorde.nome} :: ${recorde.pontuacao}</li>`
    ).join("");
}

// Chama a função para exibir os recordes ao carregar a página
document.addEventListener("DOMContentLoaded", exibirRecordes);
document.addEventListener("DOMContentLoaded", recordSalvo)