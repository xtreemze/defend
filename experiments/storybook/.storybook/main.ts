import type { StorybookConfig } from "@storybook/html-vite";

const repositoryRoot = decodeURIComponent(new URL("../../..", import.meta.url).pathname);
const defendSourceRoot = decodeURIComponent(new URL("../../../src/js", import.meta.url).pathname);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|ts)"],
  addons: ["@storybook/addon-vitest"],
  framework: "@storybook/html-vite",
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@defend": defendSourceRoot
        }
      },
      server: {
        fs: {
          strict: true,
          allow: [repositoryRoot]
        }
      }
    });
  }
};

export default config;
