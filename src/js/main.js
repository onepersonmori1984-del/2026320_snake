import { Game } from './core/game.js';
import { SnakeGameConfig } from './config.js';

window.addEventListener('load', () => { //ページの読込(index.html)が全部終わったら実行 getElementById()等の値を取得したいからね。
// html の要素を取得。
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');

    console.log("DOM取得:", scoreElement);

    // gameの内容を取得します。
    const game = new Game(canvas, scoreElement, SnakeGameConfig);
// ユーザーのキー入力を監視してgame.handleInputに渡す。
    document.addEventListener('keydown', (e) => {
        game.handleInput(e.key);
    });

    game.loop();
});