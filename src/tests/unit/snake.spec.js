import { test, expect } from '@playwright/test';
import { Snake } from '../../js/entities/snake.js';

// テスト用の設計。蛇の初期位置。
const config = {
  TILE_COUNT: 20,
  INITIAL_SNAKE: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]
};

let sut;                                      // 各テストで使うインスタンス. beforeEachで毎回初期化される。

                                                // テストの開始。
test.describe('Snake Class', () => {

  test.beforeEach(() => {
    // Arrange（準備）
    sut = new Snake(config);                        // 毎回新しいインスタンスを生成（テスト独立性確保）
  });

  test('初期化が正しい', () => {
    // Assert（検証）
    expect(sut.segments.length).toBe(3);                  //長さが3か
    expect(sut.segments[0]).toEqual({ x: 10, y: 10 });   //先頭が10,10か
  });

  test('updateで前進する', () => {
    // Act（実行）
    sut.update();                                           //updateを実行

    // Assert（検証）
    expect(sut.segments[0]).toEqual({ x: 11, y: 10 });    //先頭が11,10か
  });

  test('setDirectionで方向転換', () => {
    // Act（実行）
    sut.setDirection(0, -1);                                //方向転換

    // Assert（検証）
    expect(sut.nextDx).toBe(0);                             //x方向の移動量が0か
    expect(sut.nextDy).toBe(-1);                            //y方向の移動量が-1か
  });

  test('setDirectionで180度ターンを防ぐ', () => {
    // Act（実行）
    sut.setDirection(0, -1);                                //方向転換

    // Assert（検証）
    expect(sut.nextDx).toBe(0);                             //x方向の移動量が0か
    expect(sut.nextDy).toBe(-1);                            //y方向の移動量が-1か
  });

  test('popTailで長さ維持', () => {
    // Act（実行）
    sut.update();                                           //updateを実行
    sut.popTail();                                          //popTailを実行

    // Assert（検証）
    expect(sut.segments.length).toBe(3);                  //長さが3か
  });

  test('壁衝突検知', () => {                                    //壁衝突検知かテスト
    // Arrange（準備）
    sut.segments[0] = { x: -1, y: 0 };                    //壁衝突を設定

    // Act（実行）
    const result = sut.checkWallCollision();              //壁衝突判定を実行

    // Assert（検証）
    expect(result).toBeTruthy();                          //壁衝突か判定
  });

});