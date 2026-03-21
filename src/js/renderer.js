export class Renderer {
    constructor(canvas, config) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.config = config;
    }

    draw(game) {
        const { snake, food, gameState } = game;

        this.ctx.fillStyle = this.config.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        snake.draw(this.ctx);
        food.draw(this.ctx);

        if (gameState.state === 'COUNTDOWN') {
            this.drawOverlay(gameState.countdownValue === 0 ? 'GO!' : gameState.countdownValue);
        } else if (gameState.state === 'GAMEOVER') {
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
} 