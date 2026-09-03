import { defineConfig } from "vite";

export default defineConfig({
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: "index.html",
        mothership: "mothership.html",
        navigation: "navigation.html",
      },
    },
  },
});
