import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright smoke, accessibility, keyboard and link checks (ARCHITECTURE.md §13) against
 * a production build at the two reference sizes. Run `pnpm build` first; the web server
 * below serves it. Locally an installed browser can be used instead of downloading one:
 * `PW_CHANNEL=msedge pnpm test:e2e`.
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const channel = process.env.PW_CHANNEL || undefined

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // Browsers, axe and the server share one machine; more workers than half the cores
  // starves the server and turns the smoke tests into load tests.
  workers: '50%',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
        channel,
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel,
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'pnpm start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
