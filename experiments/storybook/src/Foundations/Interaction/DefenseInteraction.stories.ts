import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent } from "storybook/test";
import {
  resolveDefenseInteraction,
  type DefenseInteractionAction,
  type DefenseInteractionRejection,
  type DefenseInteractionRequest,
  type DefenseInteractionResolution
} from "@defend/gameplay/defenseInteraction";
import { createLabShell } from "../../labTheme";

type Scenario = {
  id: string;
  title: string;
  note: string;
  request: DefenseInteractionRequest;
  expectedAction: DefenseInteractionAction;
  expectedRejection: DefenseInteractionRejection;
};

const scenarios: Scenario[] = [
  {
    id: "place-valid",
    title: "Valid placement",
    note: "World-owned gesture, valid terrain, empty cell, sufficient energy.",
    request: {
      kind: "placement",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      terrainValid: true,
      protectedTarget: false,
      occupied: false
    },
    expectedAction: "place",
    expectedRejection: "none"
  },
  {
    id: "place-invalid-terrain",
    title: "Invalid terrain",
    note: "A world target exists, but the surface is outside the buildable terrain contract.",
    request: {
      kind: "placement",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      terrainValid: false,
      protectedTarget: false,
      occupied: false
    },
    expectedAction: "none",
    expectedRejection: "invalid-terrain"
  },
  {
    id: "place-protected",
    title: "Protected core",
    note: "The target is buildable terrain but belongs to protected/core space.",
    request: {
      kind: "placement",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      terrainValid: true,
      protectedTarget: true,
      occupied: false
    },
    expectedAction: "none",
    expectedRejection: "protected-target"
  },
  {
    id: "place-occupied",
    title: "Occupied cell",
    note: "Placement resolves to an occupied location and must explain the rejection.",
    request: {
      kind: "placement",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      terrainValid: true,
      protectedTarget: false,
      occupied: true
    },
    expectedAction: "none",
    expectedRejection: "occupied"
  },
  {
    id: "place-unaffordable",
    title: "Insufficient energy",
    note: "Affordability is supplied by the caller so #109 can change its boundary independently.",
    request: {
      kind: "placement",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: false,
      terrainValid: true,
      protectedTarget: false,
      occupied: false
    },
    expectedAction: "none",
    expectedRejection: "unaffordable"
  },
  {
    id: "camera-gesture",
    title: "Camera owns gesture",
    note: "Orbit/zoom won arbitration; placement must not look like a mysterious ignored tap.",
    request: {
      kind: "placement",
      gestureOwner: "camera",
      targetAvailable: true,
      affordable: true,
      terrainValid: true,
      protectedTarget: false,
      occupied: false
    },
    expectedAction: "none",
    expectedRejection: "camera-gesture"
  },
  {
    id: "stale-target",
    title: "Stale target",
    note: "The selected world object disappeared or became unavailable before commitment.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: false,
      affordable: true,
      currentTowerLevel: 2,
      maxTowerLevel: 3,
      maxTowerAction: "reject"
    },
    expectedAction: "none",
    expectedRejection: "stale-target"
  },
  {
    id: "tower-upgrade",
    title: "Tower upgrade",
    note: "A valid tower interaction advances one semantic level.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      currentTowerLevel: 1,
      maxTowerLevel: 3,
      maxTowerAction: "reject"
    },
    expectedAction: "upgrade",
    expectedRejection: "none"
  },
  {
    id: "tower-unaffordable",
    title: "Upgrade lacks energy",
    note: "A valid tower remains unchanged when the requested upgrade is unaffordable.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: false,
      currentTowerLevel: 2,
      maxTowerLevel: 3,
      maxTowerAction: "reject"
    },
    expectedAction: "none",
    expectedRejection: "unaffordable"
  },
  {
    id: "tower-max",
    title: "Tower at max state",
    note: "Max-level behavior is explicit rather than silently rebuilding the same state.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      currentTowerLevel: 3,
      maxTowerLevel: 3,
      maxTowerAction: "reject"
    },
    expectedAction: "none",
    expectedRejection: "max-state"
  },
  {
    id: "tower-refresh",
    title: "Explicit refresh policy",
    note: "If a future design intentionally refreshes a max-level tower, it is represented as a distinct action.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      currentTowerLevel: 3,
      maxTowerLevel: 3,
      maxTowerAction: "refresh"
    },
    expectedAction: "refresh",
    expectedRejection: "none"
  },
  {
    id: "tower-invalid-state",
    title: "Invalid tower state",
    note: "Malformed or stale semantic tower levels are rejected instead of being guessed from presentation data.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      currentTowerLevel: 4,
      maxTowerLevel: 3,
      maxTowerAction: "reject"
    },
    expectedAction: "none",
    expectedRejection: "invalid-tower-state"
  }
];

function describeResolution(resolution: DefenseInteractionResolution): string {
  if (resolution.accepted) {
    if (resolution.action === "place") return "Placement accepted";
    if (resolution.action === "upgrade") return `Upgrade ${resolution.fromLevel} → ${resolution.toLevel}`;
    if (resolution.action === "refresh") return `Refresh level ${resolution.fromLevel}`;
  }
  return `Rejected: ${resolution.rejection}`;
}

function scenarioMarkup(scenario: Scenario): string {
  const resolution = resolveDefenseInteraction(scenario.request);
  const outcomeClass = resolution.accepted ? "interaction-card--accepted" : "interaction-card--rejected";
  const outcomeWord = resolution.accepted ? "Accepted" : "Rejected";
  return `
    <button
      class="interaction-card ${outcomeClass}"
      type="button"
      data-scenario="${scenario.id}"
      data-action="${resolution.action}"
      data-rejection="${resolution.rejection}"
    >
      <span class="interaction-card__outcome">${outcomeWord}</span>
      <span class="interaction-card__title">${scenario.title}</span>
      <span class="interaction-card__note">${scenario.note}</span>
      <span class="interaction-card__result">${describeResolution(resolution)}</span>
    </button>
  `;
}

const meta = {
  title: "Foundations/Interaction/Defense Interaction Legibility",
  tags: ["test", "visual"],
  render: () => {
    const shell = createLabShell(
      "Foundations / interaction",
      "Defense interaction legibility",
      "A deterministic feedforward/rejection matrix for direct-world placement and tower interaction. It classifies intent without Babylon, DOM ownership, or affordability arithmetic."
    );

    shell.frame.innerHTML = `
      <style>
        .interaction-layout { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr); gap:16px; }
        .interaction-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; }
        .interaction-card { text-align:left; border:1px solid rgba(228,185,128,.26); background:rgba(17,13,20,.8); color:inherit; border-radius:10px; padding:14px; cursor:pointer; min-height:148px; }
        .interaction-card:hover,.interaction-card:focus-visible { border-color:rgba(244,237,247,.85); outline:none; }
        .interaction-card--accepted { box-shadow:inset 3px 0 0 rgba(133,220,194,.7); }
        .interaction-card--rejected { box-shadow:inset 3px 0 0 rgba(228,185,128,.62); }
        .interaction-card--selected { border-color:#f4edf7; background:rgba(228,185,128,.1); }
        .interaction-card__outcome,.interaction-card__title,.interaction-card__note,.interaction-card__result { display:block; }
        .interaction-card__outcome { text-transform:uppercase; letter-spacing:.12em; font-size:.68rem; opacity:.62; margin-bottom:5px; }
        .interaction-card__title { font-weight:700; margin-bottom:7px; }
        .interaction-card__note { opacity:.72; font-size:.88rem; line-height:1.35; }
        .interaction-card__result { margin-top:12px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.8rem; }
        .interaction-stage { min-height:300px; display:grid; place-items:center; position:relative; overflow:hidden; }
        .interaction-cell { width:154px; height:112px; border:1px solid rgba(228,185,128,.55); transform:skewY(-8deg); display:grid; place-items:center; background:rgba(228,185,128,.05); }
        .interaction-cell__content { transform:skewY(8deg); text-align:center; max-width:120px; }
        .interaction-state { font-weight:700; margin-bottom:8px; }
        .interaction-reason { opacity:.72; font-size:.86rem; word-break:break-word; }
        @media (max-width:820px) { .interaction-layout { grid-template-columns:1fr; } }
      </style>
      <div class="interaction-layout">
        <section class="interaction-grid" aria-label="Interaction scenarios">
          ${scenarios.map(scenarioMarkup).join("")}
        </section>
        <aside class="lab__panel interaction-stage" aria-live="polite">
          <div class="interaction-cell">
            <div class="interaction-cell__content">
              <div class="interaction-state" data-selected-state>Placement accepted</div>
              <div class="interaction-reason" data-selected-reason>action=place · rejection=none</div>
            </div>
          </div>
        </aside>
      </div>
    `;

    const cards = Array.from(shell.root.querySelectorAll<HTMLButtonElement>("[data-scenario]"));
    const selectedState = shell.root.querySelector<HTMLElement>("[data-selected-state]");
    const selectedReason = shell.root.querySelector<HTMLElement>("[data-selected-reason]");

    const selectCard = (card: HTMLButtonElement): void => {
      cards.forEach(candidate => candidate.classList.remove("interaction-card--selected"));
      card.classList.add("interaction-card--selected");
      const scenario = scenarios.find(candidate => candidate.id === card.dataset.scenario);
      if (!scenario) return;
      const resolution = resolveDefenseInteraction(scenario.request);
      if (selectedState) selectedState.textContent = describeResolution(resolution);
      if (selectedReason) selectedReason.textContent = `action=${resolution.action} · rejection=${resolution.rejection}`;
    };

    cards.forEach(card => card.addEventListener("click", () => selectCard(card)));
    if (cards[0]) selectCard(cards[0]);

    return shell.root;
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RejectionAndActionMatrix: Story = {
  play: async ({ canvasElement }) => {
    const reason = canvasElement.querySelector<HTMLElement>("[data-selected-reason]");
    await expect(reason).not.toBeNull();
    if (!reason) return;

    for (const scenario of scenarios) {
      const card = canvasElement.querySelector<HTMLButtonElement>(`[data-scenario='${scenario.id}']`);
      await expect(card).not.toBeNull();
      if (!card) return;

      await expect(card).toHaveAttribute("data-action", scenario.expectedAction);
      await expect(card).toHaveAttribute("data-rejection", scenario.expectedRejection);
      await userEvent.click(card);
      await expect(reason).toHaveTextContent(`action=${scenario.expectedAction}`);
      await expect(reason).toHaveTextContent(`rejection=${scenario.expectedRejection}`);
    }
  }
};
