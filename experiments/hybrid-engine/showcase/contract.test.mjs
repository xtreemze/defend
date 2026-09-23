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

test("exactly five shared feature intents drive ten captures", () => {
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
});

test("capture preserves raw video screenshots and metadata", async () => {
  const source = await read("experiments/hybrid-engine/showcase/capture.mjs");
  assert.match(source, /recordVideo/);
  assert.match(source, /page\.screenshot/);
  assert.match(source, /video\.saveAs/);
  assert.match(source, /capturedAt/);
  assert.match(source, /browserErrors/);
});

test("renderer keeps separate reels and optimized infinite GIFs", async () => {
  const source = await read("experiments/hybrid-engine/showcase/render.mjs");
  assert.ok(source.includes('defend-" + project.key + "-highlight.mp4'));
  assert.match(source, /palettegen=max_colors=96/);
  assert.match(source, /paletteuse=/);
  assert.ok(source.includes('"-loop"'));
  assert.ok(source.includes('"0"'));
  assert.match(source, /flags=lanczos/);
});

test("normal browser smoke discovery excludes showcase files", async () => {
  const source = await read("experiments/hybrid-engine/playwright.config.ts");
  assert.match(source, /testIgnore/);
  assert.match(source, /showcase/);
});

test("README and Pages publishing reference both stable GIF collections", async () => {
  const readme = await read("README.md");
  const workflow = await read(".github/workflows/showcase-media.yml");
  assert.match(readme, /showcase\/desktop\/01-deterministic-arena\.gif/);
  assert.match(readme, /showcase\/mobile\/01-deterministic-arena\.gif/);
  assert.match(workflow, /publish\/showcase/);
  assert.match(workflow, /gh-pages/);
});
