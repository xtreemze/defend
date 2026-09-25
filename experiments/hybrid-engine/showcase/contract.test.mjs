import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import showcase from "./manifest.mjs";
import mediaConfig from "./playwright.showcase.config.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const read = (relative) => readFile(path.join(repoRoot, relative), "utf8");

test("showcase has explicit desktop and mobile projects", () => {
  assert.deepEqual(
    mediaConfig.projects.map((project) => project.name),
    ["Desktop Showcase", "Mobile Showcase"],
  );
  assert.equal(showcase.projects[0].viewport.width, 1440);
  assert.equal(showcase.projects[1].viewport.width, 390);
  assert.equal(showcase.projects[1].device.hasTouch, true);
});

test("exactly five shared feature intents drive ten 60 fps captures", () => {
  assert.equal(showcase.scenes.length, 5);
  assert.deepEqual(
    showcase.scenes.map((scene) => scene.id),
    [
      "01-deterministic-arena",
      "02-finite-energy-mothership",
      "03-raid-navigation",
      "04-geothermal-energy",
      "05-towers-and-terrain",
    ],
  );
  assert.equal(showcase.projects.length * showcase.scenes.length, 10);
  assert.equal(showcase.capture.videoFps, 60);
  assert.equal(showcase.capture.minimumEncodedFps, 59);
  assert.equal(showcase.webp.fps, showcase.capture.videoFps);
  assert.ok(showcase.scenes.every((scene) => scene.durationSeconds >= 3));
});

test("capture preserves every real canvas sample before video encoding", async () => {
  const source = await read("experiments/hybrid-engine/showcase/capture.mjs");
  assert.equal(showcase.capture.sourceFrameQuality, 0.92);
  assert.match(source, /canvas\.toDataURL\("image\/webp"/);
  assert.match(source, /frame-%03d\.webp/);
  assert.match(source, /"libvpx"/);
  assert.match(source, /"passthrough"/);
  assert.match(source, /page\.screenshot/);
  assert.match(source, /capturedAt/);
  assert.match(source, /page\.clock\.install\(\)/);
  assert.match(source, /page\.clock\.runFor/);
  assert.match(source, /frame-exact-canvas-snapshots-virtual-clock/);
  assert.match(source, /capturedFrameCount/);
  assert.match(source, /derivedFromCapturedFrames/);
  assert.match(source, /browserErrors/);
  assert.doesNotMatch(source, /MediaRecorder/);
  assert.doesNotMatch(source, /captureStream/);
  assert.doesNotMatch(source, /recordVideo/);
});

test("showcase Chromium disables throttling for dedicated capture", async () => {
  const source = await read("experiments/hybrid-engine/showcase/playwright.showcase.config.mjs");
  assert.match(source, /video: "off"/);
  assert.match(source, /--disable-background-timer-throttling/);
  assert.match(source, /--disable-renderer-backgrounding/);
  assert.match(source, /--disable-backgrounding-occluded-windows/);
  assert.match(source, /--disable-frame-rate-limit/);
  assert.match(source, /--disable-gpu-vsync/);
});

test("renderer keeps 60 fps canonical reels and frame-exact animated WebPs", async () => {
  const source = await read("experiments/hybrid-engine/showcase/render.mjs");
  const workflow = await read(".github/workflows/showcase-media.yml");
  assert.ok(source.includes('defend-" + project.key + "-highlight.mp4'));
  assert.equal(showcase.webp.fps, 60);
  assert.equal(showcase.webp.budgets.combined, 15_000_000);
  assert.match(source, /showcase\.capture\.videoFps/);
  assert.match(source, /"fps_mode",\s*"passthrough"/);
  assert.match(source, /"-frames:v"/);
  assert.doesNotMatch(source, /,fps=/);
  assert.match(source, /webpFrameDurationMs/);
  assert.match(source, /"webpmux"/);
  assert.match(source, /"libwebp"/);
  assert.doesNotMatch(source, /libwebp_anim/);
  assert.ok(source.includes('"-loop"'));
  assert.ok(source.includes('"0"'));
  assert.match(source, /flags=lanczos/);
  assert.match(source, /exceeds per-file WebP budget/);
  assert.match(workflow, /apt-get install -y ffmpeg webp/);
});

test("verifier proves explicit raw frame count before accepting 60 fps output", async () => {
  const source = await read("experiments/hybrid-engine/showcase/verify.mjs");
  const workflow = await read(".github/workflows/showcase-media.yml");
  assert.match(source, /"ffprobe"/);
  assert.match(source, /best_effort_timestamp_time/);
  assert.match(source, /assertSourceFrameSequence/);
  assert.match(source, /assertExactRawFrames/);
  assert.match(source, /frame-exact-canvas-snapshots-virtual-clock/);
  assert.match(source, /assertVp8/);
  assert.match(source, /assertEncodedCadence/);
  assert.match(source, /assertAnimatedWebpCadence/);
  assert.match(source, /frameDurationsMs/);
  assert.match(source, /value\.length > 0/);
  assert.match(workflow, /showcase:verify --source-only/);
});

test("normal browser smoke discovery excludes showcase files", async () => {
  const source = await read("experiments/hybrid-engine/playwright.config.ts");
  assert.match(source, /testIgnore/);
  assert.match(source, /showcase/);
});

test("README and Pages publishing reference both stable WebP collections", async () => {
  const readme = await read("README.md");
  const workflow = await read(".github/workflows/showcase-media.yml");
  assert.match(readme, /showcase\/desktop\/01-deterministic-arena\.webp/);
  assert.match(readme, /showcase\/mobile\/01-deterministic-arena\.webp/);
  assert.match(workflow, /publish\/showcase/);
  assert.match(workflow, /gh-pages/);
  assert.match(workflow, /vite preview --host 127\.0\.0\.1 --port 5173/);
});
