export const showcase = {
  product: "Defend",
  outputRoot: "artifacts/e2e-media",
  publishedBaseUrl: "https://xtreemze.github.io/defend/showcase",
  projects: [
    {
      key: "desktop",
      name: "Desktop Showcase",
      viewport: { width: 1440, height: 900 },
      device: { hasTouch: false, isMobile: false },
      webpWidth: 620,
    },
    {
      key: "mobile",
      name: "Mobile Showcase",
      viewport: { width: 390, height: 844 },
      device: { hasTouch: true, isMobile: true },
      webpWidth: 300,
    },
  ],
  capture: {
    videoFps: 60,
    minimumEncodedFps: 59,
    sourceFrameQuality: 0.92,
    // Blank WebP canvas snapshots are ~2-4 KB per megapixel; real renders of
    // these dark scenes are at least ~18 KB per megapixel.
    minimumFrameBytesPerMegapixel: 8_000,
  },
  webp: {
    fps: 60,
    quality: 60,
    compressionLevel: 6,
    budgets: {
      perFile: 4_500_000,
      desktopTotal: 10_000_000,
      mobileTotal: 6_000_000,
      combined: 15_000_000,
    },
  },
  // Delivery set for GitHub Pages and the presentation site: AV1 WebM loops
  // (Chrome/Edge/Firefox/Safari 17+), H.264 MP4 fallback and AVIF posters.
  web: {
    widths: { desktop: 960, mobile: 390 },
    av1: { crf: 36, preset: 6, keyframeInterval: 120 },
    h264: { crf: 26, preset: "slow" },
    avif: { crf: 32, cpuUsed: 6 },
    budgets: {
      perVideo: 1_500_000,
      perPoster: 400_000,
      total: 8_000_000,
    },
  },
  scenes: [
    {
      id: "01-deterministic-arena",
      title: "Deterministic arena",
      path: "/arena.html",
      description: "Orbit the Babylon battlefield while the fixed-step Bevy/WASM simulation remains authoritative.",
      action: "arena",
      durationSeconds: 3,
    },
    {
      id: "02-finite-energy-mothership",
      title: "Finite-energy mothership",
      path: "/mothership.html",
      description: "Expose the mothership's finite reserve, hover drain, and reversible camera perspective.",
      action: "mothership",
      durationSeconds: 3,
    },
    {
      id: "03-raid-navigation",
      title: "Raid navigation",
      path: "/navigation.html",
      description: "Select raid sectors and watch the mothership approach through physically constrained navigation.",
      action: "navigation",
      durationSeconds: 3,
    },
    {
      id: "04-geothermal-energy",
      title: "Geothermal energy",
      path: "/geothermal.html",
      description: "Accelerate local pressure and expose finite subsurface energy as a tactical world system.",
      action: "geothermal",
      durationSeconds: 3,
    },
    {
      id: "05-towers-and-terrain",
      title: "Towers and terrain",
      path: "/tower-terrain.html",
      description: "Demonstrate finite turret behavior, missed shots, impacts, and deformation on shared terrain.",
      action: "towerTerrain",
      durationSeconds: 3,
    },
  ],
};

export default showcase;
