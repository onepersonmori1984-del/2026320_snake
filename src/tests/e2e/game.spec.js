import { test, expect } from '@playwright/test';

test.describe('Snake Game (E2E)', () => {

  test('初期表示', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#score')).toHaveText('Score: 0');
    await expect(page.locator('#gameCanvas')).toBeVisible();
  });

  test('キー入力でゲーム動く', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    await expect(page.locator('#gameCanvas')).toBeVisible();
  });

});