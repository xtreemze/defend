import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyDirectManipulation,
	type DirectManipulationCandidate
} from "@defend/gameplay/directManipulation";
import {
	createDirectManipulationObservationState,
	recordDirectManipulationObservation,
	summarizeDirectManipulationObservations,
	type DirectManipulationInterventionKind,
	type DirectManipulationObservation,
	type DirectManipulationObservationSummary
} from "@defend/gameplay/directManipulationObservation";
import { createLabShell } from "../../labTheme";

function candidate(
	overrides: Partial<DirectManipulationCandidate> = {}
): DirectManipulationCandidate {
	return {
		targetKind: "ground",
		gestureOwner: "world",
		targetStale: false,
		terrainValid: true,
		occupied: false,
		protected: false,
		affordable: true,
		requiredEnergy: 3000,
		currentTowerLevel: null,
		maximumTowerLevel: 3,
		requestedTowerAction: "upgrade",
		maintenanceAvailable: false,
		...overrides
	};
}

function observation(
	atSeconds: number,
	input: DirectManipulationCandidate,
	interventionKind: DirectManipulationInterventionKind,
	cellKey: string | null,
	roleKey: string | null,
	tacticalContextKey: string
): DirectManipulationObservation {
	return {
		atSeconds,
		cellKey,
		roleKey,
		tacticalContextKey,
		interventionKind,
		outcome: classifyDirectManipulation(input)
	};
}

function summarizeSession(
	events: DirectManipulationObservation[]
): DirectManipulationObservationSummary {
	let state = createDirectManipulationObservationState(0);
	for (let index = 0; index < events.length; index += 1) {
		state = recordDirectManipulationObservation(state, events[index]);
	}
	return summarizeDirectManipulationObservations(state);
}

function legibleSession(): DirectManipulationObservationSummary {
	return summarizeSession([
		observation(
			1.2,
			candidate({ occupied: true }),
			"new-build",
			"cell-a",
			"barrier",
			"opening"
		),
		observation(
			2,
			candidate({ gestureOwner: "camera" }),
			"other",
			null,
			null,
			"opening"
		),
		observation(4.2, candidate(), "new-build", "cell-b", "barrier", "opening"),
		observation(26, candidate(), "replacement", "cell-b", "barrier", "opening"),
		observation(
			44,
			candidate(),
			"replacement",
			"cell-b",
			"barrier",
			"mixed-heavy-threat"
		),
		observation(
			48,
			candidate({
				targetKind: "tower",
				currentTowerLevel: 1,
				requiredEnergy: 6000
			}),
			"upgrade",
			"cell-b",
			"interceptor",
			"mixed-heavy-threat"
		)
	]);
}

function opaqueSession(): DirectManipulationObservationSummary {
	return summarizeSession([
		observation(1, candidate({ occupied: true }), "new-build", "cell-a", "barrier", "opening"),
		observation(3, candidate({ protected: true }), "new-build", "core", "barrier", "opening"),
		observation(5, candidate({ affordable: false }), "new-build", "cell-b", "barrier", "opening"),
		observation(8, candidate({ gestureOwner: "camera" }), "other", null, null, "opening"),
		observation(13, candidate(), "new-build", "cell-c", "barrier", "opening"),
		observation(30, candidate(), "replacement", "cell-c", "barrier", "opening"),
		observation(46, candidate(), "replacement", "cell-c", "barrier", "opening"),
		observation(62, candidate(), "replacement", "cell-c", "barrier", "opening")
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
	summary: DirectManipulationObservationSummary
): string {
	return `
		<article class="obs-card" data-session="${id}"
			data-first-build="${summary.timeToFirstBuildSeconds ?? -1}"
			data-rejections-before-build="${summary.rejectedBeforeFirstBuild}"
			data-camera-conflicts="${summary.cameraConflicts}"
			data-repeated="${summary.repeatedSameContextReplacements}"
			data-repetition-rate="${summary.repetitionRate}">
			<header><small>observation fixture</small><strong>${label}</strong></header>
			<div class="obs-metrics">
				<div><span>attempts</span><strong>${summary.attempts}</strong></div>
				<div><span>accepted</span><strong>${summary.acceptedActions}</strong></div>
				<div><span>rejected</span><strong>${summary.rejectedActions}</strong></div>
				<div><span>first build</span><strong>${fixed(summary.timeToFirstBuildSeconds)} s</strong></div>
				<div><span>rejects before build</span><strong>${summary.rejectedBeforeFirstBuild}</strong></div>
				<div><span>camera conflicts</span><strong>${summary.cameraConflicts}</strong></div>
				<div><span>same-context replacements</span><strong>${summary.repeatedSameContextReplacements} / ${summary.acceptedReplacements}</strong></div>
				<div><span>replacement repetition</span><strong>${fixed(summary.repetitionRate * 100, 0)}%</strong></div>
			</div>
			<footer>
				Rejections: occupied ${summary.rejectionCounts.occupied} · protected ${summary.rejectionCounts.protected} · resource ${summary.rejectionCounts.unaffordable} · camera ${summary.rejectionCounts.cameraOwned}
			</footer>
		</article>`;
}

const meta = {
	title: "Foundations/Interaction/Direct Manipulation Observation",
	tags: ["test", "visual"],
	render: () => {
		const legible = legibleSession();
		const opaque = opaqueSession();
		const shell = createLabShell(
			"Foundations / interaction",
			"First-build and maintenance observation",
			"Passive deterministic metrics for #108. The observer records already-resolved interaction outcomes plus coarse caller-owned cell/role/context identities. It never changes affordability, placement, camera arbitration, combat, or tower lifecycle."
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
			<div class="obs-note">The comparison is illustrative, not a production target. It demonstrates the evidence shape needed for first-build discoverability and the “input tax” maintenance gate: repeated replacement only counts as rote when cell, role, and caller-defined tactical context remain the same.</div>
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
		await expect(Number(legible.dataset.rejectionsBeforeBuild)).toBe(2);
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
