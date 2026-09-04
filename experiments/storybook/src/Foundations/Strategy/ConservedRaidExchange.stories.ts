import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	raidAttackerNetReturn,
	raidTargetRichness,
	settleConservedRaidExchange
} from "@defend/gameplay/conservedRaidExchange";
import { createLabShell } from "../../labTheme";

type ExchangeArgs = {
	capacity: number;
	richReserve: number;
	poorReserve: number;
	requestedExtraction: number;
	attackerEmbodiedEnergy: number;
	requestedRecovery: number;
	collateralDissipationRatio: number;
	committedEnergy: number;
	travelCost: number;
};

function fixed(value: number, digits = 0): string {
	if (value !== value || value === Infinity || value === -Infinity) return "0";
	return value.toFixed(digits);
}

function percent(value: number): string {
	return `${fixed(value * 100, 0)}%`;
}

const meta = {
	title: "Foundations/Strategy/Conserved Raid Exchange",
	tags: ["test", "visual"],
	args: {
		capacity: 30000,
		richReserve: 30000,
		poorReserve: 5000,
		requestedExtraction: 18000,
		attackerEmbodiedEnergy: 12000,
		requestedRecovery: 4500,
		collateralDissipationRatio: 0.1,
		committedEnergy: 12000,
		travelCost: 500
	},
	argTypes: {
		capacity: { control: { type: "range", min: 1000, max: 60000, step: 1000 } },
		richReserve: { control: { type: "range", min: 0, max: 60000, step: 500 } },
		poorReserve: { control: { type: "range", min: 0, max: 30000, step: 500 } },
		requestedExtraction: { control: { type: "range", min: 0, max: 70000, step: 500 } },
		attackerEmbodiedEnergy: { control: { type: "range", min: 0, max: 30000, step: 500 } },
		requestedRecovery: { control: { type: "range", min: 0, max: 30000, step: 500 } },
		collateralDissipationRatio: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
		committedEnergy: { control: { type: "range", min: 0, max: 30000, step: 500 } },
		travelCost: { control: { type: "range", min: 0, max: 5000, step: 100 } }
	},
	render: (args: ExchangeArgs) => {
		const rich = settleConservedRaidExchange({
			defenderReserve: args.richReserve,
			defenderCapacity: args.capacity,
			requestedExtractionEnergy: args.requestedExtraction,
			attackerEmbodiedEnergy: args.attackerEmbodiedEnergy,
			requestedRecoveryEnergy: args.requestedRecovery,
			collateralDissipationRatio: args.collateralDissipationRatio
		});
		const poor = settleConservedRaidExchange({
			defenderReserve: args.poorReserve,
			defenderCapacity: args.capacity,
			requestedExtractionEnergy: args.requestedExtraction,
			attackerEmbodiedEnergy: args.attackerEmbodiedEnergy,
			requestedRecoveryEnergy: args.requestedRecovery,
			collateralDissipationRatio: args.collateralDissipationRatio
		});
		const richReturn = raidAttackerNetReturn(
			rich.extractedEnergy,
			args.committedEnergy,
			args.travelCost
		);
		const poorReturn = raidAttackerNetReturn(
			poor.extractedEnergy,
			args.committedEnergy,
			args.travelCost
		);

		const storageLimited = settleConservedRaidExchange({
			defenderReserve: Math.max(0, args.capacity - 100),
			defenderCapacity: args.capacity,
			requestedExtractionEnergy: 0,
			attackerEmbodiedEnergy: 1000,
			requestedRecoveryEnergy: 1000,
			collateralDissipationRatio: 0
		});
		const sourceLimited = settleConservedRaidExchange({
			defenderReserve: 0,
			defenderCapacity: args.capacity,
			requestedExtractionEnergy: 0,
			attackerEmbodiedEnergy: 3000,
			requestedRecoveryEnergy: 10000,
			collateralDissipationRatio: 0
		});

		const shell = createLabShell(
			"Foundations / strategy",
			"Conserved raid exchange",
			"A raider can only extract energy that is physically stored in the target. Combat recovery is separately bounded by attacker embodied energy and by remaining defender storage. Any extra breach harm is dissipative loss, never additional attacker income."
		);

		const card = (
			label: string,
			reserve: number,
			extracted: number,
			unmet: number,
			recovered: number,
			endReserve: number,
			attackerReturn: number
		) => `
			<article class="exchange-card">
				<header><small>${label}</small><strong>${percent(raidTargetRichness(reserve, args.capacity))} target richness</strong></header>
				<div class="exchange-flow">
					<div><span>stored</span><strong>${fixed(Math.min(args.capacity, Math.max(0, reserve)))}</strong></div>
					<div><span>actual extraction</span><strong>${fixed(extracted)}</strong></div>
					<div><span>unmet extraction</span><strong>${fixed(unmet)}</strong></div>
					<div><span>collected recovery</span><strong>${fixed(recovered)}</strong></div>
					<div><span>end reserve</span><strong>${fixed(endReserve)}</strong></div>
					<div><span>attacker net</span><strong>${fixed(attackerReturn)}</strong></div>
				</div>
			</article>`;

		shell.frame.innerHTML = `
			<style>
				.exchange-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:14px; }
				.exchange-card { border:1px solid rgba(228,185,128,.22); background:rgba(10,3,17,.44); padding:14px; }
				.exchange-card header { display:flex; justify-content:space-between; gap:12px; align-items:baseline; margin-bottom:12px; }
				.exchange-card small { text-transform:uppercase; letter-spacing:.08em; opacity:.5; }
				.exchange-flow { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
				.exchange-flow div { border-top:1px solid rgba(244,237,247,.08); padding-top:7px; }
				.exchange-flow span { display:block; font-size:10px; opacity:.48; }
				.exchange-flow strong { display:block; margin-top:3px; font-size:14px; }
				.exchange-note { margin-top:14px; padding:12px; border:1px solid rgba(73,215,209,.18); font-size:11px; line-height:1.55; opacity:.76; }
			</style>
			<div class="exchange-grid">
				${card("rich target", args.richReserve, rich.extractedEnergy, rich.unmetExtractionEnergy, rich.recoveredEnergy, rich.reserveAfter, richReturn)}
				${card("poor target", args.poorReserve, poor.extractedEnergy, poor.unmetExtractionEnergy, poor.recoveredEnergy, poor.reserveAfter, poorReturn)}
			</div>
			<div class="exchange-note"
				data-rich-extracted="${rich.extractedEnergy}"
				data-poor-extracted="${poor.extractedEnergy}"
				data-rich-return="${richReturn}"
				data-poor-return="${poorReturn}"
				data-poor-reserve="${poor.reserveBefore}"
				data-poor-end="${poor.reserveAfter}"
				data-poor-loss="${poor.defenderEnergyLost}"
				data-poor-recovery="${poor.recoveredEnergy}"
				data-storage-recovery="${storageLimited.recoveredEnergy}"
				data-storage-uncollected="${storageLimited.uncollectedRecoveryEnergy}"
				data-source-recovery="${sourceLimited.recoveredEnergy}"
				data-source-shortfall="${sourceLimited.recoverySourceShortfall}">
				Same requested raid, different physical reward: an emptying silo reduces actual attacker return automatically. Separate stress fixtures verify that a nearly-full silo cannot report discarded recovery as collected, and that defender recovery cannot exceed attacker embodied energy.
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<ExchangeArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RichVersusPoorTarget: Story = {
	play: async ({ canvasElement }) => {
		const evidence = canvasElement.querySelector<HTMLElement>(".exchange-note");
		await expect(evidence).not.toBeNull();
		if (!evidence) return;

		const richExtracted = Number(evidence.dataset.richExtracted);
		const poorExtracted = Number(evidence.dataset.poorExtracted);
		const richReturn = Number(evidence.dataset.richReturn);
		const poorReturn = Number(evidence.dataset.poorReturn);
		const poorReserve = Number(evidence.dataset.poorReserve);
		const poorEnd = Number(evidence.dataset.poorEnd);
		const poorLoss = Number(evidence.dataset.poorLoss);
		const poorRecovery = Number(evidence.dataset.poorRecovery);
		const storageRecovery = Number(evidence.dataset.storageRecovery);
		const storageUncollected = Number(evidence.dataset.storageUncollected);
		const sourceRecovery = Number(evidence.dataset.sourceRecovery);
		const sourceShortfall = Number(evidence.dataset.sourceShortfall);

		await expect(poorExtracted).toBeLessThanOrEqual(poorReserve + 1e-9);
		await expect(richExtracted).toBeGreaterThanOrEqual(poorExtracted);
		await expect(richReturn).toBeGreaterThanOrEqual(poorReturn);
		await expect(poorEnd).toBeCloseTo(
			poorReserve - poorLoss + poorRecovery,
			8
		);
		await expect(storageRecovery).toBeLessThanOrEqual(100 + 1e-9);
		await expect(storageUncollected).toBeGreaterThanOrEqual(900 - 1e-9);
		await expect(sourceRecovery).toBeLessThanOrEqual(3000 + 1e-9);
		await expect(sourceShortfall).toBeGreaterThanOrEqual(7000 - 1e-9);
	}
};
