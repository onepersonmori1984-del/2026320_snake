export class InputHandler {
    constructor(game) {
        this.game = game;
    }

    handle(key) {
        if (this.game.gameState.state === 'GAMEOVER' && key === ' ') {
            this.game.reset();
            return;
        }

        const dirs = {
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0]
        };

        if (dirs[key]) {
            this.game.snake.setDirection(...dirs[key]);
        }
    }
}