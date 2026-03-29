// ゲームの進行 ルール を管理する。1フレーム分のルール。
export class GameLogic {
    /**
     * 1フレーム分のゲーム更新を行う
     * @param {Object} snake ヘビのインスタンス
     * @param {Object} food エサのインスタンス
     * @param {Object} gameState ゲーム状態のインスタンス
     * @returns {Object|null} 発生したイベント（GAME_OVER, EAT_FOOD）
     */
    update(snake, food, gameState) {
        if (gameState.state !== 'PLAYING') return null;

        snake.update();
        
        // 衝突判定
        if (snake.checkWallCollision() || snake.checkSelfCollision()) {
            gameState.setGameOver();
            return { event: 'GAME_OVER' };
        }

        const head = snake.segments[0];

        // エサ取得判定
        if (head.x === food.x && head.y === food.y) {
            return { event: 'EAT_FOOD' };
        } else {
            snake.popTail();
        }

        return null;
    }
}
