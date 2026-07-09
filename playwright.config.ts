import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // booking journey has state dependency; keep sequential
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://www.tui.nl',
    headless: true,
    viewport: { width: 1440, height: 900 },
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'test-results',

  // Global timeout per test (10 minutes — the booking funnel can be slow)
  timeout: 600_000,
  expect: {
    timeout: 20_000,
  },
});
