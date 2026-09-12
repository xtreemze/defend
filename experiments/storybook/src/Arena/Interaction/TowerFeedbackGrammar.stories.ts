import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyTowerInteraction,
	type TowerInteractionRequest
} from "@defend/gameplay/towerInteraction";
import {
	towerInteractionFeedback,
	type TowerInteractionFeedbackDescriptor
} from "@defend/presentation/towerInteractionFeedback";
import { createLabShell } from "../../labTheme";

type FeedbackArgs = {
	reducedMotion: boolean;
	audioEnabled: boolean;
	grayscale: boolean;
};

interface Scenario {
	id: string;
	label: string;
	description: string;
	request: TowerInteractionRequest;
}

const BASE_COST = 3000;

function request(
	overrides: Partial<TowerInteractionRequest> = {}
): TowerInteractionRequest {
	return {
		inputOwner: "world",
		targetKind: "ground",
		occupied: false,
		balance: 15000,
		requestedCost: BASE_COST,
		currentLevel: 0,
		maximumLevel: 3,
		affordabilityRule: "legacy-strict",
		maxLevelBehavior: "no-op",
		...overrides
	};
}

const SCENARIOS: Scenario[] = [
	{
		id: "place-ready",
		label: "Placement ready",
		description: "Stable ground anchor and visible reserve relationship.",
		request: request()
	},
	{
		id: "occupied",
		label: "Occupied",
		description: "Same candidate location remains visible, but overlap is a spatial conflict.",
		request: request({ occupied: true })
	},
	{
		id: "protected",
		label: "Protected core",
		description: "The protected region owns the response rather than implying a missed tap.",
		request: request({ targetKind: "protected-core" })
	},
	{
		id: "invalid-terrain",
		label: "Invalid terrain",
		description: "Broken contact language indicates surface incompatibility.",
		request: request({ targetKind: "invalid-terrain" })
	},
	{
		id: "outside-arena",
		label: "Outside arena",
		description: "Clipped boundary language distinguishes arena limits from terrain failure.",
		request: request({ targetKind: "outside-arena" })
	},
	{
		id: "unaffordable",
		label: "Insufficient energy",
		description: "Spatial validity remains readable; failure occurs at the resource relationship.",
		request: request({ balance: BASE_COST - 1 })
	},
	{
		id: "camera",
		label: "Camera gesture",
		description: "Orbit/zoom ownership suppresses false world-error feedback.",
		request: request({ inputOwner: "camera" })
	},
	{
		id: "stale",
		label: "Stale target",
		description: "Old target ownership tears down cleanly without charge or spatial error language.",
		request: request({ targetKind: "stale-target" })
	},
	{
		id: "upgrade",
		label: "Upgrade ready",
		description: "Existing tower remains the anchor and projected change reads as an upgrade.",
		request: request({
			targetKind: "tower",
			currentLevel: 1,
			requestedCost: BASE_COST * 2
		})
	},
	{
		id: "max-level",
		label: "Healthy maximum",
		description: "No-op max policy is explicit and cannot masquerade as a paid upgrade.",
		request: request({
			targetKind: "tower",
			currentLevel: 3,
			requestedCost: BASE_COST * 4,
			maxLevelBehavior: "no-op"
		})
	},
	{
		id: "maintenance",
		label: "Maintenance ready",
		description: "Service is represented as maintenance rather than an invented fourth upgrade tier.",
		request: request({
			targetKind: "tower",
			currentLevel: 3,
			requestedCost: BASE_COST * 2,
			maxLevelBehavior: "maintenance"
		})
	},
	{
		id: "invalid-cost",
		label: "Diagnostic fallback",
		description: "Malformed authority fails closed without inventing a misleading economy explanation.",
		request: request({ requestedCost: NaN })
	}
];

function patternMarkup(descriptor: TowerInteractionFeedbackDescriptor): string {
	if (descriptor.suppressed) {
		return '<div class="feedback-stage__suppressed">camera owns gesture</div>';
	}
	return `
		<div
			class="feedback-shape feedback-shape--${descriptor.pattern} feedback-shape--motion-${descriptor.motion}"
			data-pattern="${descriptor.pattern}"
			data-motion="${descriptor.motion}"
		>
			<span>${descriptor.anchor}</span>
		</div>
	`;
}

function scenarioCard(scenario: Scenario, args: FeedbackArgs): string {
	const preview = classifyTowerInteraction(scenario.request);
	const descriptor = towerInteractionFeedback(preview, {
		reducedMotion: args.reducedMotion,
		audioEnabled: args.audioEnabled
	});
	return `
		<article
			class="feedback-card"
			data-scenario="${scenario.id}"
			data-disposition="${preview.disposition}"
			data-reason="${preview.reason}"
			data-meaning="${descriptor.meaning}"
			data-anchor="${descriptor.anchor}"
			data-pattern="${descriptor.pattern}"
			data-motion="${descriptor.motion}"
			data-audio="${descriptor.audioCue}"
			data-suppressed="${descriptor.suppressed}"
		>
			<header>
				<small>${preview.disposition} · ${preview.reason}</small>
				<strong>${scenario.label}</strong>
			</header>
			<p>${scenario.description}</p>
			<div class="feedback-stage">${patternMarkup(descriptor)}</div>
			<dl>
				<div><dt>meaning</dt><dd>${descriptor.meaning}</dd></div>
				<div><dt>pattern</dt><dd>${descriptor.pattern}</dd></div>
				<div><dt>motion</dt><dd>${descriptor.motion}</dd></div>
				<div><dt>audio cue</dt><dd>${descriptor.audioCue}</dd></div>
				<div><dt>preview</dt><dd>${descriptor.showPreview ? "shown" : "hidden"}</dd></div>
				<div><dt>cost relation</dt><dd>${descriptor.showCostRelationship ? "shown" : "hidden"}</dd></div>
			</dl>
			<div class="feedback-announcement">${descriptor.announcement || "No world announcement"}</div>
		</article>
	`;
}

const meta = {
	title: "Arena/Interaction/Tower Feedback Grammar",
	tags: ["test", "visual"],
	args: {
		reducedMotion: false,
		audioEnabled: true,
		grayscale: false
	},
	argTypes: {
		reducedMotion: { control: "boolean" },
		audioEnabled: { control: "boolean" },
		grayscale: { control: "boolean" }
	},
	render: (args: FeedbackArgs) => {
		const shell = createLabShell(
			"Arena / interaction",
			"World-grounded interaction feedback grammar",
			"Authoritative #117 interaction previews are mapped downstream into distinct geometry, pattern, motion, audio-cue and announcement semantics. Color is only reinforcement; camera-owned gestures deliberately produce no world-error feedback."
		);

		shell.frame.innerHTML = `
			<style>
				.feedback-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:12px; ${args.grayscale ? "filter:grayscale(1);" : ""} }
				.feedback-card { padding:13px; border:1px solid rgba(244,237,247,.13); background:rgba(8,10,18,.48); }
				.feedback-card header { display:grid; gap:3px; }
				.feedback-card header small { opacity:.48; text-transform:uppercase; letter-spacing:.07em; font-size:9px; }
				.feedback-card p { min-height:50px; font-size:10px; line-height:1.45; opacity:.58; }
				.feedback-stage { min-height:112px; display:grid; place-items:center; margin:10px 0; border:1px solid rgba(244,237,247,.06); background:radial-gradient(circle,rgba(228,185,128,.045),transparent 62%); }
				.feedback-stage__suppressed { font-size:10px; letter-spacing:.06em; text-transform:uppercase; opacity:.42; }
				.feedback-shape { width:105px; height:72px; display:grid; place-items:center; border:2px solid rgba(228,185,128,.82); font-size:9px; text-transform:uppercase; letter-spacing:.06em; }
				.feedback-shape--solid { border-style:solid; }
				.feedback-shape--double { border-style:double; border-width:4px; }
				.feedback-shape--dashed { border-style:dashed; }
				.feedback-shape--hatch { background:repeating-linear-gradient(135deg,transparent 0 7px,rgba(244,237,247,.13) 7px 9px); }
				.feedback-shape--broken { border-style:dashed; transform:skew(-7deg); }
				.feedback-shape--clipped { clip-path:polygon(0 0,75% 0,100% 35%,75% 100%,0 100%); border-style:dashed; }
				.feedback-shape--service { border-style:double; border-radius:14px; background:repeating-linear-gradient(90deg,transparent 0 14px,rgba(244,237,247,.08) 14px 16px); }
				.feedback-shape--motion-compress { transform:scaleX(.88); }
				.feedback-shape--motion-repel { outline:1px solid rgba(244,237,247,.35); outline-offset:10px; }
				.feedback-shape--motion-pulse { box-shadow:0 0 0 7px rgba(228,185,128,.08); }
				.feedback-shape--motion-break { transform:skew(-7deg); }
				.feedback-shape--motion-fade { opacity:.48; }
				.feedback-shape--motion-service { outline:1px dashed rgba(244,237,247,.35); outline-offset:6px; }
				.feedback-card dl { display:grid; gap:3px; margin:0; font-size:9px; }
				.feedback-card dl div { display:grid; grid-template-columns:1fr auto; gap:8px; }
				.feedback-card dt { opacity:.46; }
				.feedback-card dd { margin:0; opacity:.78; }
				.feedback-announcement { margin-top:10px; min-height:28px; padding-top:8px; border-top:1px solid rgba(244,237,247,.08); font-size:10px; opacity:.72; }
			</style>
			<div class="feedback-grid">
				${SCENARIOS.map(scenario => scenarioCard(scenario, args)).join("")}
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<FeedbackArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemanticMatrix: Story = {
	play: async ({ canvasElement }) => {
		const occupied = canvasElement.querySelector<HTMLElement>('[data-scenario="occupied"]');
		const protectedCore = canvasElement.querySelector<HTMLElement>('[data-scenario="protected"]');
		const terrain = canvasElement.querySelector<HTMLElement>('[data-scenario="invalid-terrain"]');
		const boundary = canvasElement.querySelector<HTMLElement>('[data-scenario="outside-arena"]');
		const unaffordable = canvasElement.querySelector<HTMLElement>('[data-scenario="unaffordable"]');
		const camera = canvasElement.querySelector<HTMLElement>('[data-scenario="camera"]');
		const upgrade = canvasElement.querySelector<HTMLElement>('[data-scenario="upgrade"]');
		const maintenance = canvasElement.querySelector<HTMLElement>('[data-scenario="maintenance"]');
		const invalidCost = canvasElement.querySelector<HTMLElement>('[data-scenario="invalid-cost"]');

		await expect(occupied).not.toBeNull();
		await expect(protectedCore).not.toBeNull();
		await expect(terrain).not.toBeNull();
		await expect(boundary).not.toBeNull();
		await expect(unaffordable).not.toBeNull();
		await expect(camera).not.toBeNull();
		await expect(upgrade).not.toBeNull();
		await expect(maintenance).not.toBeNull();
		await expect(invalidCost).not.toBeNull();
		if (!occupied || !protectedCore || !terrain || !boundary || !unaffordable || !camera || !upgrade || !maintenance || !invalidCost) return;

		await expect(occupied.dataset.pattern).toBe("hatch");
		await expect(protectedCore.dataset.anchor).toBe("core");
		await expect(terrain.dataset.pattern).toBe("broken");
		await expect(boundary.dataset.pattern).toBe("clipped");
		await expect(unaffordable.dataset.meaning).toBe("resource-conflict");
		await expect(unaffordable.dataset.pattern).toBe("solid");
		await expect(camera.dataset.suppressed).toBe("true");
		await expect(camera.dataset.audio).toBe("none");
		await expect(upgrade.dataset.pattern).toBe("double");
		await expect(maintenance.dataset.pattern).toBe("service");
		await expect(invalidCost.dataset.meaning).toBe("diagnostic");
	}
};

export const ReducedMotion: Story = {
	args: {
		reducedMotion: true,
		audioEnabled: true,
		grayscale: true
	},
	play: async ({ canvasElement }) => {
		const cards = Array.from(canvasElement.querySelectorAll<HTMLElement>("[data-scenario]"));
		await expect(cards.length).toBe(SCENARIOS.length);
		for (let index = 0; index < cards.length; index += 1) {
			await expect(cards[index].dataset.motion).toBe("none");
		}
		const occupied = canvasElement.querySelector<HTMLElement>('[data-scenario="occupied"]');
		const terrain = canvasElement.querySelector<HTMLElement>('[data-scenario="invalid-terrain"]');
		await expect(occupied?.dataset.pattern).toBe("hatch");
		await expect(terrain?.dataset.pattern).toBe("broken");
	}
};
