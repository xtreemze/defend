import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	authorizeDiscreteMothershipSpend,
	fundContinuousMothershipSpend,
	mothershipFundingFraction
} from "@defend/gameplay/mothershipEnergyAuthorization";
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

const meta = {
	title: "Foundations/Physics/Mothership Energy Authorization",
	tags: ["test", "visual"],
	render: () => {
		const healthy = state(10);
		const hulk = state(10, "hulk");
		const rows = [
			{
				id: "valid",
				label: "valid spend",
				discrete: authorizeDiscreteMothershipSpend(healthy, 6),
				continuous: fundContinuousMothershipSpend(healthy, 6)
			},
			{
				id: "overdraw",
				label: "overdraw",
				discrete: authorizeDiscreteMothershipSpend(healthy, 12),
				continuous: fundContinuousMothershipSpend(healthy, 12)
			},
			{
				id: "invalid-request",
				label: "NaN request",
				discrete: authorizeDiscreteMothershipSpend(healthy, NaN),
				continuous: fundContinuousMothershipSpend(healthy, NaN)
			},
			{
				id: "invalid-protected",
				label: "invalid protected reserve",
				discrete: authorizeDiscreteMothershipSpend(healthy, 6, Infinity),
				continuous: fundContinuousMothershipSpend(healthy, 6, Infinity)
			},
			{
				id: "hulk-zero",
				label: "hulk / zero request",
				discrete: authorizeDiscreteMothershipSpend(hulk, 0),
				continuous: fundContinuousMothershipSpend(hulk, 0)
			}
		];
		const shell = createLabShell(
			"Foundations / physics",
			"Mothership spend authorization",
			"Physical authority fails closed when spend inputs or authoritative reserve state are malformed. A hulk exposes zero launch/propulsion authority even when requested spend is zero; an intact mothership may still represent an explicit zero-cost action without conflating it with invalid input."
		);

		shell.frame.innerHTML = `
			<style>
				.auth-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:10px; }
				.auth-card { padding:13px; border:1px solid rgba(244,237,247,.12); border-radius:9px; background:rgba(8,10,18,.48); }
				.auth-card[data-authorized="true"] { box-shadow:inset 3px 0 0 rgba(73,215,209,.78); }
				.auth-card[data-authorized="false"] { box-shadow:inset 3px 0 0 rgba(228,185,128,.76); }
				.auth-card h3 { margin:0 0 10px; font-size:13px; }
				.auth-card dl { display:grid; grid-template-columns:1fr auto; gap:5px 10px; margin:0; font-size:10px; }
				.auth-card dt { color:rgba(244,237,247,.48); }
				.auth-card dd { margin:0; color:rgba(244,237,247,.78); }
			</style>
			<div class="auth-grid">
				${rows
					.map(
						row => `
						<article class="auth-card" data-case="${row.id}" data-authorized="${row.discrete.authorized}" data-valid="${row.discrete.inputValid}" data-authority="${row.continuous.authorityAvailable}" data-fraction="${mothershipFundingFraction(row.continuous)}">
							<h3>${row.label}</h3>
							<dl>
								<dt>discrete</dt><dd>${row.discrete.authorized ? "authorized" : "rejected"}</dd>
								<dt>input valid</dt><dd>${row.discrete.inputValid}</dd>
								<dt>available</dt><dd>${row.discrete.availableEnergy.toFixed(2)}</dd>
								<dt>continuous funded</dt><dd>${row.continuous.fundedEnergy.toFixed(2)}</dd>
								<dt>funding fraction</dt><dd>${mothershipFundingFraction(row.continuous).toFixed(3)}</dd>
							</dl>
						</article>`
					)
					.join("")}
			</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FailClosedAuthority: Story = {
	play: async ({ canvasElement }) => {
		const healthy = state(10);
		const hulk = state(10, "hulk");

		const valid = authorizeDiscreteMothershipSpend(healthy, 6);
		await expect(valid.inputValid).toBe(true);
		await expect(valid.authorized).toBe(true);

		const overdraw = authorizeDiscreteMothershipSpend(healthy, 12);
		await expect(overdraw.authorized).toBe(false);
		const partial = fundContinuousMothershipSpend(healthy, 12);
		await expect(partial.fundedEnergy).toBe(10);
		await expect(partial.unmetEnergy).toBe(2);
		await expect(mothershipFundingFraction(partial)).toBeCloseTo(10 / 12);

		const malformedValues = [-1, NaN, Infinity, -Infinity];
		for (let index = 0; index < malformedValues.length; index += 1) {
			const malformed = authorizeDiscreteMothershipSpend(
				healthy,
				malformedValues[index]
			);
			await expect(malformed.inputValid).toBe(false);
			await expect(malformed.authorized).toBe(false);
			await expect(Number.isFinite(malformed.requestedEnergy)).toBe(true);

			const funding = fundContinuousMothershipSpend(
				healthy,
				malformedValues[index]
			);
			await expect(funding.inputValid).toBe(false);
			await expect(funding.authorityAvailable).toBe(false);
			await expect(mothershipFundingFraction(funding)).toBe(0);
		}

		const invalidProtected = authorizeDiscreteMothershipSpend(healthy, 6, NaN);
		await expect(invalidProtected.inputValid).toBe(false);
		await expect(invalidProtected.authorized).toBe(false);
		const invalidProtectedFunding = fundContinuousMothershipSpend(
			healthy,
			6,
			Infinity
		);
		await expect(invalidProtectedFunding.inputValid).toBe(false);
		await expect(mothershipFundingFraction(invalidProtectedFunding)).toBe(0);

		const invalidReserve = authorizeDiscreteMothershipSpend(state(NaN), 0);
		await expect(invalidReserve.inputValid).toBe(false);
		await expect(invalidReserve.authorized).toBe(false);

		const hulkZero = authorizeDiscreteMothershipSpend(hulk, 0);
		await expect(hulkZero.inputValid).toBe(true);
		await expect(hulkZero.authorized).toBe(false);
		const hulkFunding = fundContinuousMothershipSpend(hulk, 0);
		await expect(hulkFunding.authorityAvailable).toBe(false);
		await expect(mothershipFundingFraction(hulkFunding)).toBe(0);

		const explicitZero = authorizeDiscreteMothershipSpend(healthy, 0);
		await expect(explicitZero.inputValid).toBe(true);
		await expect(explicitZero.authorized).toBe(true);
		const zeroFunding = fundContinuousMothershipSpend(healthy, 0);
		await expect(mothershipFundingFraction(zeroFunding)).toBe(1);

		const hulkCard = canvasElement.querySelector<HTMLElement>(
			"[data-case='hulk-zero']"
		);
		await expect(hulkCard).not.toBeNull();
		await expect(hulkCard?.dataset.authorized).toBe("false");
		await expect(hulkCard?.dataset.fraction).toBe("0");
	}
};
