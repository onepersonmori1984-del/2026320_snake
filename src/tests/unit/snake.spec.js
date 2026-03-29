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

  test('setDirectionで180度ターンを防ぐ（右進行中に左へは曲がれない）', () => {
    // Act（実行）
    // デフォルトは右(dx:1, dy:0)
    sut.setDirection(-1, 0);                                

    // Assert（検証）
    expect(sut.nextDx).toBe(1);                             // 180度転換は無視され、右のまま
    expect(sut.nextDy).toBe(0);
  });

  test('setDirectionで90度ターンは可能', () => {
    // Act（実行）
    sut.setDirection(0, 1);                                 // 下へ

    // Assert（検証）
    expect(sut.nextDx).toBe(0);
    expect(sut.nextDy).toBe(1);
  });

  test('popTailで長さ維持', () => {
    // Act（実行）
    sut.update();                                           // 1マス進む (長さが4になる)
    sut.popTail();                                          // 末尾を消す (長さが3に戻る)

    // Assert（検証）
    expect(sut.segments.length).toBe(3);
  });

  test('壁衝突検知（左端）', () => {
    // Arrange
    sut.segments[0] = { x: -1, y: 10 };

    // Act
    const result = sut.checkWallCollision();

    // Assert
    expect(result).toBe(true);
  });

  test('壁衝突検知（右端）', () => {
    // Arrange
    sut.segments[0] = { x: config.TILE_COUNT, y: 10 };

    // Act
    const result = sut.checkWallCollision();

    // Assert
    expect(result).toBe(true);
  });

  test('自分自身への衝突を検知する', () => {
    // Arrange
    // 頭を2番目のセグメントと同じ位置にする
    sut.segments = [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 11, y: 11 },
      { x: 10, y: 11 },
      { x: 10, y: 10 } // ここに頭が重なる
    ];

    // Act
    const result = sut.checkSelfCollision();

    // Assert
    expect(result).toBe(true);
  });

  test('自分自身に衝突していない場合はfalseを返す', () => {
    // Act
    const result = sut.checkSelfCollision();

    // Assert
    expect(result).toBe(false);
  });

});