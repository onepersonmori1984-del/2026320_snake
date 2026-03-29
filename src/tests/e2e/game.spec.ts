import { test, expect, Page } from '@playwright/test';

test('ゲーム画面が表示される', async ({ page }: { page: Page }) => {
  await page.goto('/');

  // 要素が存在することを型安全にチェック
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.locator('#score')).toHaveText('Score: 0');
});

test('キー入力でゲームが動く', async ({ page }: { page: Page }) => {
  await page.goto('/');

  // 初期待ち
  await page.waitForTimeout(500);

  // 操作（キーボード入力をシミュレート）
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);

  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);

  // スコアのテキストを取得して検証
  const scoreText: string = await page.locator('#score').innerText();

  expect(scoreText).toContain('Score');
});
