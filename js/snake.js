// Snake クラス
window.Snake = class {
    constructor(config) {
        this.config = config;
        this.reset();
    }

    reset() {
        // Deep copy of initial position
        this.segments = JSON.parse(JSON.stringify(this.config.INITIAL_SNAKE));
        this.dx = 1;
        this.dy = 0;
        this.nextDx = 1;
        this.nextDy = 0;
    }

    update() {
        this.dx = this.nextDx;
        this.dy = this.nextDy;
        const head = {
            x: this.segments[0].x + this.dx,
            y: this.segments[0].y + this.dy
        };
        this.segments.unshift(head);
    }

    popTail() {
        return this.segments.pop();
    }

    setDirection(newDx, newDy) {
        // 180度ターンを防ぐ（真後ろには進めない）
        if (newDx !== -this.dx && newDy !== -this.dy) {
            this.nextDx = newDx;
            this.nextDy = newDy;
        }
    }

    checkWallCollision() {
        const head = this.segments[0];
        return head.x < 0 || head.x >= this.config.TILE_COUNT || head.y < 0 || head.y >= this.config.TILE_COUNT;
    }

    checkSelfCollision() {
        const head = this.segments[0];
        for (let i = 1; i < this.segments.length; i++) {
            if (this.segments[i].x === head.x && this.segments[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        this.segments.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? this.config.COLORS.SNAKE_HEAD : this.config.COLORS.SNAKE_BODY;
            ctx.fillRect(
                segment.x * this.config.GRID_SIZE,
                segment.y * this.config.GRID_SIZE,
                this.config.GRID_SIZE - 1,
                this.config.GRID_SIZE - 1
            );
        });
    }
};
console.log("Snake class loaded.");
