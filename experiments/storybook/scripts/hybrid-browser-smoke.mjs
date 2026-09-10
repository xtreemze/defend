import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.HYBRID_SMOKE_URL ?? "http://127.0.0.1:5173";
const artifactDirectory = new URL("../hybrid-smoke-artifacts/", import.meta.url);
const pages = [
  ["main", "/"],
  ["mothership", "/mothership.html"],
  ["navigation", "/navigation.html"],
  ["routing", "/routing.html"],
  ["geothermal", "/geothermal.html"],
  ["tower-terrain", "/tower-terrain.html"],
];

await mkdir(artifactDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
let failed = false;

async function captureFailure(page, name) {
  try {
    await page.screenshot({
      path: new URL(`${name}.png`, artifactDirectory).pathname,
      fullPage: true,
    });
  } catch {
    // Preserve the original failure when screenshot capture is unavailable.
  }
}

async function visit(name, path) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    const response = await page.goto(`${baseUrl}${path}`, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    if (!response || response.status() >= 400) {
      throw new Error(`${name} returned HTTP ${response?.status() ?? "no response"}`);
    }

    await page.waitForFunction(
      () => document.querySelector("#metrics")?.textContent !== "initializing…",
      undefined,
      { timeout: 30_000 },
    );

    if (name === "main") {
      await page.waitForFunction(
        () => {
          const diagnostics = window.__defendParallelDiagnostics;
          return (
            diagnostics &&
            diagnostics.aiCompleted > 0 &&
            diagnostics.combatCompleted > 0 &&
            diagnostics.audioCompleted > 0
          );
        },
        undefined,
        { timeout: 30_000 },
      );

      const beforeAudio = await page.evaluate(() => ({
        diagnostics: window.__defendParallelDiagnostics,
        workletSupported:
          "AudioContext" in window &&
          "AudioWorkletNode" in window &&
          "audioWorklet" in AudioContext.prototype,
      }));
      if (!beforeAudio.diagnostics || beforeAudio.diagnostics.workerErrors !== 0) {
        throw new Error(
          `worker diagnostics unhealthy: ${JSON.stringify(beforeAudio.diagnostics)}`,
        );
      }

      if (beforeAudio.workletSupported) {
        await page.locator("#renderCanvas").click({ position: { x: 20, y: 20 } });
        await page.waitForFunction(
          () => {
            const state = window.__defendParallelDiagnostics?.audioState;
            return state === "ready" || state === "failed" || state === "unavailable";
          },
          undefined,
          { timeout: 15_000 },
        );
        const audioState = await page.evaluate(
          () => window.__defendParallelDiagnostics?.audioState,
        );
        if (audioState !== "ready") {
          throw new Error(`AudioWorklet failed to become ready: ${audioState}`);
        }
      }

      const diagnostics = await page.evaluate(() => window.__defendParallelDiagnostics);
      if (!diagnostics || diagnostics.workerErrors !== 0) {
        throw new Error(`worker diagnostics regressed: ${JSON.stringify(diagnostics)}`);
      }
      console.log(
        `main workers: ai=${diagnostics.aiCompleted}/${diagnostics.aiApplied} combat=${diagnostics.combatCompleted}/${diagnostics.combatTargets} audio=${diagnostics.audioCompleted}/${diagnostics.audioVoices} stale=${diagnostics.staleResults} audioState=${diagnostics.audioState}`,
      );
    }

    if (pageErrors.length > 0 || consoleErrors.length > 0) {
      throw new Error(
        `${name} browser errors: ${[...pageErrors, ...consoleErrors].join(" | ")}`,
      );
    }
    console.log(`PASS ${name}`);
  } catch (error) {
    failed = true;
    await captureFailure(page, name);
    console.error(`FAIL ${name}:`, error);
  } finally {
    await page.close();
  }
}

try {
  for (const [name, path] of pages) {
    await visit(name, path);
  }
} finally {
  await browser.close();
}

if (failed) {
  process.exitCode = 1;
}
