import { test, expect } from "playwright/test";

const BASE_URL = 'http://localhost:5173';

const PAGES = [
  { path: '/', name: 'main' },
  { path: '/mothership.html', name: 'mothership' },
  { path: '/navigation.html', name: 'navigation' },
  { path: '/routing.html', name: 'routing' },
  { path: '/geothermal.html', name: 'geothermal' },
  { path: '/tower-terrain.html', name: 'tower-terrain' },
];

test.describe('Hybrid engine browser smoke tests', () => {
  for (const page of PAGES) {
    test(`${page.name} page loads without errors`, async ({ browser }) => {
      const context = await browser.newContext();
      const page_obj = await context.newPage();

      // Collect all console messages and errors
      const consoleErrors: string[] = [];
      const consoleWarnings: string[] = [];

      page_obj.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        } else if (msg.type() === 'warning') {
          consoleWarnings.push(msg.text());
        }
      });

      // Fail on uncaught exceptions
      let uncaughtException: Error | null = null;
      page_obj.on('pageerror', (err) => {
        uncaughtException = err;
      });

      // Navigate to the page
      const response = await page_obj.goto(`${BASE_URL}${page.path}`, {
        waitUntil: 'networkidle',
      });

      // Verify page loaded successfully
      expect(response?.status()).toBeLessThan(400);

      // Wait a bit for any initialization errors to appear
      await page_obj.waitForTimeout(2000);

      // Check for uncaught exceptions
      if (uncaughtException) {
        throw new Error(
          `Uncaught exception on ${page.name}: ${uncaughtException.message}`
        );
      }

      // Fail if there were console errors (except expected ones)
      const ignoredErrors: readonly string[] = [];

      const unexpectedErrors = consoleErrors.filter(
        (err) =>
          !ignoredErrors.some((pattern) =>
            err.toLowerCase().includes(pattern.toLowerCase())
          )
      );

      expect(unexpectedErrors).toEqual(
        [],
        `${page.name} page had console errors: ${unexpectedErrors.join('; ')}`
      );

      // Verify WASM module is loaded
      const wasmLoaded = await page_obj.evaluate(() => {
        // Check if the WASM module is available in the window object
        return "defend_hybrid_runtime" in globalThis;
      });

      expect(wasmLoaded).toBe(
        true,
        `WASM module not loaded on ${page.name} page`
      );

      // Verify basic DOM structure exists
      const bodyExists = await page_obj.locator('body').count();
      expect(bodyExists).toBeGreaterThan(0);

      // Clean up
      await context.close();
    });
  }

  test('inspect mode loads without errors', async ({ browser }) => {
    const context = await browser.newContext();
    const page_obj = await context.newPage();

    const consoleErrors: string[] = [];
    page_obj.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    let uncaughtException: Error | null = null;
    page_obj.on('pageerror', (err) => {
      uncaughtException = err;
    });

    // Test Inspector mode on main page
    const response = await page_obj.goto(`${BASE_URL}/?inspect=1`, {
      waitUntil: 'networkidle',
    });

    expect(response?.status()).toBeLessThan(400);

    // Wait for Inspector to initialize
    await page_obj.waitForTimeout(2000);

    if (uncaughtException) {
      throw new Error(
        `Uncaught exception in inspector mode: ${uncaughtException.message}`
      );
    }

    // Inspector should not cause errors (it's an optional debug tool)
    // but we verify it loads without crashing the main app
    const bodyExists = await page_obj.locator('body').count();
    expect(bodyExists).toBeGreaterThan(0);

    await context.close();
  });
});
