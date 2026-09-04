import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	ageRaidBelief,
	createRaidBelief,
	DEFAULT_RAID_BELIEF_CALIBRATION,
	DEFAULT_RAID_BELIEF_PRIOR,
	observeRaidOutcome,
	observeRaidSignature,
	raidBeliefInformationNeed,
	type RaidBeliefCalibration,
	type RaidBeliefState
} from "@defend/gameplay/raidBelief";
import { createLabShell } from "../../labTheme";

type RaidBeliefArgs = {
	failureCount: number;
	failedViability: number;
	successViability: number;
	quietSeconds: number;
	brightSignatureEnergy: number;
};

type BeliefStage = {
	label: string;
	note: string;
	state: RaidBeliefState;
};

function fixed(value: number, digits = 2): string {
	if (value !== value || value === Infinity || value === -Infinity) return "0";
	return value.toFixed(digits);
}

function percent(value: number): string {
	return `${fixed(value * 100, 0)}%`;
}

function buildStages(args: RaidBeliefArgs): BeliefStage[] {
	const calibration = DEFAULT_RAID_BELIEF_CALIBRATION;
	const initial = createRaidBelief(DEFAULT_RAID_BELIEF_PRIOR, calibration);
	let state = initial;
	const stages: BeliefStage[] = [
		{
			label: "Prior",
			note: "Valuable target, optimistic but uncertain physical expectations.",
			state
		}
	];

	for (let index = 0; index < Math.max(1, Math.floor(args.failureCount)); index += 1) {
		state = observeRaidOutcome(
			state,
			{ breached: false, remainingViability: args.failedViability, reliability: 1 },
			calibration
		);
	}
	stages.push({
		label: "Repeated failures",
		note: "Direct evidence lowers breach/viability expectations and reduces uncertainty.",
		state
	});

	state = observeRaidOutcome(
		state,
		{ breached: true, remainingViability: args.successViability, reliability: 1 },
		calibration
	);
	stages.push({
		label: "One lucky success",
		note: "Belief recovers partially; one result does not erase the accumulated history.",
		state
	});

	for (let index = 0; index < 4; index += 1) {
		state = observeRaidOutcome(
			state,
			{ breached: true, remainingViability: Math.min(1, args.successViability + 0.08), reliability: 1 },
			calibration
		);
	}
	stages.push({
		label: "Repeated success",
		note: "Accumulated contrary evidence can restore broader confidence.",
		state
	});

	state = ageRaidBelief(state, args.quietSeconds, calibration);
	stages.push({
		label: "Deterrent quiet",
		note: "Physical means remain unchanged, but old information becomes stale and uncertainty rises.",
		state
	});

	state = observeRaidSignature(
		state,
		args.brightSignatureEnergy,
		16,
		calibration
	);
	stages.push({
		label: "Target brightens",
		note: "Passive teal evidence raises perceived opportunity without revealing hidden defense quality.",
		state
	});

	state = observeRaidOutcome(
		state,
		{ breached: false, remainingViability: args.failedViability, reliability: 1 },
		calibration
	);
	stages.push({
		label: "Fresh probe",
		note: "A new direct observation reduces uncertainty and updates the physical estimate again.",
		state
	});

	return stages;
}

function stageCard(stage: BeliefStage, calibration: RaidBeliefCalibration, index: number): string {
	const informationNeed = raidBeliefInformationNeed(stage.state, calibration);
	return `
		<article class="belief-card" data-stage="${index}" data-breach="${stage.state.expectedBreachProbability}" data-viability="${stage.state.expectedArrivalViability}" data-uncertainty="${stage.state.uncertainty}" data-energy="${stage.state.perceivedTargetEnergy}" data-information-need="${informationNeed}">
			<header><small>${String(index + 1).padStart(2, "0")}</small><strong>${stage.label}</strong></header>
			<p>${stage.note}</p>
			<div class="belief-metrics">
				<div><small>perceived energy</small><strong>${fixed(stage.state.perceivedTargetEnergy, 0)}</strong></div>
				<div><small>breach expectation</small><strong>${percent(stage.state.expectedBreachProbability)}</strong></div>
				<div><small>arrival viability</small><strong>${percent(stage.state.expectedArrivalViability)}</strong></div>
				<div><small>uncertainty</small><strong>${percent(stage.state.uncertainty)}</strong></div>
				<div><small>information need</small><strong>${percent(informationNeed)}</strong></div>
				<div><small>direct observations</small><strong>${stage.state.directObservations}</strong></div>
			</div>
		</article>
	`;
}

function repeatAge(
	initial: RaidBeliefState,
	totalSeconds: number,
	steps: number,
	calibration: RaidBeliefCalibration
): RaidBeliefState {
	let state = initial;
	const delta = totalSeconds / Math.max(1, steps);
	for (let index = 0; index < steps; index += 1) {
		state = ageRaidBelief(state, delta, calibration);
	}
	return state;
}

function repeatSignature(
	initial: RaidBeliefState,
	targetEnergy: number,
	totalSeconds: number,
	steps: number,
	calibration: RaidBeliefCalibration
): RaidBeliefState {
	let state = initial;
	const delta = totalSeconds / Math.max(1, steps);
	for (let index = 0; index < steps; index += 1) {
		state = observeRaidSignature(state, targetEnergy, delta, calibration);
	}
	return state;
}

const meta = {
	title: "Foundations/Strategy/Raid Belief",
	tags: ["test", "visual"],
	args: {
		failureCount: 5,
		failedViability: 0.12,
		successViability: 0.65,
		quietSeconds: 180,
		brightSignatureEnergy: 29000
	},
	argTypes: {
		failureCount: { control: { type: "range", min: 1, max: 12, step: 1 } },
		failedViability: { control: { type: "range", min: 0, max: 0.5, step: 0.02 } },
		successViability: { control: { type: "range", min: 0.3, max: 1, step: 0.02 } },
		quietSeconds: { control: { type: "range", min: 0, max: 600, step: 15 } },
		brightSignatureEnergy: { control: { type: "range", min: 1000, max: 30000, step: 1000 } }
	},
	render: (args: RaidBeliefArgs) => {
		const calibration = DEFAULT_RAID_BELIEF_CALIBRATION;
		const stages = buildStages(args);
		const shell = createLabShell(
			"Foundations / strategy",
			"Attacker beliefs and stale information",
			"Deterrence should emerge because attackers learn from outcomes, not because they read authoritative fortress state. Direct raids update physical expectations; passive teal signatures update opportunity; quiet makes old information uncertain enough to justify later re-probing."
		);
		shell.frame.innerHTML = `
			<style>
				.belief-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; }
				.belief-card { padding:12px; border:1px solid rgba(228,185,128,.18); background:rgba(10,3,17,.4); }
				.belief-card header { display:flex; gap:8px; align-items:baseline; }
				.belief-card header small { opacity:.38; }
				.belief-card p { min-height:48px; font-size:10px; line-height:1.5; color:rgba(244,237,247,.5); }
				.belief-metrics { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
				.belief-metrics > div { border-top:1px solid rgba(244,237,247,.08); padding-top:6px; }
				.belief-metrics small { display:block; font-size:8px; text-transform:uppercase; letter-spacing:.06em; color:rgba(244,237,247,.38); }
				.belief-metrics strong { display:block; margin-top:2px; font-size:12px; font-variant-numeric:tabular-nums; }
				.belief-note { margin-top:12px; font-size:10px; line-height:1.5; color:rgba(244,237,247,.48); }
			</style>
			<div class="belief-grid">${stages.map((stage, index) => stageCard(stage, calibration, index)).join("")}</div>
			<div class="belief-note">`information need` is a bounded diagnostic derived from uncertainty × perceived target richness. It does not choose a raid or award hidden ROI; a later planner may use it to compare the value of a cheap probe with ordinary economic return.</div>
		`;
		return shell.root;
	}
} satisfies Meta<RaidBeliefArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LearningAndStaleness: Story = {
	play: async ({ canvasElement }) => {
		const calibration = DEFAULT_RAID_BELIEF_CALIBRATION;
		const fixedArgs: RaidBeliefArgs = {
			failureCount: 5,
			failedViability: 0.12,
			successViability: 0.65,
			quietSeconds: 180,
			brightSignatureEnergy: 29000
		};
		const stages = buildStages(fixedArgs);
		await expect(canvasElement.querySelectorAll("[data-stage]").length).toBe(stages.length);

		const prior = stages[0].state;
		const failures = stages[1].state;
		const lucky = stages[2].state;
		const repeatedSuccess = stages[3].state;
		const quiet = stages[4].state;
		const bright = stages[5].state;
		const probe = stages[6].state;

		await expect(failures.expectedBreachProbability).toBeLessThan(prior.expectedBreachProbability);
		await expect(failures.expectedArrivalViability).toBeLessThan(prior.expectedArrivalViability);
		await expect(failures.uncertainty).toBeLessThan(prior.uncertainty);
		await expect(lucky.expectedBreachProbability).toBeGreaterThan(failures.expectedBreachProbability);
		await expect(lucky.expectedBreachProbability).toBeLessThan(prior.expectedBreachProbability);
		await expect(repeatedSuccess.expectedBreachProbability).toBeGreaterThan(lucky.expectedBreachProbability);
		await expect(quiet.expectedBreachProbability).toBe(repeatedSuccess.expectedBreachProbability);
		await expect(quiet.expectedArrivalViability).toBe(repeatedSuccess.expectedArrivalViability);
		await expect(quiet.uncertainty).toBeGreaterThan(repeatedSuccess.uncertainty);
		await expect(bright.perceivedTargetEnergy).toBeGreaterThan(quiet.perceivedTargetEnergy);
		await expect(bright.expectedBreachProbability).toBe(quiet.expectedBreachProbability);
		await expect(probe.uncertainty).toBeLessThan(bright.uncertainty);

		const initial = createRaidBelief(DEFAULT_RAID_BELIEF_PRIOR, calibration);
		const age30 = repeatAge(initial, 120, 30 * 120, calibration);
		const age60 = repeatAge(initial, 120, 60 * 120, calibration);
		const age120 = repeatAge(initial, 120, 120 * 120, calibration);
		await expect(Math.abs(age30.uncertainty - age60.uncertainty)).toBeLessThan(0.000001);
		await expect(Math.abs(age60.uncertainty - age120.uncertainty)).toBeLessThan(0.000001);

		const signature30 = repeatSignature(initial, 29000, 16, 30 * 16, calibration);
		const signature60 = repeatSignature(initial, 29000, 16, 60 * 16, calibration);
		const signature120 = repeatSignature(initial, 29000, 16, 120 * 16, calibration);
		await expect(Math.abs(signature30.perceivedTargetEnergy - signature60.perceivedTargetEnergy)).toBeLessThan(0.01);
		await expect(Math.abs(signature60.perceivedTargetEnergy - signature120.perceivedTargetEnergy)).toBeLessThan(0.01);

		const malformed = createRaidBelief(
			{
				perceivedTargetEnergy: Number.POSITIVE_INFINITY,
				expectedBreachProbability: Number.NaN,
				expectedArrivalViability: Number.NEGATIVE_INFINITY,
				uncertainty: Number.POSITIVE_INFINITY
			},
			calibration
		);
		await expect(Number.isFinite(malformed.perceivedTargetEnergy)).toBe(true);
		await expect(Number.isFinite(malformed.expectedBreachProbability)).toBe(true);
		await expect(Number.isFinite(malformed.expectedArrivalViability)).toBe(true);
		await expect(Number.isFinite(malformed.uncertainty)).toBe(true);
	}
};