
export const TILE_SIZE = 32;

export function generateMaze(width = 19, height = 13) {

    // Maze dimensions should be odd numbers.
    if (width % 2 === 0 || height % 2 === 0) {
        throw new Error("Maze dimensions must be odd.");
    }

    const grid = Array.from(
        { length: height },
        () => Array(width).fill(1)
    );

    const directions = [
        [0, -2],
        [0, 2],
        [-2, 0],
        [2, 0]
    ];

    const stack = [{ x: 1, y: 1 }];

    grid[1][1] = 0;

    while (stack.length > 0) {

        const current = stack[stack.length - 1];

        const shuffled = [...directions].sort(
            () => Math.random() - 0.5
        );

        let carved = false;

        for (const [dx, dy] of shuffled) {

            const nx = current.x + dx;
            const ny = current.y + dy;

            if (
                nx > 0 &&
                ny > 0 &&
                nx < width - 1 &&
                ny < height - 1 &&
                grid[ny][nx] === 1
            ) {

                grid[current.y + dy / 2]
                    [current.x + dx / 2] = 0;

                grid[ny][nx] = 0;

                stack.push({ x: nx, y: ny });

                carved = true;
                break;
            }
        }

        if (!carved) {
            stack.pop();
        }
    }

    // Exit location
    grid[height - 2][width - 2] = 0;

    return grid;
}

export function getOpenCells(grid) {

    const cells = [];

    grid.forEach((row, y) => {

        row.forEach((tile, x) => {

            if (tile === 0) {
                cells.push({ x, y });
            }

        });

    });

    return cells;
}

export function drawMaze(ctx, grid) {

    grid.forEach((row, y) => {

        row.forEach((tile, x) => {

            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            if (tile === 1) {

                ctx.fillStyle = "#56515c";
                ctx.fillRect(
                    px, py, TILE_SIZE, TILE_SIZE
                );

                ctx.fillStyle = "#68616d";
                ctx.fillRect(
                    px + 3, py + 3, TILE_SIZE - 6, 4
                );

            } else {

                ctx.fillStyle = "#27232b";
                ctx.fillRect(
                    px, py, TILE_SIZE, TILE_SIZE
                );

            }

        });

    });
}

export function isWall(grid, x, y) {

    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);

    if (
        tileY < 0 ||
        tileY >= grid.length ||
        tileX < 0 ||
        tileX >= grid[0].length
    ) {
        return true;
    }

    return grid[tileY][tileX] === 1;
}
