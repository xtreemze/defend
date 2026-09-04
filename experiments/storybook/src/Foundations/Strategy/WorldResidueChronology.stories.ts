import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	appendWorldResidueEvent,
	buildWorldResidueState,
	createWorldResidueState,
	summarizeWorldResidue,
	type WorldResidueEvent,
	type WorldResidueState
} from "@defend/gameplay/worldResidue";
import { createLabShell } from "../../labTheme";

function event(
	id: string,
	regionId: string,
	kind: WorldResidueEvent["kind"],
	occurredAtSeconds: number,
	magnitude: number,
	gameplayConsequence = false
): WorldResidueEvent {
	return { id, regionId, kind, occurredAtSeconds, magnitude, gameplayConsequence };
}

const EVENT_SET: WorldResidueEvent[] = [
	event("old-impact-a", "east", "minor-impact", 12, 0.18),
	event("old-impact-b", "north", "heavy-impact", 18, 0.48, true),
	event("dry-source", "south", "geothermal-depletion", 33, 0.6, true),
	event("extracted", "core", "extraction-depletion", 47, 0.72, true),
	event("equal-b", "west", "minor-impact", 60, 0.2),
	event("equal-a", "west", "heavy-impact", 60, 0.2),
	event("late-hulk", "far-edge", "mothership-hulk", 95, 0.98, true),
	event("fortress", "core", "fortress-remnant", 110, 0.94, true)
];

function reversed<T>(items: T[]): T[] {
	return items.slice().reverse();
}

function interleavedEvents(): WorldResidueEvent[] {
	return [
		EVENT_SET[6],
		EVENT_SET[1],
		EVENT_SET[4],
		EVENT_SET[0],
		EVENT_SET[7],
		EVENT_SET[3],
		EVENT_SET[5],
		EVENT_SET[2]
	];
}

function replayFingerprint(state: WorldResidueState): string {
	return JSON.stringify({
		records: state.records,
		compacted: state.compacted,
		latestOccurredAtSeconds: state.latestOccurredAtSeconds
	});
}

const meta = {
	title: "Foundations/Strategy/World Residue Chronology",
	tags: ["test", "visual", "experimental"],
	render: () => {
		const chronological = buildWorldResidueState(EVENT_SET, { maxRecords: 4 });
		const reverseReplay = buildWorldResidueState(reversed(EVENT_SET), {
			maxRecords: 4
		});
		const interleavedReplay = buildWorldResidueState(interleavedEvents(), {
			maxRecords: 4
		});
		const summary = summarizeWorldResidue(chronological);
		const shell = createLabShell(
			"Foundations / strategy",
			"Residue replay chronology",
			"Bounded live state keeps a monotonic newest-known world time. Full reconstruction sorts the semantic event set deterministically before compaction, so reload/replay does not depend on source-array ingestion order."
		);
		shell.frame.innerHTML = `
			<style>
				.replay-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
				.replay-card { padding:12px; border:1px solid rgba(244,237,247,.14); background:rgba(12,7,18,.48); }
				.replay-card small { opacity:.48; text-transform:uppercase; letter-spacing:.06em; }
				.replay-card strong { display:block; margin:4px 0 10px; }
				.replay-card dl { display:grid; grid-template-columns:1fr auto; gap:5px 9px; margin:0; font-size:9px; }
				.replay-card dd { margin:0; font-variant-numeric:tabular-nums; }
				.replay-note { margin-top:12px; font-size:10px; line-height:1.5; opacity:.58; }
				@media (max-width:760px) { .replay-grid { grid-template-columns:1fr; } }
			</style>
			<div class="replay-grid">
				${[
					["chronological", "Chronological input", chronological],
					["reverse", "Reverse source order", reverseReplay],
					["interleaved", "Interleaved source order", interleavedReplay]
				]
					.map(entry => {
						const id = entry[0] as string;
						const label = entry[1] as string;
						const state = entry[2] as WorldResidueState;
						return `<article class="replay-card" data-replay="${id}" data-fingerprint="${replayFingerprint(state).replace(/"/g, "&quot;")}"><small>same semantic event set</small><strong>${label}</strong><dl><dt>live records</dt><dd>${state.records.length}</dd><dt>compacted events</dt><dd>${state.compacted.totalEvents}</dd><dt>latest world time</dt><dd>${state.latestOccurredAtSeconds.toFixed(0)} s</dd><dt>represented events</dt><dd>${summarizeWorldResidue(state).representedEventCount}</dd></dl></article>`;
					})
					.join("")}
			</div>
			<div class="replay-note">All three reconstructions resolve to one bounded history (${summary.representedEventCount} represented events). Live append still cannot retroactively recover records already compacted before a backfilled event arrives; that limitation is explicit rather than hidden behind timestamp rewrites.</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReplayIsDeterministic: Story = {
	play: async ({ canvasElement }) => {
		const chronological = buildWorldResidueState(EVENT_SET, { maxRecords: 4 });
		const reverseReplay = buildWorldResidueState(reversed(EVENT_SET), {
			maxRecords: 4
		});
		const interleavedReplay = buildWorldResidueState(interleavedEvents(), {
			maxRecords: 4
		});
		const expected = replayFingerprint(chronological);
		await expect(replayFingerprint(reverseReplay)).toBe(expected);
		await expect(replayFingerprint(interleavedReplay)).toBe(expected);
		await expect(chronological.latestOccurredAtSeconds).toBe(110);
		await expect(summarizeWorldResidue(chronological).representedEventCount).toBe(
			EVENT_SET.length
		);

		let live = createWorldResidueState();
		live = appendWorldResidueEvent(
			live,
			event("newest", "core", "extraction-depletion", 100, 0.7, true),
			{ maxRecords: 2 }
		);
		live = appendWorldResidueEvent(
			live,
			event("backfill", "old-edge", "minor-impact", 10, 0.2, false),
			{ maxRecords: 2 }
		);
		await expect(live.latestOccurredAtSeconds).toBe(100);
		await expect(summarizeWorldResidue(live).representedEventCount).toBe(2);

		const runtimeMalformed = appendWorldResidueEvent(
			createWorldResidueState(),
			event(
				"runtime-malformed",
				"edge",
				"minor-impact",
				undefined as unknown as number,
				undefined as unknown as number
			)
		);
		await expect(Number.isFinite(runtimeMalformed.latestOccurredAtSeconds)).toBe(
			true
		);
		await expect(Number.isFinite(runtimeMalformed.records[0].intensity)).toBe(true);

		await expect(canvasElement.querySelectorAll("[data-replay]").length).toBe(3);
	}
};
