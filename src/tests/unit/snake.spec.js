import { test, expect } from '@playwright/test';
import { Snake } from '../../js/snake.js';
import { SnakeGameConfig } from '../../js/config.js';

test.describe('Snake (unit)', () => {

  test('初期化', () => {
    const snake = new Snake(SnakeGameConfig);

    expect(snake.segments.length).toBe(3);
    expect(snake.segments[0]).toEqual({ x: 10, y: 10 });
  });

  test('移動', () => {
    const snake = new Snake(SnakeGameConfig);

    snake.update();
    expect(snake.segments[0]).toEqual({ x: 11, y: 10 });

    snake.popTail();
    expect(snake.segments.length).toBe(3);
  });

});