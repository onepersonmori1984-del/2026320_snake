// ゲームの本体。ゲームの進行を管理する。

import { Snake } from '../entities/snake.js';
import { Food } from '../entities/food.js';
import { GameState } from './gameState.js';
import { GameLogic } from './gameLogic.js';
import { InputHandler } from './inputHandler.js';
import { Renderer } from '../renderer.js';
import { ApiService } from '../services/api-service.js';

// ゲーム全体のクラス。
export class Game {
    constructor(canvas, scoreElement, highScoreElement, config) {         //初期化,パラメータの設定。Gameのパーツを組み立てる。
        this.canvas = canvas;                          //mainから取得
        this.scoreElement = scoreElement;             //mainから取得
        this.highScoreElement = highScoreElement;     //mainから取得
        this.config = config;                        //mainから取得

        this.snake = new Snake(config);               //snakeから取得 引数はconfig  
        this.food = new Food(config);                //foodから取得 引数はconfig

        this.gameState = new GameState();                 //gameStateから取得
        this.logic = new GameLogic();                    //gameLogicから取得
        this.input = new InputHandler(this);            //inputHandlerから取得 game自身を渡してる
        this.renderer = new Renderer(canvas, config);  //rendererから取得　引数はcanvasとconfig

        this.score = 0;                                 //スコアの初期化
        this.highScore = 0;                             //ハイスコアの初期化

        this.init();                                    //初期化
    }

    init() {
        this.gameState.startCountdown();                //初期処理のカウントダウン
        this.fetchHighScore();                          //ハイスコアをDBから読み込む
    }

    async fetchHighScore() {                            // DBからハイスコアを取得
        try {
            this.highScore = await ApiService.getHighScore();
            this.updateHighScoreUI();
        } catch (error) {
            console.error('Failed to fetch high score:', error);
        }
    }

    updateHighScoreUI() {                               // ハイスコア表示を更新
        if (this.highScoreElement) {
            this.highScoreElement.innerText = `High Score: ${this.highScore}`;
        }
    }

    async handleGameOver() {                            // ゲームオーバー時の処理
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.updateHighScoreUI();
            await this.saveScore(this.score);
        }
    }

    async saveScore(score) {                            // スコアをDBに保存
        try {
            const result = await ApiService.saveScore(score);
            console.log('Score saved:', result);
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    }

    reset() {                                           //リセット処理
        this.snake.reset();                             //snakeをリセット
        this.food.randomize(this.snake.segments);       //foodをランダムに配置
        this.score = 0;                                 //スコアをリセット
        this.updateScore();                             //スコアを更新
        this.gameState.startCountdown();                //カウントダウンを再開
    }

    updateScore() {                                     //スコアの更新
        this.scoreElement.innerText = `Score: ${this.score}`;
    }

    update() {                                          //更新処理
        // GameLogicは事実（イベント）を返すだけにする
        const result = this.logic.update(this.snake, this.food, this.gameState);

        if (result) {
            if (result.event === 'GAME_OVER') {
                this.handleGameOver();
            } else if (result.event === 'EAT_FOOD') {
                this.score += 10;
                this.updateScore();
                this.food.randomize(this.snake.segments);
            }
        }
    }

    draw() {                                            //描画処理
        this.renderer.draw(this);                       //rendererのdrawメソッドを呼び出す
    }

    loop() {                                            //ループ処理ゲームのエンジン部分。これを見る。
        const tick = () => {
            this.update();                                  //更新処理
            this.draw();                                    //描画処理
            setTimeout(() => requestAnimationFrame(tick), this.config.SPEED);  //一定時間後にrequestAnimationFrameを呼び出す
        };
        requestAnimationFrame(tick);                        //ブラウザが画面に反映
    }

    handleInput(key) {                                  //キー入力の処理
        this.input.handle(key);                         //inputHandlerのhandleメソッドを呼び出す
    }
}