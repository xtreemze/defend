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

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(command + " failed with exit code " + result.status);
  }
}

async function renderProject(project) {
  const normalizedProject = path.join(normalizedRoot, project.key);
  const webpProject = path.join(webpsRoot, project.key);
  const publishProject = path.join(publishRoot, project.key);
  await mkdir(normalizedProject, { recursive: true });
  await mkdir(webpProject, { recursive: true });
  await mkdir(publishProject, { recursive: true });

  const normalized = [];
  for (const scene of showcase.scenes) {
    const input = path.join(outputRoot, "raw", project.key, scene.id + ".webm");
    const normalizedVideo = path.join(normalizedProject, scene.id + ".mp4");
    normalized.push(normalizedVideo);

    run("ffmpeg", [
      "-y",
      "-i",
      input,
      "-an",
      "-vf",
      "fps=" +
        showcase.capture.videoFps +
        ",scale=" +
        project.viewport.width +
        ":" +
        project.viewport.height +
        ":force_original_aspect_ratio=decrease,pad=" +
        project.viewport.width +
        ":" +
        project.viewport.height +
        ":(ow-iw)/2:(oh-ih)/2",
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
    run("ffmpeg", [
      "-y",
      "-i",
      input,
      "-an",
      "-vf",
      "fps=" + showcase.webp.fps + ",scale=" + project.webpWidth + ":-2:flags=lanczos",
      "-c:v",
      "libwebp_anim",
      "-lossless",
      "0",
      "-compression_level",
      String(showcase.webp.compressionLevel),
      "-q:v",
      String(showcase.webp.quality),
      "-loop",
      "0",
      webp,
    ]);
    await copyFile(webp, path.join(publishProject, scene.id + ".webp"));
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
}

async function buildReadmeSnippet() {
  const lines = [
    "## Product in motion",
    "",
    "CI records these scenes from the real modern preview in Chromium. Raw canvas capture is measured before encoding and must sustain at least 59 actual frames per second against a 60 fps target.",
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
