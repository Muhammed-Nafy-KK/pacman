
import { keys } from "./input.js";
import { TILE_SIZE, isWall } from "./maze.js";

// ==================================
// COLLISION UTILITIES
// ==================================

export function overlaps(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function canMove(grid, entity, x, y) {

    const points = [
        [x, y],
        [x + entity.width - 1, y],
        [x, y + entity.height - 1],
        [x + entity.width - 1, y + entity.height - 1]
    ];

    return points.every(([px, py]) =>
        !isWall(grid, px, py)
    );
}

// ==================================
// PLAYER
// ==================================

export function createPlayer() {

    return {
        x: TILE_SIZE + 4,
        y: TILE_SIZE + 4,
        width: 24,
        height: 24,
        speed: 160,
        normalSpeed: 160,
        shield: false,
        speedTimer: 0,
        shieldTimer: 0
    };
}

export function updatePlayer(player, grid, dt) {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy--;
    if (keys["s"] || keys["arrowdown"]) dy++;
    if (keys["a"] || keys["arrowleft"]) dx--;
    if (keys["d"] || keys["arrowright"]) dx++;

    const length = Math.hypot(dx, dy);

    if (length > 0) {
        dx /= length;
        dy /= length;
    }

    const nextX = player.x + dx * player.speed * dt;

    if (canMove(grid, player, nextX, player.y)) {
        player.x = nextX;
    }

    const nextY = player.y + dy * player.speed * dt;

    if (canMove(grid, player, player.x, nextY)) {
        player.y = nextY;
    }

    if (player.speedTimer > 0) {
        player.speedTimer -= dt;

        if (player.speedTimer <= 0) {
            player.speed = player.normalSpeed;
        }
    }

    if (player.shieldTimer > 0) {
        player.shieldTimer -= dt;

        if (player.shieldTimer <= 0) {
            player.shield = false;
        }
    }
}

export function drawPlayer(ctx, player) {

    ctx.fillStyle = player.shield
        ? "#55eaff"
        : "#ffb52e";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    // Eyes
    ctx.fillStyle = "#292020";

    ctx.fillRect(
        player.x + 5,
        player.y + 6,
        4,
        4
    );

    ctx.fillRect(
        player.x + 15,
        player.y + 6,
        4,
        4
    );
}

// ==================================
// COINS
// ==================================

export function createCoins(grid, count = 10) {

    const available = [];

    grid.forEach((row, y) => {

        row.forEach((tile, x) => {

            if (
                tile === 0 &&
                !(x === 1 && y === 1) &&
                !(x === grid[0].length - 2 &&
                  y === grid.length - 2)
            ) {
                available.push({ x, y });
            }

        });

    });

    available.sort(() => Math.random() - 0.5);

    return available.slice(0, count).map(cell => ({
        x: cell.x * TILE_SIZE + 8,
        y: cell.y * TILE_SIZE + 8,
        width: 16,
        height: 16,
        collected: false
    }));
}

export function updateCoins(player, coins) {

    let collected = 0;

    for (const coin of coins) {

        if (
            !coin.collected &&
            overlaps(player, coin)
        ) {
            coin.collected = true;
            collected++;
        }

    }

    return collected;
}

export function drawCoins(ctx, coins) {

    for (const coin of coins) {

        if (coin.collected) continue;

        ctx.fillStyle = "#ffd700";

        ctx.beginPath();

        ctx.arc(
            coin.x + 8,
            coin.y + 8,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#fff3a0";

        ctx.fillRect(
            coin.x + 6,
            coin.y + 4,
            3,
            6
        );
    }
}

// ==================================
// ENEMIES
// ==================================

export function createEnemies(grid, count = 3) {

    const available = [];

    grid.forEach((row, y) => {

        row.forEach((tile, x) => {

            const farFromStart =
                Math.abs(x - 1) + Math.abs(y - 1) > 4;

            if (tile === 0 && farFromStart) {
                available.push({ x, y });
            }

        });

    });

    available.sort(() => Math.random() - 0.5);

    return available.slice(0, count).map(cell => ({
        x: cell.x * TILE_SIZE + 5,
        y: cell.y * TILE_SIZE + 5,
        width: 22,
        height: 22,
        speed: 48,
        direction: Math.random() < 0.5 ? 1 : -1,
        axis: Math.random() < 0.5 ? "x" : "y"
    }));
}

export function updateEnemies(enemies, grid, dt) {

    for (const enemy of enemies) {

        const distance = enemy.speed * enemy.direction * dt;

        const nextX = enemy.axis === "x"
            ? enemy.x + distance
            : enemy.x;

        const nextY = enemy.axis === "y"
            ? enemy.y + distance
            : enemy.y;

        if (canMove(grid, enemy, nextX, nextY)) {

            enemy.x = nextX;
            enemy.y = nextY;

        } else {

            enemy.direction *= -1;

        }
    }
}

export function drawEnemies(ctx, enemies) {

    for (const enemy of enemies) {

        ctx.fillStyle = "#e64b55";

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            enemy.x + 4,
            enemy.y + 5,
            4,
            4
        );

        ctx.fillRect(
            enemy.x + 14,
            enemy.y + 5,
            4,
            4
        );
    }
}

// ==================================
// POWER-UPS
// ==================================

export function createPowerups(grid) {

    const available = [];

    grid.forEach((row, y) => {

        row.forEach((tile, x) => {

            if (
                tile === 0 &&
                !(x === 1 && y === 1)
            ) {
                available.push({ x, y });
            }

        });

    });

    available.sort(() => Math.random() - 0.5);

    return available.slice(0, 2).map((cell, index) => ({
        x: cell.x * TILE_SIZE + 8,
        y: cell.y * TILE_SIZE + 8,
        width: 16,
        height: 16,
        type: index === 0 ? "speed" : "shield",
        collected: false
    }));
}

export function updatePowerups(player, powerups) {

    for (const powerup of powerups) {

        if (
            !powerup.collected &&
            overlaps(player, powerup)
        ) {

            powerup.collected = true;

            if (powerup.type === "speed") {

                player.speed = 280;
                player.speedTimer = 5;

            } else if (powerup.type === "shield") {

                player.shield = true;
                player.shieldTimer = 7;

            }
        }
    }
}

export function drawPowerups(ctx, powerups) {

    for (const powerup of powerups) {

        if (powerup.collected) continue;

        ctx.fillStyle = powerup.type === "speed"
            ? "#36d9ff"
            : "#a77aff";

        ctx.fillRect(
            powerup.x,
            powerup.y,
            powerup.width,
            powerup.height
        );

    }
}

// ==================================
// PARTICLES
// ==================================

export function createParticles(x, y, color, amount = 8) {

    return Array.from({ length: amount }, () => {

        const angle = Math.random() * Math.PI * 2;
        const speed = 30 + Math.random() * 100;

        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.5,
            maxLife: 0.5,
            color
        };

    });
}

export function updateParticles(particles, dt) {

    for (const particle of particles) {

        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        particle.life -= dt;

    }


    return particles.filter(p => p.life > 0);
}



export function drawParticles(ctx, particles) {

    for (const particle of particles) {

        ctx.globalAlpha =
            particle.life / particle.maxLife;

        ctx.fillStyle = particle.color;

        ctx.fillRect(
            particle.x,
            particle.y,
            4,
            4
        );

    }

    ctx.globalAlpha = 1;
}
