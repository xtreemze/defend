import showcase from "./manifest.mjs";

export default {
  testDir: "./showcase",
  testMatch: "capture.mjs",
  outputDir: "./artifacts/e2e-media/playwright",
  projects: showcase.projects.map((project) => ({
    name: project.name,
    use: {
      browserName: "chromium",
      viewport: project.viewport,
      hasTouch: project.device.hasTouch,
      isMobile: project.device.isMobile,
      video: "on",
      screenshot: "on",
    },
  })),
};
