import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  expect: {toHaveScreenshot: {animations: 'disabled'}},
  use: {baseURL: 'http://localhost:4173'},
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
