import { defineConfig, devices, VideoMode } from '@playwright/test'
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL as string;
const TIMEOUT = process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 5000;
const EXPECT_TIMEOUT = process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : 5000;
const PULSE_REPORT_DIR = path.resolve(__dirname, "test-results/pulse-report");


export default defineConfig({
  testDir: '.',
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  timeout: TIMEOUT,
  expect: {
    timeout: EXPECT_TIMEOUT // assertions timeout
  },
  retries: 0,
  reporter: [
    [
      "@arghajit/playwright-pulse-report",
      {
        outputDir: PULSE_REPORT_DIR,
        resetOnEachRun: false, // Default is true
      },
    ],
    ['html', { outputFolder: 'test-results/playwright-report' }],
    ['json', { outputFile: 'results.json' }],
    ['list']
  ],
  use: {
    baseURL: BASE_URL,
    // baseURL: 'http://localhost:5173',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    headless: process.env.PW_HEADLESS === 'false' ? false : true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: process.env.PW_VIDEO as VideoMode,
      size: { width: 640, height: 480 }
    },
    // video: 'retain-on-failure'
  },
  projects: [
    {
        name: 'chromium',
        use: {
            ...devices['Desktop Chrome'],
            launchOptions: {
                args: [
                    '--disable-web-security',
                    '--disable-blink-features=AutomationControlled']
            }
        }
    },
    // {
    //     name: 'firefox',
    //     use: { ...devices['Desktop Firefox'] }
    // },
    // {
    //     name: 'webkit',
    //     use: { ...devices['Desktop Safari'] }
    // }
  ]
})
