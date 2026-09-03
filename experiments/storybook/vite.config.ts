import { defineConfig } from "vite";

const repositoryRoot = decodeURIComponent(new URL("../..", import.meta.url).pathname);
const defendSourceRoot = decodeURIComponent(new URL("../../src/js", import.meta.url).pathname);

export default defineConfig({
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
