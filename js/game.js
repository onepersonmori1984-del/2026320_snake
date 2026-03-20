// Game エンジン
window.GAME_STATE = {
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
};

window.Game = class {
    constructor(canvas, scoreElement, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scoreElement = scoreElement;
        this.config = config;
        
        this.snake = new window.Snake(config);
        this.food = new window.Food(config);
        this.score = 0;
        this.state = window.GAME_STATE.COUNTDOWN;
        this.countdownValue = 3;
        
        this.init();
    }

    init() {
        this.startCountdown();
    }

    startCountdown() {
        this.state = window.GAME_STATE.COUNTDOWN;
        this.countdownValue = 3;
        
        const countdownInterval = setInterval(() => {
            this.countdownValue--;
            if (this.countdownValue < 0) {
                clearInterval(countdownInterval);
                this.state = window.GAME_STATE.PLAYING;
            }
        }, 1000);
    }

    reset() {
        this.snake.reset();
        this.food.randomize(this.snake.segments);
        this.score = 0;
        this.scoreElement.innerText = `Score: ${this.score}`;
        this.startCountdown();
    }

    update() {
        if (this.state !== window.GAME_STATE.PLAYING) return;

        this.snake.update();

        // 衝突判定
        if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
            this.state = window.GAME_STATE.GAMEOVER;
            return;
        }

        // エサを食べたか
        const head = this.snake.segments[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.innerText = `Score: ${this.score}`;
            this.food.randomize(this.snake.segments);
        } else {
            this.snake.popTail();
        }
    }

    draw() {
        // 背景クリア
        this.ctx.fillStyle = this.config.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 各オブジェクトの描画
        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);

        // オーバーレイ描画
        if (this.state === window.GAME_STATE.COUNTDOWN) {
            const displayValue = this.countdownValue === 0 ? 'GO!' : this.countdownValue;
            this.drawOverlay(displayValue);
        } else if (this.state === window.GAME_STATE.GAMEOVER) {
            this.drawOverlay('GAME OVER\n\n[Press Space to Restart]');
        }
    }

    drawOverlay(text) {
        this.ctx.fillStyle = this.config.COLORS.OVERLAY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        if (typeof text === 'number' || text === 'GO!') {
            this.ctx.font = 'bold 100px Arial';
            this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        } else {
            this.ctx.font = 'bold 24px Arial';
            const lines = text.split('\n');
            lines.forEach((line, i) => {
                this.ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + (i * 40));
            });
        }
    }

    loop() {
        // 描画と更新のループ
        const tick = () => {
            this.update();
            this.draw();
            setTimeout(() => requestAnimationFrame(tick), this.config.SPEED);
        };
        requestAnimationFrame(tick);
    }

    handleInput(key) {
        if (this.state === window.GAME_STATE.GAMEOVER && (key === ' ' || key === 'Spacebar')) {
            this.reset();
            return;
        }

        const dirs = {
            'ArrowUp': [0, -1], 'w': [0, -1], 'W': [0, -1],
            'ArrowDown': [0, 1], 's': [0, 1], 'S': [0, 1],
            'ArrowLeft': [-1, 0], 'a': [-1, 0], 'A': [-1, 0],
            'ArrowRight': [1, 0], 'd': [1, 0], 'D': [1, 0]
        };

        if (dirs[key]) {
            this.snake.setDirection(dirs[key][0], dirs[key][1]);
        }
    }
};
console.log("Game class loaded.");
