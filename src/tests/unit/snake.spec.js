import { test, expect } from '@playwright/test';
import { Snake } from '../../js/entities/snake.js';

const config = {
  TILE_COUNT: 20,
  INITIAL_SNAKE: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]
};

test.describe('Snake Class', () => {

  test('初期化が正しい', () => {
    const snake = new Snake(config);

    expect(snake.segments.length).toBe(3);
    expect(snake.segments[0]).toEqual({ x: 10, y: 10 });
  });

  test('updateで前進する', () => {
    const snake = new Snake(config);

    snake.update();

    expect(snake.segments[0]).toEqual({ x: 11, y: 10 });
  });

  test('popTailで長さ維持', () => {
    const snake = new Snake(config);

    snake.update();
    snake.popTail();

    expect(snake.segments.length).toBe(3);
  });

  test('壁衝突検知', () => {
    const snake = new Snake(config);

    snake.segments[0] = { x: -1, y: 0 };

    expect(snake.checkWallCollision()).toBeTruthy();
  });

});