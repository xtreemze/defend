import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyTowerInteraction,
	towerInteractionCanAfford,
	type TowerAffordabilityRule,
	type TowerInteractionRequest
} from "@defend/gameplay/towerInteraction";
import { createLabShell } from "../../labTheme";

interface EconomyCase {
	id: string;
	label: string;
	balance: number;
	cost: number;
	rule: TowerAffordabilityRule;
	expectedReason: "invalid-cost" | "unaffordable" | "none";
}

const COST_CASES: EconomyCase[] = [
	{ id: "cost-negative", label: "negative cost", balance: 15000, cost: -1, rule: "legacy-strict", expectedReason: "invalid-cost" },
	{ id: "cost-nan", label: "NaN cost", balance: 15000, cost: NaN, rule: "legacy-strict", expectedReason: "invalid-cost" },
	{ id: "cost-positive-infinity", label: "+Infinity cost", balance: 15000, cost: Infinity, rule: "legacy-strict", expectedReason: "invalid-cost" },
	{ id: "cost-negative-infinity", label: "-Infinity cost", balance: 15000, cost: -Infinity, rule: "legacy-strict", expectedReason: "invalid-cost" },
	{ id: "cost-undefined", label: "undefined cost", balance: 15000, cost: undefined as unknown as number, rule: "legacy-strict", expectedReason: "invalid-cost" },
	{ id: "explicit-zero", label: "explicit zero cost", balance: 15000, cost: 0, rule: "legacy-strict", expectedReason: "none" }
];

const BALANCE_CASES: EconomyCase[] = [
	{ id: "balance-negative", label: "negative reserve", balance: -1, cost: 0, rule: "inclusive", expectedReason: "unaffordable" },
	{ id: "balance-nan", label: "NaN reserve", balance: NaN, cost: 0, rule: "inclusive", expectedReason: "unaffordable" },
	{ id: "balance-positive-infinity", label: "+Infinity reserve", balance: Infinity, cost: 0, rule: "inclusive", expectedReason: "unaffordable" },
	{ id: "balance-negative-infinity", label: "-Infinity reserve", balance: -Infinity, cost: 0, rule: "inclusive", expectedReason: "unaffordable" },
	{ id: "balance-undefined", label: "undefined reserve", balance: undefined as unknown as number, cost: 0, rule: "inclusive", expectedReason: "unaffordable" }
];

const ECONOMY_CASES = COST_CASES.concat(BALANCE_CASES);

function request(testCase: EconomyCase): TowerInteractionRequest {
	return {
		inputOwner: "world",
		targetKind: "ground",
		occupied: false,
		balance: testCase.balance,
		requestedCost: testCase.cost,
		currentLevel: 0,
		maximumLevel: 3,
		affordabilityRule: testCase.rule,
		maxLevelBehavior: "legacy-rebuild"
	};
}

const meta = {
	title: "Arena/Interaction/Tower Invalid Economy",
	tags: ["test", "visual"],
	render: () => {
		const cases = ECONOMY_CASES.map(testCase => ({
			...testCase,
			result: classifyTowerInteraction(request(testCase))
		}));
		const shell = createLabShell(
			"Arena / interaction",
			"Malformed economy authority fails closed",
			"Negative, non-finite and runtime non-number authority inputs cannot become free placement permission. Invalid costs remain explicit diagnostic failures. Invalid reserve state fails the affordability boundary without mutating finite preview diagnostics. A literal zero cost remains a valid explicit caller value when reserve state itself is valid."
		);

		shell.frame.innerHTML = `
			<style>
				.cost-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:10px; }
				.cost-card { padding:13px; border:1px solid rgba(244,237,247,.12); border-radius:9px; background:rgba(8,10,18,.48); }
				.cost-card[data-disposition="rejected"] { box-shadow:inset 3px 0 0 rgba(228,185,128,.76); }
				.cost-card[data-disposition="allowed"] { box-shadow:inset 3px 0 0 rgba(73,215,209,.78); }
				.cost-card h3 { margin:0 0 10px; font-size:13px; }
				.cost-card dl { display:grid; grid-template-columns:1fr auto; gap:5px 10px; margin:0; font-size:10px; }
				.cost-card dt { color:rgba(244,237,247,.48); }
				.cost-card dd { margin:0; color:rgba(244,237,247,.78); }
			</style>
			<div class="cost-grid">
				${cases
					.map(
						entry => `
						<article class="cost-card" data-case="${entry.id}" data-disposition="${entry.result.disposition}" data-reason="${entry.result.reason}" data-cost="${entry.result.requestedCost}" data-balance-before="${entry.result.balanceBefore}" data-balance-after="${entry.result.balanceAfter}">
							<h3>${entry.label}</h3>
							<dl>
								<dt>policy</dt><dd>${entry.rule}</dd>
								<dt>disposition</dt><dd>${entry.result.disposition}</dd>
								<dt>reason</dt><dd>${entry.result.reason}</dd>
								<dt>diagnostic cost</dt><dd>${entry.result.requestedCost}</dd>
								<dt>diagnostic reserve</dt><dd>${entry.result.balanceBefore}</dd>
								<dt>reserve after</dt><dd>${entry.result.balanceAfter}</dd>
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

export const FailClosed: Story = {
	play: async ({ canvasElement }) => {
		for (let index = 0; index < ECONOMY_CASES.length; index += 1) {
			const testCase = ECONOMY_CASES[index];
			const card = canvasElement.querySelector<HTMLElement>(
				`[data-case='${testCase.id}']`
			);
			await expect(card).not.toBeNull();
			if (!card) continue;

			const classified = classifyTowerInteraction(request(testCase));
			const canAfford = towerInteractionCanAfford(
				testCase.balance,
				testCase.cost,
				testCase.rule
			);

			if (testCase.expectedReason === "none") {
				await expect(canAfford).toBe(true);
				await expect(classified.disposition).toBe("allowed");
				await expect(classified.reason).toBe("none");
				await expect(classified.requestedCost).toBe(0);
			} else {
				await expect(canAfford).toBe(false);
				await expect(classified.disposition).toBe("rejected");
				await expect(classified.reason).toBe(testCase.expectedReason);
				await expect(card.dataset.reason).toBe(testCase.expectedReason);
			}

			await expect(Number.isFinite(classified.requestedCost)).toBe(true);
			await expect(Number.isFinite(classified.balanceBefore)).toBe(true);
			await expect(Number.isFinite(classified.balanceAfter)).toBe(true);
		}
	}
};
