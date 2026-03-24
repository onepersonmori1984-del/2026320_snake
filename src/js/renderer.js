// 画面に絵を描く。今の状態をそのまま描くだけ

export class Renderer {
    constructor(canvas, config) {
        this.ctx = canvas.getContext('2d'); // 描画道具 ペン。これを使って描いていく。
        this.canvas = canvas;
        this.config = config;
    }

    draw(game) {                                                                //ループ中に毎回呼ばれるやつ。
        const { snake, food, gameState } = game;                               // gameから必要なものを取得する。

        this.ctx.fillStyle = this.config.COLORS.BACKGROUND;                  // 背景色を設定
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);     // その背景色で全体を塗りつぶす

        snake.draw(this.ctx);                                   // そして更新されたsnakeを描画
        food.draw(this.ctx);                                    // そして更新されたfoodを描画

        if (gameState.state === 'COUNTDOWN') {                               // カウントダウン中の処理
            this.drawOverlay(gameState.countdownValue === 0 ? 'GO!' : gameState.countdownValue);        // 上書
        } else if (gameState.state === 'GAMEOVER') {                         // ゲームオーバー中の処理
            this.drawOverlay('GAME OVER\n\n[Press Space]');                // 上書
        }
    }

    // 上書きの関数
    drawOverlay(text) {
        this.ctx.fillStyle = this.config.COLORS.OVERLAY;                        // 上書きの色
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);         // 上書きの範囲

        this.ctx.fillStyle = 'white';                                           // 上書きの文字色
        this.ctx.textAlign = 'center';                                          // 上書きの文字の配置
        this.ctx.textBaseline = 'middle';                                       // 上書きの文字の配置
        this.ctx.font = 'bold 30px Arial';                                      // 上書きの文字のフォント

        const lines = text.toString().split('\n');                              // 改行で分割
        lines.forEach((line, i) => {                                            // 分割した行をそれぞれ描画
            this.ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + i * 30); // 描画
        });
    }
} 