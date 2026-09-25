import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import showcase from "./manifest.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const outputRoot = path.resolve(packageRoot, showcase.outputRoot);
const sourceOnly = process.argv.includes("--source-only");

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

function probeFrameTimestamps(file) {
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

  return result.stdout
    .split(/\r?\n/u)
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map(Number)
    .filter((value) => Number.isFinite(value));
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

function assertReportedHighFrameRate(file) {
  const stream = probeJson(file);
  const fps = Math.max(frameRate(stream.avg_frame_rate), frameRate(stream.r_frame_rate));
  assert.ok(
    Number.isFinite(fps) && fps >= showcase.capture.minimumCapturedFps,
    file + " must report at least " + showcase.capture.minimumCapturedFps + " fps; got " + fps,
  );
}

function assertExactRawFrames(file, expectedFrames) {
  const timestamps = probeFrameTimestamps(file);
  assert.equal(
    timestamps.length,
    expectedFrames,
    file +
      " must contain exactly " +
      expectedFrames +
      " explicitly requested canvas frames; got " +
      timestamps.length,
  );
}

function assertEncodedCadence(file, expectedFrames, label) {
  const timestamps = probeFrameTimestamps(file);
  assert.equal(
    timestamps.length,
    expectedFrames,
    file + " must contain exactly " + expectedFrames + " encoded frames for " + label,
  );
  assert.ok(timestamps.length >= 2, file + " must contain multiple decoded frames");

  const first = timestamps[0];
  const last = timestamps.at(-1);
  const duration = last - first;
  assert.ok(Number.isFinite(duration) && duration > 0, "Invalid decoded frame duration for " + file);
  const fps = (timestamps.length - 1) / duration;
  assert.ok(
    fps >= showcase.capture.minimumCapturedFps,
    file +
      " decodes at " +
      fps.toFixed(2) +
      " fps; expected at least " +
      showcase.capture.minimumCapturedFps +
      " fps for " +
      label,
  );
}

function uint24le(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

async function probeAnimatedWebp(file) {
  const buffer = await readFile(file);
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", file + " must be a RIFF WebP");
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", file + " must be a WebP");

  let offset = 12;
  let frameCount = 0;
  let durationMs = 0;
  let hasAnimationHeader = false;

  while (offset + 8 <= buffer.length) {
    const fourcc = buffer.subarray(offset, offset + 4).toString("ascii");
    const size = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    if (fourcc === "ANIM") hasAnimationHeader = true;
    if (fourcc === "ANMF") {
      assert.ok(size >= 16, file + " contains a truncated ANMF chunk");
      frameCount += 1;
      durationMs += uint24le(buffer, dataOffset + 12);
    }
    offset = dataOffset + size + (size & 1);
  }

  return { frameCount, durationMs, hasAnimationHeader };
}

async function assertAnimatedWebpCadence(file, expectedFrames) {
  const stats = await probeAnimatedWebp(file);
  assert.equal(stats.hasAnimationHeader, true, file + " must contain an ANIM chunk");
  assert.equal(
    stats.frameCount,
    expectedFrames,
    file + " must contain exactly " + expectedFrames + " animated WebP frames",
  );
  assert.ok(stats.durationMs > 0, file + " must have a positive animation duration");
  const fps = stats.frameCount / (stats.durationMs / 1000);
  assert.ok(
    fps >= showcase.capture.minimumCapturedFps,
    file +
      " WebP animation cadence is " +
      fps.toFixed(2) +
      " fps; expected at least " +
      showcase.capture.minimumCapturedFps,
  );
}

async function verifySources() {
  for (const project of showcase.projects) {
    for (const scene of showcase.scenes) {
      const rawBase = path.join(outputRoot, "raw", project.key, scene.id);
      const rawVideo = rawBase + ".webm";
      const screenshot = rawBase + ".png";
      const metadataPath = rawBase + ".json";
      await mustExist(rawVideo);
      await mustExist(screenshot);
      await mustExist(metadataPath);

      const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
      const expectedFrames = Math.round(scene.durationSeconds * showcase.capture.videoFps);
      assert.equal(metadata.requestedFps, showcase.capture.videoFps);
      assert.equal(metadata.durationSeconds, scene.durationSeconds);
      assert.equal(metadata.requestedFrameCount, expectedFrames);
      assert.equal(metadata.source.requestedFrames, expectedFrames);
      assert.equal(metadata.captureMode, "manual-request-frame-virtual-clock");
      assert.equal(metadata.source.width, project.viewport.width);
      assert.equal(metadata.source.height, project.viewport.height);

      assertDimensions(rawVideo, project.viewport);
      assertExactRawFrames(rawVideo, expectedFrames);
      assertDimensions(screenshot, project.viewport);
    }

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
  }
}

async function verifyRenderedOutputs() {
  for (const project of showcase.projects) {
    let projectFrameTotal = 0;
    for (const scene of showcase.scenes) {
      const expectedFrames = Math.round(scene.durationSeconds * showcase.capture.videoFps);
      projectFrameTotal += expectedFrames;
      const normalized = path.join(
        outputRoot,
        "playwright",
        "normalized",
        project.key,
        scene.id + ".mp4",
      );
      const webp = path.join(outputRoot, "webps", project.key, scene.id + ".webp");
      const publishedWebp = path.join(
        outputRoot,
        "publish",
        "showcase",
        project.key,
        scene.id + ".webp",
      );

      await mustExist(normalized);
      await mustExist(webp);
      await mustExist(publishedWebp);

      assertDimensions(normalized, project.viewport);
      assertReportedHighFrameRate(normalized);
      assertEncodedCadence(normalized, expectedFrames, "normalized 60 fps video");

      assertWidth(webp, project.webpWidth);
      await assertAnimatedWebpCadence(webp, expectedFrames);
      await assertAnimatedWebpCadence(publishedWebp, expectedFrames);
    }

    const webpFiles = (await readdir(path.join(outputRoot, "webps", project.key))).filter((file) =>
      file.endsWith(".webp"),
    );
    assert.equal(webpFiles.length, 5, project.key + " must contain exactly five animated WebPs");

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
    assertReportedHighFrameRate(reel);
    assertEncodedCadence(reel, projectFrameTotal, "60 fps highlight reel");
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
}

await verifySources();
if (sourceOnly) {
  process.stdout.write(
    "showcase source verification passed: 10 frame-exact raw captures at 60 virtual Hz\n",
  );
} else {
  await verifyRenderedOutputs();
  process.stdout.write(
    "showcase verification passed: 10 frame-exact raw captures, 10 screenshots, 10 60 fps MP4s, 10 60 fps WebPs, 2 60 fps reels\n",
  );
}
