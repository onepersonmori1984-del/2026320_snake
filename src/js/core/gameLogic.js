// ゲームの進行 ルール を管理する。1フレーム分のルール。
// 結構snakeのメソッドを用いますね。
export class GameLogic {
    update(game) {                                                              // 引数としてgameをそのまま取得する。
        const { snake, food, gameState } = game;                                // gameから必要なものを取得する。

        if (gameState.state !== 'PLAYING') return;                               // ゲームがPLAYING状態でない場合は何もしない。 (countdownやgameoverでない)

        snake.update();                                                          // snakeを更新する。 (中身を見ると1マス先の座標を見て、更新毎に配列の先頭に追加している。)
        if (snake.checkWallCollision() || snake.checkSelfCollision()) {          // 判定衝突：壁や自分自身に衝突したかチェック
            gameState.setGameOver();                                            // ゲームオーバー
            return;
        }

        const head = snake.segments[0];                                          // 頭の位置を取得 (餌との座標確認の為)

        if (head.x === food.x && head.y === food.y) {                            // 餌取得：頭がfoodの位置と同じかチェック
            game.score += 10;                                                    // スコア加算
            game.updateScore();                                                  // スコア更新
            food.randomize(snake.segments);                                      // foodをランダムに配置
        } else {
            snake.popTail();                                                    // 前に進んだ分、snakeの最後尾を削除
        }
    }
}