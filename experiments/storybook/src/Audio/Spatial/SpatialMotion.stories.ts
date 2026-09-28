import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
  initialSpatialMotionEstimate,
  predictSpatialMotionFromCalibration,
  spatialMotionSpeed,
  updateSpatialMotionEstimate,
  type SpatialMotionCalibration,
  type SpatialMotionEstimate
} from "@defend/audio/spatialMotion";
import { createLabShell } from "../../labTheme";

type MotionArgs = {
  sampleHz: number;
  speed: number;
  halfLife: number;
  maxSpeed: number;
  teleportDistance: number;
  includeTeleport: boolean;
};

type TracePoint = {
  x: number;
  z: number;
  estimate: SpatialMotionEstimate;
};

type MotionTrace = {
  points: TracePoint[];
  resetCount: number;
  finalSpeed: number;
  predictedX: number;
  predictedZ: number;
};

function buildTrace(args: MotionArgs): MotionTrace {
  const sampleHz = Math.max(1, Math.floor(args.sampleHz));
  const deltaSeconds = 1 / sampleHz;
  const calibration: SpatialMotionCalibration = {
    minSampleDeltaSeconds: 1 / 500,
    maxSampleDeltaSeconds: 0.25,
    teleportDistance: Math.max(0, args.teleportDistance),
    velocityHalfLifeSeconds: Math.max(0, args.halfLife),
    maxSpeed: Math.max(0, args.maxSpeed),
    maxPredictionSeconds: 0.12
  };
  const startX = -72;
  const startZ = -22;
  const duration = 1.5;
  let offsetX = 0;
  let offsetZ = 0;
  let teleported = false;
  let estimate = initialSpatialMotionEstimate({
    position: { x: startX, y: 0, z: startZ },
    timeSeconds: 0
  });
  const points: TracePoint[] = [{ x: startX, z: startZ, estimate }];
  let resetCount = 0;

  for (let timeSeconds = deltaSeconds; timeSeconds <= duration + 1e-9; timeSeconds += deltaSeconds) {
    if (args.includeTeleport && !teleported && timeSeconds >= 0.75) {
      const distance = Math.max(1, calibration.teleportDistance);
      offsetX = distance + 28;
      offsetZ = -(distance * 0.45 + 10);
      teleported = true;
    }

    const position = {
      x: startX + args.speed * timeSeconds + offsetX,
      y: 0,
      z: startZ + args.speed * 0.18 * timeSeconds + offsetZ
    };
    estimate = updateSpatialMotionEstimate(
      estimate,
      { position, timeSeconds },
      calibration
    );
    if (estimate.reset) resetCount += 1;
    points.push({ x: position.x, z: position.z, estimate });
  }

  const predicted = predictSpatialMotionFromCalibration(
    estimate,
    estimate.timeSeconds + 0.12,
    calibration
  );

  return {
    points,
    resetCount,
    finalSpeed: spatialMotionSpeed(estimate.velocity),
    predictedX: predicted.x,
    predictedZ: predicted.z
  };
}

function bounds(trace: MotionTrace) {
  const xs = trace.points.map(point => point.x).concat(trace.predictedX);
  const zs = trace.points.map(point => point.z).concat(trace.predictedZ);
  const minimumX = Math.min(...xs);
  const maximumX = Math.max(...xs);
  const minimumZ = Math.min(...zs);
  const maximumZ = Math.max(...zs);
  const padding = 18;
  return {
    x: minimumX - padding,
    y: minimumZ - padding,
    width: Math.max(60, maximumX - minimumX + padding * 2),
    height: Math.max(60, maximumZ - minimumZ + padding * 2)
  };
}

function polyline(trace: MotionTrace): string {
  return trace.points.map(point => `${point.x},${point.z}`).join(" ");
}

const meta = {
  title: "Audio/Spatial/Motion Estimator",
  tags: ["test", "visual"],
  args: {
    sampleHz: 60,
    speed: 54,
    halfLife: 0.12,
    maxSpeed: 120,
    teleportDistance: 36,
    includeTeleport: true
  },
  argTypes: {
    sampleHz: { control: { type: "range", min: 15, max: 144, step: 1 } },
    speed: { control: { type: "range", min: 0, max: 160, step: 2 } },
    halfLife: { control: { type: "range", min: 0, max: 0.5, step: 0.01 } },
    maxSpeed: { control: { type: "range", min: 10, max: 220, step: 5 } },
    teleportDistance: { control: { type: "range", min: 0, max: 100, step: 2 } },
    includeTeleport: { control: "boolean" }
  },
  render: (args: MotionArgs) => {
    const shell = createLabShell(
      "Audio / spatial",
      "Timestamped motion estimator",
      "Scrub sampling cadence, smoothing and reset thresholds before listener/source velocity feeds Doppler, closest-approach priority or Web Audio transform scheduling."
    );
    const trace = buildTrace(args);
    const view = bounds(trace);
    const finalPoint = trace.points[trace.points.length - 1];
    const velocityScale = 0.2;
    const velocityEndX = finalPoint.x + finalPoint.estimate.velocity.x * velocityScale;
    const velocityEndZ = finalPoint.z + finalPoint.estimate.velocity.z * velocityScale;

    shell.frame.innerHTML = `
      <style>
        .motion-stage { background: radial-gradient(circle at center, rgba(173, 97, 26, 0.08), transparent 48%); }
        .motion-path { fill: none; stroke: rgba(215, 164, 108, 0.72); stroke-width: 1.4; vector-effect: non-scaling-stroke; }
        .motion-sample { fill: rgba(244, 237, 247, 0.36); }
        .motion-reset { fill: #e4b980; stroke: #f4edf7; stroke-width: 1.2; vector-effect: non-scaling-stroke; }
        .motion-final { fill: #f4edf7; stroke: #1c0530; stroke-width: 1.5; vector-effect: non-scaling-stroke; }
        .motion-predicted { fill: none; stroke: rgba(228, 185, 128, 0.8); stroke-dasharray: 4 4; stroke-width: 1.4; vector-effect: non-scaling-stroke; }
        .motion-velocity { stroke: rgba(228, 185, 128, 0.92); stroke-width: 1.8; vector-effect: non-scaling-stroke; }
      </style>
      <div class="lab__grid">
        <section class="lab__panel lab__stage motion-stage">
          <svg viewBox="${view.x} ${view.y} ${view.width} ${view.height}" aria-label="Timestamped spatial motion trace">
            <polyline class="motion-path" points="${polyline(trace)}" />
            ${trace.points.map((point, index) => {
              const runtimeReset = index > 0 && point.estimate.reset;
              return `<circle class="${runtimeReset ? "motion-reset" : "motion-sample"}" cx="${point.x}" cy="${point.z}" r="${runtimeReset ? 3.3 : 1.4}" ${runtimeReset ? "data-motion-reset" : ""} />`;
            }).join("")}
            <line class="motion-velocity" x1="${finalPoint.x}" y1="${finalPoint.z}" x2="${velocityEndX}" y2="${velocityEndZ}" />
            <circle class="motion-final" cx="${finalPoint.x}" cy="${finalPoint.z}" r="3.5" />
            <line class="motion-predicted" x1="${finalPoint.x}" y1="${finalPoint.z}" x2="${trace.predictedX}" y2="${trace.predictedZ}" />
            <circle class="motion-predicted" cx="${trace.predictedX}" cy="${trace.predictedZ}" r="3" />
          </svg>
        </section>
        <aside class="lab__panel lab__panel--padded">
          <h2 class="lab__section-title">Estimator state</h2>
          <dl class="lab__metrics">
            <div class="lab__metric"><dt>Sample cadence</dt><dd data-sample-hz>${Math.max(1, Math.floor(args.sampleHz))} Hz</dd></div>
            <div class="lab__metric"><dt>Runtime resets</dt><dd data-reset-count>${trace.resetCount}</dd></div>
            <div class="lab__metric"><dt>Final speed</dt><dd data-final-speed>${trace.finalSpeed.toFixed(2)}</dd></div>
            <div class="lab__metric"><dt>Speed limit</dt><dd data-max-speed>${Math.max(0, args.maxSpeed).toFixed(2)}</dd></div>
            <div class="lab__metric"><dt>Prediction horizon</dt><dd>120 ms</dd></div>
            <div class="lab__metric"><dt>Final reset</dt><dd data-final-reset>${String(finalPoint.estimate.reset)}</dd></div>
          </dl>
          <p class="lab__note">Copper markers are discontinuity resets. The solid vector is the final smoothed velocity; the dashed segment is bounded forward prediction for lower-rate audio/control snapshots.</p>
        </aside>
      </div>
    `;

    shell.root.dataset.runtimeResets = String(trace.resetCount);
    shell.root.dataset.finalSpeed = String(trace.finalSpeed);
    shell.root.dataset.maxSpeed = String(Math.max(0, args.maxSpeed));
    return shell.root;
  }
} satisfies Meta<MotionArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CadenceAndTeleport: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("[data-runtime-resets]");
    const reset = canvasElement.querySelector<SVGCircleElement>("[data-motion-reset]");
    await expect(root).not.toBeNull();
    await expect(reset).not.toBeNull();
    if (!root) return;
    const finalSpeed = Number(root.dataset.finalSpeed || "Infinity");
    const maximum = Number(root.dataset.maxSpeed || "0");
    await expect(root.dataset.runtimeResets).toBe("1");
    await expect(Number.isFinite(finalSpeed)).toBe(true);
    await expect(finalSpeed <= maximum).toBe(true);
  }
};
