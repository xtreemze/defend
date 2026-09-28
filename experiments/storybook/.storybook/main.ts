import type { StorybookConfig } from "@storybook/web-components-vite";

const repositoryRoot = decodeURIComponent(new URL("../../..", import.meta.url).pathname);
const defendSourceRoot = decodeURIComponent(new URL("../../../src/js", import.meta.url).pathname);
const defendUiRoot = decodeURIComponent(new URL("../../ui/src", import.meta.url).pathname);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|ts)"],
  addons: ["@storybook/addon-vitest"],
  framework: "@storybook/web-components-vite",
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(viteConfig, {
      resolve: {
        alias: [
          { find: "@defend/ui", replacement: defendUiRoot },
          { find: "@defend", replacement: defendSourceRoot }
        ]
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
