import { test, expect } from '@playwright/test';
import { Food } from '../../js/food.js';
import { SnakeGameConfig } from '../../js/config.js';

test.describe('Food (unit)', () => {

  test('範囲内に出る', () => {
    const food = new Food(SnakeGameConfig);

    for (let i = 0; i < 20; i++) {
      food.randomize();

      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeGreaterThanOrEqual(0);
    }
  });

});