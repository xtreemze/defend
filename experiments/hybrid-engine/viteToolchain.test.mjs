import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("Vite 8 project-site toolchain", () => {
  it("uses the Rolldown-native config surface without esbuild", () => {
    const packageJson = JSON.parse(read("./package.json"));
    const config = read("./vite.config.ts");

    expect(packageJson.devDependencies?.vite).toMatch(/^\^?8\./);
    expect(packageJson.devDependencies).not.toHaveProperty("esbuild");
    expect(packageJson.dependencies).not.toHaveProperty("esbuild");
    expect(config).toContain("rolldownOptions");
    expect(config).not.toContain("rollupOptions");
  });
});
