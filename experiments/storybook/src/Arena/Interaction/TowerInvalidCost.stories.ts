import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyTowerInteraction,
	towerInteractionCanAfford,
	type TowerInteractionRequest
} from "@defend/gameplay/towerInteraction";
import { createLabShell } from "../../labTheme";

interface CostCase {
	id: string;
	label: string;
	cost: number;
	valid: boolean;
}

const COST_CASES: CostCase[] = [
	{ id: "negative", label: "negative", cost: -1, valid: false },
	{ id: "nan", label: "NaN", cost: NaN, valid: false },
	{ id: "positive-infinity", label: "+Infinity", cost: Infinity, valid: false },
	{ id: "negative-infinity", label: "-Infinity", cost: -Infinity, valid: false },
	{ id: "explicit-zero", label: "explicit zero", cost: 0, valid: true }
];

function request(cost: number): TowerInteractionRequest {
	return {
		inputOwner: "world",
		targetKind: "ground",
		occupied: false,
		balance: 15000,
		requestedCost: cost,
		currentLevel: 0,
		maximumLevel: 3,
		affordabilityRule: "legacy-strict",
		maxLevelBehavior: "legacy-rebuild"
	};
}

const meta = {
	title: "Arena/Interaction/Tower Invalid Cost",
	tags: ["test", "visual"],
	render: () => {
		const cases = COST_CASES.map(testCase => ({
			...testCase,
			result: classifyTowerInteraction(request(testCase.cost))
		}));
		const shell = createLabShell(
			"Arena / interaction",
			"Malformed cost rejection",
			"Economic authority fails closed. Negative and non-finite action costs remain finite in diagnostics but can never become free placement permission. A literal zero cost remains distinguishable as an explicit caller value."
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
						<article class="cost-card" data-case="${entry.id}" data-valid="${entry.valid}" data-disposition="${entry.result.disposition}" data-reason="${entry.result.reason}" data-cost="${entry.result.requestedCost}" data-balance-after="${entry.result.balanceAfter}">
							<h3>${entry.label}</h3>
							<dl>
								<dt>input</dt><dd>${entry.label}</dd>
								<dt>disposition</dt><dd>${entry.result.disposition}</dd>
								<dt>reason</dt><dd>${entry.result.reason}</dd>
								<dt>diagnostic cost</dt><dd>${entry.result.requestedCost}</dd>
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
		for (let index = 0; index < COST_CASES.length; index += 1) {
			const testCase = COST_CASES[index];
			const card = canvasElement.querySelector<HTMLElement>(
				`[data-case='${testCase.id}']`
			);
			await expect(card).not.toBeNull();
			if (!card) continue;

			const classified = classifyTowerInteraction(request(testCase.cost));
			if (!testCase.valid) {
				await expect(
					towerInteractionCanAfford(15000, testCase.cost, "legacy-strict")
				).toBe(false);
				await expect(
					towerInteractionCanAfford(15000, testCase.cost, "inclusive")
				).toBe(false);
				await expect(classified.disposition).toBe("rejected");
				await expect(classified.reason).toBe("invalid-cost");
				await expect(classified.balanceAfter).toBe(15000);
				await expect(Number.isFinite(classified.requestedCost)).toBe(true);
				await expect(Number.isFinite(classified.balanceAfter)).toBe(true);
				await expect(card.dataset.reason).toBe("invalid-cost");
			} else {
				await expect(classified.disposition).toBe("allowed");
				await expect(classified.reason).toBe("none");
				await expect(classified.requestedCost).toBe(0);
			}
		}
	}
};
