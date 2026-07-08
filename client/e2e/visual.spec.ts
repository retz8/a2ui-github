import {test, expect} from '@playwright/test';

const FIXTURE_NAMES = [
  'text',
  'text-bound',
  'text-sizes',
  'text-weights',
  'text-as',
  'text-whitespace',
  'button-fn',
  'button-event',
  'button-variants',
  'button-sizes',
  'button-aligncontent',
  'button-disabled',
  'button-inactive',
  'button-loading',
  'button-block',
  'button-labelwrap',
  'button-count',
  'button-icon',
  'button-leading-visual',
  'button-trailing-visual',
  'button-trailing-action',
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
