import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  expect: {toHaveScreenshot: {animations: 'disabled'}},
  // Pin the browser time zone so RelativeTime's absolute-date fixtures (hour / time-zone parts)
  // render identically regardless of the runner's locale, keeping their baselines deterministic.
  use: {baseURL: 'http://localhost:4173', timezoneId: 'UTC'},
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome'], viewport: {width: 1024, height: 768}},
    },
  ],
  webServer: {
    command: 'yarn build && yarn preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
