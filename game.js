const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverDialog = document.getElementById('gameOverDialog');
const finalScoreElement = document.getElementById('finalScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameLoop;
let gameActive = true;

// Add function to generate random colors
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 95%)`; // Using HSL for soft, pleasant colors
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameActive) {
        hideGameOverDialog();
        resetGame();
        return;
    }
    changeDirection(event);
});

function changeDirection(event) {
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    if (!gameActive) return;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawGame() {
    if (!gameActive) return;
    
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
        increaseSpeed();
        // Change background color when food is eaten
        document.body.style.backgroundColor = getRandomColor();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.font = `${gridSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍎', (food.x * gridSize) + (gridSize/2), (food.y * gridSize) + (gridSize/2));
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 2;
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, gameSpeed);
    }
}

function showGameOverDialog() {
    gameOverDialog.style.display = 'block';
}

function hideGameOverDialog() {
    gameOverDialog.style.display = 'none';
}

function gameOver() {
    gameActive = false;
    clearInterval(gameLoop);
    showGameOverDialog();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    gameActive = true;
    updateScore();
    gameLoop = setInterval(drawGame, gameSpeed);
}

// Start the game
resetGame();
