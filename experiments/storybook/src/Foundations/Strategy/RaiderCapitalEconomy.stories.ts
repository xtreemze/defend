import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	DEFAULT_RAIDER_CAPITAL_PROFILES,
	estimateRaiderCapitalExpectedValue,
	raiderCapitalExpectedValueIsPositive,
	settleRaiderCapitalEconomy,
	type RaiderCapitalMode,
	type RaiderCapitalProfile
} from "@defend/gameplay/raiderCapitalEconomy";
import { createLabShell } from "../../labTheme";

type CapitalEconomyArgs = {
	expectedBreachProbability: number;
	expectedBreachViability: number;
	expectedSuccessReturnViability: number;
	expectedFailureReturnViability: number;
	realizedBreachViability: number;
	realizedReturnViability: number;
	travelAndOperatingCost: number;
	defenderCaptureFraction: number;
};

type TargetWitness = {
	label: string;
	reserve: number;
};

const TARGETS: TargetWitness[] = [
	{ label: "Poor target", reserve: 5000 },
	{ label: "Medium target", reserve: 15000 },
	{ label: "Rich target", reserve: 30000 }
];

const MODES: RaiderCapitalMode[] = ["fully-sunk", "embodied-return"];

const FIXED_WITNESS = {
	expectedBreachProbability: 0.55,
	expectedBreachViability: 0.55,
	expectedSuccessReturnViability: 0.55,
	expectedFailureReturnViability: 0.3,
	travelAndOperatingCost: 500
};

function fixed(value: number, digits = 0): string {
	if (value !== value || value === Infinity || value === -Infinity) return "0";
	return value.toFixed(digits);
}

function signed(value: number): string {
	return `${value >= 0 ? "+" : ""}${fixed(value, 0)}`;
}

function modeLabel(mode: RaiderCapitalMode): string {
	return mode === "fully-sunk" ? "Fully sunk launch" : "Embodied capital return";
}

function estimateCell(
	mode: RaiderCapitalMode,
	profile: RaiderCapitalProfile,
	target: TargetWitness,
	args: CapitalEconomyArgs
): string {
	const estimate = estimateRaiderCapitalExpectedValue({
		mode,
		profile,
		perceivedTargetEnergy: target.reserve,
		expectedBreachProbability: args.expectedBreachProbability,
		expectedArrivalViabilityOnBreach: args.expectedBreachViability,
		expectedReturnViabilityAfterBreach: args.expectedSuccessReturnViability,
		expectedReturnViabilityOnFailure: args.expectedFailureReturnViability,
		travelAndOperatingCost: args.travelAndOperatingCost
	});
	const positive = raiderCapitalExpectedValueIsPositive(estimate);
	return `
		<div class="capital-cell" data-mode="${mode}" data-target="${target.reserve}" data-tier="${profile.tier}" data-positive="${positive}">
			<header><strong>R${profile.tier}</strong><span>${positive ? "positive EV" : "negative EV"}</span></header>
			<div class="capital-net">${signed(estimate.expectedNetReturn)}</div>
			<small>extract ${fixed(estimate.expectedExtractedEnergy)} · return ${fixed(estimate.expectedReturnedCapital)} · post-breach loss ${fixed(estimate.expectedPostBreachCapitalLoss)}</small>
		</div>
	`;
}

function modePanel(mode: RaiderCapitalMode, args: CapitalEconomyArgs): string {
	return `
		<section class="lab__panel lab__panel--padded capital-mode">
			<div class="capital-mode__heading">
				<div><small>capital interpretation</small><h2>${modeLabel(mode)}</h2></div>
				<p>${
					mode === "fully-sunk"
						? "Launch commitment is consumed immediately; surviving body state cannot return that commitment."
						: "Launch commitment remains physical capital. Breach viability limits extraction; later evacuation viability independently determines how much capital actually returns."
				}</p>
			</div>
			<div class="capital-targets">
				${TARGETS.map(
					target => `
					<section class="capital-target">
						<header><strong>${target.label}</strong><span>${fixed(target.reserve)} teal</span></header>
						<div class="capital-tier-grid">${DEFAULT_RAIDER_CAPITAL_PROFILES.map(profile => estimateCell(mode, profile, target, args)).join("")}</div>
					</section>`
				).join("")}
			</div>
		</section>
	`;
}

function fixedWitnessPositive(tierIndex: number, targetEnergy: number): boolean {
	const profile = DEFAULT_RAIDER_CAPITAL_PROFILES[tierIndex];
	return raiderCapitalExpectedValueIsPositive(
		estimateRaiderCapitalExpectedValue({
			mode: "embodied-return",
			profile,
			perceivedTargetEnergy: targetEnergy,
			expectedBreachProbability: FIXED_WITNESS.expectedBreachProbability,
			expectedArrivalViabilityOnBreach: FIXED_WITNESS.expectedBreachViability,
			expectedReturnViabilityAfterBreach:
				FIXED_WITNESS.expectedSuccessReturnViability,
			expectedReturnViabilityOnFailure:
				FIXED_WITNESS.expectedFailureReturnViability,
			travelAndOperatingCost: FIXED_WITNESS.travelAndOperatingCost
		})
	);
}

const meta = {
	title: "Foundations/Strategy/Raider Capital Economy",
	tags: ["test", "visual"],
	args: {
		expectedBreachProbability: 0.55,
		expectedBreachViability: 0.55,
		expectedSuccessReturnViability: 0.55,
		expectedFailureReturnViability: 0.3,
		realizedBreachViability: 0.7,
		realizedReturnViability: 0.7,
		travelAndOperatingCost: 500,
		defenderCaptureFraction: 0.72
	},
	argTypes: {
		expectedBreachProbability: { control: { type: "range", min: 0.05, max: 1, step: 0.05 } },
		expectedBreachViability: { control: { type: "range", min: 0.05, max: 1, step: 0.05 } },
		expectedSuccessReturnViability: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
		expectedFailureReturnViability: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
		realizedBreachViability: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
		realizedReturnViability: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
		travelAndOperatingCost: { control: { type: "range", min: 0, max: 3000, step: 100 } },
		defenderCaptureFraction: { control: { type: "range", min: 0, max: 1, step: 0.05 } }
	},
	render: (args: CapitalEconomyArgs) => {
		const shell = createLabShell(
			"Foundations / strategy",
			"Raider launch capital at risk",
			"Compare fully sunk launch cost with embodied capital whose extraction-time integrity and later evacuation survival are independent. This keeps post-breach interception economically meaningful."
		);
		shell.frame.innerHTML = `
			<style>
				.capital-layout { display:grid; gap:14px; }
				.capital-mode__heading { display:grid; grid-template-columns:minmax(180px,.7fr) minmax(240px,1.3fr); gap:20px; align-items:start; margin-bottom:14px; }
				.capital-mode__heading small, .capital-cell small { color:rgba(244,237,247,.46); }
				.capital-mode__heading h2 { margin:3px 0 0; font-size:15px; }
				.capital-mode__heading p { margin:0; color:rgba(244,237,247,.58); font-size:11px; line-height:1.5; }
				.capital-targets { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
				.capital-target { padding:10px; border:1px solid rgba(244,237,247,.08); }
				.capital-target > header { display:flex; justify-content:space-between; gap:8px; margin-bottom:8px; font-size:11px; }
				.capital-target > header span { opacity:.52; }
				.capital-tier-grid { display:grid; gap:7px; }
				.capital-cell { padding:9px; border:1px solid rgba(228,185,128,.16); background:rgba(10,3,17,.36); }
				.capital-cell header { display:flex; justify-content:space-between; gap:8px; font-size:10px; }
				.capital-cell[data-positive="false"] { border-style:dashed; opacity:.68; }
				.capital-net { margin:7px 0 4px; font-size:17px; font-variant-numeric:tabular-nums; }
				.capital-cell small { display:block; font-size:9px; line-height:1.45; }
				.capital-note { margin-top:12px; padding-top:10px; border-top:1px solid rgba(244,237,247,.08); font-size:10px; color:rgba(244,237,247,.5); }
				@media (max-width:900px) { .capital-targets { grid-template-columns:1fr; } .capital-mode__heading { grid-template-columns:1fr; } }
			</style>
			<div class="capital-layout">${MODES.map(mode => modePanel(mode, args)).join("")}</div>
			<div class="capital-note">The automated witness additionally compares clean evacuation, post-extraction interception, and failed-breach retreat. Extraction capability and return survival are deliberately non-identical quantities.</div>
		`;
		return shell.root;
	}
} satisfies Meta<CapitalEconomyArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CapitalAtRiskMatrix: Story = {
	play: async ({ canvasElement, args }) => {
		const cells = canvasElement.querySelectorAll<HTMLElement>("[data-mode][data-target][data-tier]");
		await expect(cells.length).toBe(
			MODES.length * TARGETS.length * DEFAULT_RAIDER_CAPITAL_PROFILES.length
		);

		await expect(fixedWitnessPositive(0, 5000)).toBe(true);
		await expect(fixedWitnessPositive(1, 5000)).toBe(false);
		await expect(fixedWitnessPositive(1, 15000)).toBe(true);
		await expect(fixedWitnessPositive(2, 15000)).toBe(false);
		await expect(fixedWitnessPositive(2, 30000)).toBe(true);

		for (let modeIndex = 0; modeIndex < MODES.length; modeIndex += 1) {
			for (let targetIndex = 0; targetIndex < TARGETS.length; targetIndex += 1) {
				for (
					let tierIndex = 0;
					tierIndex < DEFAULT_RAIDER_CAPITAL_PROFILES.length;
					tierIndex += 1
				) {
					const mode = MODES[modeIndex];
					const target = TARGETS[targetIndex];
					const profile = DEFAULT_RAIDER_CAPITAL_PROFILES[tierIndex];
					const settlement = settleRaiderCapitalEconomy({
						mode,
						profile,
						defenderReserve: target.reserve,
						defenderCapacity: 30000,
						breached: true,
						breachViability: args.realizedBreachViability,
						returnViability: args.realizedReturnViability,
						travelAndOperatingCost: args.travelAndOperatingCost,
						defenderCaptureFraction: args.defenderCaptureFraction,
						collateralDissipationRatio: 0
					});
					await expect(settlement.extractedEnergy).toBeLessThanOrEqual(target.reserve);
					await expect(settlement.returnedCapital).toBeLessThanOrEqual(profile.committedEnergy);
					await expect(settlement.returnedCapital).toBeLessThanOrEqual(
						settlement.capitalPresentAtBreach || profile.committedEnergy
					);
					await expect(settlement.capturedCapital).toBeLessThanOrEqual(
						settlement.capitalAtRiskLost
					);
					await expect(Math.abs(settlement.conservationResidual)).toBeLessThan(0.000001);
					if (mode === "fully-sunk") {
						await expect(settlement.returnedCapital).toBe(0);
						await expect(settlement.capturedCapital).toBe(0);
					}
				}
			}
		}

		const profile = DEFAULT_RAIDER_CAPITAL_PROFILES[1];
		const cleanReturn = settleRaiderCapitalEconomy({
			mode: "embodied-return",
			profile,
			defenderReserve: 30000,
			defenderCapacity: 30000,
			breached: true,
			breachViability: 0.8,
			returnViability: 0.8,
			travelAndOperatingCost: 500,
			defenderCaptureFraction: 0.72,
			collateralDissipationRatio: 0
		});
		const interceptedReturn = settleRaiderCapitalEconomy({
			mode: "embodied-return",
			profile,
			defenderReserve: 30000,
			defenderCapacity: 30000,
			breached: true,
			breachViability: 0.8,
			returnViability: 0.2,
			travelAndOperatingCost: 500,
			defenderCaptureFraction: 0.72,
			collateralDissipationRatio: 0
		});
		await expect(interceptedReturn.extractedEnergy).toBe(cleanReturn.extractedEnergy);
		await expect(interceptedReturn.returnedCapital).toBeLessThan(cleanReturn.returnedCapital);
		await expect(interceptedReturn.postBreachCapitalLoss).toBeGreaterThan(0);
		await expect(interceptedReturn.attackerNetReturn).toBeLessThan(cleanReturn.attackerNetReturn);

		const failedRetreat = settleRaiderCapitalEconomy({
			mode: "embodied-return",
			profile,
			defenderReserve: 30000,
			defenderCapacity: 30000,
			breached: false,
			breachViability: 0.8,
			returnViability: 0.3,
			travelAndOperatingCost: 500,
			defenderCaptureFraction: 0.72,
			collateralDissipationRatio: 0
		});
		await expect(failedRetreat.extractedEnergy).toBe(0);
		await expect(failedRetreat.returnedCapital).toBeCloseTo(profile.committedEnergy * 0.3);
		await expect(failedRetreat.postBreachCapitalLoss).toBe(0);
		await expect(Math.abs(failedRetreat.conservationResidual)).toBeLessThan(0.000001);
	}
};
