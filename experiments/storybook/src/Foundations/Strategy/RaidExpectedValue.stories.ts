import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	estimateRaidExpectedValue,
	raidExpectedValueIsAdmissible,
	selectRaidTierByExpectedNetReturn,
	type RaidExpectedValueEstimate,
	type RaidExpectedValueTier
} from "@defend/gameplay/raidExpectedValue";
import { createLabShell } from "../../labTheme";

type ExpectedValueArgs = {
	richTargetEnergy: number;
	poorTargetEnergy: number;
	emptyTargetEnergy: number;
	expectedBreachProbability: number;
	expectedArrivalViability: number;
	travelAndOperatingCost: number;
	minimumExpectedNetReturn: number;
};

type TierProfile = {
	tier: RaidExpectedValueTier;
	committedEnergy: number;
	extractionPotential: number;
};

const PROFILES: TierProfile[] = [
	{ tier: 1, committedEnergy: 3000, extractionPotential: 7720 },
	{ tier: 2, committedEnergy: 12000, extractionPotential: 30440 },
	{ tier: 3, committedEnergy: 27000, extractionPotential: 68160 }
];

function estimatesFor(
	perceivedTargetEnergy: number,
	args: ExpectedValueArgs
): RaidExpectedValueEstimate[] {
	return PROFILES.map(profile =>
		estimateRaidExpectedValue({
			tier: profile.tier,
			committedEnergy: profile.committedEnergy,
			extractionPotential: profile.extractionPotential,
			perceivedTargetEnergy,
			expectedBreachProbability: args.expectedBreachProbability,
			expectedArrivalViability: args.expectedArrivalViability,
			travelAndOperatingCost: args.travelAndOperatingCost
		})
	);
}

function fixed(value: number, digits = 0): string {
	if (value !== value || value === Infinity || value === -Infinity) return "0";
	return value.toFixed(digits);
}

function targetCard(
	label: string,
	targetEnergy: number,
	estimates: RaidExpectedValueEstimate[],
	minimumExpectedNetReturn: number
): string {
	const selected = selectRaidTierByExpectedNetReturn(
		estimates,
		minimumExpectedNetReturn
	);
	const rows = estimates
		.map(estimate => {
			const admissible = raidExpectedValueIsAdmissible(
				estimate,
				minimumExpectedNetReturn
			);
			return `
				<tr data-tier="${estimate.tier}" data-admissible="${admissible}" data-net="${estimate.expectedNetReturn}">
					<th>R${estimate.tier}</th>
					<td>${fixed(estimate.committedEnergy)}</td>
					<td>${fixed(estimate.expectedExtractedEnergy)}</td>
					<td>${fixed(estimate.expectedNetReturn)}</td>
					<td>${admissible ? "admissible" : "decline"}</td>
				</tr>`;
		})
		.join("");
	return `
		<article class="ev-card" data-target="${label}" data-selected="${selected ?? "none"}">
			<header><div><small>perceived target</small><strong>${label}</strong></div><span>${fixed(targetEnergy)} energy</span></header>
			<div class="ev-selection">highest admissible absolute net: <strong>${selected === null ? "no raid" : `R${selected}`}</strong></div>
			<table>
				<thead><tr><th>tier</th><th>commit</th><th>expected extract</th><th>expected net</th><th>gate</th></tr></thead>
				<tbody>${rows}</tbody>
			</table>
		</article>`;
}

const meta = {
	title: "Foundations/Strategy/Raid Expected Value",
	tags: ["test", "visual"],
	args: {
		richTargetEnergy: 30000,
		poorTargetEnergy: 5000,
		emptyTargetEnergy: 1000,
		expectedBreachProbability: 0.96,
		expectedArrivalViability: 0.95,
		travelAndOperatingCost: 500,
		minimumExpectedNetReturn: 0
	},
	argTypes: {
		richTargetEnergy: { control: { type: "range", min: 0, max: 60000, step: 500 } },
		poorTargetEnergy: { control: { type: "range", min: 0, max: 30000, step: 500 } },
		emptyTargetEnergy: { control: { type: "range", min: 0, max: 10000, step: 250 } },
		expectedBreachProbability: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
		expectedArrivalViability: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
		travelAndOperatingCost: { control: { type: "range", min: 0, max: 5000, step: 100 } },
		minimumExpectedNetReturn: { control: { type: "range", min: -5000, max: 10000, step: 250 } }
	},
	render: (args: ExpectedValueArgs) => {
		const orderedTargets = [
			Math.max(args.richTargetEnergy, args.poorTargetEnergy, args.emptyTargetEnergy),
			Math.max(
				Math.min(args.richTargetEnergy, args.poorTargetEnergy),
				args.emptyTargetEnergy
			),
			Math.min(args.richTargetEnergy, args.poorTargetEnergy, args.emptyTargetEnergy)
		];
		const rich = estimatesFor(orderedTargets[0], args);
		const poor = estimatesFor(orderedTargets[1], args);
		const empty = estimatesFor(orderedTargets[2], args);
		const shell = createLabShell(
			"Foundations / strategy",
			"Pre-commit raid expected value",
			"Attackers evaluate a perceived/lossy target-energy signal before commitment. Expected extraction is target-limited before launch; authoritative energy transfer still belongs to #114 after a physical breach. This lets commitment taper emerge as targets become less valuable."
		);

		shell.frame.innerHTML = `
			<style>
				.ev-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:12px; }
				.ev-card { padding:13px; border:1px solid rgba(228,185,128,.2); background:rgba(10,3,17,.42); overflow:auto; }
				.ev-card header { display:flex; justify-content:space-between; align-items:baseline; gap:12px; }
				.ev-card header div { display:grid; gap:3px; }
				.ev-card small { opacity:.45; text-transform:uppercase; letter-spacing:.08em; font-size:9px; }
				.ev-card header span { opacity:.58; font-size:10px; }
				.ev-selection { margin:10px 0; padding:7px 9px; border-left:3px solid rgba(73,215,209,.55); font-size:10px; }
				.ev-card table { width:100%; border-collapse:collapse; font-size:9px; }
				.ev-card th, .ev-card td { padding:6px 5px; text-align:right; border-top:1px solid rgba(244,237,247,.08); white-space:nowrap; }
				.ev-card th:first-child { text-align:left; }
				.ev-note { margin-top:13px; padding:11px; border:1px dashed rgba(244,237,247,.15); font-size:10px; line-height:1.55; opacity:.68; }
			</style>
			<div class="ev-grid">
				${targetCard("rich", orderedTargets[0], rich, args.minimumExpectedNetReturn)}
				${targetCard("poor", orderedTargets[1], poor, args.minimumExpectedNetReturn)}
				${targetCard("nearly empty", orderedTargets[2], empty, args.minimumExpectedNetReturn)}
			</div>
			<div class="ev-note">The selector is a diagnostic witness, not final AI. Cheap probes may intentionally use a negative admissibility threshold under uncertainty; #107 should test that policy separately. Tier numbers receive no bonus and ties prefer the lower-energy commitment.</div>
		`;
		return shell.root;
	}
} satisfies Meta<ExpectedValueArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TargetRichnessTaper: Story = {
	play: async () => {
		const witness: ExpectedValueArgs = {
			richTargetEnergy: 30000,
			poorTargetEnergy: 5000,
			emptyTargetEnergy: 1000,
			expectedBreachProbability: 0.96,
			expectedArrivalViability: 0.95,
			travelAndOperatingCost: 500,
			minimumExpectedNetReturn: 0
		};
		const rich = estimatesFor(30000, witness);
		const poor = estimatesFor(5000, witness);
		const empty = estimatesFor(1000, witness);

		for (const estimates of [rich, poor, empty]) {
			for (let index = 0; index < estimates.length; index += 1) {
				const estimate = estimates[index];
				await expect(estimate.expectedExtractedEnergy).toBeLessThanOrEqual(
					estimate.perceivedTargetEnergy *
						witness.expectedBreachProbability +
						1e-9
				);
			}
		}

		await expect(selectRaidTierByExpectedNetReturn(rich, 0)).toBe(2);
		await expect(selectRaidTierByExpectedNetReturn(poor, 0)).toBe(1);
		await expect(selectRaidTierByExpectedNetReturn(empty, 0)).toBeNull();

		await expect(poor[0].expectedNetReturn).toBeGreaterThan(0);
		await expect(poor[1].expectedNetReturn).toBeLessThan(0);
		await expect(poor[2].expectedNetReturn).toBeLessThan(0);
	}
};
