import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	summarizeInterventionCadence,
	type InterventionAction,
	type InterventionOpportunity
} from "@defend/gameplay/interventionCadence";
import { createLabShell } from "../../labTheme";

function malformedOpportunity(
	id: string,
	startSeconds: unknown,
	endSeconds: unknown
): InterventionOpportunity {
	return {
		id,
		kind: "other",
		startSeconds: startSeconds as number,
		endSeconds: endSeconds as number,
		contextKey: id
	};
}

function malformedAction(atSeconds: unknown): InterventionAction {
	return {
		atSeconds: atSeconds as number,
		kind: "other",
		opportunityId: "valid"
	};
}

const meta = {
	title: "Arena/Interaction/Intervention Cadence Integrity",
	tags: ["test", "visual"],
	render: () => {
		const summary = summarizeInterventionCadence({
			sessionStartSeconds: 0,
			sessionEndSeconds: 90,
			opportunities: [
				malformedOpportunity("valid", 10, 20),
				malformedOpportunity("undefined-start", undefined, 30),
				malformedOpportunity("string-start", "12", 30),
				malformedOpportunity("null-end", 40, null)
			],
			actions: [
				malformedAction(12),
				malformedAction(undefined),
				malformedAction("12"),
				malformedAction(null)
			]
		});
		const shell = createLabShell(
			"Arena / interaction",
			"Cadence runtime evidence integrity",
			"Runtime values can violate TypeScript declarations after deserialization or instrumentation boundaries. Non-number opportunity/action timestamps must fail closed instead of entering coverage, response, or APM metrics."
		);
		shell.frame.innerHTML = `
			<div class="lab__grid">
				<section class="lab__panel lab__panel--padded" data-valid-opportunities="${summary.opportunities}" data-invalid-opportunities="${summary.invalidOpportunities}" data-valid-actions="${summary.actions}" data-invalid-actions="${summary.invalidActions}" data-responses="${summary.respondedOpportunities}">
					<h2 class="lab__section-title">Runtime evidence</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>Valid opportunities</dt><dd>${summary.opportunities}</dd></div>
						<div class="lab__metric"><dt>Invalid opportunities</dt><dd>${summary.invalidOpportunities}</dd></div>
						<div class="lab__metric"><dt>Valid actions</dt><dd>${summary.actions}</dd></div>
						<div class="lab__metric"><dt>Invalid actions</dt><dd>${summary.invalidActions}</dd></div>
						<div class="lab__metric"><dt>Responses</dt><dd>${summary.respondedOpportunities}</dd></div>
					</dl>
				</section>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NonNumberTimestampsFailClosed: Story = {
	play: async ({ canvasElement }) => {
		const panel = canvasElement.querySelector<HTMLElement>("[data-valid-opportunities]");
		await expect(panel).not.toBeNull();
		if (!panel) return;
		await expect(panel.dataset.validOpportunities).toBe("1");
		await expect(panel.dataset.invalidOpportunities).toBe("3");
		await expect(panel.dataset.validActions).toBe("1");
		await expect(panel.dataset.invalidActions).toBe("3");
		await expect(panel.dataset.responses).toBe("1");
	}
};
