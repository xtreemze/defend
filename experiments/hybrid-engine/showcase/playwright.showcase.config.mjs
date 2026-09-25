import showcase from "./manifest.mjs";

export default {
  testDir: "./showcase",
  testMatch: "capture.mjs",
  outputDir: "./artifacts/e2e-media/playwright",
  launchOptions: {
    headless: true,
    args: [
      "--autoplay-policy=no-user-gesture-required",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
      "--disable-frame-rate-limit",
      "--disable-gpu-vsync",
    ],
  },
  projects: showcase.projects.map((project) => ({
    name: project.name,
    metadata: { showcase: project },
    use: {
      browserName: "chromium",
      viewport: project.viewport,
      hasTouch: project.device.hasTouch,
      isMobile: project.device.isMobile,
      video: "off",
      screenshot: "on",
    },
  })),
};
