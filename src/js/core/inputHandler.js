// キー入力を受け付ける。

export class InputHandler {
    constructor(game) {
        this.game = game;
    }

    handle(key) {                                                        //キーが押されたときの処理
        if (this.game.gameState.state === 'GAMEOVER' && key === ' ') {  //ゲームオーバー中にスペースキーが押されたら
            this.game.reset();                                         //リセット
            return;
        }

        const dirs = {                                                   //キー入力の方向
            ArrowUp: [0, -1],                                            //上
            ArrowDown: [0, 1],                                           //下
            ArrowLeft: [-1, 0],                                          //左
            ArrowRight: [1, 0]                                           //右
        };

        if (dirs[key]) {                                               //キーがその方向に入力されたら
            this.game.snake.setDirection(...dirs[key]);                //方向を設定
        }
    }
}

//キーが入力されるたびに関数が呼び出されて、
// そのキーがどの方向か判定して、snakeのsetDirectionを呼び出している。