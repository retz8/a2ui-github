import {test, expect} from '@playwright/test';

// Non-screenshot smoke: the app shell mounts. Add per-component visual baselines
// with expect(page).toHaveScreenshot() as you author components.
test('app shell mounts with a fixture selector', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('fixture-select')).toBeVisible();
});
