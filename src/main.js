
import {
    TILE_SIZE,
    generateMaze,
    drawMaze
} from "./maze.js";

import {
    createPlayer,
    updatePlayer,
    drawPlayer,
    createCoins,
    updateCoins,
    drawCoins,
    createEnemies,
    updateEnemies,
    drawEnemies,
    createPowerups,
    updatePowerups,
    drawPowerups,
    createParticles,
    updateParticles,
    drawParticles,
    overlaps
} from "./entities.js";

import {
    saveScore,
    getBestScore
} from "./storage.js";

// ======================================
// CANVAS SETUP
// ======================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 640;
const HEIGHT = 480;

const OFFSET_X = 16;
const OFFSET_Y = 48;

canvas.width = WIDTH;
canvas.height = HEIGHT;

// ======================================
// GAME CONFIGURATION
// ======================================

const STATE = {
    MENU: "menu",
    PLAYING: "playing",
    PAUSED: "paused",
    GAME_OVER: "gameover",
    COMPLETE: "complete"
};

let state = STATE.MENU;

let maze;
let player;
let coins = [];
let enemies = [];
let powerups = [];
let particles = [];

let score = 0;
let level = 1;
let lives = 3;
let timer = 90;

let hitCooldown = 0;
let scoreSaved = false;

// ======================================
// GAME INITIALIZATION
// ======================================

function setupLevel() {

    maze = generateMaze(19, 13);

    player = createPlayer();

    coins = createCoins(
        maze,
        Math.min(10 + level * 2, 22)
    );

    enemies = createEnemies(
        maze,
        Math.min(2 + level, 5)
    );

    powerups = createPowerups(maze);

    particles = [];

    timer = 90;

    hitCooldown = 0;
}

function startGame() {

    score = 0;
    level = 1;
    lives = 3;

    scoreSaved = false;

    setupLevel();

    state = STATE.PLAYING;
}

// ======================================
// LEVEL PROGRESSION
// ======================================

function nextLevel() {

    score += Math.ceil(timer) * 2;

    level++;

    setupLevel();

    state = STATE.PLAYING;
}

// ======================================
// GAME UPDATE
// ======================================

function update(dt) {

    if (state !== STATE.PLAYING) return;

    timer -= dt;
    hitCooldown = Math.max(0, hitCooldown - dt);

    if (timer <= 0) {
        timer = 0;
        endGame();
        return;
    }

    // Player movement
    updatePlayer(player, maze, dt);

    // Collect coins
    const collected = updateCoins(player, coins);

    if (collected > 0) {

        score += collected * 10;

        particles.push(
            ...createParticles(
                player.x + 12,
                player.y + 12,
                "#ffd700",
                collected * 6
            )
        );
    }

    // Power-ups
    updatePowerups(player, powerups);

    // Enemy movement
    updateEnemies(enemies, maze, dt);

    // Enemy collision
    for (let i = enemies.length - 1; i >= 0; i--) {

        if (
            overlaps(player, enemies[i]) &&
            hitCooldown <= 0
        ) {

            if (player.shield) {

                particles.push(
                    ...createParticles(
                        enemies[i].x + 11,
                        enemies[i].y + 11,
                        "#55eaff"
                    )
                );

                enemies.splice(i, 1);

            } else {

                lives--;

                player.x = TILE_SIZE + 4;
                player.y = TILE_SIZE + 4;

                hitCooldown = 1.5;

                particles.push(
                    ...createParticles(
                        player.x + 12,
                        player.y + 12,
                        "#e64b55"
                    )
                );

                if (lives <= 0) {
                    endGame();
                    return;
                }
            }
        }
    }

    // Particle simulation
    particles = updateParticles(particles, dt);

    // Check whether all coins are collected
    const allCollected = coins.every(
        coin => coin.collected
    );

    if (allCollected) {

        const exit = {
            x: (maze[0].length - 2) * TILE_SIZE + 4,
            y: (maze.length - 2) * TILE_SIZE + 4,
            width: 24,
            height: 24
        };

        if (overlaps(player, exit)) {
            state = STATE.COMPLETE;
        }
    }
}

// ======================================
// GAME OVER
// ======================================

function endGame() {

    state = STATE.GAME_OVER;

    if (!scoreSaved) {

        saveScore(score, level);

        scoreSaved = true;
    }
}

// ======================================
// DRAWING FUNCTIONS
// ======================================

function drawExit() {

    const allCollected = coins.every(
        coin => coin.collected
    );

    const x = (maze[0].length - 2) * TILE_SIZE;
    const y = (maze.length - 2) * TILE_SIZE;

    ctx.fillStyle = allCollected
        ? "#38d67a"
        : "#625c68";

    ctx.fillRect(
        x + 4,
        y + 4,
        24,
        24
    );

    ctx.fillStyle = "#ffffff";

    ctx.font = "11px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        allCollected ? "E" : "X",
        x + 16,
        y + 21
    );
}

function drawHUD() {

    const remainingCoins = coins.filter(
        coin => !coin.collected
    ).length;

    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#ffb52e";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";

    ctx.fillText(`SCORE: ${score}`, 16, 27);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(`LEVEL: ${level}`, 175, 27);

    ctx.fillStyle = "#ffd700";
    ctx.fillText(`COINS: ${remainingCoins}`, 280, 27);

    ctx.fillStyle = "#55eaff";
    ctx.fillText(`LIVES: ${lives}`, 420, 27);

    ctx.fillStyle = timer < 20
        ? "#ff5757"
        : "#ffffff";

    ctx.fillText(
        `TIME: ${Math.ceil(timer)}`,
        520,
        27
    );
}

function drawWorld() {

    ctx.save();

    ctx.translate(OFFSET_X, OFFSET_Y);

    drawMaze(ctx, maze);

    drawExit();

    drawCoins(ctx, coins);

    drawPowerups(ctx, powerups);

    drawEnemies(ctx, enemies);

    // Brief visual feedback after taking a hit
    if (
        hitCooldown > 0 &&
        Math.floor(hitCooldown * 10) % 2 === 0
    ) {
        // Temporarily hide the player
    } else {
        drawPlayer(ctx, player);
    }

    drawParticles(ctx, particles);

    ctx.restore();
}

function drawOverlay(title, subtitle, instructions) {

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.textAlign = "center";

    ctx.fillStyle = "#ffb52e";
    ctx.font = "bold 34px Arial";

    ctx.fillText(title, WIDTH / 2, 185);

    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial";

    ctx.fillText(subtitle, WIDTH / 2, 230);

    ctx.fillStyle = "#aaaaaa";
    ctx.font = "13px Arial";

    ctx.fillText(instructions, WIDTH / 2, 280);
}

// ======================================
// MAIN RENDER FUNCTION
// ======================================

function render() {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (state === STATE.MENU) {

        ctx.fillStyle = "#202020";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        drawOverlay(
            "PIXEL TREASURE",
            `BEST SCORE: ${getBestScore()}`,
            "PRESS ENTER TO START"
        );

        return;
    }

    if (state === STATE.GAME_OVER) {

        ctx.fillStyle = "#202020";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        drawOverlay(
            "GAME OVER",
            `FINAL SCORE: ${score}`,
            "PRESS ENTER TO PLAY AGAIN"
        );

        return;
    }

    if (state === STATE.COMPLETE) {

        drawWorld();

        drawOverlay(
            "LEVEL COMPLETE!",
            `LEVEL ${level} FINISHED · SCORE ${score}`,
            "PRESS ENTER TO CONTINUE"
        );

        return;
    }

    drawHUD();
    drawWorld();

    if (state === STATE.PAUSED) {

        drawOverlay(
            "PAUSED",
            `SCORE: ${score}`,
            "PRESS P TO RESUME"
        );
    }
}

// ======================================
// KEYBOARD CONTROLS
// ======================================

window.addEventListener("keydown", (event) => {

    if (event.repeat) return;

    const key = event.key.toLowerCase();

    if (key === "enter") {

        if (
            state === STATE.MENU ||
            state === STATE.GAME_OVER
        ) {
            startGame();
        }

        else if (state === STATE.COMPLETE) {
            nextLevel();
        }

        return;
    }

    if (key === "p") {

        if (state === STATE.PLAYING) {
            state = STATE.PAUSED;
        }

        else if (state === STATE.PAUSED) {
            state = STATE.PLAYING;
        }
    }
});

// ======================================
// FPS MONITOR
// ======================================

let lastTime = 0;
let fpsFrames = 0;
let fpsTimer = 0;
let displayedFPS = 0;

function updateFPS(dt) {

    fpsFrames++;
    fpsTimer += dt;

    if (fpsTimer >= 0.5) {

        displayedFPS = Math.round(
            fpsFrames / fpsTimer
        );

        fpsFrames = 0;
        fpsTimer = 0;

        document.getElementById("gameStats").textContent =
            `FPS: ${displayedFPS}`;
    }
}

// ======================================
// MAIN GAME LOOP
// ======================================

function gameLoop(timestamp) {

    const dt = lastTime
        ? Math.min((timestamp - lastTime) / 1000, 0.05)
        : 0;

    lastTime = timestamp;

    updateFPS(dt);

    update(dt);

    render();

    requestAnimationFrame(gameLoop);
}

// Start application
render();

requestAnimationFrame(gameLoop);
