import { Snake } from '../entities/snake.js';
import { Food } from '../entities/food.js';
import { GameState } from './gameState.js';
import { GameLogic } from './gameLogic.js';
import { InputHandler } from './inputHandler.js';
import { Renderer } from '../renderer.js';

export class Game {
    constructor(canvas, scoreElement, config) {
        this.canvas = canvas;
        this.scoreElement = scoreElement;
        this.config = config;

        this.snake = new Snake(config);
        this.food = new Food(config);

        this.gameState = new GameState();
        this.logic = new GameLogic();
        this.input = new InputHandler(this);
        this.renderer = new Renderer(canvas, config);

        this.score = 0;

        this.init();
    }

    init() {
        this.gameState.startCountdown();
    }

    reset() {
        this.snake.reset();
        this.food.randomize(this.snake.segments);
        this.score = 0;
        this.updateScore();
        this.gameState.startCountdown();
    }

    updateScore() {
        this.scoreElement.innerText = `Score: ${this.score}`;
    }

    update() {
        this.logic.update(this);
    }

    draw() {
        this.renderer.draw(this);
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
        this.input.handle(key);
    }
}