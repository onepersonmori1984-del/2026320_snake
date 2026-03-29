import { test, expect } from '@playwright/test';
import { Game } from '../../js/core/game.js';
import { ApiService } from '../../js/services/api-service.js';

// テスト用の最小限の設定
const config = {
    TILE_COUNT: 20,
    GRID_SIZE: 20,
    INITIAL_SNAKE: [{ x: 10, y: 10 }],
    SPEED: 100,
    COLORS: {
        SNAKE_HEAD: 'green',
        SNAKE_BODY: 'lime',
        FOOD: 'red'
    }
};

test.describe('Game Class - Logic & Service Integration', () => {
    let game;
    let mockScoreElement;
    let mockHighScoreElement;
    let mockCanvas;

    test.beforeEach(() => {
        // DOM要素の最小限のモック
        mockScoreElement = { innerText: '' };
        mockHighScoreElement = { innerText: '' };
        mockCanvas = { 
            getContext: () => ({
                fillRect: () => {},
                clearRect: () => {},
                fillText: () => {}
            }),
            width: 400,
            height: 400
        };

        game = new Game(mockCanvas, mockScoreElement, mockHighScoreElement, config);
    });

    test('初期化時に正しい値がセットされること', () => {
        expect(game.score).toBe(0);
        expect(game.highScore).toBe(0);
    });

    test('updateHighScoreUI が DOM を正しく書き換えること', () => {
        game.highScore = 150;
        game.updateHighScoreUI();
        expect(mockHighScoreElement.innerText).toBe('High Score: 150');
    });

    test('handleGameOver: ハイスコア更新時に保存処理が走ること', async () => {
        game.score = 100;
        game.highScore = 50;
        
        let savedValue = -1;
        // saveScore メソッド自体をモック化して、呼び出しと引数を確認
        game.saveScore = async (score) => {
            savedValue = score;
        };

        await game.handleGameOver();

        expect(game.highScore).toBe(100);
        expect(savedValue).toBe(100);
        expect(mockHighScoreElement.innerText).toBe('High Score: 100');
    });

    test('handleGameOver: ハイスコア未更新時は保存処理をスキップすること', async () => {
        game.score = 30;
        game.highScore = 50;
        
        let saveCalled = false;
        game.saveScore = async () => {
            saveCalled = true;
        };

        await game.handleGameOver();

        expect(game.highScore).toBe(50);
        expect(saveCalled).toBe(false);
    });

    test('fetchHighScore: ApiServiceから取得した値を反映できること', async () => {
        // ApiService.getHighScore をモック
        const originalMethod = ApiService.getHighScore;
        ApiService.getHighScore = async () => 200;

        await game.fetchHighScore();

        expect(game.highScore).toBe(200);
        expect(mockHighScoreElement.innerText).toBe('High Score: 200');

        ApiService.getHighScore = originalMethod;
    });

    test('fetchHighScore: エラー時もクラッシュせずログ出力すること', async () => {
        const originalMethod = ApiService.getHighScore;
        const consoleErrorSpy = [];
        const originalConsoleError = console.error;
        console.error = (msg) => consoleErrorSpy.push(msg);

        ApiService.getHighScore = async () => { throw new Error('Service Error'); };

        await game.fetchHighScore();

        expect(game.highScore).toBe(0); // 更新されないこと
        expect(consoleErrorSpy.length).toBeGreaterThan(0);

        console.error = originalConsoleError;
        ApiService.getHighScore = originalMethod;
    });

    test('saveScore: ApiService.saveScore が正しく呼ばれること', async () => {
        const originalMethod = ApiService.saveScore;
        let calledWith = -1;
        ApiService.saveScore = async (score) => {
            calledWith = score;
            return { success: true };
        };

        await game.saveScore(120);

        expect(calledWith).toBe(120);

        ApiService.saveScore = originalMethod;
    });
});
