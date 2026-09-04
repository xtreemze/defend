import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	summarizeInterventionCadence,
	type InterventionAction,
	type InterventionCadenceInput,
	type InterventionCadenceSummary,
	type InterventionOpportunity
} from "@defend/gameplay/interventionCadence";
import { createLabShell } from "../../labTheme";

function opportunity(
	id: string,
	startSeconds: number,
	endSeconds: number
): InterventionOpportunity {
	return {
		id,
		kind: "other",
		startSeconds,
		endSeconds,
		contextKey: id
	};
}

function linkedAction(
	atSeconds: number,
	opportunityId: string
): InterventionAction {
	return {
		atSeconds,
		kind: "other",
		opportunityId
	};
}

function unlinkedAction(atSeconds: number): InterventionAction {
	return {
		atSeconds,
		kind: "other",
		opportunityId: null
	};
}

const ENGAGED_OPPORTUNITIES: InterventionOpportunity[] = [
	opportunity("e1", 4, 14),
	opportunity("e2", 16, 28),
	opportunity("e3", 31, 42),
	opportunity("e4", 44, 56),
	opportunity("e5", 59, 70),
	opportunity("e6", 73, 85)
];

const SPARSE_OPPORTUNITIES: InterventionOpportunity[] = [
	opportunity("s1", 5, 12),
	opportunity("s2", 43, 50),
	opportunity("s3", 78, 84)
];

const ENGAGED_ACTIONS: InterventionAction[] = [
	linkedAction(6, "e1"),
	linkedAction(18, "e2"),
	linkedAction(34, "e3"),
	linkedAction(47, "e4"),
	linkedAction(61, "e5"),
	unlinkedAction(52)
];

const SPECTATOR_ACTIONS: InterventionAction[] = [
	linkedAction(7, "s1"),
	linkedAction(81, "s3")
];

const BUSYWORK_ACTIONS: InterventionAction[] = [
	linkedAction(7, "s1"),
	unlinkedAction(14),
	unlinkedAction(18),
	unlinkedAction(22),
	unlinkedAction(27),
	unlinkedAction(31),
	unlinkedAction(36),
	unlinkedAction(41),
	unlinkedAction(54),
	unlinkedAction(59),
	unlinkedAction(64),
	unlinkedAction(70),
	unlinkedAction(74),
	linkedAction(81, "s3")
];

function session(
	opportunities: InterventionOpportunity[],
	actions: InterventionAction[]
): InterventionCadenceInput {
	return {
		sessionStartSeconds: 0,
		sessionEndSeconds: 90,
		opportunities,
		actions
	};
}

function percent(value: number): string {
	return `${(value * 100).toFixed(0)}%`;
}

function seconds(value: number | null): string {
	return value === null ? "—" : `${value.toFixed(1)} s`;
}

function card(
	id: string,
	label: string,
	description: string,
	summary: InterventionCadenceSummary
): string {
	return `
		<article
			class="cadence-card"
			data-session="${id}"
			data-opportunities="${summary.opportunities}"
			data-response-rate="${summary.responseRate}"
			data-actions-per-minute="${summary.actionsPerMinute}"
			data-coverage="${summary.opportunityCoverageShare}"
			data-longest-gap="${summary.longestNoOpportunityGapSeconds}"
			data-unlinked-share="${summary.unlinkedActionShare}"
		>
			<header>
				<small>decision-cadence fixture</small>
				<strong>${label}</strong>
			</header>
			<p>${description}</p>
			<div class="cadence-metrics">
				<div><span>meaningful opportunities</span><strong>${summary.opportunities}</strong></div>
				<div><span>response rate</span><strong>${percent(summary.responseRate)}</strong></div>
				<div><span>opportunity coverage</span><strong>${percent(summary.opportunityCoverageShare)}</strong></div>
				<div><span>longest no-opportunity gap</span><strong>${seconds(summary.longestNoOpportunityGapSeconds)}</strong></div>
				<div><span>actions / minute</span><strong>${summary.actionsPerMinute.toFixed(1)}</strong></div>
				<div><span>unlinked input share</span><strong>${percent(summary.unlinkedActionShare)}</strong></div>
				<div><span>mean response</span><strong>${seconds(summary.meanResponseSeconds)}</strong></div>
				<div><span>missed opportunities</span><strong>${summary.missedOpportunities}</strong></div>
			</div>
		</article>
	`;
}

const meta = {
	title: "Arena/Interaction/Intervention Cadence",
	tags: ["test", "visual"],
	render: () => {
		const engaged = summarizeInterventionCadence(
			session(ENGAGED_OPPORTUNITIES, ENGAGED_ACTIONS)
		);
		const spectator = summarizeInterventionCadence(
			session(SPARSE_OPPORTUNITIES, SPECTATOR_ACTIONS)
		);
		const busywork = summarizeInterventionCadence(
			session(SPARSE_OPPORTUNITIES, BUSYWORK_ACTIONS)
		);
		const shell = createLabShell(
			"Arena / interaction",
			"Meaningful intervention cadence",
			"Decision density is not input density. These deterministic evidence shapes measure when the simulation presents a meaningful chance to alter the physical future, separately from how often the player clicks."
		);

		shell.frame.innerHTML = `
			<style>
				.cadence-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:14px; }
				.cadence-card { padding:14px; border:1px solid rgba(228,185,128,.2); background:rgba(10,3,17,.42); }
				.cadence-card header { display:grid; gap:3px; margin-bottom:9px; }
				.cadence-card header small { opacity:.45; text-transform:uppercase; letter-spacing:.08em; font-size:9px; }
				.cadence-card p { min-height:58px; margin:0 0 12px; opacity:.6; font-size:10px; line-height:1.5; }
				.cadence-metrics { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
				.cadence-metrics div { border-top:1px solid rgba(244,237,247,.08); padding-top:7px; }
				.cadence-metrics span { display:block; font-size:9px; opacity:.48; text-transform:uppercase; }
				.cadence-metrics strong { display:block; margin-top:3px; font-size:13px; }
				.cadence-note { margin-top:14px; padding:11px; border:1px dashed rgba(244,237,247,.16); opacity:.68; font-size:10px; line-height:1.55; }
			</style>
			<div class="cadence-grid">
				${card(
					"engaged",
					"Systemic engagement",
					"Frequent physical/economic decision windows, most answered deliberately, with little unrelated input.",
					engaged
				)}
				${card(
					"spectator",
					"Spectator-prone",
					"Autonomous play continues, but meaningful opportunities are sparse and long passive gaps dominate the session.",
					spectator
				)}
				${card(
					"busywork",
					"High-input busywork",
					"The same sparse opportunity structure as spectator-prone play, masked by many actions that are not attributed to meaningful decision windows.",
					busywork
				)}
			</div>
			<div class="cadence-note">Illustrative evidence shapes only. Opportunity classification is caller-owned and must come from observable tactical state; these metrics must never feed back into gameplay authority or reward raw actions-per-minute.</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DecisionDensityNotInputDensity: Story = {
	play: async ({ canvasElement }) => {
		const engaged = canvasElement.querySelector<HTMLElement>(
			'[data-session="engaged"]'
		);
		const spectator = canvasElement.querySelector<HTMLElement>(
			'[data-session="spectator"]'
		);
		const busywork = canvasElement.querySelector<HTMLElement>(
			'[data-session="busywork"]'
		);
		await expect(engaged).not.toBeNull();
		await expect(spectator).not.toBeNull();
		await expect(busywork).not.toBeNull();
		if (!engaged || !spectator || !busywork) return;

		const engagedCoverage = Number(engaged.dataset.coverage);
		const spectatorCoverage = Number(spectator.dataset.coverage);
		const busyworkCoverage = Number(busywork.dataset.coverage);
		const engagedGap = Number(engaged.dataset.longestGap);
		const spectatorGap = Number(spectator.dataset.longestGap);
		const busyworkGap = Number(busywork.dataset.longestGap);
		const engagedApm = Number(engaged.dataset.actionsPerMinute);
		const busyworkApm = Number(busywork.dataset.actionsPerMinute);
		const busyworkUnlinked = Number(busywork.dataset.unlinkedShare);

		await expect(engagedCoverage).toBeGreaterThan(spectatorCoverage);
		await expect(engagedGap).toBeLessThan(spectatorGap);
		await expect(busyworkCoverage).toBeCloseTo(spectatorCoverage, 8);
		await expect(busyworkGap).toBeCloseTo(spectatorGap, 8);
		await expect(busyworkApm).toBeGreaterThan(engagedApm);
		await expect(busyworkUnlinked).toBeGreaterThan(0.5);
	}
};
