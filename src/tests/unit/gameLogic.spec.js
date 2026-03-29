// 【テストの目的】
// 1. PLAYING（プレイ中）以外の状態では何も起きないことの確認
// 2. 壁や自分に衝突したときに正しく「ゲームオーバー」が発生することの確認
// 3. エサを食べたときに「エサを食べた」というイベントが発生することの確認
// 4. エサを食べていないときは、ヘビの尻尾が正しく削除（移動）されることの確認

// 【テストの基本構造: AAAパターン】
// Arrange（準備）: テストに必要なデータや状況を作る
// Act（実行）: テストしたい関数を実際に動かす
// Assert（検証）: 期待通りの結果になったかチェックする

import { test, expect } from '@playwright/test';
import { GameLogic } from '../../js/core/gameLogic.js';

let sut; // sut = System Under Test (テスト対象のシステムという意味)。各テストで使う GameLogic インスタンス。

test.describe('GameLogic Class', () => { // 関連するテストをグループ化します

  test.beforeEach(() => {
    // 各テスト（testメソッド）が実行される直前に、毎回新しくインスタンスを作ります。
    // これにより、前のテストの結果が次のテストに影響しない「独立性」を保ちます。
    sut = new GameLogic();
  });

  test('PLAYING状態のとき、snakeを更新する', () => {
    // --- Arrange（準備） ---
    let called = false; // snake.update が呼ばれたか確認するための旗（フラグ）

    const gameState = { state: 'PLAYING' }; // 「プレイ中」という状態を模倣
    const food = { x: 11, y: 10 };          // ヘビの頭と重ならない位置にエサを置く
    const snake = {                         // 蛇の動きを模倣するオブジェクト（モック）
        segments: [{ x: 10, y: 10 }],       // 蛇の頭の位置
        update: () => { called = true; },   // updateメソッドが呼ばれたら旗を立てる
        popTail: () => {},                  // 尻尾削除メソッド（今回は空）
        checkWallCollision: () => false,    // 壁には当たっていないことにする
        checkSelfCollision: () => false     // 自分にも当たっていないことにする
    };

    // --- Act（実行） ---
    // GameLogicに 蛇、エサ、ゲーム状態 の3つを渡して更新を実行します
    sut.update(snake, food, gameState);

    // --- Assert（検証） ---
    // 期待通り、snake.update メソッドが実行された（called が true になった）か確認
    expect(called).toBe(true);
  });

  test('PLAYINGじゃないとsnakeは動かない', () => {
    // --- Arrange（準備） ---
    let called = false; 

    const gameState = { state: 'GAMEOVER' }; // 「ゲームオーバー中」という状態
    const food = { x: 11, y: 10 };
    const snake = {
        update: () => { called = true; }     // 呼ばれたら true になる仕掛け
    };

    // --- Act（実行） ---
    sut.update(snake, food, gameState);

    // --- Assert（検証） ---
    // プレイ中でないので、snake.update は一度も呼ばれず false のままであるはず
    expect(called).toBe(false);
  });

  test('壁衝突でゲームオーバーイベントを返す', () => {
    // --- Arrange（準備） ---
    let gameOverCalled = false;
    
    const gameState = { 
        state: 'PLAYING',
        setGameOver: () => { gameOverCalled = true; } // ゲームオーバー状態への切り替えが呼ばれたか
    };
    const food = { x: 11, y: 10 };
    const snake = {
        update: () => { },
        popTail: () => { },
        checkWallCollision: () => true,               // 「壁に当たった！」という結果を返すように設定
        checkSelfCollision: () => false
    };

    // --- Act（実行） ---
    // updateの戻り値（result）を受け取ります
    const result = sut.update(snake, food, gameState);

    // --- Assert（検証） ---
    // 1. gameState.setGameOver() が内部で正しく呼ばれたか
    expect(gameOverCalled).toBe(true);
    // 2. 戻り値として「GAME_OVER」というイベント情報が返ってきたか
    expect(result.event).toBe('GAME_OVER');
  });

  test('餌を食べたとき、EAT_FOODイベントを返す', () => {
    // --- Arrange（準備） ---
    const gameState = { state: 'PLAYING' };
    const food = { x: 10, y: 10 };                    // 蛇の頭と同じ座標（＝食べた状態）
    const snake = {
        segments: [{ x: 10, y: 10 }],                 // 蛇の頭の位置
        update: () => { },
        popTail: () => { },
        checkWallCollision: () => false,
        checkSelfCollision: () => false
    };

    // --- Act（実行） ---
    const result = sut.update(snake, food, gameState);

    // --- Assert（検証） ---
    // エサと頭が重なったので、EAT_FOOD イベントが返ってくることを期待
    expect(result.event).toBe('EAT_FOOD');
  });

  test('自分自身に衝突したらゲームオーバーイベントを返す', () => {
    // --- Arrange（準備） ---
    let gameOverCalled = false;
    
    const gameState = { 
        state: 'PLAYING',
        setGameOver: () => { gameOverCalled = true; }
    };
    const food = { x: 11, y: 10 };
    const snake = {
        segments: [{ x: 10, y: 10 }],
        update: () => { },
        popTail: () => { },
        checkWallCollision: () => false,
        checkSelfCollision: () => true                // 「自分に当たった！」という結果を返す設定
    };

    // --- Act（実行） ---
    const result = sut.update(snake, food, gameState);

    // --- Assert（検証） ---
    // 自分に当たった場合も GAME_OVER が返ってくることを確認
    expect(gameOverCalled).toBe(true);
    expect(result.event).toBe('GAME_OVER');
  });

});
