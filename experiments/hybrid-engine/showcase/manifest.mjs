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
      gifWidth: 620,
    },
    {
      key: "mobile",
      name: "Mobile Showcase",
      viewport: { width: 390, height: 844 },
      device: { hasTouch: true, isMobile: true },
      gifWidth: 300,
    },
  ],
  gif: {
    fps: 8,
    colors: 64,
    budgets: {
      perFile: 4_500_000,
      desktopTotal: 10_000_000,
      mobileTotal: 6_000_000,
      combined: 15_000_000,
    },
  },
  scenes: [
    {
      id: "01-deterministic-arena",
      title: "Deterministic arena",
      path: "/",
      description: "Orbit the Babylon battlefield while the fixed-step Bevy/WASM simulation remains authoritative.",
      action: "arena",
    },
    {
      id: "02-finite-energy-mothership",
      title: "Finite-energy mothership",
      path: "/mothership.html",
      description: "Expose the mothership's finite reserve, hover drain, and reversible camera perspective.",
      action: "mothership",
    },
    {
      id: "03-raid-navigation",
      title: "Raid navigation",
      path: "/navigation.html",
      description: "Select raid sectors and watch the mothership approach through physically constrained navigation.",
      action: "navigation",
    },
    {
      id: "04-geothermal-energy",
      title: "Geothermal energy",
      path: "/geothermal.html",
      description: "Accelerate local pressure and expose finite subsurface energy as a tactical world system.",
      action: "geothermal",
    },
    {
      id: "05-towers-and-terrain",
      title: "Towers and terrain",
      path: "/tower-terrain.html",
      description: "Demonstrate finite turret behavior, missed shots, impacts, and deformation on shared terrain.",
      action: "towerTerrain",
    },
  ],
};

export default showcase;
