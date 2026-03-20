// Food クラス
export class Food {
    constructor(config) {
        this.config = config;
        this.randomize();
    }

    randomize(snakeSegments) {
        while (true) {
            this.x = Math.floor(Math.random() * this.config.TILE_COUNT);
            this.y = Math.floor(Math.random() * this.config.TILE_COUNT);
            
            // ヘビの体の上にエサが重ならないようにチェック
            if (snakeSegments) {
                const onSnake = snakeSegments.some(segment => segment.x === this.x && segment.y === this.y);
                if (onSnake) continue;
            }
            break;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.config.COLORS.FOOD;
        ctx.fillRect(
            this.x * this.config.GRID_SIZE,
            this.y * this.config.GRID_SIZE,
            this.config.GRID_SIZE - 1,
            this.config.GRID_SIZE - 1
        );
    }
};
console.log("Food class loaded.");
