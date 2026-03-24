// Snake クラス
export class Snake {
    constructor(config) {
        this.config = config;
        this.reset();
    }

    reset() {
        // Deep copy of initial position
        this.segments = JSON.parse(JSON.stringify(this.config.INITIAL_SNAKE)); // configから初期位置を取得：蛇のスタート位置
        this.dx = 1;                                                         // x方向の移動量
        this.dy = 0;                                                         // y方向の移動量
        this.nextDx = 1;                                                     // 初期の次のx方向の移動量
        this.nextDy = 0;                                                     // 初期の次のy方向の移動量
        // 初期位置から最初に進む方向は決まっている。右。
    }

    update() {
        this.dx = this.nextDx;                                   //更新されたら,次の移動量が現在の位置になる
        this.dy = this.nextDy;                                   //更新されたら,次の移動量が現在の位置になる

        const head = {
            x: this.segments[0].x + this.dx,                      //頭の次の位置を計算
            y: this.segments[0].y + this.dy                      //頭の次の位置を計算
        };
        this.segments.unshift(head);                               //頭をリストの先頭に追加
    }

    popTail() {
        return this.segments.pop();
    }

    setDirection(newDx, newDy) {                                 //蛇の次に進む方向を設定する。
        if (newDx !== -this.dx || newDy !== -this.dy) {         // 180度ターンを防ぐ（真後ろには進めない）
            this.nextDx = newDx;                                 //新しい方向を設定
            this.nextDy = newDy;                                 //新しい方向を設定
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
