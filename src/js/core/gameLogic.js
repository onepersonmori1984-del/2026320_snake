export class GameLogic {
    update(game) {
        const { snake, food, gameState } = game;

        if (gameState.state !== 'PLAYING') return;

        snake.update();

        if (snake.checkWallCollision() || snake.checkSelfCollision()) {
            gameState.setGameOver();
            return;
        }

        const head = snake.segments[0];

        if (head.x === food.x && head.y === food.y) {
            game.score += 10;
            game.updateScore();
            food.randomize(snake.segments);
        } else {
            snake.popTail();
        }
    }
}