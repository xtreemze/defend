import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
  deriveAcousticExcitation,
  impactEnergy,
  type AcousticCalibration,
  type AcousticContact,
  type AcousticExcitation,
  type AcousticMaterialId
} from "@defend/audio/acoustics";
import { terrainImpactEnergy } from "@defend/gameplay/terrainDeformation";
import { createLabShell } from "../../labTheme";

type AcousticArgs = {
  materialA: AcousticMaterialId;
  materialB: AcousticMaterialId;
  effectiveMass: number;
  normalSpeed: number;
  tangentialSpeed: number;
  angularSpeed: number;
  bodyScale: number;
  damageEnergy: number;
};

const materials: AcousticMaterialId[] = [
  "tower",
  "projectile",
  "enemy",
  "ground",
  "energy",
  "fragment"
];

const calibration: AcousticCalibration = {
  referenceImpactEnergy: 520000,
  referenceSpeed: 20,
  referenceBodyScale: 6,
  referenceFrequencyHz: 220,
  referenceDecaySeconds: 1.2
};

function contact(args: AcousticArgs, swap = false): AcousticContact {
  return {
    position: { x: 0, y: 0, z: 0 },
    normal: { x: 0, y: 1, z: 0 },
    normalSpeed: args.normalSpeed,
    tangentialSpeed: args.tangentialSpeed,
    angularSpeed: args.angularSpeed,
    effectiveMass: args.effectiveMass,
    bodyScale: args.bodyScale,
    materialA: swap ? args.materialB : args.materialA,
    materialB: swap ? args.materialA : args.materialB,
    damageEnergy: args.damageEnergy,
    seed: 41
  };
}

function scalarSignature(excitation: AcousticExcitation): number[] {
  return [
    excitation.impactEnergy,
    excitation.normalizedEnergy,
    excitation.damageEnergy,
    excitation.normalizedDamageEnergy,
    excitation.fundamentalHz,
    excitation.decaySeconds,
    excitation.brightness,
    excitation.noiseMix,
    excitation.scrapeMix,
    excitation.saturation,
    ...excitation.modeRatios
  ];
}

function maximumDifference(a: AcousticExcitation, b: AcousticExcitation): number {
  const left = scalarSignature(a);
  const right = scalarSignature(b);
  const count = Math.max(left.length, right.length);
  let difference = 0;
  for (let index = 0; index < count; index += 1) {
    difference = Math.max(difference, Math.abs((left[index] || 0) - (right[index] || 0)));
  }
  return difference;
}

function parameterBar(label: string, value: number): string {
  const clamped = Math.max(0, Math.min(1, value));
  return `
    <div class="acoustic-parameter">
      <span>${label}</span>
      <span class="acoustic-parameter__track"><i style="width:${(clamped * 100).toFixed(1)}%"></i></span>
      <strong>${clamped.toFixed(3)}</strong>
    </div>
  `;
}

function modeBars(excitation: AcousticExcitation): string {
  const maximum = Math.max(1, ...excitation.modeRatios);
  return excitation.modeRatios
    .map((ratio, index) => {
      const width = (ratio / maximum) * 100;
      return `
        <div class="mode-row">
          <span>mode ${index + 1}</span>
          <span class="mode-row__track"><i style="width:${width.toFixed(1)}%"></i></span>
          <strong>${ratio.toFixed(2)}×</strong>
        </div>
      `;
    })
    .join("");
}

const meta = {
  title: "Audio/Materials/Acoustic Contact",
  tags: ["test", "visual"],
  args: {
    materialA: "projectile",
    materialB: "enemy",
    effectiveMass: 540,
    normalSpeed: 18,
    tangentialSpeed: 6,
    angularSpeed: 1.4,
    bodyScale: 4,
    damageEnergy: 90000
  },
  argTypes: {
    materialA: { control: "select", options: materials },
    materialB: { control: "select", options: materials },
    effectiveMass: { control: { type: "range", min: 1, max: 10000, step: 10 } },
    normalSpeed: { control: { type: "range", min: -40, max: 40, step: 1 } },
    tangentialSpeed: { control: { type: "range", min: 0, max: 40, step: 1 } },
    angularSpeed: { control: { type: "range", min: 0, max: 12, step: 0.1 } },
    bodyScale: { control: { type: "range", min: 0.5, max: 18, step: 0.5 } },
    damageEnergy: { control: { type: "range", min: 0, max: 600000, step: 5000 } }
  },
  render: (args: AcousticArgs) => {
    const primaryContact = contact(args);
    const swappedContact = contact(args, true);
    const excitation = deriveAcousticExcitation(primaryContact, calibration);
    const swapped = deriveAcousticExcitation(swappedContact, calibration);
    const symmetryDifference = maximumDifference(excitation, swapped);
    const acousticEnergy = impactEnergy(primaryContact);
    const terrainEnergy = terrainImpactEnergy(args.effectiveMass, args.normalSpeed);
    const negativeSpeedEnergy = impactEnergy({ ...primaryContact, normalSpeed: -args.normalSpeed });
    const shell = createLabShell(
      "Audio / materials",
      "Physics-driven acoustic contact",
      "Inspect the backend-neutral excitation descriptor produced from one physical collision. Material order must not change the result, and acoustic and terrain systems must agree on normal-impact energy before either is wired to production."
    );

    shell.frame.innerHTML = `
      <style>
        .acoustic-stage { padding: 22px; align-content: center; }
        .contact-glyph { width: min(420px, 90%); margin: auto; }
        .contact-glyph line { vector-effect: non-scaling-stroke; }
        .contact-glyph__axis { stroke: rgba(244, 237, 247, 0.14); }
        .contact-glyph__body { fill: rgba(173, 97, 26, 0.2); stroke: #e4b980; stroke-width: 2; }
        .contact-glyph__impact { stroke: #f4edf7; stroke-width: 2; marker-end: url(#arrow); }
        .contact-glyph__scrape { stroke: rgba(215, 164, 108, 0.6); stroke-width: 2; stroke-dasharray: 4 3; marker-end: url(#arrow); }
        .acoustic-parameter, .mode-row { display:grid; grid-template-columns: 74px 1fr 52px; gap:8px; align-items:center; margin:8px 0; font-size:12px; }
        .acoustic-parameter > span:first-child, .mode-row > span:first-child { color:rgba(244,237,247,.55); }
        .acoustic-parameter strong, .mode-row strong { color:#e4b980; text-align:right; font-weight:500; font-variant-numeric:tabular-nums; }
        .acoustic-parameter__track, .mode-row__track { height:5px; background:rgba(244,237,247,.08); overflow:hidden; }
        .acoustic-parameter__track i, .mode-row__track i { display:block; height:100%; background:#d7a46c; }
        .acoustic-subsection { margin-top:20px; }
      </style>
      <div class="lab__grid">
        <section class="lab__panel lab__stage acoustic-stage">
          <svg class="contact-glyph" viewBox="-130 -100 260 200" aria-label="Acoustic contact vector diagram">
            <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e4b980" /></marker></defs>
            <line class="contact-glyph__axis" x1="-112" y1="0" x2="112" y2="0" />
            <circle class="contact-glyph__body" cx="0" cy="0" r="${Math.max(14, Math.min(46, args.bodyScale * 4))}" />
            <line class="contact-glyph__impact" x1="0" y1="-84" x2="0" y2="-20" />
            <line class="contact-glyph__scrape" x1="-80" y1="28" x2="${Math.min(92, -80 + args.tangentialSpeed * 4)}" y2="28" />
          </svg>
          <div style="width:min(520px,100%);margin:12px auto 0">
            ${parameterBar("brightness", excitation.brightness)}
            ${parameterBar("noise", excitation.noiseMix)}
            ${parameterBar("scrape", excitation.scrapeMix)}
            ${parameterBar("saturation", excitation.saturation)}
          </div>
        </section>
        <aside class="lab__panel lab__panel--padded">
          <h2 class="lab__section-title">Excitation</h2>
          <dl class="lab__metrics">
            <div class="lab__metric"><dt>Material pair</dt><dd>${args.materialA} × ${args.materialB}</dd></div>
            <div class="lab__metric"><dt>Impact energy</dt><dd data-acoustic-energy="${acousticEnergy}">${Math.round(acousticEnergy).toLocaleString()}</dd></div>
            <div class="lab__metric"><dt>Terrain energy</dt><dd data-terrain-energy="${terrainEnergy}">${Math.round(terrainEnergy).toLocaleString()}</dd></div>
            <div class="lab__metric"><dt>Fundamental</dt><dd>${excitation.fundamentalHz.toFixed(1)} Hz</dd></div>
            <div class="lab__metric"><dt>Decay</dt><dd>${excitation.decaySeconds.toFixed(3)} s</dd></div>
            <div class="lab__metric"><dt>Damage norm.</dt><dd>${excitation.normalizedDamageEnergy.toFixed(3)}</dd></div>
            <div class="lab__metric"><dt>A/B symmetry Δ</dt><dd data-symmetry-difference="${symmetryDifference}">${symmetryDifference.toExponential(1)}</dd></div>
            <div class="lab__metric"><dt>Signed-speed Δ</dt><dd data-speed-difference="${Math.abs(acousticEnergy - negativeSpeedEnergy)}">${Math.abs(acousticEnergy - negativeSpeedEnergy).toExponential(1)}</dd></div>
          </dl>
          <div class="acoustic-subsection">
            <h2 class="lab__section-title">Modal ratios</h2>
            ${modeBars(excitation)}
          </div>
        </aside>
      </div>
    `;

    return shell.root;
  }
} satisfies Meta<AcousticArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContactDescriptor: Story = {
  play: async ({ canvasElement }) => {
    const acoustic = canvasElement.querySelector<HTMLElement>("[data-acoustic-energy]");
    const terrain = canvasElement.querySelector<HTMLElement>("[data-terrain-energy]");
    const symmetry = canvasElement.querySelector<HTMLElement>("[data-symmetry-difference]");
    const signedSpeed = canvasElement.querySelector<HTMLElement>("[data-speed-difference]");
    await expect(acoustic).not.toBeNull();
    await expect(terrain).not.toBeNull();
    await expect(symmetry).not.toBeNull();
    await expect(signedSpeed).not.toBeNull();
    if (!acoustic || !terrain || !symmetry || !signedSpeed) return;
    await expect(Number(acoustic.dataset.acousticEnergy)).toBe(Number(terrain.dataset.terrainEnergy));
    await expect(Number(symmetry.dataset.symmetryDifference)).toBe(0);
    await expect(Number(signedSpeed.dataset.speedDifference)).toBe(0);
  }
};
