import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import showcase from "./manifest.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const outputRoot = path.resolve(packageRoot, showcase.outputRoot);
const reelsRoot = path.join(outputRoot, "reels");
const gifsRoot = path.join(outputRoot, "gifs");
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
  const gifProject = path.join(gifsRoot, project.key);
  const publishProject = path.join(publishRoot, project.key);
  await mkdir(normalizedProject, { recursive: true });
  await mkdir(gifProject, { recursive: true });
  await mkdir(publishProject, { recursive: true });

  const normalized = [];
  for (const scene of showcase.scenes) {
    const input = path.join(outputRoot, "raw", project.key, scene.id + ".webm");
    const metadata = JSON.parse(
      await readFile(path.join(outputRoot, "raw", project.key, scene.id + ".json"), "utf8"),
    );
    const trimArgs = [
      "-ss",
      metadata.trim.startSeconds.toFixed(3),
      "-t",
      metadata.trim.durationSeconds.toFixed(3),
    ];
    const normalizedVideo = path.join(normalizedProject, scene.id + ".mp4");
    normalized.push(normalizedVideo);

    run("ffmpeg", [
      "-y",
      ...trimArgs,
      "-i",
      input,
      "-an",
      "-vf",
      "fps=30,scale=" +
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

    const palette = path.join(normalizedProject, scene.id + "-palette.png");
    const gif = path.join(gifProject, scene.id + ".gif");
    run("ffmpeg", [
      "-y",
      ...trimArgs,
      "-i",
      input,
      "-vf",
      "fps=10,scale=" +
        project.gifWidth +
        ":-2:flags=lanczos,palettegen=max_colors=96:stats_mode=diff",
      "-frames:v",
      "1",
      palette,
    ]);
    run("ffmpeg", [
      "-y",
      ...trimArgs,
      "-i",
      input,
      "-i",
      palette,
      "-lavfi",
      "fps=10,scale=" +
        project.gifWidth +
        ":-2:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a:diff_mode=rectangle",
      "-loop",
      "0",
      gif,
    ]);
    await copyFile(gif, path.join(publishProject, scene.id + ".gif"));
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
    "CI records these scenes from the real modern preview in Chromium. Desktop and mobile use the same product capabilities with form-factor-appropriate interaction.",
    "",
  ];

  for (const project of showcase.projects) {
    lines.push("### " + (project.key === "desktop" ? "Desktop" : "Mobile"), "");
    for (const scene of showcase.scenes) {
      const url =
        showcase.publishedBaseUrl + "/" + project.key + "/" + scene.id + ".gif";
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
          project.gifWidth +
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
      const file = path.join(gifsRoot, project.key, scene.id + ".gif");
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
  process.stdout.write("combined GIF payload: " + combined + " bytes\n");
  await writeFile(path.join(outputRoot, "sizes.json"), JSON.stringify(report, null, 2) + "\n");
}

async function main() {
  await rm(reelsRoot, { recursive: true, force: true });
  await rm(gifsRoot, { recursive: true, force: true });
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
