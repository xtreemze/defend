import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent } from "storybook/test";
import {
  resolveDefenseInteraction,
  type DefenseInteractionRequest,
  type DefenseInteractionResolution
} from "@defend/gameplay/defenseInteraction";
import { createLabShell } from "../../labTheme";

type Scenario = {
  id: string;
  title: string;
  note: string;
  request: DefenseInteractionRequest;
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
    }
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
    }
  },
  {
    id: "place-protected",
    title: "Protected core",
    note: "The target exists but belongs to protected/core space.",
    request: {
      kind: "placement",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      terrainValid: true,
      protectedTarget: true,
      occupied: false
    }
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
    }
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
    }
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
    }
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
    }
  },
  {
    id: "tower-refresh",
    title: "Explicit refresh policy",
    note: "If a future design intentionally refreshes a max-level tower, it must be represented as a distinct action.",
    request: {
      kind: "tower",
      gestureOwner: "world",
      targetAvailable: true,
      affordable: true,
      currentTowerLevel: 3,
      maxTowerLevel: 3,
      maxTowerAction: "refresh"
    }
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
  return `
    <button
      class="interaction-card ${outcomeClass}"
      type="button"
      data-scenario="${scenario.id}"
      data-action="${resolution.action}"
      data-rejection="${resolution.rejection}"
    >
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
        .interaction-card { text-align:left; border:1px solid rgba(228,185,128,.26); background:rgba(17,13,20,.8); color:inherit; border-radius:10px; padding:14px; cursor:pointer; min-height:132px; }
        .interaction-card:hover,.interaction-card:focus-visible { border-color:rgba(244,237,247,.85); outline:none; }
        .interaction-card--accepted { box-shadow:inset 3px 0 0 rgba(133,220,194,.7); }
        .interaction-card--rejected { box-shadow:inset 3px 0 0 rgba(228,185,128,.62); }
        .interaction-card--selected { border-color:#f4edf7; background:rgba(228,185,128,.1); }
        .interaction-card__title,.interaction-card__note,.interaction-card__result { display:block; }
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
    const occupied = canvasElement.querySelector<HTMLButtonElement>("[data-scenario='place-occupied']");
    const unaffordable = canvasElement.querySelector<HTMLButtonElement>("[data-scenario='place-unaffordable']");
    const camera = canvasElement.querySelector<HTMLButtonElement>("[data-scenario='camera-gesture']");
    const maxTower = canvasElement.querySelector<HTMLButtonElement>("[data-scenario='tower-max']");
    const refresh = canvasElement.querySelector<HTMLButtonElement>("[data-scenario='tower-refresh']");

    await expect(reason).not.toBeNull();
    await expect(occupied).not.toBeNull();
    await expect(unaffordable).not.toBeNull();
    await expect(camera).not.toBeNull();
    await expect(maxTower).not.toBeNull();
    await expect(refresh).not.toBeNull();
    if (!reason || !occupied || !unaffordable || !camera || !maxTower || !refresh) return;

    await userEvent.click(occupied);
    await expect(reason).toHaveTextContent("rejection=occupied");

    await userEvent.click(unaffordable);
    await expect(reason).toHaveTextContent("rejection=unaffordable");

    await userEvent.click(camera);
    await expect(reason).toHaveTextContent("rejection=camera-gesture");

    await userEvent.click(maxTower);
    await expect(reason).toHaveTextContent("rejection=max-state");

    await userEvent.click(refresh);
    await expect(reason).toHaveTextContent("action=refresh");
    await expect(reason).toHaveTextContent("rejection=none");
  }
};
