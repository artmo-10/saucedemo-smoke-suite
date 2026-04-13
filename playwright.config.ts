import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on',   // ← always on so trace.zip is always produced
  },

  globalSetup: './utils/globalSetup.ts',

  projects: [
    // ── Setup projects (run auth.setup.ts once per browser) ──
    {
      name: 'setup-chromium',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup-firefox',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'setup-webkit',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // ── Test projects (load storageState, skip login UI) ──
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/chromium.json',
      },
      dependencies: ['setup-chromium'],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/firefox.json',
      },
      dependencies: ['setup-firefox'],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: '.auth/webkit.json',
      },
      dependencies: ['setup-webkit'],
      testIgnore: /.*\.setup\.ts/,
    },
  ],
});