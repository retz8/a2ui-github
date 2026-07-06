import {test, expect} from '@playwright/test';

const FIXTURE_NAMES = [
  'text',
  'text-bound',
  'button-fn',
  'button-event',
  'button-variants',
  'icon-names',
  'icon-sizes',
  'icon-fills',
];

for (const name of FIXTURE_NAMES) {
  test(`baseline: ${name}`, async ({page}) => {
    await page.goto(`/?fixture=${name}`);
    await expect(page.getByTestId('fixture-view')).toBeVisible();
    await expect(page).toHaveScreenshot(`${name}.png`, {fullPage: true});
  });
}
