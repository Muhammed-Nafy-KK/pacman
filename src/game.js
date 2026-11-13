
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const game = {
    running: true,
    lastTime: 0,
    deltaTime: 0,
    fps: 0
};

// Background renderer
function renderBackground() {
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

// Reusable rectangle renderer
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Main rendering function
function render() {
    renderBackground();

    // Test object
    drawRect(100, 100, 32, 32, "#ffb52e");
}

// Game loop

let lastTime = 0;
let fpsFrames = 0;
let fpsTimer = 0;
let displayedFPS = 0;

function gameLoop(timestamp) {

    const dt = lastTime
        ? Math.min((timestamp - lastTime) / 1000, 0.05)
        : 0;

    lastTime = timestamp;

    // Count frames
    fpsFrames++;
    fpsTimer += dt;

    // Update FPS every 500ms
    if (fpsTimer >= 0.5) {

        displayedFPS = Math.round(
            fpsFrames / fpsTimer
        );

        fpsFrames = 0;
        fpsTimer = 0;

        document.getElementById("gameStats").textContent =
            `FPS: ${displayedFPS}`;
    }

    // Render game
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


// Start engine
requestAnimationFrame(gameLoop);
