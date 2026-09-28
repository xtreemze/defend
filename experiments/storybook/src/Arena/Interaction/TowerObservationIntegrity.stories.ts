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
	type TowerInteractionObservation,
	type TowerInteractionObservationState
} from "@defend/gameplay/towerInteractionObservation";
import { createLabShell } from "../../labTheme";

function request(): TowerInteractionRequest {
	return {
		inputOwner: "world",
		targetKind: "ground",
		occupied: false,
		balance: 10000,
		requestedCost: 3000,
		currentLevel: 0,
		maximumLevel: 3,
		affordabilityRule: "legacy-strict",
		maxLevelBehavior: "no-op"
	};
}

function observation(atSeconds: number): TowerInteractionObservation {
	return {
		atSeconds,
		cellKey: "cell-a",
		roleKey: "barrier",
		tacticalContextKey: "opening",
		interventionKind: "new-build",
		preview: classifyTowerInteraction(request())
	};
}

const meta = {
	title: "Arena/Interaction/Tower Observation Integrity",
	tags: ["test", "visual"],
	render: () => {
		let state = createTowerInteractionObservationState(0);
		state = recordTowerInteractionObservation(state, observation(4));
		state = recordTowerInteractionObservation(state, observation(2));
		state = recordTowerInteractionObservation(state, observation(NaN));
		const summary = summarizeTowerInteractionObservations(state);
		const shell = createLabShell(
			"Arena / interaction",
			"Observation evidence integrity",
			"Malformed or non-monotonic timestamps fail closed instead of being silently moved forward into first-build or maintenance evidence. Persisted/corrupt counters are sanitized before rates are calculated."
		);

		shell.frame.innerHTML = `
			<style>
				.integrity-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:10px; }
				.integrity-card { padding:13px; border:1px solid rgba(244,237,247,.12); background:rgba(8,10,18,.48); }
				.integrity-card span { display:block; font-size:9px; opacity:.48; text-transform:uppercase; }
				.integrity-card strong { display:block; margin-top:4px; font-size:16px; }
			</style>
			<div class="integrity-grid">
				<div class="integrity-card" data-attempts="${summary.attempts}"><span>valid attempts</span><strong>${summary.attempts}</strong></div>
				<div class="integrity-card" data-invalid="${summary.invalidObservations}"><span>invalid observations</span><strong>${summary.invalidObservations}</strong></div>
				<div class="integrity-card" data-nonmonotonic="${summary.nonMonotonicObservations}"><span>non-monotonic</span><strong>${summary.nonMonotonicObservations}</strong></div>
				<div class="integrity-card" data-first-build="${summary.timeToFirstBuildSeconds ?? -1}"><span>first build</span><strong>${summary.timeToFirstBuildSeconds ?? "—"} s</strong></div>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InvalidEvidenceFailsClosed: Story = {
	play: async ({ canvasElement }) => {
		const attempts = canvasElement.querySelector<HTMLElement>("[data-attempts]");
		const invalid = canvasElement.querySelector<HTMLElement>("[data-invalid]");
		const nonmonotonic = canvasElement.querySelector<HTMLElement>("[data-nonmonotonic]");
		const firstBuild = canvasElement.querySelector<HTMLElement>("[data-first-build]");
		await expect(attempts?.dataset.attempts).toBe("1");
		await expect(invalid?.dataset.invalid).toBe("2");
		await expect(nonmonotonic?.dataset.nonmonotonic).toBe("1");
		await expect(firstBuild?.dataset.firstBuild).toBe("4");

		const malformed = {
			startedAtSeconds: 0,
			lastObservedAtSeconds: 20,
			attempts: 2,
			allowedActions: Infinity,
			rejectedActions: NaN,
			ignoredActions: 99,
			invalidObservations: NaN,
			nonMonotonicObservations: Infinity,
			cameraConflicts: 99,
			rejectedBeforeFirstBuild: Infinity,
			ignoredBeforeFirstBuild: 99,
			firstAllowedAtSeconds: Infinity,
			firstBuildAtSeconds: -5,
			acceptedReplacements: 99,
			repeatedSameContextReplacements: 99,
			reasonCounts: undefined,
			lastAcceptedContexts: undefined
		} as unknown as TowerInteractionObservationState;
		const sanitized = summarizeTowerInteractionObservations(malformed);
		await expect(Number.isFinite(sanitized.allowanceRate)).toBe(true);
		await expect(sanitized.allowanceRate).toBeGreaterThanOrEqual(0);
		await expect(sanitized.allowanceRate).toBeLessThanOrEqual(1);
		await expect(sanitized.repetitionRate).toBeGreaterThanOrEqual(0);
		await expect(sanitized.repetitionRate).toBeLessThanOrEqual(1);
		await expect(sanitized.timeToFirstAllowedSeconds).toBeNull();
		await expect(sanitized.timeToFirstBuildSeconds).toBeNull();
		await expect(sanitized.reasonCounts.occupied).toBe(0);
	}
};
