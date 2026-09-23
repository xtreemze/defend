import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyTowerInteraction,
	type TowerInteractionRequest
} from "@defend/gameplay/towerInteraction";
import {
	createTowerInteractionObservationState,
	recordTowerInteractionObservation,
	summarizeTowerInteractionObservations,
	type TowerInteractionInterventionKind,
	type TowerInteractionObservation,
	type TowerInteractionObservationSummary
} from "@defend/gameplay/towerInteractionObservation";
import { createLabShell } from "../../labTheme";

function request(
	overrides: Partial<TowerInteractionRequest> = {}
): TowerInteractionRequest {
	return {
		inputOwner: "world",
		targetKind: "ground",
		occupied: false,
		balance: 10000,
		requestedCost: 3000,
		currentLevel: 0,
		maximumLevel: 3,
		affordabilityRule: "legacy-strict",
		maxLevelBehavior: "no-op",
		...overrides
	};
}

function observation(
	atSeconds: number,
	input: TowerInteractionRequest,
	interventionKind: TowerInteractionInterventionKind,
	cellKey: string | null,
	roleKey: string | null,
	tacticalContextKey: string
): TowerInteractionObservation {
	return {
		atSeconds,
		cellKey,
		roleKey,
		tacticalContextKey,
		interventionKind,
		preview: classifyTowerInteraction(input)
	};
}

function summarizeSession(
	events: TowerInteractionObservation[]
): TowerInteractionObservationSummary {
	let state = createTowerInteractionObservationState(0);
	for (let index = 0; index < events.length; index += 1) {
		state = recordTowerInteractionObservation(state, events[index]);
	}
	return summarizeTowerInteractionObservations(state);
}

function legibleSession(): TowerInteractionObservationSummary {
	return summarizeSession([
		observation(
			1.2,
			request({ occupied: true }),
			"new-build",
			"cell-a",
			"barrier",
			"opening"
		),
		observation(
			2,
			request({ inputOwner: "camera" }),
			"other",
			null,
			null,
			"opening"
		),
		observation(4.2, request(), "new-build", "cell-b", "barrier", "opening"),
		observation(26, request(), "replacement", "cell-b", "barrier", "opening"),
		observation(
			44,
			request(),
			"replacement",
			"cell-b",
			"barrier",
			"mixed-heavy-threat"
		),
		observation(
			48,
			request({
				targetKind: "tower",
				currentLevel: 1,
				requestedCost: 6000
			}),
			"upgrade",
			"cell-b",
			"interceptor",
			"mixed-heavy-threat"
		)
	]);
}

function opaqueSession(): TowerInteractionObservationSummary {
	return summarizeSession([
		observation(1, request({ occupied: true }), "new-build", "cell-a", "barrier", "opening"),
		observation(
			3,
			request({ targetKind: "protected-core" }),
			"new-build",
			"core",
			"barrier",
			"opening"
		),
		observation(5, request({ balance: 1000 }), "new-build", "cell-b", "barrier", "opening"),
		observation(8, request({ inputOwner: "camera" }), "other", null, null, "opening"),
		observation(13, request(), "new-build", "cell-c", "barrier", "opening"),
		observation(30, request(), "replacement", "cell-c", "barrier", "opening"),
		observation(46, request(), "replacement", "cell-c", "barrier", "opening"),
		observation(62, request(), "replacement", "cell-c", "barrier", "opening")
	]);
}

function fixed(value: number | null, digits = 1): string {
	if (value === null || value !== value || value === Infinity || value === -Infinity) {
		return "—";
	}
	return value.toFixed(digits);
}

function sessionCard(
	id: string,
	label: string,
	summary: TowerInteractionObservationSummary
): string {
	return `
		<article class="obs-card" data-session="${id}"
			data-first-build="${summary.timeToFirstBuildSeconds ?? -1}"
			data-rejections-before-build="${summary.rejectedBeforeFirstBuild}"
			data-ignored-before-build="${summary.ignoredBeforeFirstBuild}"
			data-camera-conflicts="${summary.cameraConflicts}"
			data-repeated="${summary.repeatedSameContextReplacements}"
			data-repetition-rate="${summary.repetitionRate}">
			<header><small>observation fixture</small><strong>${label}</strong></header>
			<div class="obs-metrics">
				<div><span>attempts</span><strong>${summary.attempts}</strong></div>
				<div><span>allowed</span><strong>${summary.allowedActions}</strong></div>
				<div><span>rejected</span><strong>${summary.rejectedActions}</strong></div>
				<div><span>ignored</span><strong>${summary.ignoredActions}</strong></div>
				<div><span>first build</span><strong>${fixed(summary.timeToFirstBuildSeconds)} s</strong></div>
				<div><span>rejects before build</span><strong>${summary.rejectedBeforeFirstBuild}</strong></div>
				<div><span>camera conflicts</span><strong>${summary.cameraConflicts}</strong></div>
				<div><span>same-context replacements</span><strong>${summary.repeatedSameContextReplacements} / ${summary.acceptedReplacements}</strong></div>
				<div><span>replacement repetition</span><strong>${fixed(summary.repetitionRate * 100, 0)}%</strong></div>
			</div>
			<footer>
				Reasons: occupied ${summary.reasonCounts.occupied} · protected ${summary.reasonCounts.protectedCore} · resource ${summary.reasonCounts.unaffordable} · camera ${summary.reasonCounts.cameraGesture}
			</footer>
		</article>`;
}

const meta = {
	title: "Arena/Interaction/Tower Observation",
	tags: ["test", "visual"],
	render: () => {
		const legible = legibleSession();
		const opaque = opaqueSession();
		const shell = createLabShell(
			"Arena / interaction",
			"First-build and maintenance observation",
			"Passive metrics downstream of #117's explicit interaction preview. Camera-owned gestures remain ignored rather than being mislabeled as gameplay rejections; all attempts still contribute to first-build discoverability evidence."
		);
		shell.frame.innerHTML = `
			<style>
				.obs-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:14px; }
				.obs-card { padding:14px; border:1px solid rgba(228,185,128,.2); background:rgba(10,3,17,.42); }
				.obs-card header { display:grid; gap:3px; margin-bottom:12px; }
				.obs-card header small { opacity:.45; text-transform:uppercase; letter-spacing:.08em; font-size:9px; }
				.obs-metrics { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
				.obs-metrics div { border-top:1px solid rgba(244,237,247,.08); padding-top:7px; }
				.obs-metrics span { display:block; font-size:9px; opacity:.48; text-transform:uppercase; }
				.obs-metrics strong { display:block; margin-top:3px; font-size:13px; }
				.obs-card footer { margin-top:12px; font-size:10px; opacity:.58; line-height:1.5; }
				.obs-note { margin-top:13px; border:1px dashed rgba(244,237,247,.16); padding:11px; font-size:10px; line-height:1.55; opacity:.68; }
			</style>
			<div class="obs-grid">
				${sessionCard("legible", "Legible first contact", legible)}
				${sessionCard("opaque", "High-friction / rote maintenance", opaque)}
			</div>
			<div class="obs-note">These are evidence-shape examples, not UX targets. Same-cell replacement only becomes an input-tax signal when the semantic role and caller-owned tactical-context fingerprint also remain unchanged.</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComprehensionMetrics: Story = {
	play: async ({ canvasElement }) => {
		const legible = canvasElement.querySelector<HTMLElement>(
			'[data-session="legible"]'
		);
		const opaque = canvasElement.querySelector<HTMLElement>(
			'[data-session="opaque"]'
		);
		await expect(legible).not.toBeNull();
		await expect(opaque).not.toBeNull();
		if (!legible || !opaque) return;

		await expect(Number(legible.dataset.firstBuild)).toBeCloseTo(4.2, 8);
		await expect(Number(legible.dataset.rejectionsBeforeBuild)).toBe(1);
		await expect(Number(legible.dataset.ignoredBeforeBuild)).toBe(1);
		await expect(Number(legible.dataset.cameraConflicts)).toBe(1);
		await expect(Number(legible.dataset.repeated)).toBe(1);
		await expect(Number(legible.dataset.repetitionRate)).toBeCloseTo(0.5, 8);

		await expect(Number(opaque.dataset.firstBuild)).toBeGreaterThan(
			Number(legible.dataset.firstBuild)
		);
		await expect(Number(opaque.dataset.rejectionsBeforeBuild)).toBeGreaterThan(
			Number(legible.dataset.rejectionsBeforeBuild)
		);
		await expect(Number(opaque.dataset.repetitionRate)).toBeGreaterThan(
			Number(legible.dataset.repetitionRate)
		);
	}
};
