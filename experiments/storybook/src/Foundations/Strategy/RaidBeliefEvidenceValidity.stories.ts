import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	ageRaidBelief,
	createRaidBelief,
	DEFAULT_RAID_BELIEF_CALIBRATION,
	DEFAULT_RAID_BELIEF_PRIOR,
	observeRaidOpportunitySignature,
	observeRaidOutcome,
	observeRaidSignature,
	type RaidBeliefState
} from "@defend/gameplay/raidBelief";
import { createLabShell } from "../../labTheme";

function sameApproach(left: RaidBeliefState, right: RaidBeliefState): boolean {
	return (
		left.approach.expectedBreachProbability === right.approach.expectedBreachProbability &&
		left.approach.expectedArrivalViability === right.approach.expectedArrivalViability &&
		left.approach.uncertainty === right.approach.uncertainty &&
		left.approach.directObservations === right.approach.directObservations &&
		left.approach.secondsSinceDirectObservation ===
			right.approach.secondsSinceDirectObservation
	);
}

const meta = {
	title: "Foundations/Strategy/Raid Belief Evidence Validity",
	tags: ["test", "visual"],
	render: () => {
		const calibration = DEFAULT_RAID_BELIEF_CALIBRATION;
		const initial = createRaidBelief(DEFAULT_RAID_BELIEF_PRIOR, calibration);
		const stale = ageRaidBelief(initial, 60, calibration);
		const zeroReliability = observeRaidOutcome(
			stale,
			{ breached: false, remainingViability: 0, reliability: 0 },
			calibration
		);
		const malformedViability = observeRaidOutcome(
			stale,
			{ breached: false, remainingViability: NaN, reliability: 1 },
			calibration
		);
		const missingSignature = observeRaidSignature(
			stale,
			undefined as unknown as number,
			30,
			calibration
		);
		const validOutcome = observeRaidOutcome(
			stale,
			{ breached: false, remainingViability: 0.2, reliability: 1 },
			calibration
		);
		const shell = createLabShell(
			"Foundations / strategy",
			"Evidence validity is not evidence failure",
			"Missing, malformed or zero-reliability observations do not teach the attacker that a target is empty or an approach failed. Valid elapsed time may still make old knowledge stale; valid direct evidence alone refreshes the approach history."
		);
		shell.frame.innerHTML = `
			<style>
				.validity-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:10px; }
				.validity-card { padding:12px; border:1px solid rgba(228,185,128,.18); background:rgba(10,3,17,.4); }
				.validity-card small { display:block; opacity:.48; }
				.validity-card strong { display:block; margin:4px 0 9px; }
				.validity-card dl { display:grid; grid-template-columns:1fr auto; gap:5px 9px; margin:0; font-size:9px; }
				.validity-card dd { margin:0; }
			</style>
			<div class="validity-grid">
				${[
					["stale", "Baseline stale belief", stale],
					["zero", "Zero-reliability direct sample", zeroReliability],
					["malformed", "Malformed direct sample", malformedViability],
					["missing-signature", "Missing passive signature + time", missingSignature],
					["valid", "Valid direct evidence", validOutcome]
				]
					.map(entry => {
						const id = entry[0] as string;
						const label = entry[1] as string;
						const state = entry[2] as RaidBeliefState;
						return `<article class="validity-card" data-case="${id}"><small>belief evidence</small><strong>${label}</strong><dl><dt>target</dt><dd>${state.opportunity.perceivedTargetEnergy.toFixed(0)}</dd><dt>breach</dt><dd>${state.approach.expectedBreachProbability.toFixed(3)}</dd><dt>viability</dt><dd>${state.approach.expectedArrivalViability.toFixed(3)}</dd><dt>uncertainty</dt><dd>${state.approach.uncertainty.toFixed(3)}</dd><dt>observations</dt><dd>${state.approach.directObservations}</dd><dt>age</dt><dd>${state.approach.secondsSinceDirectObservation.toFixed(1)} s</dd></dl></article>`;
					})
					.join("")}
			</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FailClosedEvidence: Story = {
	play: async ({ canvasElement }) => {
		const calibration = DEFAULT_RAID_BELIEF_CALIBRATION;
		const initial = createRaidBelief(DEFAULT_RAID_BELIEF_PRIOR, calibration);
		const stale = ageRaidBelief(initial, 60, calibration);

		const invalidSignatures = [
			NaN,
			-1,
			Infinity,
			-Infinity,
			undefined as unknown as number
		];
		for (let index = 0; index < invalidSignatures.length; index += 1) {
			const next = observeRaidOpportunitySignature(
				stale.opportunity,
				invalidSignatures[index],
				20,
				calibration
			);
			await expect(next.perceivedTargetEnergy).toBe(
				stale.opportunity.perceivedTargetEnergy
			);
		}

		const zeroReliability = observeRaidOutcome(
			stale,
			{ breached: false, remainingViability: 0, reliability: 0 },
			calibration
		);
		await expect(sameApproach(zeroReliability, stale)).toBe(true);

		const malformedViability = observeRaidOutcome(
			stale,
			{ breached: false, remainingViability: NaN, reliability: 1 },
			calibration
		);
		await expect(sameApproach(malformedViability, stale)).toBe(true);

		const malformedBreach = observeRaidOutcome(
			stale,
			{
				breached: undefined as unknown as boolean,
				remainingViability: 0.3,
				reliability: 1
			},
			calibration
		);
		await expect(sameApproach(malformedBreach, stale)).toBe(true);

		const missingSignatureWithTime = observeRaidSignature(
			stale,
			undefined as unknown as number,
			30,
			calibration
		);
		await expect(missingSignatureWithTime.opportunity.perceivedTargetEnergy).toBe(
			stale.opportunity.perceivedTargetEnergy
		);
		await expect(
			missingSignatureWithTime.approach.expectedBreachProbability
		).toBe(stale.approach.expectedBreachProbability);
		await expect(missingSignatureWithTime.approach.uncertainty).toBeGreaterThan(
			stale.approach.uncertainty
		);
		await expect(
			missingSignatureWithTime.approach.secondsSinceDirectObservation
		).toBe(90);

		const validDirect = observeRaidOutcome(
			stale,
			{ breached: false, remainingViability: 0.2, reliability: 1 },
			calibration
		);
		await expect(validDirect.approach.directObservations).toBe(
			stale.approach.directObservations + 1
		);
		await expect(validDirect.approach.secondsSinceDirectObservation).toBe(0);
		await expect(validDirect.approach.uncertainty).toBeLessThan(
			stale.approach.uncertainty
		);

		const validSignature = observeRaidOpportunitySignature(
			stale.opportunity,
			29000,
			20,
			calibration
		);
		await expect(validSignature.perceivedTargetEnergy).toBeGreaterThan(
			stale.opportunity.perceivedTargetEnergy
		);

		await expect(canvasElement.querySelectorAll("[data-case]").length).toBe(5);
	}
};
