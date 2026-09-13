import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
  evaluateCausalLegibility,
  type CausalEvidenceEvent,
  type CausalLegibilityConfig
} from "@defend/gameplay/causalLegibility";
import { createLabShell } from "../../labTheme";

type CausalArgs = {
  minimumDistinctChannels: number;
  maximumAnticipationLeadSeconds: number;
  maximumResidueDelaySeconds: number;
};

type Fixture = {
  id: string;
  label: string;
  comparison: string;
  events: CausalEvidenceEvent[];
  expectedQualified: boolean;
};

function event(
  id: string,
  semanticKey: string,
  phase: "anticipation" | "causation" | "residue",
  atSeconds: number,
  channels: string[]
): CausalEvidenceEvent {
  return { id, semanticKey, phase, atSeconds, channels };
}

const fixtures: Fixture[] = [
  {
    id: "projectile-scale",
    label: "Weak vs heavy projectile",
    comparison: "Launch silhouette and travel precede a visibly larger impulse; displacement remains as residue.",
    expectedQualified: true,
    events: [
      event("heavy-flight", "heavy-projectile-impact", "anticipation", 1.0, ["shape", "motion", "spatial-audio"]),
      event("heavy-hit", "heavy-projectile-impact", "causation", 1.7, ["motion", "impact-audio"]),
      event("heavy-displacement", "heavy-projectile-impact", "residue", 2.1, ["position", "terrain-mark"])
    ]
  },
  {
    id: "raider-mass",
    label: "Light vs heavy raider",
    comparison: "Body scale and inertia anticipate resistance; the resulting deflection or persistence remains spatially readable.",
    expectedQualified: true,
    events: [
      event("raider-approach", "raider-mass-response", "anticipation", 2.0, ["shape", "motion"]),
      event("raider-contact", "raider-mass-response", "causation", 2.8, ["motion", "contact-audio"]),
      event("raider-vector", "raider-mass-response", "residue", 3.3, ["position", "velocity"])
    ]
  },
  {
    id: "corridor-fit",
    label: "R1 / R2 / R3 corridor fit",
    comparison: "Clearance is visible before commitment; contact explains why one body passes while another jams or redirects.",
    expectedQualified: true,
    events: [
      event("corridor-read", "corridor-clearance", "anticipation", 3.0, ["shape", "spacing"]),
      event("corridor-contact", "corridor-clearance", "causation", 3.9, ["motion", "contact-audio"]),
      event("corridor-outcome", "corridor-clearance", "residue", 4.4, ["position", "obstruction-state"])
    ]
  },
  {
    id: "edge-ejection",
    label: "Ejection at the arena edge",
    comparison: "Momentum toward the edge is readable, crossing is physical, and the missing threat remains observable afterward.",
    expectedQualified: true,
    events: [
      event("edge-vector", "edge-ejection", "anticipation", 4.0, ["motion", "boundary-shape"]),
      event("edge-cross", "edge-ejection", "causation", 4.8, ["motion", "spatial-audio"]),
      event("edge-cleared", "edge-ejection", "residue", 5.2, ["position", "threat-count"])
    ]
  },
  {
    id: "delay-expiry",
    label: "Wall delay into finite-life expiry",
    comparison: "The wall visibly delays rather than damages by fiat; elapsed obstruction leads to an observable lifecycle expiry.",
    expectedQualified: true,
    events: [
      event("wall-approach", "delay-expiry", "anticipation", 5.0, ["shape", "motion"]),
      event("wall-delay", "delay-expiry", "causation", 5.8, ["position", "contact-audio"]),
      event("expiry", "delay-expiry", "residue", 6.9, ["lifecycle-state", "absence"])
    ]
  },
  {
    id: "energy-drainage",
    label: "Teal drainage vs blocked pooling",
    comparison: "Surface slope and openings preview flow; obstruction causes pooling that persists until topology changes.",
    expectedQualified: true,
    events: [
      event("flow-path", "energy-drainage", "anticipation", 6.0, ["surface-path", "motion"]),
      event("flow-block", "energy-drainage", "causation", 6.7, ["motion", "obstruction-shape"]),
      event("flow-pool", "energy-drainage", "residue", 7.1, ["pool-shape", "position"])
    ]
  },
  {
    id: "tower-lifecycle",
    label: "Tower deployment → degradation → expiry",
    comparison: "Structural state changes are staged and visible so loss of capability is not an unexplained disappearance.",
    expectedQualified: true,
    events: [
      event("tower-degrade", "tower-lifecycle", "anticipation", 7.0, ["structure-state", "motion"]),
      event("tower-expire", "tower-lifecycle", "causation", 7.8, ["structure-state", "audio"]),
      event("tower-remnant", "tower-lifecycle", "residue", 8.3, ["remnant-shape", "topology"])
    ]
  },
  {
    id: "fortress-residue",
    label: "Fortress residue vs clean rebuild",
    comparison: "Prior construction and destruction leave bounded semantic residue instead of erasing the causal history.",
    expectedQualified: true,
    events: [
      event("fortress-strain", "fortress-residue", "anticipation", 8.0, ["structure-state", "surface-mark"]),
      event("fortress-loss", "fortress-residue", "causation", 8.8, ["motion", "impact-audio"]),
      event("fortress-remnant", "fortress-residue", "residue", 9.5, ["remnant-shape", "surface-mark"])
    ]
  },
  {
    id: "capital-risk",
    label: "Commitment preservation vs capital loss",
    comparison: "A surviving or damaged raider visibly carries investment through evacuation so economic loss follows physical survival.",
    expectedQualified: true,
    events: [
      event("evacuation-state", "capital-risk", "anticipation", 9.0, ["body-state", "motion"]),
      event("evacuation-damage", "capital-risk", "causation", 9.8, ["impact", "spatial-audio"]),
      event("capital-return", "capital-risk", "residue", 10.4, ["body-state", "energy-transfer"])
    ]
  },
  {
    id: "broken-control",
    label: "Broken causal control",
    comparison: "A residue appears without any readable anticipation. The contract must reject this as insufficient evidence, not infer a cause.",
    expectedQualified: false,
    events: [
      event("hidden-cause", "broken-control", "causation", 11.0, ["motion"]),
      event("sudden-result", "broken-control", "residue", 11.2, ["position"])
    ]
  }
];

function config(args: CausalArgs): CausalLegibilityConfig {
  return {
    minimumDistinctChannels: args.minimumDistinctChannels,
    maximumAnticipationLeadSeconds: args.maximumAnticipationLeadSeconds,
    maximumResidueDelaySeconds: args.maximumResidueDelaySeconds
  };
}

function phaseLabel(eventItem: CausalEvidenceEvent): string {
  return `${eventItem.phase} · ${eventItem.atSeconds.toFixed(1)}s · ${eventItem.channels.join(" + ")}`;
}

const meta = {
  title: "Foundations/Strategy/Causal Legibility",
  tags: ["test", "visual"],
  args: {
    minimumDistinctChannels: 2,
    maximumAnticipationLeadSeconds: 4,
    maximumResidueDelaySeconds: 8
  },
  argTypes: {
    minimumDistinctChannels: { control: { type: "range", min: 1, max: 6, step: 1 } },
    maximumAnticipationLeadSeconds: { control: { type: "range", min: 0, max: 12, step: 0.5 } },
    maximumResidueDelaySeconds: { control: { type: "range", min: 0, max: 20, step: 0.5 } }
  },
  render: (args: CausalArgs) => {
    const evaluationConfig = config(args);
    const shell = createLabShell(
      "Foundations / strategy",
      "Causal legibility evidence matrix",
      "A post-simulation evidence contract for the game-design question: can an observer read anticipation → causation → residue without a debug overlay? These fixtures are semantic examples, not substitute physics. Live #72/#86 measurements should later feed the same contract."
    );

    const cards = fixtures.map(fixture => {
      const evaluation = evaluateCausalLegibility(fixture.events, evaluationConfig);
      const chain = evaluation.chains[0];
      const qualified = evaluation.qualified;
      const status = qualified ? "legible" : "needs evidence";
      const expectedMatch = qualified === fixture.expectedQualified;
      const diagnostics = chain && chain.diagnostics.length > 0 ? chain.diagnostics.join(", ") : "none";
      const phases = fixture.events
        .map(eventItem => `<li><strong>${eventItem.phase}</strong><span>${phaseLabel(eventItem)}</span></li>`)
        .join("");

      return `
        <article class="causal-card" data-fixture="${fixture.id}" data-qualified="${qualified}" data-expected-match="${expectedMatch}">
          <header>
            <div>
              <p class="causal-kicker">${fixture.id}</p>
              <h2>${fixture.label}</h2>
            </div>
            <span class="causal-status" data-status="${status}">${status}</span>
          </header>
          <p class="causal-copy">${fixture.comparison}</p>
          <ol class="causal-phases">${phases}</ol>
          <dl class="causal-metrics">
            <div><dt>complete</dt><dd>${chain ? chain.complete : false}</dd></div>
            <div><dt>channels</dt><dd>${chain ? chain.distinctChannels : 0}</dd></div>
            <div><dt>diagnostics</dt><dd>${diagnostics}</dd></div>
          </dl>
        </article>
      `;
    }).join("");

    shell.frame.innerHTML = `
      <style>
        .causal-intro { margin: 0 0 18px; color: rgba(244, 237, 247, 0.68); max-width: 78ch; }
        .causal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 12px; }
        .causal-card { border: 1px solid rgba(244, 237, 247, 0.14); border-radius: 12px; padding: 14px; background: rgba(12, 5, 19, 0.54); min-width: 0; }
        .causal-card header { display: flex; gap: 12px; justify-content: space-between; align-items: start; }
        .causal-card h2 { font-size: 15px; line-height: 1.25; margin: 2px 0 0; }
        .causal-kicker { margin: 0; text-transform: uppercase; letter-spacing: .09em; font-size: 10px; opacity: .52; }
        .causal-status { border: 1px solid currentColor; border-radius: 999px; padding: 3px 7px; font-size: 10px; white-space: nowrap; }
        .causal-copy { min-height: 54px; font-size: 12px; line-height: 1.5; color: rgba(244, 237, 247, 0.68); }
        .causal-phases { display: grid; gap: 7px; list-style: none; padding: 0; margin: 12px 0; counter-reset: phase; }
        .causal-phases li { display: grid; grid-template-columns: 86px 1fr; gap: 8px; padding-left: 9px; border-left: 2px solid rgba(244, 237, 247, 0.28); }
        .causal-phases strong { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
        .causal-phases span { font-size: 11px; color: rgba(244, 237, 247, 0.57); overflow-wrap: anywhere; }
        .causal-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; margin: 0; }
        .causal-metrics div { border-top: 1px solid rgba(244, 237, 247, 0.1); padding-top: 7px; min-width: 0; }
        .causal-metrics dt { font-size: 9px; text-transform: uppercase; opacity: .48; }
        .causal-metrics dd { margin: 3px 0 0; font-size: 11px; overflow-wrap: anywhere; }
        @media (max-width: 620px) { .causal-grid { grid-template-columns: 1fr; } .causal-copy { min-height: 0; } }
      </style>
      <p class="causal-intro">
        The first nine rows mirror #106's required comparison families. The final row is intentionally causally opaque and must fail. The contract never invents physics: it only evaluates evidence emitted after authoritative outcomes exist.
      </p>
      <section class="causal-grid" aria-label="Causal legibility fixture matrix">${cards}</section>
    `;

    return shell.root;
  }
} satisfies Meta<CausalArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EvidenceMatrix: Story = {
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll<HTMLElement>("[data-fixture]"));
    await expect(cards).toHaveLength(10);

    const required = cards.filter(card => card.dataset.fixture !== "broken-control");
    await expect(required).toHaveLength(9);
    required.forEach(card => {
      expect(card.dataset.qualified).toBe("true");
      expect(card.dataset.expectedMatch).toBe("true");
    });

    const broken = canvasElement.querySelector<HTMLElement>("[data-fixture='broken-control']");
    await expect(broken).not.toBeNull();
    if (!broken) return;
    await expect(broken.dataset.qualified).toBe("false");
    await expect(broken.dataset.expectedMatch).toBe("true");
  }
};
