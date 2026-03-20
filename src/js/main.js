import { Game } from './game.js';
import { SnakeGameConfig } from './config.js';

window.addEventListener('load', () => { //ページの読み込みが全部終わったら実行
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');

    console.log("DOM取得:", scoreElement);

    const game = new Game(canvas, scoreElement, SnakeGameConfig);

    document.addEventListener('keydown', (e) => {
        game.handleInput(e.key);
    });

    game.loop();
});