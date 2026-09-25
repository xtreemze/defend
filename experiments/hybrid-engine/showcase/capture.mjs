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

async function startCanvasCapture(page, project) {
  const requestedFps = showcase.capture.videoFps;
  const videoBitsPerSecond = project.key === "desktop" ? 20_000_000 : 8_000_000;
  const result = await page.evaluate(
    async ({ fps, bitrate }) => {
      const canvas = document.querySelector("#renderCanvas");
      if (!(canvas instanceof HTMLCanvasElement) || canvas.width <= 0 || canvas.height <= 0) {
        throw new Error("Showcase canvas is unavailable or has no render surface.");
      }

      const stream = canvas.captureStream(fps);
      const mimeType =
        ["video/webm;codecs=vp8", "video/webm;codecs=vp9", "video/webm"].find((candidate) =>
          MediaRecorder.isTypeSupported(candidate),
        ) ?? "";
      const options = { videoBitsPerSecond: bitrate };
      const recorder =
        mimeType === ""
          ? new MediaRecorder(stream, options)
          : new MediaRecorder(stream, { ...options, mimeType });
      const chunks = [];
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      });

      window.__defendShowcaseCapture = {
        recorder,
        chunks,
        stream,
        width: canvas.width,
        height: canvas.height,
        mimeType: recorder.mimeType || mimeType || "video/webm",
      };

      recorder.start(250);
      if (recorder.state !== "recording") {
        throw new Error("Showcase recorder failed to enter recording state.");
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      return {
        width: canvas.width,
        height: canvas.height,
        mimeType: recorder.mimeType || mimeType || "video/webm",
      };
    },
    { fps: requestedFps, bitrate: videoBitsPerSecond },
  );

  return { ...result, requestedFps, videoBitsPerSecond };
}

async function stopCanvasCapture(page) {
  return page.evaluate(async () => {
    const state = window.__defendShowcaseCapture;
    if (!state) throw new Error("No active showcase capture exists.");

    await new Promise((resolve, reject) => {
      state.recorder.addEventListener("stop", resolve, { once: true });
      state.recorder.addEventListener(
        "error",
        () => reject(new Error("MediaRecorder failed while finalizing showcase capture.")),
        { once: true },
      );
      state.recorder.stop();
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (state.chunks.length === 0) {
      throw new Error("Showcase capture produced an empty video stream.");
    }

    const blob = new Blob(state.chunks, { type: state.mimeType });
    const videoBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          if (typeof reader.result !== "string") {
            reject(new Error("Unable to serialize showcase capture."));
            return;
          }
          const comma = reader.result.indexOf(",");
          resolve(comma === -1 ? reader.result : reader.result.slice(comma + 1));
        },
        { once: true },
      );
      reader.addEventListener(
        "error",
        () => reject(reader.error ?? new Error("FileReader failed.")),
        { once: true },
      );
      reader.readAsDataURL(blob);
    });

    for (const track of state.stream.getTracks()) track.stop();
    window.__defendShowcaseCapture = undefined;
    return {
      videoBase64,
      width: state.width,
      height: state.height,
      mimeType: state.mimeType,
    };
  });
}

async function recordScene(browser, project, scene) {
  const formRoot = path.join(outputRoot, "raw", project.key);
  await mkdir(formRoot, { recursive: true });

  const context = await browser.newContext({
    viewport: project.viewport,
    hasTouch: project.device.hasTouch,
    isMobile: project.device.isMobile,
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

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

  const captureInfo = await startCanvasCapture(page, project);
  const startedAt = Date.now();

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

  const targetMs = Math.round(scene.durationSeconds * 1000);
  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs < targetMs) await sleep(targetMs - elapsedMs);

  const capture = await stopCanvasCapture(page);
  const captureWallSeconds = (Date.now() - startedAt) / 1000;
  assert.deepEqual(browserErrors, [], scene.id + " produced browser errors");

  await writeFile(
    path.join(formRoot, scene.id + ".webm"),
    Buffer.from(capture.videoBase64, "base64"),
  );
  const metadata = {
    product: showcase.product,
    project: project.name,
    formFactor: project.key,
    viewport: project.viewport,
    scene,
    durationSeconds: scene.durationSeconds,
    requestedFps: captureInfo.requestedFps,
    videoBitsPerSecond: captureInfo.videoBitsPerSecond,
    captureWallSeconds,
    source: {
      width: capture.width,
      height: capture.height,
      mimeType: capture.mimeType,
    },
    capturedAt: new Date().toISOString(),
  };
  await writeFile(
    path.join(formRoot, scene.id + ".json"),
    JSON.stringify(metadata, null, 2) + "\n",
  );

  await context.close();
}

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const browser = await chromium.launch(mediaConfig.launchOptions);
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
