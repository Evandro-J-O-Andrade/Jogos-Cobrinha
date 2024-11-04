const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const blockSize = 20;
let snake = [{ x: 9, y: 9 }];
let snakeDirection = 'RIGHT';
let apple = { x: Math.floor(Math.random() * canvas.width / blockSize), y: Math.floor(Math.random() * canvas.height / blockSize) };

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

// Adiciona o evento de toque ao canvas
stage.addEventListener("touchstart", handleTouch);


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
