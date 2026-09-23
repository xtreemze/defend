import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import showcase from "./manifest.mjs";
import mediaConfig from "./playwright.showcase.config.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const outputRoot = path.resolve(packageRoot, showcase.outputRoot);
const baseURL = process.env.SHOWCASE_BASE_URL ?? "http://127.0.0.1:5173";
const requireFromStorybook = createRequire(
  new URL("../../storybook/package.json", import.meta.url),
);
const { chromium } = requireFromStorybook("playwright");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function activate(page, project, target) {
  if (project.key === "mobile") {
    await target.tap();
    return;
  }
  await target.hover();
  await target.click();
}

async function pressArenaPauseShortcut(page) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await page.keyboard.press("Space");
}

async function ensureControls(page) {
  const toggle = page.getByRole("button", { name: "Controls" });
  if ((await toggle.count()) === 0) return;
  if ((await toggle.getAttribute("aria-expanded")) === "false") {
    await toggle.click();
  }
}

async function dismissIntro(page) {
  const dismiss = page.locator("[data-preview-intro-dismiss]");
  if ((await dismiss.count()) > 0 && (await dismiss.isVisible())) {
    await dismiss.click();
  }
}

async function addBranding(page, project, scene) {
  await page.evaluate(
    ({ product, projectName, title }) => {
      const old = document.querySelector("[data-showcase-overlay]");
      old?.remove();
      const overlay = document.createElement("div");
      overlay.dataset.showcaseOverlay = "true";
      overlay.setAttribute("aria-hidden", "true");
      overlay.textContent = product + " · " + title + " · " + projectName;
      Object.assign(overlay.style, {
        position: "fixed",
        top: "14px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "2147483647",
        maxWidth: "min(72vw, 760px)",
        padding: "7px 12px",
        border: "1px solid rgba(232,216,192,.28)",
        borderRadius: "999px",
        background: "rgba(8,5,13,.72)",
        color: "rgba(243,234,223,.92)",
        font: "600 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace",
        letterSpacing: ".04em",
        textAlign: "center",
        pointerEvents: "none",
        backdropFilter: "blur(8px)",
      });
      document.body.append(overlay);
    },
    {
      product: showcase.product,
      projectName: project.name,
      title: scene.title,
    },
  );
}

async function runArena(page, project, checkpoint) {
  const canvas = page.locator("#renderCanvas");
  const box = await canvas.boundingBox();
  assert.ok(box, "arena canvas must have a bounding box");

  if (project.key === "desktop") {
    await page.mouse.move(box.x + box.width * 0.54, box.y + box.height * 0.55);
    await page.mouse.wheel(0, -420);
    await sleep(400);
    await activate(page, project, page.locator("#arena-camera"));
  } else {
    await page.touchscreen.tap(
      Math.round(box.x + box.width * 0.52),
      Math.round(box.y + box.height * 0.52),
    );
  }

  const pause = page.locator("#arena-pause");
  if (project.key === "desktop") {
    await pause.hover();
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await page.keyboard.press("Space");
  } else {
    await activate(page, project, pause);
  }
  assert.equal(await pause.getAttribute("aria-pressed"), "true");
  assert.match((await pause.textContent()) ?? "", /Resume simulation/);
  await checkpoint();
  if (project.key === "desktop") {
    await pressArenaPauseShortcut(page);
  } else {
    await activate(page, project, pause);
  }
  assert.equal(await pause.getAttribute("aria-pressed"), "false");
  if (project.key === "desktop") {
    await activate(page, project, page.locator("#arena-camera"));
  }
}

async function runMothership(page, project, checkpoint) {
  const fast = page.locator("#fast");
  await activate(page, project, fast);
  assert.match((await fast.textContent()) ?? "", /Normal drain/);
  await sleep(650);

  const camera = page.locator("#camera");
  const before = (await camera.textContent()) ?? "";
  await activate(page, project, camera);
  assert.notEqual((await camera.textContent()) ?? "", before);
  await checkpoint();
  await activate(page, project, camera);
  await activate(page, project, fast);
  assert.match((await fast.textContent()) ?? "", /Fast drain/);
  await activate(page, project, page.locator("#reset"));
}

async function runNavigation(page, project, checkpoint) {
  const metrics = page.locator("#metrics");
  const initial = (await metrics.textContent()) ?? "";
  await activate(page, project, page.locator("#far"));
  await sleep(850);
  const moved = (await metrics.textContent()) ?? "";
  assert.notEqual(moved, initial, "navigation metrics must change after targeting");

  const camera = page.locator("#camera");
  const before = (await camera.textContent()) ?? "";
  await activate(page, project, camera);
  assert.notEqual((await camera.textContent()) ?? "", before);
  await checkpoint();
  await activate(page, project, camera);
  await activate(page, project, page.locator("#reset"));
}

async function runGeothermal(page, project, checkpoint) {
  const pressure = page.locator("#pressure");
  await activate(page, project, pressure);
  assert.match((await pressure.textContent()) ?? "", /Normal pressure/);
  await sleep(900);
  await activate(page, project, page.locator("#eruption"));
  await sleep(500);
  await checkpoint();
  await activate(page, project, pressure);
  assert.match((await pressure.textContent()) ?? "", /Accelerate pressure/);
  await activate(page, project, page.locator("#reset"));
}

async function runTowerTerrain(page, project, checkpoint) {
  const metrics = page.locator("#metrics");
  const readProjectileCount = async () => {
    const text = (await metrics.textContent()) ?? "";
    const match = text.match(/projectiles:\s*(\d+)/);
    return Number(match?.[1] ?? 0);
  };

  const before = await readProjectileCount();
  await activate(page, project, page.locator("#miss2"));
  await page.waitForFunction(
    ({ previous }) => {
      const text = document.querySelector("#metrics")?.textContent ?? "";
      const match = text.match(/projectiles:\s*(\d+)/);
      return Number(match?.[1] ?? 0) > previous;
    },
    { previous: before },
    { timeout: 3000 },
  );
  await activate(page, project, page.locator("#drop"));
  await sleep(500);
  await checkpoint();
  await activate(page, project, page.locator("#reset"));
}

const actions = {
  arena: runArena,
  mothership: runMothership,
  navigation: runNavigation,
  geothermal: runGeothermal,
  towerTerrain: runTowerTerrain,
};

async function recordScene(browser, project, scene) {
  const formRoot = path.join(outputRoot, "raw", project.key);
  const videoScratch = path.join(outputRoot, "playwright", project.key, scene.id);
  await mkdir(formRoot, { recursive: true });
  await mkdir(videoScratch, { recursive: true });

  const context = await browser.newContext({
    viewport: project.viewport,
    hasTouch: project.device.hasTouch,
    isMobile: project.device.isMobile,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    recordVideo: {
      dir: videoScratch,
      size: project.viewport,
    },
  });
  const page = await context.newPage();
  const recordingStartedAt = Date.now();
  const video = page.video();
  assert.ok(video, "Playwright video capture must be active");

  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  const response = await page.goto(baseURL + scene.path, {
    waitUntil: "networkidle",
    timeout: 30_000,
  });
  assert.ok(response && response.status() < 400, scene.id + " must load successfully");
  await page.waitForFunction(
    () => document.body.dataset.previewReady === "true",
    undefined,
    { timeout: 20_000 },
  );
  await dismissIntro(page);
  await ensureControls(page);
  await addBranding(page, project, scene);
  await sleep(450);
  const sceneStartMs = Date.now() - recordingStartedAt;

  let checkpointTaken = false;
  const screenshotPath = path.join(formRoot, scene.id + ".png");
  const checkpoint = async () => {
    await page.screenshot({ path: screenshotPath, fullPage: false });
    checkpointTaken = true;
  };

  const action = actions[scene.action];
  assert.ok(action, "unknown showcase action " + scene.action);
  await action(page, project, checkpoint);
  assert.equal(checkpointTaken, true, scene.id + " must capture its demonstrated state");
  await sleep(550);
  const sceneEndMs = Date.now() - recordingStartedAt;

  assert.deepEqual(browserErrors, [], scene.id + " produced browser errors");

  const metadata = {
    product: showcase.product,
    project: project.name,
    formFactor: project.key,
    viewport: project.viewport,
    scene,
    trim: {
      startSeconds: Math.max(0, (sceneStartMs - 150) / 1000),
      durationSeconds: Math.max(0.5, (sceneEndMs - sceneStartMs + 300) / 1000),
    },
    capturedAt: new Date().toISOString(),
  };
  await writeFile(
    path.join(formRoot, scene.id + ".json"),
    JSON.stringify(metadata, null, 2) + "\n",
  );

  const videoPath = path.join(formRoot, scene.id + ".webm");
  await context.close();
  await video.saveAs(videoPath);
}

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    for (const configuredProject of mediaConfig.projects) {
      const project = configuredProject.metadata.showcase;
      for (const scene of showcase.scenes) {
        process.stdout.write("capture " + project.key + " / " + scene.id + "\n");
        await recordScene(browser, project, scene);
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    path.join(outputRoot, "manifest.json"),
    JSON.stringify(showcase, null, 2) + "\n",
  );
}

await main();
