import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import showcase from "./manifest.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const outputRoot = path.resolve(packageRoot, showcase.outputRoot);
const reelsRoot = path.join(outputRoot, "reels");
const webpsRoot = path.join(outputRoot, "webps");
const normalizedRoot = path.join(outputRoot, "playwright", "normalized");
const publishRoot = path.join(outputRoot, "publish", "showcase");
const webRoot = path.join(outputRoot, "web");

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(command + " failed with exit code " + result.status);
  }
}

function webpFrameDurationMs(frameIndex, fps) {
  const start = Math.round((frameIndex * 1000) / fps);
  const end = Math.round(((frameIndex + 1) * 1000) / fps);
  return end - start;
}

async function renderAnimatedWebp({
  inputPattern,
  output,
  frameWidth,
  expectedFrames,
  frameRoot,
}) {
  await rm(frameRoot, { recursive: true, force: true });
  await mkdir(frameRoot, { recursive: true });
  const pattern = path.join(frameRoot, "frame-%03d.webp");

  run("ffmpeg", [
    "-y",
    "-framerate",
    String(showcase.capture.videoFps),
    "-start_number",
    "1",
    "-i",
    inputPattern,
    "-an",
    "-vf",
    "scale=" + frameWidth + ":-2:flags=lanczos",
    "-frames:v",
    String(expectedFrames),
    "-c:v",
    "libwebp",
    "-lossless",
    "0",
    "-compression_level",
    String(showcase.webp.compressionLevel),
    "-q:v",
    String(showcase.webp.quality),
    pattern,
  ]);

  const muxArgs = [];
  for (let frameIndex = 0; frameIndex < expectedFrames; frameIndex += 1) {
    const frameNumber = String(frameIndex + 1).padStart(3, "0");
    const frameFile = path.join(frameRoot, "frame-" + frameNumber + ".webp");
    const durationMs = webpFrameDurationMs(frameIndex, showcase.webp.fps);
    muxArgs.push("-frame", frameFile, "+" + durationMs + "+0+0+0-b");
  }
  muxArgs.push("-loop", "0", "-o", output);
  run("webpmux", muxArgs);

  await rm(frameRoot, { recursive: true, force: true });
}

async function renderWebSet({ project, scene, inputPattern, expectedFrames, screenshot, webProject, publishProject }) {
  const width = showcase.web.widths[project.key];
  const scale = "scale=" + width + ":-2:flags=lanczos";
  const base = path.join(webProject, scene.id);
  const input = ["-y", "-framerate", String(showcase.capture.videoFps), "-start_number", "1", "-i", inputPattern, "-an", "-vf", scale, "-frames:v", String(expectedFrames)];

  run("ffmpeg", [
    ...input,
    "-c:v", "libsvtav1",
    "-crf", String(showcase.web.av1.crf),
    "-preset", String(showcase.web.av1.preset),
    "-g", String(showcase.web.av1.keyframeInterval),
    "-pix_fmt", "yuv420p",
    base + ".webm",
  ]);
  run("ffmpeg", [
    ...input,
    "-fps_mode", "passthrough",
    "-c:v", "libx264",
    "-preset", showcase.web.h264.preset,
    "-crf", String(showcase.web.h264.crf),
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    base + ".mp4",
  ]);
  run("ffmpeg", [
    "-y", "-i", screenshot, "-vf", scale,
    "-c:v", "libaom-av1", "-still-picture", "1",
    "-crf", String(showcase.web.avif.crf),
    "-cpu-used", String(showcase.web.avif.cpuUsed),
    "-pix_fmt", "yuv420p",
    base + ".avif",
  ]);
  for (const extension of [".webm", ".mp4", ".avif"]) {
    await copyFile(base + extension, path.join(publishProject, scene.id + extension));
  }
  return base + ".webm";
}

async function renderProject(project) {
  const normalizedProject = path.join(normalizedRoot, project.key);
  const webpProject = path.join(webpsRoot, project.key);
  const webProject = path.join(webRoot, project.key);
  await mkdir(webProject, { recursive: true });
  const publishProject = path.join(publishRoot, project.key);
  await mkdir(normalizedProject, { recursive: true });
  await mkdir(webpProject, { recursive: true });
  await mkdir(publishProject, { recursive: true });

  const normalized = [];
  const av1Scenes = [];
  for (const scene of showcase.scenes) {
    const frameRoot = path.join(outputRoot, "raw", project.key, scene.id + "-frames");
    const inputPattern = path.join(frameRoot, "frame-%03d.webp");
    const metadata = JSON.parse(
      await readFile(path.join(outputRoot, "raw", project.key, scene.id + ".json"), "utf8"),
    );
    const expectedFrames = metadata.requestedFrameCount;
    const normalizedVideo = path.join(normalizedProject, scene.id + ".mp4");
    normalized.push(normalizedVideo);

    run("ffmpeg", [
      "-y",
      "-framerate",
      String(showcase.capture.videoFps),
      "-start_number",
      "1",
      "-i",
      inputPattern,
      "-an",
      "-vf",
      "scale=" +
        project.viewport.width +
        ":" +
        project.viewport.height +
        ":force_original_aspect_ratio=decrease,pad=" +
        project.viewport.width +
        ":" +
        project.viewport.height +
        ":(ow-iw)/2:(oh-ih)/2",
      "-frames:v",
      String(expectedFrames),
      "-fps_mode",
      "passthrough",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "21",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      normalizedVideo,
    ]);

    const webp = path.join(webpProject, scene.id + ".webp");
    await renderAnimatedWebp({
      inputPattern,
      output: webp,
      frameWidth: project.webpWidth,
      expectedFrames,
      frameRoot: path.join(normalizedProject, scene.id + "-webp-frames"),
    });
    await copyFile(webp, path.join(publishProject, scene.id + ".webp"));

    av1Scenes.push(
      await renderWebSet({
        project,
        scene,
        inputPattern,
        expectedFrames,
        screenshot: path.join(outputRoot, "raw", project.key, scene.id + ".png"),
        webProject,
        publishProject,
      }),
    );
  }

  const concatFile = path.join(normalizedProject, "concat.txt");
  await writeFile(
    concatFile,
    normalized.map((file) => "file '" + file.replaceAll("'", "'\\''") + "'").join("\n") + "\n",
  );
  const reel = path.join(reelsRoot, "defend-" + project.key + "-highlight.mp4");
  run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatFile,
    "-c",
    "copy",
    "-movflags",
    "+faststart",
    reel,
  ]);
  await mkdir(path.join(publishRoot, "reels"), { recursive: true });
  await copyFile(reel, path.join(publishRoot, "reels", path.basename(reel)));

  const av1ConcatFile = path.join(webProject, "concat.txt");
  await writeFile(
    av1ConcatFile,
    av1Scenes.map((file) => "file '" + file.replaceAll("'", "'\\''") + "'").join("\n") + "\n",
  );
  const av1Reel = path.join(reelsRoot, "defend-" + project.key + "-highlight.webm");
  run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", av1ConcatFile, "-c", "copy", av1Reel]);
  await copyFile(av1Reel, path.join(publishRoot, "reels", path.basename(av1Reel)));
}

async function buildReadmeSnippet() {
  const lines = [
    "## Product in motion",
    "",
    "AV1 WebM loops, H.264 MP4 fallbacks and AVIF posters for the presentation site are published beside each animated WebP under `showcase/<form-factor>/`; the WebPs below are for GitHub's README, which cannot embed video.",
    "",
    "CI records these scenes from the real modern preview in Chromium. Each three-second scene is sampled as exactly 180 explicit canvas frames on a controlled 60 Hz application clock before encoding.",
    "",
  ];

  for (const project of showcase.projects) {
    lines.push("### " + (project.key === "desktop" ? "Desktop" : "Mobile"), "");
    for (const scene of showcase.scenes) {
      const url =
        showcase.publishedBaseUrl + "/" + project.key + "/" + scene.id + ".webp";
      lines.push(
        "#### " + scene.title,
        "",
        scene.description,
        "",
        '<img src="' +
          url +
          '" alt="Defend ' +
          scene.title +
          " " +
          project.key +
          ' showcase" width="' +
          project.webpWidth +
          '">',
        "",
      );
    }
  }

  await writeFile(path.join(outputRoot, "README-showcase.md"), lines.join("\n") + "\n");
}

async function reportSizes() {
  const report = { desktop: {}, mobile: {}, totals: {} };
  let combined = 0;

  for (const project of showcase.projects) {
    let total = 0;
    for (const scene of showcase.scenes) {
      const file = path.join(webpsRoot, project.key, scene.id + ".webp");
      const size = (await stat(file)).size;
      report[project.key][scene.id] = size;
      total += size;
      process.stdout.write(project.key + " " + scene.id + ": " + size + " bytes\n");
    }
    report.totals[project.key] = total;
    combined += total;
    process.stdout.write(project.key + " total: " + total + " bytes\n");
  }
  report.totals.combined = combined;
  report.budgets = showcase.webp.budgets;

  report.web = { budgets: showcase.web.budgets, files: {}, total: 0 };
  for (const project of showcase.projects) {
    for (const scene of showcase.scenes) {
      for (const [kind, extension, budget] of [
        ["av1", ".webm", showcase.web.budgets.perVideo],
        ["h264", ".mp4", showcase.web.budgets.perVideo],
        ["avif", ".avif", showcase.web.budgets.perPoster],
      ]) {
        const size = (await stat(path.join(webRoot, project.key, scene.id + extension))).size;
        report.web.files[project.key + "/" + scene.id + "." + kind] = size;
        report.web.total += size;
        if (size > budget) {
          throw new Error(project.key + " " + scene.id + " " + kind + " exceeds web budget: " + size);
        }
      }
    }
  }
  process.stdout.write("AV1 + H.264 + AVIF delivery payload: " + report.web.total + " bytes\n");
  if (report.web.total > showcase.web.budgets.total) {
    throw new Error("web delivery payload exceeds budget: " + report.web.total);
  }
  process.stdout.write("combined animated WebP payload: " + combined + " bytes\n");
  await writeFile(path.join(outputRoot, "sizes.json"), JSON.stringify(report, null, 2) + "\n");

  for (const project of showcase.projects) {
    for (const scene of showcase.scenes) {
      const size = report[project.key][scene.id];
      if (size > showcase.webp.budgets.perFile) {
        throw new Error(project.key + " " + scene.id + " exceeds per-file WebP budget: " + size);
      }
    }
  }
  if (report.totals.desktop > showcase.webp.budgets.desktopTotal) {
    throw new Error("desktop WebP payload exceeds budget: " + report.totals.desktop);
  }
  if (report.totals.mobile > showcase.webp.budgets.mobileTotal) {
    throw new Error("mobile WebP payload exceeds budget: " + report.totals.mobile);
  }
  if (report.totals.combined > showcase.webp.budgets.combined) {
    throw new Error("combined WebP payload exceeds budget: " + report.totals.combined);
  }
}

async function main() {
  await rm(reelsRoot, { recursive: true, force: true });
  await rm(webpsRoot, { recursive: true, force: true });
  await rm(webRoot, { recursive: true, force: true });
  await rm(normalizedRoot, { recursive: true, force: true });
  await rm(publishRoot, { recursive: true, force: true });
  await mkdir(reelsRoot, { recursive: true });

  for (const project of showcase.projects) {
    await renderProject(project);
  }
  await buildReadmeSnippet();
  await reportSizes();

  const manifest = JSON.parse(await readFile(path.join(outputRoot, "manifest.json"), "utf8"));
  manifest.renderedAt = new Date().toISOString();
  await writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
}

await main();
