const { test, expect } = require('@playwright/test');

test.describe('Snake Class (White-box)', () => {
  test.beforeEach(async ({ page }) => {
    // ページをロードして、必要なクラスが window に定義された状態にする
    await page.goto('/');
  });

  test('should initialize correctly', async ({ page }) => {
    const stats = await page.evaluate(() => {
      const snake = new window.Snake(window.SnakeGameConfig);
      return {
        length: snake.segments.length,
        head: snake.segments[0],
        dx: snake.dx,
        dy: snake.dy
      };
    });

    expect(stats.length).toBe(3);
    expect(stats.head).toEqual({ x: 10, y: 10 });
    expect(stats.dx).toBe(1);
    expect(stats.dy).toBe(0);
  });

  test('update() and popTail() handle movement', async ({ page }) => {
    const stats = await page.evaluate(() => {
      const snake = new window.Snake(window.SnakeGameConfig);
      snake.update();
      const afterUpdate = {
        head: snake.segments[0],
        length: snake.segments.length
      };
      snake.popTail();
      const afterPop = {
        length: snake.segments.length,
        tail: snake.segments[snake.segments.length - 1]
      };
      return { afterUpdate, afterPop };
    });

    expect(stats.afterUpdate.head).toEqual({ x: 11, y: 10 });
    expect(stats.afterUpdate.length).toBe(4);
    expect(stats.afterPop.length).toBe(3);
    expect(stats.afterPop.tail).toEqual({ x: 9, y: 10 });
  });

  test('setDirection() correctly queues direction change', async ({ page }) => {
    const stats = await page.evaluate(() => {
      const snake = new window.Snake(window.SnakeGameConfig);
      snake.setDirection(0, 1);
      const queued = { nextDx: snake.nextDx, nextDy: snake.nextDy };
      snake.update();
      const headAfterUpdate = snake.segments[0];
      return { queued, headAfterUpdate };
    });

    expect(stats.queued.nextDx).toBe(0);
    expect(stats.queued.nextDy).toBe(1);
    expect(stats.headAfterUpdate).toEqual({ x: 10, y: 11 });
  });

  test('setDirection() ignores 180-degree turns', async ({ page }) => {
    const stats = await page.evaluate(() => {
      const snake = new window.Snake(window.SnakeGameConfig);
      const initialDx = snake.nextDx;
      const initialDy = snake.nextDy;
      
      snake.setDirection(-1, 0); // Initial is (1,0) so (-1,0) is backward
      return {
        initialDx, initialDy,
        nextDx: snake.nextDx,
        nextDy: snake.nextDy
      };
    });

    expect(stats.nextDx).toBe(stats.initialDx);
    expect(stats.nextDy).toBe(stats.initialDy);
  });

  test('checkWallCollision() detects collisions properly', async ({ page }) => {
    const results = await page.evaluate(() => {
      const snake = new window.Snake(window.SnakeGameConfig);
      const config = window.SnakeGameConfig;
      
      const results = {};
      
      // SAFE
      snake.segments[0] = { x: 10, y: 10 };
      results.safe = snake.checkWallCollision();

      // LEFT
      snake.segments[0] = { x: -1, y: 10 };
      results.left = snake.checkWallCollision();

      // RIGHT
      snake.segments[0] = { x: config.TILE_COUNT, y: 10 };
      results.right = snake.checkWallCollision();
      
      return results;
    });

    expect(results.safe).toBe(false);
    expect(results.left).toBe(true);
    expect(results.right).toBe(true);
  });

  test('checkSelfCollision() detects self collision', async ({ page }) => {
    const results = await page.evaluate(() => {
      const snake = new window.Snake(window.SnakeGameConfig);
      
      const results = {};
      
      // COLLISION
      snake.segments = [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 11, y: 11 },
        { x: 10, y: 11 },
        { x: 10, y: 10 }
      ];
      results.collision = snake.checkSelfCollision();

      // NO COLLISION
      snake.segments = [
        { x: 10, y: 10 },
        { x: 9, y: 10 }
      ];
      results.noCollision = snake.checkSelfCollision();
      
      return results;
    });

    expect(results.collision).toBe(true);
    expect(results.noCollision).toBe(false);
  });
});
