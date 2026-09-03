import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
  accumulateDepression,
  radialDeformationDepth,
  relaxDepression,
  terrainImpactProfile,
  type TerrainDeformationCalibration
} from "@defend/gameplay/terrainDeformation";
import { createLabShell } from "../../labTheme";

type TerrainArgs = {
  effectiveMass: number;
  normalSpeed: number;
  bodyRadius: number;
  compliance: number;
  stabilization: number;
  maxDepth: number;
};

function calibration(args: TerrainArgs): TerrainDeformationCalibration {
  return {
    maxDepth: args.maxDepth,
    minFootprintRadius: 6,
    maxFootprintRadius: 54,
    energyForMaxDepth: 520000,
    energyForMaxRadius: 420000,
    baseRecoveryHalfLifeMs: 5000,
    minimumRecoveryHalfLifeMs: 1800,
    diffusionPerSecond: 0.8,
    maxSupportSpeed: 8
  };
}

function crossSectionPath(radius: number, depthAt: (distance: number) => number, maxDepth: number): string {
  const width = 420;
  const centerY = 150;
  const depthScale = maxDepth > 0 ? 82 / maxDepth : 0;
  const points: string[] = [];
  const samples = 96;
  for (let index = 0; index <= samples; index += 1) {
    const normalized = index / samples;
    const worldX = (normalized * 2 - 1) * radius;
    const x = normalized * width - width / 2;
    const y = centerY + depthAt(Math.abs(worldX)) * depthScale;
    points.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const meta = {
  title: "Foundations/Physics/Terrain Deformation",
  tags: ["test", "visual"],
  args: {
    effectiveMass: 5400,
    normalSpeed: 12,
    bodyRadius: 6,
    compliance: 0.65,
    stabilization: 0.12,
    maxDepth: 8
  },
  argTypes: {
    effectiveMass: { control: { type: "range", min: 100, max: 20000, step: 100 } },
    normalSpeed: { control: { type: "range", min: 0, max: 40, step: 1 } },
    bodyRadius: { control: { type: "range", min: 1, max: 16, step: 0.5 } },
    compliance: { control: { type: "range", min: 0, max: 1.5, step: 0.05 } },
    stabilization: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    maxDepth: { control: { type: "range", min: 1, max: 16, step: 0.5 } }
  },
  render: (args: TerrainArgs) => {
    const config = calibration(args);
    const profile = terrainImpactProfile(
      {
        effectiveMass: args.effectiveMass,
        normalSpeed: args.normalSpeed,
        bodyRadius: args.bodyRadius,
        compliance: args.compliance,
        stabilization: args.stabilization
      },
      config
    );
    const radius = Math.max(profile.footprintRadius, 1);
    const rawPath = crossSectionPath(
      radius,
      distance => radialDeformationDepth(distance, profile),
      config.maxDepth
    );
    const recoveredCenter = relaxDepression(
      profile.depth,
      config.baseRecoveryHalfLifeMs,
      args.stabilization,
      config
    );
    const recoveryRatio = profile.depth > 0 ? recoveredCenter / profile.depth : 0;
    const recoveredPath = crossSectionPath(
      radius,
      distance => radialDeformationDepth(distance, profile) * recoveryRatio,
      config.maxDepth
    );
    let repeatedDepth = 0;
    for (let index = 0; index < 8; index += 1) {
      repeatedDepth = accumulateDepression(repeatedDepth, profile.depth, config.maxDepth);
    }

    const shell = createLabShell(
      "Foundations / physics",
      "Bounded terrain response",
      "Explore how impact energy, body scale, material compliance, stabilization, recovery, and the hard depth cap shape a self-leveling support field before any live ground mesh is allowed to move."
    );

    shell.frame.innerHTML = `
      <style>
        .terrain-baseline { stroke: rgba(244, 237, 247, 0.18); stroke-width: 1; vector-effect: non-scaling-stroke; }
        .terrain-profile { fill: none; stroke: #e4b980; stroke-width: 2; vector-effect: non-scaling-stroke; }
        .terrain-recovered { fill: none; stroke: rgba(215, 164, 108, 0.44); stroke-width: 1.5; stroke-dasharray: 5 4; vector-effect: non-scaling-stroke; }
        .terrain-impact { fill: #e4b980; opacity: 0.86; }
        .terrain-label { fill: rgba(244, 237, 247, 0.52); font-size: 11px; }
        .terrain-stage { background: linear-gradient(to bottom, rgba(173, 97, 26, 0.03), rgba(10, 2, 18, 0.2)); }
      </style>
      <div class="lab__grid">
        <section class="lab__panel lab__stage terrain-stage">
          <svg viewBox="-240 0 480 280" aria-label="Terrain deformation cross section">
            <line class="terrain-baseline" x1="-220" y1="150" x2="220" y2="150" />
            <path class="terrain-recovered" d="${recoveredPath}" />
            <path class="terrain-profile" d="${rawPath}" />
            <circle class="terrain-impact" cx="0" cy="132" r="4" />
            <text class="terrain-label" x="-214" y="34">impact profile</text>
            <text class="terrain-label" x="-214" y="52">dashed = one recovery half-life later</text>
          </svg>
        </section>
        <aside class="lab__panel lab__panel--padded">
          <h2 class="lab__section-title">Impact model</h2>
          <dl class="lab__metrics">
            <div class="lab__metric"><dt>Energy</dt><dd>${Math.round(profile.energy).toLocaleString()}</dd></div>
            <div class="lab__metric"><dt>Peak depth</dt><dd data-depth="${profile.depth}">${profile.depth.toFixed(3)}</dd></div>
            <div class="lab__metric"><dt>Footprint radius</dt><dd>${profile.footprintRadius.toFixed(2)}</dd></div>
            <div class="lab__metric"><dt>After 1 half-life</dt><dd>${recoveredCenter.toFixed(3)}</dd></div>
            <div class="lab__metric"><dt>8 repeated impacts</dt><dd data-repeated-depth="${repeatedDepth}">${repeatedDepth.toFixed(3)}</dd></div>
            <div class="lab__metric"><dt>Hard cap</dt><dd data-max-depth="${config.maxDepth}">${config.maxDepth.toFixed(2)}</dd></div>
          </dl>
        </aside>
      </div>
    `;

    return shell.root;
  }
} satisfies Meta<TerrainArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImpactResponse: Story = {
  play: async ({ canvasElement }) => {
    const depth = canvasElement.querySelector<HTMLElement>("[data-depth]");
    const repeated = canvasElement.querySelector<HTMLElement>("[data-repeated-depth]");
    const maximum = canvasElement.querySelector<HTMLElement>("[data-max-depth]");
    await expect(depth).not.toBeNull();
    await expect(repeated).not.toBeNull();
    await expect(maximum).not.toBeNull();
    if (!depth || !repeated || !maximum) return;
    const cap = Number(maximum.dataset.maxDepth);
    await expect(Number(depth.dataset.depth)).toBeLessThanOrEqual(cap);
    await expect(Number(repeated.dataset.repeatedDepth)).toBeLessThanOrEqual(cap);
  }
};
