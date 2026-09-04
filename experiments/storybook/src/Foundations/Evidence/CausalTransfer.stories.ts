import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	summarizeCausalEvidence,
	validateCausalTrace,
	type CausalEvidenceTrial
} from "@defend/experiments/causalEvidence";
import { createLabShell } from "../../labTheme";

type EvidenceArgs = {
	includeMixedFailure: boolean;
};

function events(offset = 0) {
	return [
		{ timeSeconds: offset + 0, phase: "anticipation" as const, kind: "world-cue" },
		{ timeSeconds: offset + 0.7, phase: "causation" as const, kind: "physical-event" },
		{ timeSeconds: offset + 1.2, phase: "residue" as const, kind: "persistent-result" }
	];
}

function trials(args: EvidenceArgs): CausalEvidenceTrial[] {
	return [
		{
			trialId: "delay-example",
			fixtureId: "delay-clean",
			mechanismId: "finite-life-delay",
			surfaceVariantId: "straight-barrier",
			supportStage: "observed-example",
			predictedOutcome: null,
			actualOutcome: "expires",
			events: events(),
			explanationGrade: "not-collected"
		},
		{
			trialId: "delay-guided",
			fixtureId: "delay-clean",
			mechanismId: "finite-life-delay",
			surfaceVariantId: "angled-barrier",
			supportStage: "guided",
			predictedOutcome: "expires",
			actualOutcome: "expires",
			events: events(),
			explanationGrade: "partial"
		},
		{
			trialId: "delay-independent",
			fixtureId: "delay-clean",
			mechanismId: "finite-life-delay",
			surfaceVariantId: "offset-entry",
			supportStage: "independent",
			predictedOutcome: "marginal",
			actualOutcome: "marginal",
			events: events(),
			explanationGrade: "strong"
		},
		{
			trialId: "delay-near-transfer",
			fixtureId: "delay-transfer",
			mechanismId: "finite-life-delay",
			surfaceVariantId: "long-detour",
			supportStage: "near-transfer",
			predictedOutcome: "expires",
			actualOutcome: "expires",
			events: events(),
			explanationGrade: "strong"
		},
		{
			trialId: "mixed-transfer",
			fixtureId: "mixed-drainage-delay",
			mechanismId: "finite-life-delay",
			surfaceVariantId: "barrier-plus-drainage-gap",
			supportStage: "mixed-transfer",
			predictedOutcome: args.includeMixedFailure ? "arrives" : "expires",
			actualOutcome: "expires",
			events: events(),
			explanationGrade: args.includeMixedFailure ? "partial" : "strong"
		}
	];
}

const intentionallyBrokenTrace = [
	{ timeSeconds: 0, phase: "anticipation" as const, kind: "world-cue" },
	{ timeSeconds: 1.1, phase: "residue" as const, kind: "result-recorded-too-early" },
	{ timeSeconds: 0.8, phase: "causation" as const, kind: "late-event-write" }
];

const meta = {
	title: "Foundations/Evidence/Causal Transfer",
	tags: ["test", "visual"],
	args: {
		includeMixedFailure: true
	},
	argTypes: {
		includeMixedFailure: { control: "boolean" }
	},
	render: (args: EvidenceArgs) => {
		const evidence = trials(args);
		const summary = summarizeCausalEvidence(evidence);
		const broken = validateCausalTrace(intentionallyBrokenTrace);
		const shell = createLabShell(
			"Foundations / evidence",
			"Causal prediction and transfer record",
			"The evidence model distinguishes a readable worked example from guided, independent, near-transfer and mixed-transfer trials. Prediction accuracy is only meaningful when the same causal rule survives changed surface conditions; chronology validation deliberately refuses to sort malformed event traces."
		);

		shell.frame.innerHTML = `
			<style>
				.evidence-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; margin-bottom:14px; }
				.evidence-card { padding:12px; border:1px solid rgba(244,237,247,.12); background:rgba(8,10,18,.48); }
				.evidence-card small { display:block; text-transform:uppercase; letter-spacing:.07em; opacity:.46; }
				.evidence-card strong { display:block; margin:5px 0 9px; font-size:13px; }
				.evidence-row { display:flex; justify-content:space-between; gap:8px; padding-top:5px; font-size:10px; border-top:1px solid rgba(244,237,247,.07); }
				.evidence-row span:first-child { opacity:.46; }
				.evidence-summary { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:8px; }
				.evidence-summary > div { padding:10px; border:1px solid rgba(73,215,209,.16); }
				.evidence-summary dt { font-size:9px; text-transform:uppercase; letter-spacing:.06em; opacity:.48; }
				.evidence-summary dd { margin:4px 0 0; font-size:15px; }
			</style>
			<div class="evidence-grid">
				${evidence
					.map(
						trial => `
						<article class="evidence-card" data-trial="${trial.trialId}">
							<small>${trial.supportStage}</small>
							<strong>${trial.surfaceVariantId}</strong>
							<div class="evidence-row"><span>prediction</span><span>${trial.predictedOutcome ?? "observed"}</span></div>
							<div class="evidence-row"><span>actual</span><span>${trial.actualOutcome}</span></div>
							<div class="evidence-row"><span>explanation</span><span>${trial.explanationGrade}</span></div>
						</article>`
					)
					.join("")}
			</div>
			<dl class="evidence-summary"
				data-trials="${summary.trialCount}"
				data-predictions="${summary.predictionCount}"
				data-matches="${summary.predictionMatches}"
				data-transfer="${summary.transferTrialCount}"
				data-transfer-predictions="${summary.transferPredictionCount}"
				data-transfer-matches="${summary.transferPredictionMatches}"
				data-complete="${summary.completeTraceCount}"
				data-variants="${summary.surfaceVariantCount}"
				data-broken-complete="${broken.complete}">
				<div><dt>prediction accuracy</dt><dd>${Math.round(summary.predictionAccuracy * 100)}%</dd></div>
				<div><dt>transfer accuracy</dt><dd>${Math.round(summary.transferPredictionAccuracy * 100)}%</dd></div>
				<div><dt>complete traces</dt><dd>${summary.completeTraceCount}/${summary.trialCount}</dd></div>
				<div><dt>surface variants</dt><dd>${summary.surfaceVariantCount}</dd></div>
				<div><dt>strong explanation rate</dt><dd>${Math.round(summary.strongExplanationRate * 100)}%</dd></div>
				<div><dt>broken trace accepted</dt><dd>${broken.complete ? "YES" : "NO"}</dd></div>
			</dl>
		`;
		return shell.root;
	}
} satisfies Meta<EvidenceArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FadingAndTransfer: Story = {
	play: async ({ canvasElement, args }) => {
		const summary = canvasElement.querySelector<HTMLElement>(".evidence-summary");
		await expect(summary).not.toBeNull();
		if (!summary) return;

		await expect(Number(summary.dataset.trials)).toBe(5);
		await expect(Number(summary.dataset.predictions)).toBe(4);
		await expect(Number(summary.dataset.transfer)).toBe(2);
		await expect(Number(summary.dataset.transferPredictions)).toBe(2);
		await expect(Number(summary.dataset.complete)).toBe(5);
		await expect(Number(summary.dataset.variants)).toBe(5);
		await expect(summary.dataset.brokenComplete).toBe("false");
		await expect(Number(summary.dataset.matches)).toBe(
			args.includeMixedFailure ? 3 : 4
		);
		await expect(Number(summary.dataset.transferMatches)).toBe(
			args.includeMixedFailure ? 1 : 2
		);
	}
};
