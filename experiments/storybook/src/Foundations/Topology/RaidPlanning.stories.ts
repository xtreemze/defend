import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	advanceRaidPlan,
	assignRaidSector,
	createRaidPlan,
	raidSetCommitment,
	raidSetIsHold,
	resolveRaidSector,
	type RaidCommitmentWeights,
	type RaidSectorTarget,
	type RaidSetPlan
} from "@defend/gameplay/raidPlanning";
import { createLabShell } from "../../labTheme";

type RaidPlanningArgs = {
	maximumPerTier: number;
	currentSectorX: number;
	currentSectorZ: number;
	snapshotSectorX: number;
	snapshotSectorZ: number;
	set1R1: number;
	set2R1: number;
	set2R2: number;
};

const LAB_WEIGHTS: RaidCommitmentWeights = { r1: 1, r2: 4, r3: 9 };

function composition(plan: RaidSetPlan): string {
	if (raidSetIsHold(plan)) return "HOLD / NO RAID";
	const parts: string[] = [];
	if (plan.r1 > 0) parts.push(`R1×${plan.r1}`);
	if (plan.r2 > 0) parts.push(`R2×${plan.r2}`);
	if (plan.r3 > 0) parts.push(`R3×${plan.r3}`);
	return parts.join("  ");
}

function sectorText(plan: RaidSetPlan): string {
	return plan.sector === null
		? "sector deferred until launch"
		: `sector ${plan.sector.x.toFixed(1)}, ${plan.sector.z.toFixed(1)}`;
}

function setCard(plan: RaidSetPlan, index: number, prefix: string): string {
	return `
		<article class="raid-card ${raidSetIsHold(plan) ? "raid-card--hold" : ""}" data-${prefix}-index="${index}" data-${prefix}-hold="${raidSetIsHold(plan)}">
			<header><strong>Set ${index + 1}</strong><span>weight ${raidSetCommitment(plan, LAB_WEIGHTS)}</span></header>
			<div class="raid-composition">${composition(plan)}</div>
			<div class="raid-sector">${sectorText(plan)}</div>
		</article>
	`;
}

const meta = {
	title: "Foundations/Topology/Raid Planning",
	tags: ["test", "visual"],
	args: {
		maximumPerTier: 9,
		currentSectorX: -14,
		currentSectorZ: 22,
		snapshotSectorX: 18,
		snapshotSectorZ: -12,
		set1R1: 3,
		set2R1: 1,
		set2R2: 1
	},
	argTypes: {
		maximumPerTier: { control: { type: "range", min: 1, max: 16, step: 1 } },
		currentSectorX: { control: { type: "range", min: -50, max: 50, step: 1 } },
		currentSectorZ: { control: { type: "range", min: -50, max: 50, step: 1 } },
		snapshotSectorX: { control: { type: "range", min: -50, max: 50, step: 1 } },
		snapshotSectorZ: { control: { type: "range", min: -50, max: 50, step: 1 } },
		set1R1: { control: { type: "range", min: 0, max: 16, step: 1 } },
		set2R1: { control: { type: "range", min: 0, max: 16, step: 1 } },
		set2R2: { control: { type: "range", min: 0, max: 16, step: 1 } }
	},
	render: (args: RaidPlanningArgs) => {
		const currentSector: RaidSectorTarget = {
			x: args.currentSectorX,
			z: args.currentSectorZ
		};
		const snapshotSector: RaidSectorTarget = {
			x: args.snapshotSectorX,
			z: args.snapshotSectorZ
		};
		const initial = createRaidPlan(
			[
				{ r1: args.set1R1, r2: 0, r3: 0, sector: null },
				{ r1: args.set2R1, r2: args.set2R2, r3: 0, sector: null },
				{ r1: 0, r2: 0, r3: 0, sector: null }
			],
			args.maximumPerTier
		);
		const planned = assignRaidSector(initial, 1, snapshotSector, args.maximumPerTier);
		const advanced = advanceRaidPlan(planned, args.maximumPerTier);
		const deferredResolved = resolveRaidSector(planned[0], currentSector);
		const snappedResolved = resolveRaidSector(planned[1], currentSector);

		const shell = createLabShell(
			"Foundations / topology",
			"Three-set raid planning",
			"The mothership owns exactly three upcoming decisions. A set may be a real composition or an intentional HOLD, and its ground sector may either be snapshotted now or deferred until launch. Queue semantics are deterministic; launch costs remain caller-owned."
		);

		shell.frame.innerHTML = `
			<style>
				.raid-columns { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
				.raid-stack { display:grid; gap:10px; }
				.raid-card { padding:12px; border:1px solid rgba(228,185,128,.22); background:rgba(10,3,17,.42); }
				.raid-card--hold { border-style:dashed; opacity:.68; }
				.raid-card header { display:flex; justify-content:space-between; gap:12px; font-size:12px; }
				.raid-composition { margin-top:9px; color:#49d7d1; min-height:18px; }
				.raid-sector { margin-top:5px; font-size:11px; color:rgba(244,237,247,.5); }
				.raid-resolution { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; }
				.raid-resolution > div { padding:10px; border:1px solid rgba(244,237,247,.08); }
				.raid-resolution small { display:block; color:rgba(244,237,247,.42); margin-bottom:5px; }
				.raid-note { margin-top:12px; font-size:11px; color:rgba(244,237,247,.5); }
			</style>
			<div class="raid-columns">
				<section class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Upcoming horizon</h2>
					<div class="raid-stack">${planned.map((plan, index) => setCard(plan, index, "planned")).join("")}</div>
				</section>
				<section class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">After set 1 launches</h2>
					<div class="raid-stack">${advanced.map((plan, index) => setCard(plan, index, "advanced")).join("")}</div>
				</section>
			</div>
			<section class="lab__panel lab__panel--padded" style="margin-top:16px">
				<h2 class="lab__section-title">Sector resolution</h2>
				<div class="raid-resolution">
					<div><small>Set 1 · deferred</small><strong data-deferred-x="${deferredResolved.x}" data-deferred-z="${deferredResolved.z}">${deferredResolved.x.toFixed(1)}, ${deferredResolved.z.toFixed(1)}</strong></div>
					<div><small>Set 2 · snapshotted</small><strong data-snapped-x="${snappedResolved.x}" data-snapped-z="${snappedResolved.z}">${snappedResolved.x.toFixed(1)}, ${snappedResolved.z.toFixed(1)}</strong></div>
				</div>
				<div class="raid-note">Displayed 1/4/9 weights are supplied by this Storybook fixture only. The gameplay contract does not define launch cost.</div>
			</section>
		`;
		return shell.root;
	}
} satisfies Meta<RaidPlanningArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeSetHorizon: Story = {
	play: async ({ canvasElement, args }) => {
		const planned = canvasElement.querySelectorAll<HTMLElement>("[data-planned-index]");
		const advanced = canvasElement.querySelectorAll<HTMLElement>("[data-advanced-index]");
		const deferred = canvasElement.querySelector<HTMLElement>("[data-deferred-x]");
		const snapped = canvasElement.querySelector<HTMLElement>("[data-snapped-x]");
		await expect(planned.length).toBe(3);
		await expect(advanced.length).toBe(3);
		await expect(deferred).not.toBeNull();
		await expect(snapped).not.toBeNull();
		if (!deferred || !snapped) return;
		await expect(Number(deferred.dataset.deferredX)).toBe(args.currentSectorX);
		await expect(Number(deferred.dataset.deferredZ)).toBe(args.currentSectorZ);
		await expect(Number(snapped.dataset.snappedX)).toBe(args.snapshotSectorX);
		await expect(Number(snapped.dataset.snappedZ)).toBe(args.snapshotSectorZ);
		await expect(advanced[2].dataset.advancedHold).toBe("true");
	}
};
