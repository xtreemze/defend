import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent } from "storybook/test";
import type {
  SpatialAudioCalibration,
  SpatialAudioObjectState,
  SpatialListenerState
} from "@defend/audio/spatialAudio";
import {
  planSpatialVoiceBudget,
  spatialVoiceHistory,
  type SpatialVoiceBudget,
  type SpatialVoicePlan
} from "@defend/audio/spatialVoiceBudget";
import { createLabShell } from "../../labTheme";

type SpatialArgs = {
  emitterCount: number;
  fullVoices: number;
  standardVoices: number;
  cheapVoices: number;
  retention: number;
};

const listener: SpatialListenerState = {
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  forward: { x: 0, y: 0, z: 1 },
  up: { x: 0, y: 1, z: 0 },
  focusPosition: { x: 0, y: 0, z: 0 }
};

const calibration: SpatialAudioCalibration = {
  speedOfSound: 420,
  maxRadialFractionOfSoundSpeed: 0.75,
  minDopplerRatio: 0.5,
  maxDopplerRatio: 2,
  referenceDistance: 24,
  rolloffExponent: 1.35,
  airAbsorptionPerUnit: 0.008,
  predictionHorizonSeconds: 1.2,
  energyReference: 1400,
  proximityWeight: 1,
  closestApproachWeight: 1.4,
  energyWeight: 0.8,
  threatWeight: 1.2,
  continuityWeight: 0.35
};

function movingSource(source: SpatialAudioObjectState, timeSeconds: number): SpatialAudioObjectState {
  return {
    ...source,
    position: {
      x: source.position.x + source.velocity.x * timeSeconds,
      y: source.position.y + source.velocity.y * timeSeconds,
      z: source.position.z + source.velocity.z * timeSeconds
    }
  };
}

function sources(count: number, timeSeconds: number): SpatialAudioObjectState[] {
  const safeCount = Math.max(8, Math.floor(count));
  const generated: SpatialAudioObjectState[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  generated.push(
    movingSource(
      {
        id: "flyby-projectile",
        kind: "projectile",
        acousticProfile: "projectile",
        position: { x: -96, y: 2, z: 18 },
        velocity: { x: 148, y: 0, z: -5 },
        orientation: { x: 1, y: 0, z: 0 },
        directivity: 0.2,
        radius: 1.4,
        baseGain: 1,
        excitationEnergy: 2600,
        threat: 0.78,
        continuity: 0.65,
        seed: 17,
        sustained: true
      },
      timeSeconds
    )
  );

  for (let index = 1; index < safeCount; index += 1) {
    const angle = index * goldenAngle;
    const distance = 18 + (index % 9) * 10 + Math.floor(index / 9) * 2;
    const tangentialSpeed = 4 + (index % 5) * 3;
    const radialSpeed = index % 4 === 0 ? -5 : 1.5;
    const radial = { x: Math.cos(angle), z: Math.sin(angle) };
    const tangent = { x: -radial.z, z: radial.x };
    const source: SpatialAudioObjectState = {
      id: `emitter-${String(index).padStart(3, "0")}`,
      kind: index % 3 === 0 ? "enemy" : index % 3 === 1 ? "impact" : "fragment",
      acousticProfile: index % 3 === 0 ? "enemy" : index % 3 === 1 ? "ground" : "fragment",
      position: { x: radial.x * distance, y: 0, z: radial.z * distance },
      velocity: {
        x: tangent.x * tangentialSpeed + radial.x * radialSpeed,
        y: 0,
        z: tangent.z * tangentialSpeed + radial.z * radialSpeed
      },
      orientation: { x: tangent.x, y: 0, z: tangent.z },
      directivity: 0,
      radius: 1 + (index % 4) * 0.5,
      baseGain: 0.75,
      excitationEnergy: 180 + (index % 11) * 130,
      threat: index % 13 === 0 ? 0.72 : 0.1 + (index % 5) * 0.08,
      continuity: index % 6 === 0 ? 0.8 : 0.2,
      seed: 100 + index,
      sustained: index % 4 === 0
    };
    generated.push(movingSource(source, timeSeconds));
  }

  return generated;
}

function sourceMarkup(source: SpatialAudioObjectState, plan: SpatialVoicePlan): string {
  const scale = 1.65;
  const x = source.position.x * scale;
  const y = source.position.z * scale;
  const velocityScale = 0.12;
  const vx = source.velocity.x * velocityScale;
  const vy = source.velocity.z * velocityScale;
  const radius = source.id === "flyby-projectile" ? 6 : 2.5 + plan.priority * 3.5;
  const velocityLine = plan.tier === "full" || source.id === "flyby-projectile"
    ? `<line class="voice__velocity" x1="${x}" y1="${y}" x2="${x + vx}" y2="${y + vy}" />`
    : "";

  return `
    <g class="voice voice--${plan.tier}" data-plan-id="${plan.id}" data-tier="${plan.tier}" data-priority="${plan.priority}">
      ${velocityLine}
      <circle cx="${x}" cy="${y}" r="${radius}" />
    </g>
  `;
}

function renderPlans(
  root: HTMLElement,
  args: SpatialArgs,
  timeSeconds: number,
  previous?: SpatialVoicePlan[]
): SpatialVoicePlan[] {
  const currentSources = sources(args.emitterCount, timeSeconds);
  const budget: SpatialVoiceBudget = {
    fullVoices: args.fullVoices,
    standardVoices: args.standardVoices,
    cheapVoices: args.cheapVoices,
    activeVoiceRetention: args.retention
  };
  const history = previous ? spatialVoiceHistory(previous) : undefined;
  const plans = planSpatialVoiceBudget(currentSources, listener, calibration, budget, history);
  const byId = new Map<string, SpatialAudioObjectState>(
    currentSources.map(source => [source.id, source] as const)
  );
  const hero = plans.find(plan => plan.id === "flyby-projectile");
  const stage = root.querySelector<SVGElement>("[data-spatial-stage]");
  const table = root.querySelector<HTMLElement>("[data-voice-table]");
  const heroDoppler = root.querySelector<HTMLElement>("[data-hero-doppler]");
  const heroPriority = root.querySelector<HTMLElement>("[data-hero-priority]");
  const renderedMetric = root.querySelector<HTMLElement>("[data-rendered-count]");
  const rendered = plans.filter(plan => plan.tier !== "virtual").length;

  if (stage) {
    stage.innerHTML = `
      <circle class="listener-range" cx="0" cy="0" r="${calibration.referenceDistance * 1.65}" />
      <circle class="listener" cx="0" cy="0" r="6" />
      ${plans.map(plan => {
        const source = byId.get(plan.id);
        return source ? sourceMarkup(source, plan) : "";
      }).join("")}
    `;
  }

  if (table) {
    table.innerHTML = plans.slice(0, 10).map(plan =>
      `<tr><td>${plan.rank + 1}</td><td>${plan.id}</td><td>${plan.tier}</td><td>${plan.priority.toFixed(3)}</td><td>${plan.hints.distance.toFixed(1)}</td></tr>`
    ).join("");
  }

  if (hero && heroDoppler) heroDoppler.textContent = hero.hints.doppler.ratio.toFixed(3);
  if (hero && heroPriority) heroPriority.textContent = hero.priority.toFixed(3);
  if (renderedMetric) renderedMetric.textContent = String(rendered);
  return plans;
}

const meta = {
  title: "Audio/Spatial/Voice Budget",
  tags: ["test", "visual"],
  args: {
    emitterCount: 64,
    fullVoices: 8,
    standardVoices: 16,
    cheapVoices: 20,
    retention: 0.05
  },
  argTypes: {
    emitterCount: { control: { type: "range", min: 16, max: 256, step: 8 } },
    fullVoices: { control: { type: "range", min: 0, max: 32, step: 1 } },
    standardVoices: { control: { type: "range", min: 0, max: 64, step: 1 } },
    cheapVoices: { control: { type: "range", min: 0, max: 128, step: 1 } },
    retention: { control: { type: "range", min: 0, max: 0.25, step: 0.01 } }
  },
  render: (args: SpatialArgs) => {
    const shell = createLabShell(
      "Audio / spatial",
      "World-space voice budget",
      "Inspect how proximity, predicted closest approach, excitation, threat, and continuity rank moving emitters before any renderer maps semantic tiers to HRTF, equal-power panning, modal complexity, or virtualization."
    );

    shell.frame.innerHTML = `
      <style>
        .spatial-stage { background: radial-gradient(circle at center, rgba(173, 97, 26, 0.09), transparent 38%); }
        .spatial-stage svg { overflow: visible; }
        .listener-range { fill: none; stroke: rgba(215, 164, 108, 0.2); stroke-dasharray: 4 5; }
        .listener { fill: #f4edf7; stroke: #1c0530; stroke-width: 2; }
        .voice circle { vector-effect: non-scaling-stroke; }
        .voice--full circle { fill: #e4b980; stroke: #f4edf7; stroke-width: 1.2; }
        .voice--standard circle { fill: rgba(215, 164, 108, 0.72); stroke: rgba(244, 237, 247, 0.6); }
        .voice--cheap circle { fill: rgba(173, 97, 26, 0.42); stroke: rgba(215, 164, 108, 0.38); }
        .voice--virtual circle { fill: rgba(244, 237, 247, 0.05); stroke: rgba(244, 237, 247, 0.14); }
        .voice__velocity { stroke: rgba(228, 185, 128, 0.45); stroke-width: 1; vector-effect: non-scaling-stroke; }
        .spatial-actions { display: flex; gap: 8px; margin-top: 14px; }
      </style>
      <div class="lab__grid">
        <section class="lab__panel lab__stage spatial-stage">
          <svg viewBox="-210 -210 420 420" aria-label="Spatial audio emitter priorities" data-spatial-stage></svg>
        </section>
        <aside class="lab__panel lab__panel--padded">
          <h2 class="lab__section-title">Planner state</h2>
          <dl class="lab__metrics">
            <div class="lab__metric"><dt>Emitters</dt><dd>${Math.max(8, Math.floor(args.emitterCount))}</dd></div>
            <div class="lab__metric"><dt>Rendered voices</dt><dd data-rendered-count>0</dd></div>
            <div class="lab__metric"><dt>Fly-by Doppler</dt><dd data-hero-doppler>1.000</dd></div>
            <div class="lab__metric"><dt>Fly-by priority</dt><dd data-hero-priority>0.000</dd></div>
          </dl>
          <div class="spatial-actions">
            <button type="button" data-advance data-time="0">Advance 250 ms</button>
          </div>
          <h2 class="lab__section-title" style="margin-top:18px">Top voices</h2>
          <table>
            <thead><tr><th>#</th><th>Emitter</th><th>Tier</th><th>Priority</th><th>Distance</th></tr></thead>
            <tbody data-voice-table></tbody>
          </table>
        </aside>
      </div>
    `;

    let plans = renderPlans(shell.root, args, 0);
    const advance = shell.root.querySelector<HTMLButtonElement>("[data-advance]");
    advance?.addEventListener("click", () => {
      const next = Number(advance.dataset.time || "0") + 0.25;
      plans = renderPlans(shell.root, args, next, plans);
      advance.dataset.time = String(next);
    });

    return shell.root;
  }
} satisfies Meta<SpatialArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MovingEmitterBudget: Story = {
  play: async ({ canvasElement }) => {
    const advance = canvasElement.querySelector<HTMLButtonElement>("[data-advance]");
    const hero = canvasElement.querySelector<SVGGElement>("[data-plan-id='flyby-projectile']");
    const rendered = canvasElement.querySelector<HTMLElement>("[data-rendered-count]");
    await expect(advance).not.toBeNull();
    await expect(hero).not.toBeNull();
    await expect(rendered).not.toBeNull();
    if (!advance || !hero || !rendered) return;
    await expect(hero.getAttribute("data-tier")).not.toBe("virtual");
    await expect(rendered).toHaveTextContent("44");
    await userEvent.click(advance);
    await expect(advance).toHaveAttribute("data-time", "0.25");
  }
};
