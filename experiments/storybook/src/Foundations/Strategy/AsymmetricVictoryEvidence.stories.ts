import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
  evaluateAsymmetricVictory,
  type AsymmetricEncounterEvidence,
  type AsymmetricVictoryThresholds
} from "@defend/gameplay/asymmetricEncounterEvidence";
import { createLabShell } from "../../labTheme";

type EvidenceArgs = {
  minimumCommitmentDisadvantage: number;
  minimumEconomicLeverage: number;
  minimumNonDestructiveResolutionShare: number;
  minimumRouteDistanceAdded: number;
  minimumDelaySeconds: number;
  maximumBreachRate: number;
};

type EvidenceCase = {
  id: string;
  title: string;
  premise: string;
  evidence: AsymmetricEncounterEvidence;
};

const cases: EvidenceCase[] = [
  {
    id: "brute-force",
    title: "Brute-force hold",
    premise:
      "The player survives, but does so by spending almost as much as the attacker and resolving the encounter mainly through direct destruction.",
    evidence: {
      playerSucceeded: true,
      criticalAssetPreserved: true,
      playerCommittedEnergy: 18000,
      opponentCommittedEnergy: 27000,
      playerOperatingCost: 0,
      opponentOperatingCost: 1200,
      playerRecoveredEnergy: 2500,
      opponentRecoveredEnergy: 0,
      playerInfrastructureLoss: 0,
      opponentInfrastructureLoss: 0,
      bodiesFaced: 3,
      bodiesDestroyed: 3,
      bodiesEjected: 0,
      bodiesExpired: 0,
      bodiesBreached: 0,
      routeDistanceAdded: 4,
      delaySeconds: 2
    }
  },
  {
    id: "barrier-delay",
    title: "Cheap barrier, expensive failure",
    premise:
      "A low-cost barrier lengthens the route until finite-life decay and mothership operating pressure make a much larger commitment unprofitable.",
    evidence: {
      playerSucceeded: true,
      criticalAssetPreserved: true,
      playerCommittedEnergy: 3000,
      opponentCommittedEnergy: 27000,
      playerOperatingCost: 0,
      opponentOperatingCost: 4200,
      playerRecoveredEnergy: 3600,
      opponentRecoveredEnergy: 0,
      playerInfrastructureLoss: 0,
      opponentInfrastructureLoss: 0,
      bodiesFaced: 3,
      bodiesDestroyed: 0,
      bodiesEjected: 0,
      bodiesExpired: 3,
      bodiesBreached: 0,
      routeDistanceAdded: 96,
      delaySeconds: 19
    }
  },
  {
    id: "edge-ejection",
    title: "Titan edge ejection",
    premise:
      "The defender cannot win a damage race against the heavy commitment, but one positional impulse converts the attacker's mass and trajectory into an ejection.",
    evidence: {
      playerSucceeded: true,
      criticalAssetPreserved: true,
      playerCommittedEnergy: 9000,
      opponentCommittedEnergy: 30000,
      playerOperatingCost: 0,
      opponentOperatingCost: 1800,
      playerRecoveredEnergy: 1200,
      opponentRecoveredEnergy: 0,
      playerInfrastructureLoss: 0,
      opponentInfrastructureLoss: 0,
      bodiesFaced: 2,
      bodiesDestroyed: 0,
      bodiesEjected: 1,
      bodiesExpired: 1,
      bodiesBreached: 0,
      routeDistanceAdded: 18,
      delaySeconds: 7
    }
  },
  {
    id: "pyrrhic-breach",
    title: "Pyrrhic breach",
    premise:
      "A raider physically reaches the silo, but extraction is too small relative to commitment and operating cost to count as strategic success.",
    evidence: {
      playerSucceeded: false,
      criticalAssetPreserved: true,
      playerCommittedEnergy: 27000,
      opponentCommittedEnergy: 18000,
      playerOperatingCost: 5200,
      opponentOperatingCost: 0,
      playerRecoveredEnergy: 8000,
      opponentRecoveredEnergy: 3200,
      playerInfrastructureLoss: 0,
      opponentInfrastructureLoss: 3000,
      bodiesFaced: 1,
      bodiesDestroyed: 0,
      bodiesEjected: 0,
      bodiesExpired: 0,
      bodiesBreached: 1,
      routeDistanceAdded: 0,
      delaySeconds: 0
    }
  }
];

function thresholdsFromArgs(args: EvidenceArgs): AsymmetricVictoryThresholds {
  return {
    minimumCommitmentDisadvantage: args.minimumCommitmentDisadvantage,
    minimumEconomicLeverage: args.minimumEconomicLeverage,
    minimumNonDestructiveResolutionShare: args.minimumNonDestructiveResolutionShare,
    minimumRouteDistanceAdded: args.minimumRouteDistanceAdded,
    minimumDelaySeconds: args.minimumDelaySeconds,
    maximumBreachRate: args.maximumBreachRate
  };
}

function formatEnergy(value: number): string {
  return Math.round(value).toLocaleString();
}

function formatRatio(value: number): string {
  if (value >= 1000) return ">999×";
  return `${value.toFixed(2)}×`;
}

function caseMarkup(testCase: EvidenceCase, thresholds: AsymmetricVictoryThresholds): string {
  const result = evaluateAsymmetricVictory(testCase.evidence, thresholds);
  const state = result.qualifies ? "asymmetric victory" : "ordinary / failed";
  const axes = result.axes.length > 0 ? result.axes.join(" · ") : "none";

  return `
    <article
      class="evidence-card evidence-card--${result.qualifies ? "qualified" : "ordinary"}"
      data-case="${testCase.id}"
      data-qualifies="${String(result.qualifies)}"
    >
      <header class="evidence-card__header">
        <div>
          <p class="evidence-card__state">${state}</p>
          <h2>${testCase.title}</h2>
        </div>
        <strong class="evidence-card__ratio">${formatRatio(result.commitmentDisadvantage)}</strong>
      </header>
      <p class="evidence-card__premise">${testCase.premise}</p>
      <dl class="evidence-card__metrics">
        <div><dt>Commitment disadvantage</dt><dd>${formatRatio(result.commitmentDisadvantage)}</dd></div>
        <div><dt>Economic leverage</dt><dd>${formatRatio(result.economicLeverage)}</dd></div>
        <div><dt>Player net cost</dt><dd>${formatEnergy(result.playerNetCost)}</dd></div>
        <div><dt>Opponent net cost</dt><dd>${formatEnergy(result.opponentNetCost)}</dd></div>
        <div><dt>Non-destructive share</dt><dd>${Math.round(result.nonDestructiveResolutionShare * 100)}%</dd></div>
        <div><dt>Breach rate</dt><dd>${Math.round(result.breachRate * 100)}%</dd></div>
        <div><dt>Route distance added</dt><dd>${Math.round(testCase.evidence.routeDistanceAdded)}</dd></div>
        <div><dt>Delay created</dt><dd>${testCase.evidence.delaySeconds.toFixed(1)} s</dd></div>
      </dl>
      <p class="evidence-card__axes"><span>Observed leverage</span>${axes}</p>
    </article>
  `;
}

const meta = {
  title: "Foundations/Strategy/Asymmetric Victory Evidence",
  tags: ["test", "visual"],
  args: {
    minimumCommitmentDisadvantage: 2,
    minimumEconomicLeverage: 2,
    minimumNonDestructiveResolutionShare: 0.5,
    minimumRouteDistanceAdded: 40,
    minimumDelaySeconds: 8,
    maximumBreachRate: 0.25
  },
  argTypes: {
    minimumCommitmentDisadvantage: {
      control: { type: "range", min: 1, max: 6, step: 0.25 }
    },
    minimumEconomicLeverage: {
      control: { type: "range", min: 1, max: 10, step: 0.25 }
    },
    minimumNonDestructiveResolutionShare: {
      control: { type: "range", min: 0, max: 1, step: 0.05 }
    },
    minimumRouteDistanceAdded: {
      control: { type: "range", min: 0, max: 160, step: 5 }
    },
    minimumDelaySeconds: {
      control: { type: "range", min: 0, max: 30, step: 1 }
    },
    maximumBreachRate: {
      control: { type: "range", min: 0, max: 1, step: 0.05 }
    }
  },
  render: (args: EvidenceArgs) => {
    const thresholds = thresholdsFromArgs(args);
    const shell = createLabShell(
      "Foundations / strategy",
      "Asymmetric victory evidence",
      "A diagnostic surface for comparing measured encounter outcomes. It identifies high-leverage wins without creating an underdog reward or predicting physics; live fixtures can later supply these measurements."
    );

    shell.frame.innerHTML = `
      <style>
        .evidence-thresholds {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1px;
          margin-bottom: 18px;
          background: rgba(215, 164, 108, 0.14);
          border: 1px solid rgba(215, 164, 108, 0.14);
        }
        .evidence-thresholds > div {
          padding: 12px 14px;
          background: rgba(18, 4, 31, 0.92);
        }
        .evidence-thresholds dt,
        .evidence-card__metrics dt,
        .evidence-card__axes span {
          color: rgba(244, 237, 247, 0.5);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .evidence-thresholds dd {
          margin: 3px 0 0;
          color: #e4b980;
          font-variant-numeric: tabular-nums;
        }
        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }
        .evidence-card {
          border: 1px solid rgba(215, 164, 108, 0.16);
          padding: 18px;
          background: rgba(18, 4, 31, 0.86);
        }
        .evidence-card--qualified {
          border-color: rgba(228, 185, 128, 0.55);
          box-shadow: inset 3px 0 0 rgba(228, 185, 128, 0.72);
        }
        .evidence-card__header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
        }
        .evidence-card h2 {
          margin: 3px 0 0;
          font-size: 18px;
          font-weight: 560;
        }
        .evidence-card__state {
          margin: 0;
          color: #d7a46c;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .evidence-card__ratio {
          color: #e4b980;
          font-size: 20px;
          font-variant-numeric: tabular-nums;
        }
        .evidence-card__premise {
          min-height: 66px;
          margin: 14px 0 16px;
          color: rgba(244, 237, 247, 0.66);
        }
        .evidence-card__metrics {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 7px 12px;
          margin: 0;
        }
        .evidence-card__metrics > div {
          display: contents;
        }
        .evidence-card__metrics dd {
          margin: 0;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .evidence-card__axes {
          display: grid;
          gap: 4px;
          margin: 16px 0 0;
          padding-top: 12px;
          border-top: 1px solid rgba(215, 164, 108, 0.14);
          color: #e4b980;
        }
      </style>
      <dl class="evidence-thresholds" aria-label="Diagnostic thresholds">
        <div><dt>Commitment disadvantage</dt><dd>${args.minimumCommitmentDisadvantage.toFixed(2)}×</dd></div>
        <div><dt>Economic leverage</dt><dd>${args.minimumEconomicLeverage.toFixed(2)}×</dd></div>
        <div><dt>Non-destructive share</dt><dd>${Math.round(args.minimumNonDestructiveResolutionShare * 100)}%</dd></div>
        <div><dt>Route distance</dt><dd>${Math.round(args.minimumRouteDistanceAdded)}</dd></div>
        <div><dt>Delay</dt><dd>${Math.round(args.minimumDelaySeconds)} s</dd></div>
        <div><dt>Maximum breach rate</dt><dd>${Math.round(args.maximumBreachRate * 100)}%</dd></div>
      </dl>
      <section class="evidence-grid" aria-label="Encounter evidence comparisons">
        ${cases.map(testCase => caseMarkup(testCase, thresholds)).join("")}
      </section>
    `;

    return shell.root;
  }
} satisfies Meta<EvidenceArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComparativeEvidence: Story = {
  play: async ({ canvasElement }) => {
    const barrier = canvasElement.querySelector<HTMLElement>("[data-case='barrier-delay']");
    const edge = canvasElement.querySelector<HTMLElement>("[data-case='edge-ejection']");
    const bruteForce = canvasElement.querySelector<HTMLElement>("[data-case='brute-force']");
    const pyrrhic = canvasElement.querySelector<HTMLElement>("[data-case='pyrrhic-breach']");

    await expect(barrier).not.toBeNull();
    await expect(edge).not.toBeNull();
    await expect(bruteForce).not.toBeNull();
    await expect(pyrrhic).not.toBeNull();
    if (!barrier || !edge || !bruteForce || !pyrrhic) return;

    await expect(barrier).toHaveAttribute("data-qualifies", "true");
    await expect(edge).toHaveAttribute("data-qualifies", "true");
    await expect(bruteForce).toHaveAttribute("data-qualifies", "false");
    await expect(pyrrhic).toHaveAttribute("data-qualifies", "false");
  }
};
