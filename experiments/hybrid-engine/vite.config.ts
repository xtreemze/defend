import { defineConfig } from "vite";

export default defineConfig({
  server: {
    fs: {
      strict: true,
      allow: ["../.."],
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: "index.html",
        towerTerrain: "tower-terrain.html",
      },
    },
  },
});
