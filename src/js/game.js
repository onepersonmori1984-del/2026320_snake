import { Snake } from './snake.js';
import { Food } from './food.js';

export const GAME_STATE = {
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
};

export class Game {
    constructor(canvas, scoreElement, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scoreElement = scoreElement;
        this.config = config;

        this.snake = new Snake(config);
        this.food = new Food(config);

        this.score = 0;
        this.state = GAME_STATE.COUNTDOWN;
        this.countdownValue = 3;

        this.init();
    }

    init() {
        this.startCountdown();
    }

    startCountdown() {
        this.state = GAME_STATE.COUNTDOWN;
        this.countdownValue = 3;

        const interval = setInterval(() => {
            this.countdownValue--;
            if (this.countdownValue < 0) {
                clearInterval(interval);
                this.state = GAME_STATE.PLAYING;
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
        if (this.state !== GAME_STATE.PLAYING) return;

        this.snake.update();

        if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
            this.state = GAME_STATE.GAMEOVER;
            return;
        }

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
        this.ctx.fillStyle = this.config.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);

        if (this.state === GAME_STATE.COUNTDOWN) {
            this.drawOverlay(this.countdownValue === 0 ? 'GO!' : this.countdownValue);
        } else if (this.state === GAME_STATE.GAMEOVER) {
            this.drawOverlay('GAME OVER\n\n[Press Space]');
        }
    }

    drawOverlay(text) {
        this.ctx.fillStyle = this.config.COLORS.OVERLAY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 30px Arial';

        const lines = text.toString().split('\n');
        lines.forEach((line, i) => {
            this.ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + i * 30);
        });
    }

    loop() {
        const tick = () => {
            this.update();
            this.draw();
            setTimeout(() => requestAnimationFrame(tick), this.config.SPEED);
        };
        requestAnimationFrame(tick);
    }

    handleInput(key) {
        if (this.state === GAME_STATE.GAMEOVER && key === ' ') {
            this.reset();
            return;
        }

        const dirs = {
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0]
        };

        if (dirs[key]) {
            this.snake.setDirection(...dirs[key]);
        }
    }
}