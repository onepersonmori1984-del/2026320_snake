const { test, expect } = require('@playwright/test');

test.describe('Food Class (White-box)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should spawn within tile bounds on randomize()', async ({ page }) => {
    const results = await page.evaluate(() => {
      const food = new window.Food(window.SnakeGameConfig);
      const config = window.SnakeGameConfig;
      const positions = [];
      
      for (let i = 0; i < 50; i++) {
        food.randomize();
        positions.push({ x: food.x, y: food.y });
      }
      return { positions, tileCount: config.TILE_COUNT };
    });

    for (const pos of results.positions) {
      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.x).toBeLessThan(results.tileCount);
      expect(pos.y).toBeGreaterThanOrEqual(0);
      expect(pos.y).toBeLessThan(results.tileCount);
    }
  });

  test('should not spawn on top of existing snake segments', async ({ page }) => {
    const result = await page.evaluate(() => {
      const food = new window.Food(window.SnakeGameConfig);
      const tc = window.SnakeGameConfig.TILE_COUNT;
      const snakeSegments = [];
      
      // 7,7 以外すべてをヘビの体で埋める
      for (let x = 0; x < tc; x++) {
        for (let y = 0; y < tc; y++) {
          if (x !== 7 || y !== 7) { 
            snakeSegments.push({ x, y });
          }
        }
      }
      
      food.randomize(snakeSegments);
      return { x: food.x, y: food.y };
    });

    expect(result.x).toBe(7);
    expect(result.y).toBe(7);
  });
});
