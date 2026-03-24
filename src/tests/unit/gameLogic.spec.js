// PLAYINGじゃないとき 何も起きない\
// 壁衝突 GAMEOVERになる
// 食べたとき スコア +10
// 食べてないとき tail削除
// Arrange（準備）　Act（実行）　Assert（検証）

import { test, expect } from '@playwright/test';
import { GameLogic } from '../../js/core/gameLogic.js';

let sut;                                      // 各テストで使うインスタンス. beforeEachで毎回初期化される。

test.describe('GameLogic Class', () => { //テストのグループ化

  test.beforeEach(() => {
    // Arrange（準備）
    sut = new GameLogic();                        // 毎回新しいインスタンスを生成（テスト独立性確保）
  });

  test('空テスト', () => {
    // Arrange
    // Act
    // Assert
  });

  test('PLAYING状態のとき、snakeを更新する', () => {

    // Arrange 最初の状態はfalse
    let called = false;

    const gameMock = {                        //ゲームのモックgameに必要なオブジェクトも揃えて模倣。
      gameState: { state: 'PLAYING' },       //ゲームの状態
      food: { x: 11, y: 10 },                //餌の位置

      snake: {                               //蛇のオブジェクト こちらもsnake.jsのコードを参照にして引数をそろえて。
        segments: [{ x: 10, y: 10 }],        //蛇の体の位置
        update: () => { called = true; },    // snakeのupdateメソッドが呼ばれたらフラグをオンにする関数。

        popTail: () => {},                   //蛇の体の削除 引数に必要だから入れてる。今回は使わないけど。
        checkWallCollision: () => false,     //壁衝突判定 GameLogicの中にあるから用意しないとダメ。
        checkSelfCollision: () => false      //自分自身との衝突判定 GameLogicの中にあるから用意しないとダメ。 
      },

      score: 0,                              //スコア　　　今回は必要ないけど一応。
      updateScore: () => {}                  //スコア更新　今回は必要ないけど一応。
    };

    // Act ゲームの更新を実行
    sut.update(gameMock);

    // Assert 検証 calledがtrueであるかどうか。
    expect(called).toBe(true);
  });

  test('PLAYINGじゃないとsnakeは動かない', () => {
  // Arrange falseで更新されなければ、そのまま。
  let called = false; 

  const gameMock = {
    gameState: { state: 'GAMEOVER' }, //
    snake: {
      update: () => { called = true; } //この条件に入るので終了。　snakeのupdateは呼ばれない。
    }
  };

  // Act
  sut.update(gameMock);

  // Assert
  expect(called).toBe(false);
});

  test('壁衝突でゲームオーバー', () => {
    // Arrange
    let gameOverCalled = false; // ゲームオーバーが呼ばれたかどうか。
    
    //本物のゲームオブジェクトの代わりにモックを準備する。
    const gameMock = { 
      gameState: { 
        state: 'PLAYING',
        setGameOver: () => { gameOverCalled = true; } //setGameOver という独自関数の定義。これを実行するとgameOverCalledがtrueになる。　最初はfalse でした。
       },
      snake: {
        update: () => { },
        popTail: () => { },
        checkWallCollision: () => true, // 壁衝突を強制的に true にする
        checkSelfCollision: () => false
      }
    };

    // Act
    sut.update(gameMock);

    // Assert
    expect(gameOverCalled).toBe(true);
  });

  test('餌を食べたとき、スコアが10加算され、餌が再配置される', () => {
    // Arrange
    let scoreIncreased = false; //スコアが10加算されたかどうか。
    let foodRandomized = false; //餌が再配置されたかどうか。
    
    const gameMock = {
      gameState: { state: 'PLAYING' },
      
      food: { 
        x: 10, y: 10 ,
        randomize: () => { foodRandomized = true; }
      },

      snake: {
        segments: [{ x: 10, y: 10 }],
        update: () => { },
        popTail: () => { },
        //衝突しない。ゲームが続く。
        checkWallCollision: () => false,
        checkSelfCollision: () => false
      },

      score: 0,
      updateScore: () => { scoreIncreased = true; }
    };

    // Act
    sut.update(gameMock);

    // Assert
    expect(gameMock.score).toBe(10);
    expect(scoreIncreased).toBe(true);
    expect(foodRandomized).toBe(true);
   
  });

  test('自分自身に衝突したらゲームオーバーになる', () => {
    // Arrange
    let gameOverCalled = false;
    
    const gameMock = {
      gameState: { state: 'PLAYING',
                   setGameOver: () => { gameOverCalled = true; }
                   },
      
      food: { 
        x: 10, y: 10 ,
        randomize: () => { } //今回は使わないので空でOK
      },

      snake: {
        segments: [{ x: 10, y: 10 }],
        update: () => { },
        popTail: () => { },
        //衝突しない。ゲームが続く。
        checkWallCollision: () => false,
        checkSelfCollision: () => true //自分自身に衝突
      },

      score: 0,
      updateScore: () => { } //今回は使わないので空でOK
    };

    // Act
    sut.update(gameMock);

    // Assert
    expect(gameOverCalled).toBe(true);
  });




});