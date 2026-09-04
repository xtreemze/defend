import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	compareDeterrencePolicies,
	DEFAULT_DETERRENCE_CONFIG,
	DEFAULT_DETERRENCE_POLICIES,
	DEFAULT_DETERRENCE_RAIDERS,
	type DeterrenceModelConfig,
	type DeterrencePolicyId,
	type DeterrenceScenarioResult,
	type DeterrenceStateCounts
} from "@defend/gameplay/deterrenceEconomy";
import { createLabShell } from "../../labTheme";

type DeterrenceArgs = {
	horizon: number;
	seed: number;
	seedCount: number;
	collectionEfficiency: number;
	confidenceSmoothing: number;
	breachLossMultiplier: number;
	starvationThreshold: number;
};

type PolicyAggregate = {
	id: DeterrencePolicyId;
	label: string;
	meanEndingEnergy: number;
	meanSurvival: number;
	ruinRate: number;
	meanRaids: number;
	meanBreaches: number;
	meanAttackerRoi: number;
	stateCounts: DeterrenceStateCounts;
	representative: DeterrenceScenarioResult;
};

function fixed(value: number, digits = 1): string {
	if (value !== value || value === Infinity || value === -Infinity) return "0";
	return value.toFixed(digits);
}

function percent(value: number): string {
	return `${fixed(value * 100, 0)}%`;
}

function copyCounts(): DeterrenceStateCounts {
	return { contested: 0, adapting: 0, probing: 0, quiet: 0, starvation: 0 };
}

function addCounts(
	target: DeterrenceStateCounts,
	source: DeterrenceStateCounts
): void {
	target.contested += source.contested;
	target.adapting += source.adapting;
	target.probing += source.probing;
	target.quiet += source.quiet;
	target.starvation += source.starvation;
}

function aggregatePolicies(args: DeterrenceArgs): PolicyAggregate[] {
	const config: DeterrenceModelConfig = {
		...DEFAULT_DETERRENCE_CONFIG,
		horizon: args.horizon,
		collectionEfficiency: args.collectionEfficiency,
		confidenceSmoothing: args.confidenceSmoothing,
		breachLossMultiplier: args.breachLossMultiplier,
		starvationThreshold: args.starvationThreshold
	};
	const seedCount = Math.max(1, Math.floor(args.seedCount));
	const accumulators = DEFAULT_DETERRENCE_POLICIES.map(policy => ({
		id: policy.id,
		label: policy.label,
		endingEnergy: 0,
		survival: 0,
		ruins: 0,
		raids: 0,
		breaches: 0,
		attackerRoi: 0,
		stateCounts: copyCounts(),
		representative: compareDeterrencePolicies(
			[policy],
			config,
			DEFAULT_DETERRENCE_RAIDERS,
			args.seed
		)[0]
	}));

	for (let offset = 0; offset < seedCount; offset += 1) {
		const results = compareDeterrencePolicies(
			DEFAULT_DETERRENCE_POLICIES,
			config,
			DEFAULT_DETERRENCE_RAIDERS,
			args.seed + offset
		);
		for (let index = 0; index < results.length; index += 1) {
			const result = results[index];
			const acc = accumulators[index];
			acc.endingEnergy += result.summary.endingDefenderEnergy;
			acc.survival += result.summary.survivalOpportunities;
			if (result.summary.ruined) acc.ruins += 1;
			acc.raids += result.summary.raids;
			acc.breaches += result.summary.breaches;
			acc.attackerRoi += result.summary.attackerReturnOnCommitment;
			addCounts(acc.stateCounts, result.summary.stateCounts);
		}
	}

	return accumulators.map(acc => ({
		id: acc.id,
		label: acc.label,
		meanEndingEnergy: acc.endingEnergy / seedCount,
		meanSurvival: acc.survival / seedCount,
		ruinRate: acc.ruins / seedCount,
		meanRaids: acc.raids / seedCount,
		meanBreaches: acc.breaches / seedCount,
		meanAttackerRoi: acc.attackerRoi / seedCount,
		stateCounts: {
			contested: acc.stateCounts.contested / seedCount,
			adapting: acc.stateCounts.adapting / seedCount,
			probing: acc.stateCounts.probing / seedCount,
			quiet: acc.stateCounts.quiet / seedCount,
			starvation: acc.stateCounts.starvation / seedCount
		},
		representative: acc.representative
	}));
}

function energyTrace(result: DeterrenceScenarioResult): string {
	const maxEnergy = DEFAULT_DETERRENCE_CONFIG.maxDefenderEnergy;
	const width = 320;
	const height = 64;
	if (result.steps.length === 0) return "";
	const points: string[] = [];
	for (let index = 0; index < result.steps.length; index += 1) {
		const step = result.steps[index];
		const x =
			result.steps.length <= 1
				? 0
				: (index / (result.steps.length - 1)) * width;
		const y =
			height -
			(step.defenderEnergyAfter / Math.max(1, maxEnergy)) * height;
		points.push(`${fixed(x, 1)},${fixed(y, 1)}`);
	}
	return `<svg class="det-trace" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Representative defender-energy trajectory"><polyline points="${points.join(" ")}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" /></svg>`;
}

function stateStrip(counts: DeterrenceStateCounts): string {
	const total =
		counts.contested +
		counts.adapting +
		counts.probing +
		counts.quiet +
		counts.starvation;
	if (total <= 0) return "";
	const segments = [
		["contested", counts.contested],
		["adapting", counts.adapting],
		["probing", counts.probing],
		["quiet", counts.quiet],
		["starvation", counts.starvation]
	];
	return segments
		.map(segment => {
			const name = segment[0] as string;
			const value = segment[1] as number;
			return `<span class="det-state det-state--${name}" title="${name}: ${fixed(value, 1)} opportunities" style="flex:${Math.max(0.001, value / total)}"></span>`;
		})
		.join("");
}

function policyCard(aggregate: PolicyAggregate): string {
	const summary = aggregate.representative.summary;
	return `
		<article class="det-card" data-policy="${aggregate.id}" data-ruin-rate="${aggregate.ruinRate}" data-survival="${aggregate.meanSurvival}">
			<header>
				<div><small>policy hypothesis</small><strong>${aggregate.label}</strong></div>
				<span>${percent(aggregate.ruinRate)} ruin</span>
			</header>
			${energyTrace(aggregate.representative)}
			<div class="det-state-strip">${stateStrip(aggregate.stateCounts)}</div>
			<div class="det-metrics">
				<div><small>mean end reserve</small><strong>${fixed(aggregate.meanEndingEnergy, 0)}</strong></div>
				<div><small>mean survival</small><strong>${fixed(aggregate.meanSurvival, 1)}</strong></div>
				<div><small>raids / breaches</small><strong>${fixed(aggregate.meanRaids, 1)} / ${fixed(aggregate.meanBreaches, 1)}</strong></div>
				<div><small>attacker ROI</small><strong>${fixed(aggregate.meanAttackerRoi, 2)}</strong></div>
			</div>
			<footer>Representative seed: ${summary.raids} raids · ${summary.breaches} breaches · ${fixed(summary.totalDefenderRecoveredEnergy, 0)} captured energy · ${fixed(summary.totalDefenderBreachLoss, 0)} breach loss</footer>
		</article>
	`;
}

const meta = {
	title: "Foundations/Strategy/Deterrence Economy",
	tags: ["test", "visual"],
	args: {
		horizon: 120,
		seed: 7,
		seedCount: 24,
		collectionEfficiency: 0.78,
		confidenceSmoothing: 0.14,
		breachLossMultiplier: 1,
		starvationThreshold: 6500
	},
	argTypes: {
		horizon: { control: { type: "range", min: 20, max: 240, step: 10 } },
		seed: { control: { type: "number", min: 1, max: 100000, step: 1 } },
		seedCount: { control: { type: "range", min: 1, max: 64, step: 1 } },
		collectionEfficiency: { control: { type: "range", min: 0.1, max: 1, step: 0.02 } },
		confidenceSmoothing: { control: { type: "range", min: 0.02, max: 0.5, step: 0.01 } },
		breachLossMultiplier: { control: { type: "range", min: 0.25, max: 1.5, step: 0.05 } },
		starvationThreshold: { control: { type: "range", min: 1000, max: 15000, step: 500 } }
	},
	render: (args: DeterrenceArgs) => {
		const aggregates = aggregatePolicies(args);
		const competent = aggregates.find(
			entry => entry.id === "competent-defense"
		);
		const leak = aggregates.find(entry => entry.id === "intentional-leak");
		const antiFarmingPass =
			competent !== undefined &&
			leak !== undefined &&
			competent.meanSurvival > leak.meanSurvival &&
			competent.ruinRate < leak.ruinRate;

		const shell = createLabShell(
			"Foundations / strategy",
			"Deterrence and anti-farming economy",
			"Engine-free normalized model for the defender → deterrence → starvation hinge. Values are experimental, injectable hypotheses rather than production balance. The default sweep should make active competent defense outperform deliberate breach farming while over-fortification still risks self-starvation."
		);

		shell.frame.innerHTML = `
			<style>
				.det-banner { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:12px 14px; border:1px solid rgba(244,237,247,.12); margin-bottom:14px; }
				.det-banner strong { font-size:13px; }
				.det-banner span { font-size:11px; opacity:.68; }
				.det-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px; }
				.det-card { padding:13px; border:1px solid rgba(228,185,128,.2); background:rgba(10,3,17,.42); }
				.det-card header { display:flex; justify-content:space-between; gap:14px; align-items:start; }
				.det-card header div { display:grid; gap:3px; }
				.det-card small { display:block; color:rgba(244,237,247,.43); font-size:10px; text-transform:uppercase; letter-spacing:.08em; }
				.det-card header span { font-size:11px; color:rgba(244,237,247,.62); }
				.det-trace { width:100%; height:64px; margin:12px 0 8px; color:#49d7d1; background:linear-gradient(to bottom,rgba(73,215,209,.04),transparent); }
				.det-state-strip { display:flex; height:5px; overflow:hidden; margin-bottom:12px; background:rgba(244,237,247,.04); }
				.det-state--contested { background:#dc7c55; }
				.det-state--adapting { background:#e0ad66; }
				.det-state--probing { background:#49d7d1; }
				.det-state--quiet { background:#54708a; }
				.det-state--starvation { background:#6d596f; }
				.det-metrics { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
				.det-metrics > div { border-top:1px solid rgba(244,237,247,.08); padding-top:7px; }
				.det-metrics strong { display:block; margin-top:3px; font-size:13px; }
				.det-card footer { margin-top:11px; font-size:10px; line-height:1.45; color:rgba(244,237,247,.46); }
				.det-legend { display:flex; flex-wrap:wrap; gap:12px; margin-top:14px; font-size:10px; color:rgba(244,237,247,.5); }
				.det-legend span::before { content:""; display:inline-block; width:7px; height:7px; margin-right:5px; background:currentColor; }
			</style>
			<div class="det-banner" data-anti-farming-pass="${antiFarmingPass}">
				<strong>${antiFarmingPass ? "Default anti-farming gate passes" : "Current parameters expose an anti-farming failure"}</strong>
				<span>${args.seedCount} deterministic seeds · ${args.horizon} opportunities each</span>
			</div>
			<div class="det-grid">${aggregates.map(policyCard).join("")}</div>
			<div class="det-legend">
				<span style="color:#dc7c55">contested</span>
				<span style="color:#e0ad66">adapting</span>
				<span style="color:#49d7d1">probing</span>
				<span style="color:#54708a">deterrent quiet</span>
				<span style="color:#6d596f">strategic starvation</span>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<DeterrenceArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PolicySweep: Story = {
	play: async ({ canvasElement }) => {
		const cards = canvasElement.querySelectorAll<HTMLElement>("[data-policy]");
		const gate = canvasElement.querySelector<HTMLElement>(
			"[data-anti-farming-pass]"
		);
		await expect(cards.length).toBe(DEFAULT_DETERRENCE_POLICIES.length);
		await expect(gate).not.toBeNull();
		if (!gate) return;
		await expect(gate.dataset.antiFarmingPass).toBe("true");

		const config = DEFAULT_DETERRENCE_CONFIG;
		const invariantResults = compareDeterrencePolicies(
			DEFAULT_DETERRENCE_POLICIES,
			config,
			DEFAULT_DETERRENCE_RAIDERS,
			7
		);
		for (let resultIndex = 0; resultIndex < invariantResults.length; resultIndex += 1) {
			const result = invariantResults[resultIndex];
			for (let stepIndex = 0; stepIndex < result.steps.length; stepIndex += 1) {
				const step = result.steps[stepIndex];
				await expect(step.defenderRecoveredEnergy).toBeLessThanOrEqual(
					step.committedEnergy
				);
				await expect(step.defenderEnergyAfter).toBeLessThanOrEqual(
					config.maxDefenderEnergy
				);
				await expect(step.defenderEnergyAfter).toBeGreaterThanOrEqual(0);
			}
		}
	}
};
