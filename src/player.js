import { keys } from "./input.js";

export const player = {
    x: 100,
    y: 100,
    width: 24,
    height: 24,
    speed: 180
};

export function updatePlayer(dt) {
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

    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;
}

export function drawPlayer(ctx) {
    ctx.fillStyle = "#ffb52e";
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}