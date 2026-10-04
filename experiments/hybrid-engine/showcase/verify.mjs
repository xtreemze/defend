import assert from "node:assert/strict";
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

for (const project of showcase.projects) {
  for (const scene of showcase.scenes) {
    await mustExist(path.join(outputRoot, "raw", project.key, scene.id + ".webm"));
    await mustExist(path.join(outputRoot, "raw", project.key, scene.id + ".png"));
    await mustExist(path.join(outputRoot, "raw", project.key, scene.id + ".json"));
    await mustExist(path.join(outputRoot, "gifs", project.key, scene.id + ".gif"));
    await mustExist(path.join(outputRoot, "publish", "showcase", project.key, scene.id + ".gif"));
  }
  const gifFiles = (await readdir(path.join(outputRoot, "gifs", project.key))).filter((file) => file.endsWith(".gif"));
  assert.equal(gifFiles.length, 5, project.key + " must contain exactly five GIFs");
  const rawFiles = await readdir(path.join(outputRoot, "raw", project.key));
  assert.equal(rawFiles.filter((file) => file.endsWith(".webm")).length, 5, project.key + " must contain exactly five raw videos");
  assert.equal(rawFiles.filter((file) => file.endsWith(".png")).length, 5, project.key + " must contain exactly five screenshots");
  assert.equal(rawFiles.filter((file) => file.endsWith(".json")).length, 5, project.key + " must contain exactly five metadata files");
  await mustExist(path.join(outputRoot, "reels", "defend-" + project.key + "-highlight.mp4"));
  await mustExist(path.join(outputRoot, "publish", "showcase", "reels", "defend-" + project.key + "-highlight.mp4"));
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

process.stdout.write("showcase verification passed: 10 scenes, 10 videos, 10 screenshots, 10 GIFs, 2 reels\n");
