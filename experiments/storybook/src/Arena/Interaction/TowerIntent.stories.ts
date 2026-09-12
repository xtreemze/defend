import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyTowerInteraction,
	type TowerAffordabilityRule,
	type TowerInteractionPreview,
	type TowerInteractionRequest,
	type TowerMaxLevelBehavior
} from "@defend/gameplay/towerInteraction";
import { createLabShell } from "../../labTheme";

type TowerIntentArgs = {
	balance: number;
	affordabilityRule: TowerAffordabilityRule;
	maxLevelBehavior: TowerMaxLevelBehavior;
};

interface Scenario {
	id: string;
	label: string;
	description: string;
	request: TowerInteractionRequest;
}

const BASE_COST = 3000;
const MAX_LEVEL = 3;

function request(
	args: TowerIntentArgs,
	overrides: Partial<TowerInteractionRequest>
): TowerInteractionRequest {
	return {
		inputOwner: "world",
		targetKind: "ground",
		occupied: false,
		balance: args.balance,
		requestedCost: BASE_COST,
		currentLevel: 0,
		maximumLevel: MAX_LEVEL,
		affordabilityRule: args.affordabilityRule,
		maxLevelBehavior: args.maxLevelBehavior,
		...overrides
	};
}

function scenarios(args: TowerIntentArgs): Scenario[] {
	return [
		{
			id: "open-ground",
			label: "Open ground",
			description: "A normal placement candidate with the current reserve.",
			request: request(args, {})
		},
		{
			id: "exact-cost",
			label: "Exact cost",
			description: "Makes the legacy `>` versus future `>=` affordability boundary explicit.",
			request: request(args, { balance: BASE_COST })
		},
		{
			id: "under-cost",
			label: "Below cost",
			description: "A true insufficient-reserve case remains rejected under both affordability policies.",
			request: request(args, { balance: BASE_COST - 1 })
		},
		{
			id: "occupied",
			label: "Occupied cell",
			description: "Affordability must not hide an independent spatial rejection.",
			request: request(args, { occupied: true })
		},
		{
			id: "protected",
			label: "Protected core",
			description: "Core/protected space is a distinct rejection, not a silent tap.",
			request: request(args, { targetKind: "protected-core" })
		},
		{
			id: "tower-l1",
			label: "Tower 1",
			description: "Existing lower-tier tower resolves to an upgrade intent.",
			request: request(args, {
				targetKind: "tower",
				currentLevel: 1,
				requestedCost: BASE_COST * 2
			})
		},
		{
			id: "tower-max",
			label: "Tower 3",
			description: "Max-tier behavior remains an explicit caller-owned policy.",
			request: request(args, {
				targetKind: "tower",
				currentLevel: 3,
				requestedCost: BASE_COST * 4
			})
		},
		{
			id: "invalid-terrain",
			label: "Invalid terrain",
			description: "Unsupported/non-buildable terrain has its own causal feedback state.",
			request: request(args, { targetKind: "invalid-terrain" })
		},
		{
			id: "outside-arena",
			label: "Outside arena",
			description: "A world hit outside the playable surface is distinguishable from invalid terrain.",
			request: request(args, { targetKind: "outside-arena" })
		},
		{
			id: "camera-gesture",
			label: "Camera owns gesture",
			description: "Input arbitration is ignored by world placement rather than reported as an economic failure.",
			request: request(args, { inputOwner: "camera" })
		},
		{
			id: "stale-target",
			label: "Stale target",
			description: "Disposed/outdated pick state remains distinguishable from invalid terrain.",
			request: request(args, { targetKind: "stale-target" })
		}
	];
}

function statusLabel(result: TowerInteractionPreview): string {
	if (result.disposition === "allowed") return result.intent.toUpperCase();
	if (result.disposition === "ignored") return "CAMERA";
	return result.reason.replace(/-/g, " ").toUpperCase();
}

const meta = {
	title: "Arena/Interaction/Tower Intent",
	tags: ["test", "visual"],
	args: {
		balance: 15000,
		affordabilityRule: "legacy-strict",
		maxLevelBehavior: "legacy-rebuild"
	},
	argTypes: {
		balance: { control: { type: "range", min: 0, max: 30000, step: 500 } },
		affordabilityRule: {
			control: "radio",
			options: ["legacy-strict", "inclusive"]
		},
		maxLevelBehavior: {
			control: "radio",
			options: ["legacy-rebuild", "maintenance", "no-op"]
		}
	},
	render: (args: TowerIntentArgs) => {
		const rows = scenarios(args).map(scenario => ({
			...scenario,
			result: classifyTowerInteraction(scenario.request)
		}));
		const shell = createLabShell(
			"Arena / interaction",
			"Tower intent and rejection grammar",
			"A pointer/touch candidate should be classifiable before the scene mutates. The playground keeps current exact-cost and level-3 behavior visible as explicit policies while exposing affordability, occupancy, protected-space, terrain, arena-boundary, stale-target and camera-arbitration reasons that production currently collapses into silent or ambiguous feedback."
		);

		shell.frame.innerHTML = `
			<style>
				.intent-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin-bottom:14px; }
				.intent-summary > div { padding:10px 12px; border:1px solid rgba(244,237,247,.12); border-radius:8px; background:rgba(255,255,255,.025); }
				.intent-summary dt { color:rgba(244,237,247,.5); font-size:10px; text-transform:uppercase; letter-spacing:.07em; }
				.intent-summary dd { margin:5px 0 0; font-size:13px; }
				.intent-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:10px; }
				.intent-card { min-height:150px; padding:13px; border:1px solid rgba(244,237,247,.12); border-radius:9px; background:rgba(8,10,18,.48); }
				.intent-card[data-disposition="allowed"] { box-shadow:inset 3px 0 0 rgba(73,215,209,.78); }
				.intent-card[data-disposition="rejected"] { box-shadow:inset 3px 0 0 rgba(228,185,128,.76); }
				.intent-card[data-disposition="ignored"] { box-shadow:inset 3px 0 0 rgba(180,107,211,.72); }
				.intent-card h3 { margin:0 0 5px; font-size:13px; }
				.intent-card p { min-height:34px; margin:0 0 10px; color:rgba(244,237,247,.54); font-size:11px; line-height:1.45; }
				.intent-state { display:flex; justify-content:space-between; gap:8px; align-items:center; margin-bottom:9px; }
				.intent-chip { padding:4px 7px; border:1px solid rgba(244,237,247,.16); border-radius:999px; font-size:10px; letter-spacing:.04em; }
				.intent-metrics { display:grid; grid-template-columns:1fr auto; gap:4px 10px; font-size:10px; color:rgba(244,237,247,.48); }
				.intent-metrics strong { color:rgba(244,237,247,.74); font-weight:500; }
			</style>
			<dl class="intent-summary">
				<div><dt>Reserve</dt><dd>${Math.max(0, args.balance).toFixed(0)}</dd></div>
				<div><dt>Affordability</dt><dd>${args.affordabilityRule}</dd></div>
				<div><dt>Max-tier policy</dt><dd>${args.maxLevelBehavior}</dd></div>
			</dl>
			<div class="intent-grid">
				${rows
					.map(
						row => `
						<article class="intent-card" data-scenario="${row.id}" data-disposition="${row.result.disposition}" data-reason="${row.result.reason}" data-intent="${row.result.intent}">
							<h3>${row.label}</h3>
							<p>${row.description}</p>
							<div class="intent-state"><span class="intent-chip">${statusLabel(row.result)}</span><span>${row.result.disposition}</span></div>
							<div class="intent-metrics">
								<span>intent</span><strong>${row.result.intent}</strong>
								<span>reason</span><strong>${row.result.reason}</strong>
								<span>cost</span><strong>${row.result.requestedCost.toFixed(0)}</strong>
								<span>projected reserve</span><strong>${row.result.balanceAfter.toFixed(0)}</strong>
								<span>level</span><strong>${row.result.fromLevel} → ${row.result.toLevel}</strong>
							</div>
						</article>`
					)
					.join("")}
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<TowerIntentArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntentMatrix: Story = {
	play: async ({ canvasElement, args }) => {
		const cards = canvasElement.querySelectorAll<HTMLElement>("[data-scenario]");
		await expect(cards.length).toBe(11);

		const exact = canvasElement.querySelector<HTMLElement>("[data-scenario='exact-cost']");
		const underCost = canvasElement.querySelector<HTMLElement>("[data-scenario='under-cost']");
		const occupied = canvasElement.querySelector<HTMLElement>("[data-scenario='occupied']");
		const protectedCore = canvasElement.querySelector<HTMLElement>("[data-scenario='protected']");
		const towerL1 = canvasElement.querySelector<HTMLElement>("[data-scenario='tower-l1']");
		const towerMax = canvasElement.querySelector<HTMLElement>("[data-scenario='tower-max']");
		const outsideArena = canvasElement.querySelector<HTMLElement>("[data-scenario='outside-arena']");
		const camera = canvasElement.querySelector<HTMLElement>("[data-scenario='camera-gesture']");
		const stale = canvasElement.querySelector<HTMLElement>("[data-scenario='stale-target']");

		await expect(exact).not.toBeNull();
		await expect(underCost).not.toBeNull();
		await expect(occupied).not.toBeNull();
		await expect(protectedCore).not.toBeNull();
		await expect(towerL1).not.toBeNull();
		await expect(towerMax).not.toBeNull();
		await expect(outsideArena).not.toBeNull();
		await expect(camera).not.toBeNull();
		await expect(stale).not.toBeNull();
		if (
			!exact ||
			!underCost ||
			!occupied ||
			!protectedCore ||
			!towerL1 ||
			!towerMax ||
			!outsideArena ||
			!camera ||
			!stale
		) return;

		await expect(exact.dataset.disposition).toBe(
			args.affordabilityRule === "inclusive" ? "allowed" : "rejected"
		);
		await expect(underCost.dataset.disposition).toBe("rejected");
		await expect(underCost.dataset.reason).toBe("unaffordable");
		await expect(occupied.dataset.reason).toBe("occupied");
		await expect(protectedCore.dataset.reason).toBe("protected-core");
		await expect(towerL1.dataset.intent).toBe("upgrade");
		await expect(outsideArena.dataset.reason).toBe("outside-arena");
		await expect(camera.dataset.disposition).toBe("ignored");
		await expect(camera.dataset.reason).toBe("camera-gesture");
		await expect(stale.dataset.reason).toBe("stale-target");

		if (args.maxLevelBehavior === "legacy-rebuild") {
			await expect(towerMax.dataset.intent).toBe("rebuild");
		} else if (args.maxLevelBehavior === "maintenance") {
			await expect(towerMax.dataset.intent).toBe("maintain");
		} else {
			await expect(towerMax.dataset.reason).toBe("max-level");
		}
	}
};
