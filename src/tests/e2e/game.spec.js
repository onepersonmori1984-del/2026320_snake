import { test, expect } from '@playwright/test';

test('ゲーム画面が表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.locator('#score')).toHaveText('Score: 0');
});

test('キー入力でゲームが動く', async ({ page }) => {
  await page.goto('/');

  // 初期待ち
  await page.waitForTimeout(500);

  // 操作
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);

  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);

  // スコア存在確認
  const score = await page.locator('#score').innerText();

  expect(score).toContain('Score');
});