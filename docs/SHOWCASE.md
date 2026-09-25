# Visual showcase pipeline

Defend maintains a CI-native visual evidence pipeline for the modern browser preview. It records the real application in real Chromium rather than a fake/demo shell and produces separate desktop and mobile presentation media from the same five product capabilities.

## Presentation set

The showcase intentionally covers:

1. **Deterministic arena** — Babylon presentation driven by the fixed-step Bevy/WASM simulation.
2. **Finite-energy mothership** — finite reserve, hover drain, and reversible defender/raider perspective.
3. **Raid navigation** — target-sector selection and physically constrained mothership movement.
4. **Geothermal energy** — finite local energy, pressure, conduits, and eruption.
5. **Towers and terrain** — finite slew, misses, impacts, drilling/maintenance context, and shared terrain deformation.

Each capability has one desktop scene and one mobile scene. Desktop is captured at 1440×900 with pointer/wheel interaction where appropriate. Mobile uses a 390×844 portrait viewport with touch enabled and the actual responsive control layout.

## Outputs

A successful showcase run preserves:

- five raw desktop WebM recordings, screenshots, and scene metadata;
- five raw mobile WebM recordings, screenshots, and scene metadata;
- `defend-desktop-highlight.mp4`;
- `defend-mobile-highlight.mp4`;
- five 60 fps animated desktop WebPs;
- five 60 fps animated mobile WebPs;
- `README-showcase.md`, generated from the same manifest as the renderer;
- `sizes.json` with per-WebP, per-form-factor, and combined payload sizes;
- the Playwright/media working output needed to inspect failures.

The artifact layout is rooted at `experiments/hybrid-engine/artifacts/e2e-media/`.

## Capture and frame-rate policy

Dynamic evidence is captured directly from `#renderCanvas` with `HTMLCanvasElement.captureStream(60)` and a browser `MediaRecorder`, rather than relying on Playwright's generic page-video recorder. The recorder prefers VP8 over VP9 to reduce real-time encoding pressure. Desktop capture targets 20 Mbps and mobile capture targets 8 Mbps.

Dedicated showcase Chromium runs disable background timer throttling, renderer/background occlusion throttling, the frame-rate limit, and GPU vsync. These flags reduce CI-specific capture pressure, but they are not accepted as proof of frame rate.

The 60 fps request is only a target. Before FFmpeg normalization, `showcase/verify.mjs` decodes the raw WebM frame timestamps with FFprobe and requires at least 59 actual captured frames per second across at least 97% of the intended three-second scene duration. A slower source cannot pass merely because FFmpeg duplicates frames or reports a nominal 60 fps stream.

FFmpeg then produces source-resolution H.264 scene videos and highlight reels at 60 fps. Animated WebP presentation derivatives also preserve the 60 fps temporal cadence while being spatially scaled for README/document use.

## CI ownership

`.github/workflows/showcase-media.yml` is the dedicated workflow. It runs independently from the ordinary browser smoke matrix, supports pull requests, relevant `master` changes, and manual dispatch, and cancels obsolete runs for the same ref.

The workflow:

1. validates configuration contracts;
2. installs the pinned modern workspace;
3. installs real Chromium through the existing Playwright dependency;
4. installs FFmpeg;
5. builds the real hybrid-engine preview;
6. records five desktop and five mobile scenes;
7. renders ten source-resolution 60 fps H.264 scene videos and the two 60 fps H.264 highlight reels;
8. renders ten 60 fps animated WebP presentation derivatives;
9. verifies raw decoded capture cadence plus every required source and finished output;
10. reports media sizes;
11. uploads the complete evidence bundle;
12. publishes the stable showcase media to `gh-pages` after successful `master` runs.

The normal Playwright smoke configuration explicitly ignores `showcase/**`. Showcase capture therefore cannot silently expand the ordinary exhaustive browser-test surface.

## Dependency decision

The pipeline deliberately reuses the existing pinned Playwright installation in `experiments/storybook/` for Chromium automation and uses system FFmpeg for deterministic media composition. It does not add Remotion, a browser video editor, a native OpenGL editing stack, or another rendering framework solely for showcase generation.

This keeps capture tied to the same browser automation already used by the repository and keeps rendering reproducible in Linux CI.

## Stable presentation URLs

Published animated WebPs are available under:

- `https://xtreemze.github.io/defend/showcase/desktop/<scene>.webp`
- `https://xtreemze.github.io/defend/showcase/mobile/<scene>.webp`

Published reels are available under:

- `https://xtreemze.github.io/defend/showcase/reels/defend-desktop-highlight.mp4`
- `https://xtreemze.github.io/defend/showcase/reels/defend-mobile-highlight.mp4`

The root README uses these stable Pages URLs rather than temporary Actions artifact URLs.

## Animated WebP delivery budget

README motion preserves the 60 fps capture cadence in animated WebP, uses lossy quality 60 with compression level 6, Lanczos scaling, 620 px desktop width, and 300 px mobile width. CI fails if any WebP exceeds 4.5 MB, if the desktop set exceeds 10 MB, if the mobile set exceeds 6 MB, or if the combined ten-WebP payload exceeds 15 MB. These are upper bounds, not targets; scenes should remain as short as practical.

## Presentation guidance

Use the desktop reel when presenting the wide-screen systems view and the mobile reel when presenting touch/responsive behavior. For documents, editorials, issue reports, and README sections, prefer the individual feature WebPs because each scene is designed to stand alone and return near its initial state for a natural loop.

Raw WebM and PNG evidence should remain CI artifacts rather than source-controlled binaries. Generated WebPs and MP4s are published by CI and should not be committed unless repository policy changes explicitly.
