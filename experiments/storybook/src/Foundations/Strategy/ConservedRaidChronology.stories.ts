import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	collectRaidRecovery,
	settleConservedRaidExchangeWithOrder,
	settleRaidBreach,
	type ConservedRaidExchangeResult
} from "@defend/gameplay/conservedRaidExchange";
import { createLabShell } from "../../labTheme";

const INPUT = {
	defenderReserve: 5000,
	defenderCapacity: 30000,
	requestedExtractionEnergy: 18000,
	attackerEmbodiedEnergy: 4500,
	requestedRecoveryEnergy: 4500,
	collateralDissipationRatio: 0
};

function identityResidual(result: ConservedRaidExchangeResult): number {
	return (
		result.reserveBefore +
		result.recoveredEnergy -
		result.defenderEnergyLost -
		result.reserveAfter
	);
}

function card(label: string, result: ConservedRaidExchangeResult): string {
	return `
		<article class="chronology-card" data-order="${result.chronology}" data-extracted="${result.extractedEnergy}" data-final="${result.reserveAfter}">
			<small>event chronology</small>
			<h3>${label}</h3>
			<dl>
				<dt>start reserve</dt><dd>${result.reserveBefore.toFixed(0)}</dd>
				<dt>recovery collected</dt><dd>${result.recoveredEnergy.toFixed(0)}</dd>
				<dt>reserve at breach</dt><dd>${result.reserveAtBreach.toFixed(0)}</dd>
				<dt>actual extraction</dt><dd>${result.extractedEnergy.toFixed(0)}</dd>
				<dt>final reserve</dt><dd>${result.reserveAfter.toFixed(0)}</dd>
			</dl>
		</article>
	`;
}

const meta = {
	title: "Foundations/Strategy/Conserved Raid Chronology",
	tags: ["test", "visual"],
	render: () => {
		const recoveryFirst = settleConservedRaidExchangeWithOrder(
			INPUT,
			"recovery-then-breach"
		);
		const breachFirst = settleConservedRaidExchangeWithOrder(
			INPUT,
			"breach-then-recovery"
		);
		const shell = createLabShell(
			"Foundations / strategy",
			"Conservation does not imply commutativity",
			"The same starting reserve, recoverable attacker energy and breach demand can produce different target richness at contact depending on whether physically liberated recovery reaches the silo before or after extraction. Both histories conserve energy."
		);
		shell.frame.innerHTML = `
			<style>
				.chronology-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
				.chronology-card { padding:14px; border:1px solid rgba(228,185,128,.2); background:rgba(10,3,17,.42); }
				.chronology-card small { opacity:.45; text-transform:uppercase; font-size:9px; letter-spacing:.07em; }
				.chronology-card h3 { margin:4px 0 12px; font-size:14px; }
				.chronology-card dl { display:grid; grid-template-columns:1fr auto; gap:6px 12px; margin:0; font-size:10px; }
				.chronology-card dd { margin:0; font-variant-numeric:tabular-nums; }
				.chronology-note { margin-top:12px; font-size:10px; line-height:1.5; opacity:.58; }
				@media (max-width:720px) { .chronology-grid { grid-template-columns:1fr; } }
			</style>
			<div class="chronology-grid">
				${card("Recovery arrives before breach", recoveryFirst)}
				${card("Breach arrives before recovery", breachFirst)}
			</div>
			<div class="chronology-note">This is an ordering witness, not a production timing rule. #97/#86 should eventually provide physical packet/breach timing distributions.</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrderingChangesExtraction: Story = {
	play: async ({ canvasElement }) => {
		const recoveryFirst = settleConservedRaidExchangeWithOrder(
			INPUT,
			"recovery-then-breach"
		);
		const breachFirst = settleConservedRaidExchangeWithOrder(
			INPUT,
			"breach-then-recovery"
		);

		await expect(recoveryFirst.reserveBefore).toBe(5000);
		await expect(recoveryFirst.recoveredEnergy).toBe(4500);
		await expect(recoveryFirst.reserveAtBreach).toBe(9500);
		await expect(recoveryFirst.extractedEnergy).toBe(9500);
		await expect(recoveryFirst.reserveAfter).toBe(0);

		await expect(breachFirst.reserveBefore).toBe(5000);
		await expect(breachFirst.reserveAtBreach).toBe(5000);
		await expect(breachFirst.extractedEnergy).toBe(5000);
		await expect(breachFirst.recoveredEnergy).toBe(4500);
		await expect(breachFirst.reserveAfter).toBe(4500);

		await expect(recoveryFirst.extractedEnergy).toBeGreaterThan(
			breachFirst.extractedEnergy
		);
		await expect(Math.abs(identityResidual(recoveryFirst))).toBeLessThan(0.000001);
		await expect(Math.abs(identityResidual(breachFirst))).toBeLessThan(0.000001);

		const limitedSource = collectRaidRecovery({
			defenderReserve: 0,
			defenderCapacity: 30000,
			captureEligibleAttackerEnergy: 1000,
			requestedRecoveryEnergy: 5000
		});
		await expect(limitedSource.sourceAvailableRecoveryEnergy).toBe(1000);
		await expect(limitedSource.recoverySourceShortfall).toBe(4000);
		await expect(limitedSource.recoveredEnergy).toBe(1000);

		const breachOnly = settleRaidBreach({
			defenderReserve: 5000,
			defenderCapacity: 30000,
			requestedExtractionEnergy: 18000,
			collateralDissipationRatio: 0
		});
		await expect(breachOnly.extractedEnergy).toBe(5000);
		await expect(breachOnly.reserveAfter).toBe(0);

		await expect(canvasElement.querySelectorAll("[data-order]").length).toBe(2);
	}
};
