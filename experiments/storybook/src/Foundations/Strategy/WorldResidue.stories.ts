import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	appendWorldResidueEvent,
	buildWorldResidueState,
	createWorldResidueState,
	summarizeWorldResidue,
	type WorldResidueEvent,
	type WorldResidueState,
	type WorldResidueSummary
} from "@defend/gameplay/worldResidue";
import { createLabShell } from "../../labTheme";

type HistoryFixture = {
	id: string;
	label: string;
	description: string;
	state: WorldResidueState;
	summary: WorldResidueSummary;
};

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

function repeatedHeavyFire(): WorldResidueEvent[] {
	const events: WorldResidueEvent[] = [];
	for (let index = 0; index < 10; index += 1) {
		events.push(
			event(
				`heavy-${index}`,
				index % 2 === 0 ? "east-approach" : "north-east-approach",
				index % 3 === 0 ? "heavy-impact" : "minor-impact",
				12 + index * 4,
				index % 3 === 0 ? 0.5 : 0.24,
				true
			)
		);
	}
	return events;
}

function fixture(
	id: string,
	label: string,
	description: string,
	events: WorldResidueEvent[]
): HistoryFixture {
	const state = buildWorldResidueState(events, { maxRecords: 12 });
	return { id, label, description, state, summary: summarizeWorldResidue(state) };
}

function fixtures(): HistoryFixture[] {
	return [
		fixture("pristine", "Pristine", "No consequential history has accumulated yet.", []),
		fixture(
			"contested",
			"Repeated heavy fire",
			"The same approaches have absorbed repeated projectile impacts and now read as contested terrain.",
			repeatedHeavyFire()
		),
		fixture(
			"crash",
			"Failed mothership",
			"A large embodied commitment lost lift and remained as a recognizable landmark after impact.",
			[
				event("hulk-alpha", "west-edge", "mothership-hulk", 42, 0.96, true),
				event("crash-impact", "west-edge", "heavy-impact", 42.2, 0.9, true),
				event("secondary-impact", "west-approach", "heavy-impact", 42.4, 0.58, true)
			]
		),
		fixture(
			"eruption",
			"Geothermal exhaustion",
			"Sustained draw and eruption leave a geological history distinct from ordinary weapon impacts.",
			[
				event("dry-source", "south-source", "geothermal-depletion", 22, 0.7, true),
				event("eruption-main", "south-source", "eruption", 38, 0.92, true),
				event("eruption-edge", "south-approach", "eruption", 39, 0.46, false)
			]
		),
		fixture(
			"extracted",
			"Recently extracted",
			"The geometry is familiar, but the target carries a visible economic aftermath rather than only a lower hidden number.",
			[
				event("extraction-main", "core", "extraction-depletion", 55, 0.88, true),
				event("breach-impact", "core-approach", "minor-impact", 54.5, 0.28, true)
			]
		),
		fixture(
			"abandoned",
			"Abandoned fortress",
			"The defended system has changed lifecycle state, leaving recognizable rooted infrastructure behind.",
			[
				event("fortress-origin", "core", "fortress-remnant", 72, 0.95, true),
				event("dry-source", "north-source", "geothermal-depletion", 70, 0.62, true),
				event("old-impact", "east-approach", "minor-impact", 31, 0.22, false)
			]
		)
	];
}

function stressHistory(): WorldResidueState {
	let state = createWorldResidueState();
	for (let index = 0; index < 180; index += 1) {
		const familyIndex = index % 4;
		const kind: WorldResidueEvent["kind"] =
			familyIndex === 0
				? "minor-impact"
				: familyIndex === 1
					? "heavy-impact"
					: familyIndex === 2
						? "geothermal-depletion"
						: "extraction-depletion";
		state = appendWorldResidueEvent(
			state,
			event(
				`stress-${index}`,
				`region-${index % 18}`,
				kind,
				index * 3,
				0.08 + (index % 7) * 0.06,
				index % 5 === 0
			),
			{ maxRecords: 6 }
		);
	}
	state = appendWorldResidueEvent(
		state,
		event("late-hulk", "far-edge", "mothership-hulk", 800, 0.98, true),
		{ maxRecords: 6 }
	);
	return state;
}

function familyMarks(history: HistoryFixture): string {
	if (history.state.records.length === 0) {
		return `<span class="residue-empty">No residue</span>`;
	}
	return history.state.records
		.map(record => {
			const short =
				record.family === "impact"
					? "impact"
					: record.family === "wreck"
						? "hulk"
						: record.family === "fortress"
							? "remnant"
							: record.family === "geology"
								? "geology"
								: "depletion";
			return `<span class="residue-mark residue-mark--${record.family}" style="opacity:${Math.max(0.35, record.intensity)}" title="${record.regionId}: ${record.dominantKind} (${record.eventCount} event${record.eventCount === 1 ? "" : "s"})">${short}</span>`;
		})
		.join("");
}

function signature(summary: WorldResidueSummary): string {
	return [
		summary.hasWreckHistory ? "wreck" : "-",
		summary.hasFortressRemnant ? "fortress" : "-",
		summary.impactIntensity.toFixed(2),
		summary.geologyIntensity.toFixed(2),
		summary.energyIntensity.toFixed(2)
	].join("|");
}

function historyCard(history: HistoryFixture): string {
	const summary = history.summary;
	return `
		<article class="residue-card" data-history="${history.id}" data-signature="${signature(summary)}" data-impact="${summary.impactIntensity}" data-geology="${summary.geologyIntensity}" data-energy="${summary.energyIntensity}" data-hulk="${summary.hasMothershipHulk}" data-fortress="${summary.hasFortressRemnant}">
			<header>
				<small>same arena · different past</small>
				<h3>${history.label}</h3>
			</header>
			<div class="residue-arena" aria-label="Compressed physical history for ${history.label}">
				<div class="residue-core">core</div>
				<div class="residue-marks">${familyMarks(history)}</div>
			</div>
			<p>${history.description}</p>
			<dl class="residue-metrics">
				<div><dt>represented events</dt><dd>${summary.representedEventCount}</dd></div>
				<div><dt>records</dt><dd>${summary.recordCount}</dd></div>
				<div><dt>impact</dt><dd>${summary.impactIntensity.toFixed(2)}</dd></div>
				<div><dt>geology</dt><dd>${summary.geologyIntensity.toFixed(2)}</dd></div>
				<div><dt>energy aftermath</dt><dd>${summary.energyIntensity.toFixed(2)}</dd></div>
			</dl>
		</article>
	`;
}

const meta = {
	title: "Foundations/Strategy/World Residue",
	tags: ["test", "visual", "experimental"],
	render: () => {
		const histories = fixtures();
		const stress = stressHistory();
		const stressSummary = summarizeWorldResidue(stress);
		const shell = createLabShell(
			"Foundations / strategy",
			"World history without a history log",
			"Compare one identical abstract arena after different systemic histories. The experiment tests whether consequential events can leave bounded, lossy, causally meaningful residue rather than disappearing into score text or unbounded debris."
		);

		shell.frame.innerHTML = `
			<style>
				.residue-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:14px; }
				.residue-card { border:1px solid rgba(244,237,247,.14); border-radius:12px; padding:14px; background:rgba(12,7,18,.48); display:grid; gap:10px; }
				.residue-card header small { opacity:.5; letter-spacing:.08em; text-transform:uppercase; }
				.residue-card h3 { margin:3px 0 0; font-size:17px; }
				.residue-card p { margin:0; opacity:.68; min-height:3.2em; line-height:1.45; }
				.residue-arena { position:relative; min-height:126px; border:1px solid rgba(244,237,247,.12); border-radius:10px; overflow:hidden; background:repeating-linear-gradient(0deg,transparent 0 24px,rgba(244,237,247,.035) 24px 25px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(244,237,247,.035) 24px 25px); }
				.residue-core { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:52px; height:34px; display:grid; place-items:center; border:2px solid currentColor; opacity:.55; font-size:10px; text-transform:uppercase; letter-spacing:.08em; }
				.residue-marks { position:absolute; inset:8px; display:flex; align-content:flex-start; align-items:flex-start; flex-wrap:wrap; gap:5px; pointer-events:none; }
				.residue-mark,.residue-empty { padding:3px 6px; border:1px solid currentColor; border-radius:999px; font-size:9px; text-transform:uppercase; letter-spacing:.07em; background:rgba(8,4,12,.76); }
				.residue-mark--wreck { border-style:double; border-width:3px; }
				.residue-mark--fortress { border-radius:2px; border-style:double; }
				.residue-mark--impact { border-style:dashed; }
				.residue-mark--geology { border-style:dotted; }
				.residue-mark--energy { border-left-width:5px; }
				.residue-empty { opacity:.3; border-style:dashed; }
				.residue-metrics { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px 12px; margin:0; }
				.residue-metrics div { display:flex; justify-content:space-between; gap:8px; }
				.residue-metrics dt { opacity:.5; }
				.residue-metrics dd { margin:0; font-variant-numeric:tabular-nums; }
				.residue-stress { margin-top:14px; padding:14px; border:1px solid rgba(244,237,247,.14); border-radius:12px; }
				.residue-stress strong { font-variant-numeric:tabular-nums; }
			</style>
			<div class="residue-grid">${histories.map(historyCard).join("")}</div>
			<section class="residue-stress" data-stress-records="${stressSummary.recordCount}" data-stress-compacted="${stressSummary.compactedEventCount}" data-stress-events="${stressSummary.representedEventCount}" data-stress-hulk="${stressSummary.hasMothershipHulk}">
				<strong>Compaction stress:</strong>
				180+ deterministic events are represented by ${stressSummary.recordCount} live semantic records plus a fixed-size compacted summary; ${stressSummary.compactedEventCount} event histories have already been folded out of detailed records. A late major hulk remains explicit: ${stressSummary.hasMothershipHulk ? "yes" : "no"}.
			</section>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DifferentHistories: Story = {
	play: async ({ canvasElement }) => {
		const cards = Array.from(canvasElement.querySelectorAll<HTMLElement>("[data-history]"));
		await expect(cards.length).toBe(6);
		const signatures = cards.map(card => card.dataset.signature || "");
		await expect(new Set(signatures).size).toBe(6);

		const pristine = canvasElement.querySelector<HTMLElement>("[data-history='pristine']");
		const contested = canvasElement.querySelector<HTMLElement>("[data-history='contested']");
		const crash = canvasElement.querySelector<HTMLElement>("[data-history='crash']");
		const eruption = canvasElement.querySelector<HTMLElement>("[data-history='eruption']");
		const extracted = canvasElement.querySelector<HTMLElement>("[data-history='extracted']");
		const abandoned = canvasElement.querySelector<HTMLElement>("[data-history='abandoned']");
		await expect(pristine).not.toBeNull();
		await expect(contested).not.toBeNull();
		await expect(crash).not.toBeNull();
		await expect(eruption).not.toBeNull();
		await expect(extracted).not.toBeNull();
		await expect(abandoned).not.toBeNull();
		if (!pristine || !contested || !crash || !eruption || !extracted || !abandoned) return;
		await expect(Number(pristine.dataset.impact)).toBe(0);
		await expect(Number(contested.dataset.impact)).toBeGreaterThan(0.72);
		await expect(crash.dataset.hulk).toBe("true");
		await expect(Number(eruption.dataset.geology)).toBeGreaterThan(0.8);
		await expect(Number(extracted.dataset.energy)).toBeGreaterThan(0.8);
		await expect(abandoned.dataset.fortress).toBe("true");

		const stress = canvasElement.querySelector<HTMLElement>("[data-stress-records]");
		await expect(stress).not.toBeNull();
		if (!stress) return;
		await expect(Number(stress.dataset.stressRecords)).toBeLessThanOrEqual(6);
		await expect(Number(stress.dataset.stressCompacted)).toBeGreaterThan(0);
		await expect(Number(stress.dataset.stressEvents)).toBe(181);
		await expect(stress.dataset.stressHulk).toBe("true");
	}
};
