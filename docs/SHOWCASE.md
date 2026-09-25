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

Dynamic evidence is captured directly from `#renderCanvas`, but Defend does not treat GitHub runner wall-clock speed as the media clock. Playwright's Clock API controls `requestAnimationFrame`, `performance`, and timers while the capture is active. For each three-second scene, CI advances application time in 16/17 ms increments and explicitly requests one canvas frame per tick through `canvas.captureStream(0)` + `CanvasCaptureMediaStreamTrack.requestFrame()`. That produces exactly 180 source frame requests at a 60 Hz application-time cadence.

The browser recorder prefers VP8 over VP9 and is used only as a container for those explicitly requested source frames. Desktop capture targets 12 Mbps and mobile capture targets 6 Mbps. Dedicated showcase Chromium also disables background timer/render throttling and frame-rate/vsync limits.

This is intentionally an offline, frame-exact capture contract rather than a claim that GitHub's software-rendered runner can render Defend at 60 frames per wall-clock second. Before FFmpeg runs, `showcase/verify.mjs --source-only` decodes the raw WebM and requires exactly 180 frames per three-second scene, matching the 180 explicit frame requests recorded in metadata. If Chromium drops even one requested source frame, CI fails before encoding.

FFmpeg then retimes those already-captured frames with `setpts=N/(60*TB)`; it is not permitted to manufacture a 60 fps source by duplicating a slower recording. The final verifier requires each H.264 scene video and reel to contain the expected decoded frame count at at least 59 fps. For animated WebP, FFmpeg first encodes each scaled source sample as a single-frame WebP and the official `webpmux` tool assembles all 180 frames with an exact 17/16/17 ms cadence. This avoids `libwebp_anim` frame coalescing. The final verifier independently parses RIFF `ANIM`/`ANMF` chunks and requires the exact 180-frame sequence, every per-frame duration, and the exact three-second total because FFprobe does not reliably expose animated-WebP timing on the Ubuntu build used by CI.

## CI ownership

`.github/workflows/showcase-media.yml` is the dedicated workflow. It runs independently from the ordinary browser smoke matrix, supports pull requests, relevant `master` changes, and manual dispatch, and cancels obsolete runs for the same ref.

The workflow:

1. validates configuration contracts;
2. installs the pinned modern workspace;
3. installs real Chromium through the existing Playwright dependency;
4. installs FFmpeg and the official WebP tools;
5. builds the real hybrid-engine preview;
6. records five desktop and five mobile scenes with 180 explicit source-frame requests each;
7. verifies the raw source frame count before any normalization or encoding;
8. renders ten source-resolution 60 fps H.264 scene videos and the two 60 fps H.264 highlight reels;
9. encodes 180 single-frame WebPs per scene and muxes each set into a frame-exact 60 fps animated WebP;
10. verifies final decoded frame counts/cadence plus the animated-WebP frame structure;
11. reports media sizes;
12. uploads the complete evidence bundle;
13. publishes the stable showcase media to `gh-pages` after successful `master` runs.

The normal Playwright smoke configuration explicitly ignores `showcase/**`. Showcase capture therefore cannot silently expand the ordinary exhaustive browser-test surface.

## Dependency decision

The pipeline deliberately reuses the existing pinned Playwright installation in `experiments/storybook/` for Chromium automation, system FFmpeg for deterministic video/frame encoding, and the official libwebp `webpmux` utility for frame-exact animated-WebP assembly. It does not add Remotion, a browser video editor, a native OpenGL editing stack, or another rendering framework solely for showcase generation.

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

README motion preserves the 60 fps capture cadence in animated WebP as exactly 180 frames over three seconds using 17/16/17 ms frame durations, lossy quality 60 with compression level 6, Lanczos scaling, 620 px desktop width, and 300 px mobile width. CI fails if any WebP exceeds 4.5 MB, if the desktop set exceeds 10 MB, if the mobile set exceeds 6 MB, or if the combined ten-WebP payload exceeds 15 MB. These are upper bounds, not targets; scenes should remain as short as practical.

## Presentation guidance

Use the desktop reel when presenting the wide-screen systems view and the mobile reel when presenting touch/responsive behavior. For documents, editorials, issue reports, and README sections, prefer the individual feature WebPs because each scene is designed to stand alone and return near its initial state for a natural loop.

Raw WebM and PNG evidence should remain CI artifacts rather than source-controlled binaries. Generated WebPs and MP4s are published by CI and should not be committed unless repository policy changes explicitly.
