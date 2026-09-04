import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	classifyDirectManipulation,
	type DirectManipulationCandidate,
	type DirectManipulationOutcome
} from "@defend/gameplay/directManipulation";
import { createLabShell } from "../../labTheme";

type Scenario = {
	id: string;
	label: string;
	candidate: DirectManipulationCandidate;
};

function baseCandidate(): DirectManipulationCandidate {
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
		maintenanceAvailable: false
	};
}

function scenarios(): Scenario[] {
	const validPlace = baseCandidate();
	const unaffordable = { ...baseCandidate(), affordable: false };
	const occupied = { ...baseCandidate(), occupied: true };
	const protectedCell = { ...baseCandidate(), protected: true };
	const invalidTerrain = { ...baseCandidate(), terrainValid: false };
	const cameraOwned = { ...baseCandidate(), gestureOwner: "camera" as const };
	const stale = { ...baseCandidate(), targetStale: true };
	const validUpgrade = {
		...baseCandidate(),
		targetKind: "tower" as const,
		currentTowerLevel: 2,
		requiredEnergy: 9000
	};
	const maximum = {
		...validUpgrade,
		currentTowerLevel: 3,
		affordable: false
	};
	const service = {
		...validUpgrade,
		requestedTowerAction: "maintenance" as const,
		maintenanceAvailable: true,
		requiredEnergy: 1200
	};
	const noService = {
		...service,
		maintenanceAvailable: false
	};

	return [
		{ id: "place", label: "Valid placement", candidate: validPlace },
		{ id: "resource", label: "Unaffordable", candidate: unaffordable },
		{ id: "occupied", label: "Occupied cell", candidate: occupied },
		{ id: "protected", label: "Protected/core cell", candidate: protectedCell },
		{ id: "terrain", label: "Invalid terrain", candidate: invalidTerrain },
		{ id: "camera", label: "Camera gesture owns input", candidate: cameraOwned },
		{ id: "stale", label: "Stale/disposed target", candidate: stale },
		{ id: "upgrade", label: "Valid upgrade", candidate: validUpgrade },
		{ id: "maximum", label: "Maximum tower state", candidate: maximum },
		{ id: "service", label: "Maintenance available", candidate: service },
		{ id: "no-service", label: "No service needed", candidate: noService }
	];
}

function glyph(outcome: DirectManipulationOutcome): string {
	if (outcome.accepted && outcome.action === "place") return "+";
	if (outcome.accepted && outcome.action === "upgrade") return "↑";
	if (outcome.accepted && outcome.action === "maintenance") return "↻";
	if (outcome.rejectionReason === "unaffordable") return "$";
	if (outcome.rejectionReason === "occupied") return "■";
	if (outcome.rejectionReason === "protected") return "×";
	if (outcome.rejectionReason === "invalid-terrain") return "∿";
	if (outcome.rejectionReason === "maximum-state") return "III";
	if (outcome.rejectionReason === "no-service-needed") return "=";
	if (outcome.rejectionReason === "camera-owned") return "↔";
	if (outcome.rejectionReason === "stale-target") return "…";
	return "?";
}

function card(scenario: Scenario): string {
	const outcome = classifyDirectManipulation(scenario.candidate);
	const status = outcome.accepted ? "accepted" : "rejected";
	const reason = outcome.rejectionReason;
	const resultLevel =
		outcome.resultingTowerLevel === null ? "—" : String(outcome.resultingTowerLevel);
	return `
		<article class="dm-card dm-card--${outcome.cueFamily}"
			data-scenario="${scenario.id}"
			data-status="${status}"
			data-action="${outcome.action}"
			data-reason="${reason}"
			data-cue="${outcome.cueFamily}"
			aria-label="${scenario.label}: ${status}${reason === "none" ? "" : `, ${reason}`}"
		>
			<div class="dm-footprint"><span aria-hidden="true">${glyph(outcome)}</span></div>
			<div class="dm-copy">
				<strong>${scenario.label}</strong>
				<small>${outcome.accepted ? `${outcome.action} accepted` : reason.replace(/-/g, " ")}</small>
			</div>
			<dl>
				<div><dt>energy</dt><dd>${outcome.requiredEnergy}</dd></div>
				<div><dt>result tier</dt><dd>${resultLevel}</dd></div>
				<div><dt>residue</dt><dd>${outcome.residue.replace(/-/g, " ")}</dd></div>
			</dl>
		</article>`;
}

const meta = {
	title: "Foundations/Interaction/Direct Manipulation",
	tags: ["test", "visual"],
	render: () => {
		const matrix = scenarios();
		const shell = createLabShell(
			"Foundations / interaction",
			"Direct-manipulation feedforward and rejection",
			"The gameplay layer classifies authoritative pick, occupancy, terrain, economy and gesture facts into one expected action or rejection. The visual matrix intentionally uses glyph, border/pattern, wording and geometry together so color or sound is never the only explanation."
		);

		shell.frame.innerHTML = `
			<style>
				.dm-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:11px; }
				.dm-card { min-height:172px; padding:12px; border:2px solid rgba(244,237,247,.2); background:rgba(10,3,17,.42); display:grid; grid-template-columns:54px 1fr; grid-template-rows:auto 1fr; gap:10px; }
				.dm-footprint { width:48px; height:48px; display:grid; place-items:center; border:2px solid currentColor; font-weight:700; font-size:17px; }
				.dm-copy { display:grid; align-content:center; gap:4px; }
				.dm-copy small { opacity:.62; text-transform:uppercase; letter-spacing:.06em; font-size:9px; }
				.dm-card dl { grid-column:1 / -1; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin:0; }
				.dm-card dl div { border-top:1px solid rgba(244,237,247,.09); padding-top:6px; min-width:0; }
				.dm-card dt { opacity:.45; font-size:9px; text-transform:uppercase; }
				.dm-card dd { margin:3px 0 0; font-size:10px; overflow-wrap:anywhere; }
				.dm-card--commit { border-style:solid; }
				.dm-card--resource { border-style:dashed; background-image:repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(244,237,247,.035) 8px,rgba(244,237,247,.035) 10px); }
				.dm-card--occupancy { border-style:double; }
				.dm-card--protected { outline:2px solid rgba(244,237,247,.18); outline-offset:-7px; }
				.dm-card--terrain { border-style:dotted; transform:skewX(-1deg); }
				.dm-card--maximum .dm-footprint { border-width:4px; }
				.dm-card--service .dm-footprint { border-radius:50%; }
				.dm-card--gesture { border-left-width:8px; }
				.dm-card--stale { opacity:.58; }
				.dm-card--unsupported { border-style:dotted; opacity:.65; }
				.dm-note { margin-top:13px; padding:11px; border:1px solid rgba(244,237,247,.1); font-size:10px; line-height:1.5; opacity:.67; }
			</style>
			<div class="dm-grid">${matrix.map(card).join("")}</div>
			<div class="dm-note">Affordability is supplied as a fact. This fixture does not choose the legacy strict-&gt; rule or the later #109 exact-cost correction. Likewise, camera arbitration and occupancy remain caller-owned; this seam only prevents their outcomes from collapsing into an unexplained tap.</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OutcomeMatrix: Story = {
	play: async ({ canvasElement }) => {
		const cards = Array.from(
			canvasElement.querySelectorAll<HTMLElement>("[data-scenario]")
		);
		await expect(cards.length).toBe(11);

		const expectedReasons = [
			"unaffordable",
			"occupied",
			"protected",
			"invalid-terrain",
			"camera-owned",
			"stale-target",
			"maximum-state",
			"no-service-needed"
		];
		for (let index = 0; index < expectedReasons.length; index += 1) {
			const reason = expectedReasons[index];
			const match = cards.find(cardElement => cardElement.dataset.reason === reason);
			await expect(match).not.toBeUndefined();
		}

		const accepted = cards.filter(cardElement => cardElement.dataset.status === "accepted");
		await expect(accepted.length).toBe(3);
		for (let index = 0; index < accepted.length; index += 1) {
			await expect(accepted[index].dataset.reason).toBe("none");
		}

		const maximum = cards.find(cardElement => cardElement.dataset.scenario === "maximum");
		await expect(maximum).not.toBeUndefined();
		if (maximum) {
			await expect(maximum.dataset.reason).toBe("maximum-state");
			await expect(maximum.dataset.cue).toBe("maximum");
		}
	}
};
