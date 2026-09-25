import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import showcase from "./manifest.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const outputRoot = path.resolve(packageRoot, showcase.outputRoot);

async function mustExist(file) {
  await access(file);
  const info = await stat(file);
  assert.ok(info.size > 0, file + " must be non-empty");
}

function probeJson(file) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,avg_frame_rate,r_frame_rate",
      "-of",
      "json",
      file,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error("ffprobe stream inspection failed for " + file + ": " + result.stderr);
  }
  const parsed = JSON.parse(result.stdout);
  const stream = parsed.streams?.[0];
  if (!stream) throw new Error("No video stream found in " + file);
  return stream;
}

function frameRate(value) {
  if (typeof value !== "string") return Number.NaN;
  const [numerator, denominator] = value.split("/").map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return Number.NaN;
  }
  return numerator / denominator;
}

function probeFrameStats(file) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_frames",
      "-show_entries",
      "frame=best_effort_timestamp_time",
      "-of",
      "csv=p=0",
      file,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error("ffprobe frame timing failed for " + file + ": " + result.stderr);
  }

  const timestamps = result.stdout
    .split(/\r?\n/u)
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
  if (timestamps.length < 2) {
    throw new Error("Unable to measure decoded frame cadence for " + file);
  }
  const first = timestamps[0];
  const last = timestamps.at(-1);
  const duration = last - first;
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("Invalid decoded frame duration for " + file);
  }
  return {
    frames: timestamps.length,
    duration,
    fps: (timestamps.length - 1) / duration,
  };
}

function assertDimensions(file, expected) {
  const stream = probeJson(file);
  assert.equal(stream.width, expected.width, file + " width must match source target");
  assert.equal(stream.height, expected.height, file + " height must match source target");
}

function assertWidth(file, expectedWidth) {
  const stream = probeJson(file);
  assert.equal(stream.width, expectedWidth, file + " width must match presentation target");
}

function assertHighFrameRate(file) {
  const stream = probeJson(file);
  const fps = Math.max(frameRate(stream.avg_frame_rate), frameRate(stream.r_frame_rate));
  assert.ok(
    Number.isFinite(fps) && fps >= showcase.capture.minimumCapturedFps,
    file + " must report at least " + showcase.capture.minimumCapturedFps + " fps; got " + fps,
  );
}

function assertDecodedCadence(file, expectedDurationSeconds, label) {
  const stats = probeFrameStats(file);
  const minimumDuration = expectedDurationSeconds * showcase.capture.minimumDurationRatio;
  assert.ok(
    stats.duration >= minimumDuration,
    file +
      " decoded only " +
      stats.duration.toFixed(3) +
      "s; expected at least " +
      minimumDuration.toFixed(3) +
      "s",
  );
  assert.ok(
    stats.fps >= showcase.capture.minimumCapturedFps,
    file +
      " contains " +
      stats.frames +
      " actual decoded frames across " +
      stats.duration.toFixed(3) +
      "s (" +
      stats.fps.toFixed(2) +
      " fps); expected at least " +
      showcase.capture.minimumCapturedFps +
      " fps for " +
      label,
  );
}

for (const project of showcase.projects) {
  for (const scene of showcase.scenes) {
    const rawBase = path.join(outputRoot, "raw", project.key, scene.id);
    const rawVideo = rawBase + ".webm";
    const screenshot = rawBase + ".png";
    const metadataPath = rawBase + ".json";
    const normalized = path.join(outputRoot, "playwright", "normalized", project.key, scene.id + ".mp4");
    const webp = path.join(outputRoot, "webps", project.key, scene.id + ".webp");
    const publishedWebp = path.join(outputRoot, "publish", "showcase", project.key, scene.id + ".webp");

    await mustExist(rawVideo);
    await mustExist(screenshot);
    await mustExist(metadataPath);
    await mustExist(normalized);
    await mustExist(webp);
    await mustExist(publishedWebp);

    const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
    assert.equal(metadata.requestedFps, showcase.capture.videoFps);
    assert.equal(metadata.durationSeconds, scene.durationSeconds);
    assert.equal(metadata.source.width, project.viewport.width);
    assert.equal(metadata.source.height, project.viewport.height);

    assertDimensions(rawVideo, project.viewport);
    assertDecodedCadence(rawVideo, scene.durationSeconds, "raw Chromium capture");
    assertDimensions(screenshot, project.viewport);

    assertDimensions(normalized, project.viewport);
    assertHighFrameRate(normalized);
    assertDecodedCadence(normalized, scene.durationSeconds, "normalized 60 fps video");

    assertWidth(webp, project.webpWidth);
    assertDecodedCadence(webp, scene.durationSeconds, "60 fps animated WebP");
  }

  const webpFiles = (await readdir(path.join(outputRoot, "webps", project.key))).filter((file) =>
    file.endsWith(".webp"),
  );
  assert.equal(webpFiles.length, 5, project.key + " must contain exactly five animated WebPs");

  const rawFiles = await readdir(path.join(outputRoot, "raw", project.key));
  assert.equal(
    rawFiles.filter((file) => file.endsWith(".webm")).length,
    5,
    project.key + " must contain exactly five raw videos",
  );
  assert.equal(
    rawFiles.filter((file) => file.endsWith(".png")).length,
    5,
    project.key + " must contain exactly five screenshots",
  );
  assert.equal(
    rawFiles.filter((file) => file.endsWith(".json")).length,
    5,
    project.key + " must contain exactly five metadata files",
  );

  const reel = path.join(outputRoot, "reels", "defend-" + project.key + "-highlight.mp4");
  const publishedReel = path.join(
    outputRoot,
    "publish",
    "showcase",
    "reels",
    "defend-" + project.key + "-highlight.mp4",
  );
  await mustExist(reel);
  await mustExist(publishedReel);
  assertDimensions(reel, project.viewport);
  assertHighFrameRate(reel);
}

await mustExist(path.join(outputRoot, "manifest.json"));
await mustExist(path.join(outputRoot, "README-showcase.md"));
await mustExist(path.join(outputRoot, "sizes.json"));

const readme = await readFile(path.join(outputRoot, "README-showcase.md"), "utf8");
assert.match(readme, /### Desktop/);
assert.match(readme, /### Mobile/);
for (const scene of showcase.scenes) {
  assert.ok(readme.includes(scene.id), "README snippet must include " + scene.id);
}

process.stdout.write(
  "showcase verification passed: 10 measured raw 60 fps captures, 10 screenshots, 10 60 fps MP4s, 10 60 fps WebPs, 2 60 fps reels\n",
);
