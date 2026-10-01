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
	let state = createRaidBelief(DEFAULT_RAID_BELIEF_PRIOR, calibration);
	const stages: BeliefStage[] = [
		{
			label: "Prior",
			note: "One target-wide opportunity estimate plus one optimistic but uncertain approach context.",
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
		note: "Direct evidence lowers this approach's breach/viability expectation without changing target-wide energy belief.",
		state
	});

	state = observeRaidOutcome(
		state,
		{ breached: true, remainingViability: args.successViability, reliability: 1 },
		calibration
	);
	stages.push({
		label: "One lucky success",
		note: "The contextual approach recovers partially; one result does not erase accumulated history.",
		state
	});

	for (let index = 0; index < 4; index += 1) {
		state = observeRaidOutcome(
			state,
			{
				breached: true,
				remainingViability: Math.min(1, args.successViability + 0.08),
				reliability: 1
			},
			calibration
		);
	}
	stages.push({
		label: "Repeated success",
		note: "Accumulated contrary evidence can genuinely restore this approach's expectations.",
		state
	});

	state = ageRaidBelief(state, args.quietSeconds, calibration);
	stages.push({
		label: "Deterrent quiet",
		note: "Approach means stay fixed, but old route/tier information becomes stale and uncertain.",
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
		note: "The shared target opportunity rises; the approach-specific breach estimate does not magically improve.",
		state
	});

	state = observeRaidOutcome(
		state,
		{ breached: false, remainingViability: args.failedViability, reliability: 1 },
		calibration
	);
	stages.push({
		label: "Fresh probe",
		note: "Fresh direct evidence reduces uncertainty for this approach context only.",
		state
	});

	return stages;
}

function stageCard(
	stage: BeliefStage,
	calibration: RaidBeliefCalibration,
	index: number
): string {
	const informationNeed = raidBeliefInformationNeed(stage.state, calibration);
	const opportunity = stage.state.opportunity;
	const approach = stage.state.approach;
	return `
		<article class="belief-card" data-stage="${index}" data-breach="${approach.expectedBreachProbability}" data-viability="${approach.expectedArrivalViability}" data-uncertainty="${approach.uncertainty}" data-energy="${opportunity.perceivedTargetEnergy}" data-information-need="${informationNeed}">
			<header><small>${String(index + 1).padStart(2, "0")}</small><strong>${stage.label}</strong></header>
			<p>${stage.note}</p>
			<div class="belief-sections">
				<div class="belief-section">
					<small>target-wide opportunity</small>
					<strong>${fixed(opportunity.perceivedTargetEnergy, 0)} teal</strong>
				</div>
				<div class="belief-section">
					<small>this approach context</small>
					<div class="belief-metrics">
						<div><small>breach expectation</small><strong>${percent(approach.expectedBreachProbability)}</strong></div>
						<div><small>arrival viability</small><strong>${percent(approach.expectedArrivalViability)}</strong></div>
						<div><small>uncertainty</small><strong>${percent(approach.uncertainty)}</strong></div>
						<div><small>information need</small><strong>${percent(informationNeed)}</strong></div>
						<div><small>direct observations</small><strong>${approach.directObservations}</strong></div>
						<div><small>stale for</small><strong>${fixed(approach.secondsSinceDirectObservation, 0)} s</strong></div>
					</div>
				</div>
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
			"Target richness is global; breach and viability evidence are contextual. A failed R1 route should not teach the attacker that every R3 insertion is equally bad. Direct outcomes update one approach belief, while passive teal signatures update shared opportunity."
		);
		shell.frame.innerHTML = `
			<style>
				.belief-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(235px,1fr)); gap:10px; }
				.belief-card { padding:12px; border:1px solid rgba(228,185,128,.18); background:rgba(10,3,17,.4); }
				.belief-card header { display:flex; gap:8px; align-items:baseline; }
				.belief-card header small { opacity:.38; }
				.belief-card p { min-height:54px; font-size:10px; line-height:1.5; color:rgba(244,237,247,.5); }
				.belief-sections { display:grid; gap:9px; }
				.belief-section { border-top:1px solid rgba(244,237,247,.08); padding-top:7px; }
				.belief-section > small { display:block; margin-bottom:4px; font-size:8px; text-transform:uppercase; letter-spacing:.06em; color:rgba(244,237,247,.38); }
				.belief-section > strong { font-size:12px; }
				.belief-metrics { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
				.belief-metrics > div { padding-top:4px; }
				.belief-metrics small { display:block; font-size:8px; color:rgba(244,237,247,.38); }
				.belief-metrics strong { display:block; margin-top:2px; font-size:11px; font-variant-numeric:tabular-nums; }
				.belief-note { margin-top:12px; font-size:10px; line-height:1.5; color:rgba(244,237,247,.48); }
			</style>
			<div class="belief-grid">${stages.map((stage, index) => stageCard(stage, calibration, index)).join("")}</div>
			<div class="belief-note">A caller should share the opportunity belief across the target, but keep separate approach beliefs for materially different sector/tier/insertion contexts. `information need` remains a bounded diagnostic, not a raid authorization or hidden ROI bonus.</div>
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
		await expect(canvasElement.querySelectorAll("[data-stage]").length).toBe(
			stages.length
		);

		const prior = stages[0].state;
		const failures = stages[1].state;
		const lucky = stages[2].state;
		const repeatedSuccess = stages[3].state;
		const quiet = stages[4].state;
		const bright = stages[5].state;
		const probe = stages[6].state;

		await expect(failures.approach.expectedBreachProbability).toBeLessThan(
			prior.approach.expectedBreachProbability
		);
		await expect(failures.approach.expectedArrivalViability).toBeLessThan(
			prior.approach.expectedArrivalViability
		);
		await expect(failures.approach.uncertainty).toBeLessThan(
			prior.approach.uncertainty
		);
		await expect(failures.opportunity.perceivedTargetEnergy).toBe(
			prior.opportunity.perceivedTargetEnergy
		);
		await expect(lucky.approach.expectedBreachProbability).toBeGreaterThan(
			failures.approach.expectedBreachProbability
		);
		await expect(lucky.approach.expectedBreachProbability).toBeLessThan(
			prior.approach.expectedBreachProbability
		);
		await expect(
			repeatedSuccess.approach.expectedBreachProbability
		).toBeGreaterThan(lucky.approach.expectedBreachProbability);
		await expect(quiet.approach.expectedBreachProbability).toBe(
			repeatedSuccess.approach.expectedBreachProbability
		);
		await expect(quiet.approach.expectedArrivalViability).toBe(
			repeatedSuccess.approach.expectedArrivalViability
		);
		await expect(quiet.approach.uncertainty).toBeGreaterThan(
			repeatedSuccess.approach.uncertainty
		);
		await expect(bright.opportunity.perceivedTargetEnergy).toBeGreaterThan(
			quiet.opportunity.perceivedTargetEnergy
		);
		await expect(bright.approach.expectedBreachProbability).toBe(
			quiet.approach.expectedBreachProbability
		);
		await expect(probe.approach.uncertainty).toBeLessThan(
			bright.approach.uncertainty
		);

		const initial = createRaidBelief(DEFAULT_RAID_BELIEF_PRIOR, calibration);
		const age30 = repeatAge(initial, 120, 30 * 120, calibration);
		const age60 = repeatAge(initial, 120, 60 * 120, calibration);
		const age120 = repeatAge(initial, 120, 120 * 120, calibration);
		await expect(
			Math.abs(age30.approach.uncertainty - age60.approach.uncertainty)
		).toBeLessThan(0.000001);
		await expect(
			Math.abs(age60.approach.uncertainty - age120.approach.uncertainty)
		).toBeLessThan(0.000001);

		const signature30 = repeatSignature(
			initial,
			29000,
			16,
			30 * 16,
			calibration
		);
		const signature60 = repeatSignature(
			initial,
			29000,
			16,
			60 * 16,
			calibration
		);
		const signature120 = repeatSignature(
			initial,
			29000,
			16,
			120 * 16,
			calibration
		);
		await expect(
			Math.abs(
				signature30.opportunity.perceivedTargetEnergy -
					signature60.opportunity.perceivedTargetEnergy
			)
		).toBeLessThan(0.01);
		await expect(
			Math.abs(
				signature60.opportunity.perceivedTargetEnergy -
					signature120.opportunity.perceivedTargetEnergy
			)
		).toBeLessThan(0.01);

		const malformed = createRaidBelief(
			{
				perceivedTargetEnergy: Number.POSITIVE_INFINITY,
				expectedBreachProbability: Number.NaN,
				expectedArrivalViability: Number.NEGATIVE_INFINITY,
				uncertainty: Number.POSITIVE_INFINITY
			},
			calibration
		);
		await expect(
			Number.isFinite(malformed.opportunity.perceivedTargetEnergy)
		).toBe(true);
		await expect(
			Number.isFinite(malformed.approach.expectedBreachProbability)
		).toBe(true);
		await expect(
			Number.isFinite(malformed.approach.expectedArrivalViability)
		).toBe(true);
		await expect(Number.isFinite(malformed.approach.uncertainty)).toBe(true);
	}
};