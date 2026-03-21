import { test, expect } from '@playwright/test';
import { Food } from '../../js/entities/food.js';

const config = {
  TILE_COUNT: 20
};

test.describe('Food Class', () => {

  test('範囲内に生成される', () => {
    const food = new Food(config);

    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(config.TILE_COUNT);
    expect(food.y).toBeLessThan(config.TILE_COUNT);
  });

  test('snakeと重ならない', () => {
    const food = new Food(config);

    const snake = [{ x: 5, y: 5 }];

    food.randomize(snake);

    expect(food.x !== 5 || food.y !== 5).toBeTruthy();
  });

});