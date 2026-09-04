import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	authorizeDiscreteMothershipSpend,
	fundContinuousMothershipSpend
} from "@defend/gameplay/mothershipEnergyAuthorization";
import {
	authorizeMothershipEnergyBatch,
	type MothershipEnergyDemand
} from "@defend/gameplay/mothershipEnergyBatchAuthorization";
import type {
	MothershipEnergyLiftState,
	MothershipLiftPhase
} from "@defend/gameplay/mothershipEnergyLift";
import { createLabShell } from "../../labTheme";

function state(
	reserve: number,
	phase: MothershipLiftPhase = "stable"
): MothershipEnergyLiftState {
	return {
		reserve,
		phase,
		altitude: 56,
		verticalVelocity: 0,
		elapsedSeconds: 0,
		impactCount: 0
	};
}

function allocationRows(
	label: string,
	demands: MothershipEnergyDemand[],
	reserve = 10,
	protectedReserve = 2
): string {
	const batch = authorizeMothershipEnergyBatch(
		state(reserve),
		demands,
		protectedReserve
	);
	return `
		<article class="batch-card" data-batch="${label}" data-valid="${batch.inputValid}" data-authority="${batch.authorityAvailable}" data-spendable="${batch.spendableEnergy}" data-allocated="${batch.allocatedEnergy}" data-remaining="${batch.remainingSpendableEnergy}">
			<header><strong>${label}</strong><span>${batch.allocatedEnergy.toFixed(2)} / ${batch.spendableEnergy.toFixed(2)} funded</span></header>
			<div class="batch-list">
				${batch.allocations
					.map(
						allocation => `
						<div class="batch-row" data-index="${allocation.index}" data-kind="${allocation.kind}" data-authorized="${allocation.authorized}" data-funded="${allocation.fundedEnergy}" data-fraction="${allocation.fundingFraction}">
							<span>${allocation.index + 1}. ${allocation.kind}</span>
							<strong>${allocation.fundedEnergy.toFixed(2)} / ${allocation.requestedEnergy.toFixed(2)}</strong>
							<small>${allocation.authorized ? "authority" : "no authority"} · ${(allocation.fundingFraction * 100).toFixed(0)}%</small>
						</div>`
					)
					.join("")}
			</div>
		</article>`;
}

const meta = {
	title: "Foundations/Physics/Mothership Energy Batch Authorization",
	tags: ["test", "visual"],
	render: () => {
		const healthy = state(10);
		const protectedReserve = 2;
		const independentLaunch = authorizeDiscreteMothershipSpend(
			healthy,
			6,
			protectedReserve
		);
		const independentPropulsion = fundContinuousMothershipSpend(
			healthy,
			6,
			protectedReserve
		);
		const independentPromised =
			(independentLaunch.authorized ? independentLaunch.requestedEnergy : 0) +
			independentPropulsion.fundedEnergy;
		const spendable = independentLaunch.availableEnergy;

		const launchFirst: MothershipEnergyDemand[] = [
			{ kind: "discrete", requestedEnergy: 6 },
			{ kind: "continuous", requestedEnergy: 6 }
		];
		const propulsionFirst: MothershipEnergyDemand[] = [
			{ kind: "continuous", requestedEnergy: 6 },
			{ kind: "discrete", requestedEnergy: 6 }
		];
		const shell = createLabShell(
			"Foundations / physics",
			"Same-step mothership energy authority",
			"Independent authorization calls can each observe the same reserve snapshot and promise more physical authority than one teal pool can fund. Ordered batch allocation makes priority explicit: discrete actions are all-or-nothing, continuous actions may degrade proportionally, and total funded authority never exceeds spendable energy."
		);

		shell.frame.innerHTML = `
			<style>
				.overcommit { margin-bottom:14px; padding:12px; border:1px solid rgba(228,185,128,.3); background:rgba(228,185,128,.055); }
				.overcommit strong { display:block; font-size:18px; margin-top:4px; }
				.overcommit small { opacity:.58; line-height:1.5; }
				.batch-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px; }
				.batch-card { padding:13px; border:1px solid rgba(244,237,247,.13); background:rgba(8,10,18,.46); }
				.batch-card header { display:flex; justify-content:space-between; gap:10px; align-items:baseline; margin-bottom:10px; }
				.batch-card header span { font-size:9px; opacity:.55; }
				.batch-list { display:grid; gap:7px; }
				.batch-row { display:grid; grid-template-columns:1fr auto; gap:3px 10px; border-top:1px solid rgba(244,237,247,.08); padding-top:7px; font-size:10px; }
				.batch-row small { grid-column:1 / -1; opacity:.5; }
				.batch-note { margin-top:13px; padding:10px; border-left:3px solid rgba(73,215,209,.5); font-size:10px; line-height:1.55; opacity:.7; }
			</style>
			<section class="overcommit" data-independent-promised="${independentPromised}" data-spendable="${spendable}">
				<small>Independent helpers, same 10-energy snapshot, protected reserve 2</small>
				<strong>${independentPromised.toFixed(2)} promised against ${spendable.toFixed(2)} spendable</strong>
				<small>Launch 6 authorizes and propulsion 6 fully funds when checked separately: valid local answers, invalid combined transaction.</small>
			</section>
			<div class="batch-grid">
				${allocationRows("launch first", launchFirst)}
				${allocationRows("propulsion first", propulsionFirst)}
			</div>
			<div class="batch-note">Array order is policy, not hidden scheduler behavior. Launch-first keeps the discrete launch and gives propulsion the remaining 2/6 authority. Propulsion-first funds propulsion 6 and rejects the later 6-energy launch because only 2 remains. A failed physical side effect invalidates the plan: discard and recompute rather than charging stale reservations.</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreventSameStepOvercommit: Story = {
	play: async ({ canvasElement }) => {
		const healthy = state(10);
		const protectedReserve = 2;
		const independentLaunch = authorizeDiscreteMothershipSpend(
			healthy,
			6,
			protectedReserve
		);
		const independentPropulsion = fundContinuousMothershipSpend(
			healthy,
			6,
			protectedReserve
		);
		const independentPromised =
			(independentLaunch.authorized ? independentLaunch.requestedEnergy : 0) +
			independentPropulsion.fundedEnergy;
		await expect(independentPromised).toBe(12);
		await expect(independentPromised).toBeGreaterThan(
			independentLaunch.availableEnergy
		);

		const launchFirst = authorizeMothershipEnergyBatch(
			healthy,
			[
				{ kind: "discrete", requestedEnergy: 6 },
				{ kind: "continuous", requestedEnergy: 6 }
			],
			protectedReserve
		);
		await expect(launchFirst.inputValid).toBe(true);
		await expect(launchFirst.spendableEnergy).toBe(8);
		await expect(launchFirst.allocatedEnergy).toBe(8);
		await expect(launchFirst.remainingSpendableEnergy).toBe(0);
		await expect(launchFirst.allocations[0].authorized).toBe(true);
		await expect(launchFirst.allocations[0].fundedEnergy).toBe(6);
		await expect(launchFirst.allocations[1].fundedEnergy).toBe(2);
		await expect(launchFirst.allocations[1].fundingFraction).toBeCloseTo(1 / 3);
		await expect(
			launchFirst.allocations.reduce(
				(sum, allocation) => sum + allocation.fundedEnergy,
				0
			)
		).toBe(launchFirst.allocatedEnergy);

		const propulsionFirst = authorizeMothershipEnergyBatch(
			healthy,
			[
				{ kind: "continuous", requestedEnergy: 6 },
				{ kind: "discrete", requestedEnergy: 6 }
			],
			protectedReserve
		);
		await expect(propulsionFirst.allocatedEnergy).toBe(6);
		await expect(propulsionFirst.remainingSpendableEnergy).toBe(2);
		await expect(propulsionFirst.allocations[0].fundedEnergy).toBe(6);
		await expect(propulsionFirst.allocations[1].authorized).toBe(false);
		await expect(propulsionFirst.allocations[1].fundedEnergy).toBe(0);

		const invalidNumeric = authorizeMothershipEnergyBatch(
			healthy,
			[
				{ kind: "discrete", requestedEnergy: 1 },
				{ kind: "continuous", requestedEnergy: NaN }
			],
			protectedReserve
		);
		await expect(invalidNumeric.inputValid).toBe(false);
		await expect(invalidNumeric.authorityAvailable).toBe(false);
		await expect(invalidNumeric.allocatedEnergy).toBe(0);

		const malformedKind = authorizeMothershipEnergyBatch(
			healthy,
			[
				{
					kind: "unknown" as unknown as MothershipEnergyDemand["kind"],
					requestedEnergy: 1
				}
			],
			protectedReserve
		);
		await expect(malformedKind.inputValid).toBe(false);
		await expect(malformedKind.allocatedEnergy).toBe(0);

		const malformedPhase = authorizeMothershipEnergyBatch(
			{
				...healthy,
				phase: "unknown" as unknown as MothershipLiftPhase
			},
			[{ kind: "discrete", requestedEnergy: 1 }],
			protectedReserve
		);
		await expect(malformedPhase.inputValid).toBe(false);
		await expect(malformedPhase.authorityAvailable).toBe(false);
		await expect(malformedPhase.allocatedEnergy).toBe(0);

		const hulk = authorizeMothershipEnergyBatch(
			state(10, "hulk"),
			[{ kind: "discrete", requestedEnergy: 0 }],
			protectedReserve
		);
		await expect(hulk.inputValid).toBe(true);
		await expect(hulk.authorityAvailable).toBe(false);
		await expect(hulk.allocatedEnergy).toBe(0);

		const witness = canvasElement.querySelector<HTMLElement>(".overcommit");
		await expect(witness).not.toBeNull();
		await expect(Number(witness?.dataset.independentPromised)).toBeGreaterThan(
			Number(witness?.dataset.spendable)
		);
	}
};
