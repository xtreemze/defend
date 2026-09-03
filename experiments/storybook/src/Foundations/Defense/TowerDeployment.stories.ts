import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	towerDeploymentProgress,
	towerDeploymentStage,
	type TowerDeploymentSchedule
} from "@defend/gameplay/towerDeployment";
import { createLabShell } from "../../labTheme";

type DeploymentArgs = {
	elapsedSeconds: number;
	t3Powered: boolean;
};

const SCHEDULES: Record<1 | 2 | 3, TowerDeploymentSchedule> = {
	1: {
		base: { start: 0.25, end: 1.55 },
		completeAt: 1.8
	},
	2: {
		base: { start: 0.25, end: 1.5 },
		drill: { start: 1.0, end: 2.35 },
		pillar: { start: 1.65, end: 2.9 },
		turret: { start: 2.45, end: 3.55 },
		completeAt: 4.1
	},
	3: {
		base: { start: 0.25, end: 1.5 },
		drill: { start: 1.0, end: 2.8 },
		pillar: { start: 2.0, end: 3.65 },
		turret: { start: 3.15, end: 4.65 },
		completeAt: 5.4
	}
};

function timelineBlock(
	label: string,
	window: { start: number; end: number } | undefined,
	maxSeconds: number,
	className: string
): string {
	if (window === undefined) {
		return "";
	}
	const left = (window.start / maxSeconds) * 100;
	const width = ((window.end - window.start) / maxSeconds) * 100;
	return `<div class="timeline__block ${className}" style="left:${left}%;width:${width}%" title="${label}: ${window.start.toFixed(2)}–${window.end.toFixed(2)} s"><span>${label}</span></div>`;
}

const meta = {
	title: "Foundations/Defense/Tower Deployment",
	tags: ["test", "visual"],
	args: {
		elapsedSeconds: 2.7,
		t3Powered: false
	},
	argTypes: {
		elapsedSeconds: { control: { type: "range", min: 0, max: 6, step: 0.05 } },
		t3Powered: { control: "boolean" }
	},
	render: (args: DeploymentArgs) => {
		const maxSeconds = 6;
		const levels = [1, 2, 3] as const;
		const rows = levels.map(level => {
			const powered = level === 1 || level === 2 || args.t3Powered;
			const schedule = SCHEDULES[level];
			const progress = towerDeploymentProgress(args.elapsedSeconds, schedule);
			const stage = towerDeploymentStage(level, args.elapsedSeconds, powered, schedule);
			return {
				level,
				powered,
				schedule,
				progress,
				stage
			};
		});

		const shell = createLabShell(
			"Foundations / defense",
			"Staggered tower deployment",
			"Scrub one deterministic construction clock across all three tower tiers. Overlapping component windows let the structure grow mechanically rather than pop into existence, while T2/T3 drilling can finish before final calibration reveals whether the tower is powered or dry."
		);

		shell.frame.innerHTML = `
			<style>
				.timeline { display:grid; gap:14px; }
				.timeline__row { display:grid; grid-template-columns:74px minmax(0,1fr) 130px; gap:12px; align-items:center; }
				.timeline__track { position:relative; height:58px; border:1px solid rgba(244,237,247,.1); background:rgba(8,2,14,.48); overflow:hidden; }
				.timeline__block { position:absolute; height:10px; min-width:2px; border-radius:2px; overflow:hidden; }
				.timeline__block span { position:absolute; left:4px; top:-1px; font-size:8px; line-height:10px; white-space:nowrap; color:rgba(12,3,20,.82); font-weight:700; }
				.timeline__base { top:7px; background:rgba(228,185,128,.82); }
				.timeline__drill { top:20px; background:rgba(73,215,209,.72); }
				.timeline__pillar { top:33px; background:rgba(181,145,105,.68); }
				.timeline__turret { top:46px; background:rgba(239,177,95,.7); }
				.timeline__complete { position:absolute; top:0; bottom:0; width:1px; background:rgba(244,237,247,.34); }
				.timeline__now { position:absolute; top:0; bottom:0; width:2px; background:#f4edf7; box-shadow:0 0 10px rgba(244,237,247,.42); }
				.timeline__label { font-size:13px; color:rgba(244,237,247,.72); }
				.timeline__status { text-align:right; font-size:12px; letter-spacing:.04em; }
				.timeline__metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin-top:18px; }
				.timeline__metric { padding:10px; border:1px solid rgba(244,237,247,.08); background:rgba(8,2,14,.35); }
				.timeline__metric dt { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:rgba(244,237,247,.42); }
				.timeline__metric dd { margin:5px 0 0; font-variant-numeric:tabular-nums; }
			</style>
			<section class="lab__panel lab__panel--padded">
				<div class="timeline">
					${rows.map(row => {
						const now = Math.min(100, Math.max(0, (args.elapsedSeconds / maxSeconds) * 100));
						const complete = (row.schedule.completeAt / maxSeconds) * 100;
						return `
							<div class="timeline__row">
								<strong class="timeline__label">T${row.level}</strong>
								<div class="timeline__track">
									${timelineBlock("base", row.schedule.base, maxSeconds, "timeline__base")}
									${timelineBlock("drill", row.schedule.drill, maxSeconds, "timeline__drill")}
									${timelineBlock("pillar", row.schedule.pillar, maxSeconds, "timeline__pillar")}
									${timelineBlock("turret", row.schedule.turret, maxSeconds, "timeline__turret")}
									<div class="timeline__complete" style="left:${complete}%"></div>
									<div class="timeline__now" style="left:${now}%"></div>
								</div>
								<strong class="timeline__status" data-level="${row.level}" data-stage="${row.stage}">${row.stage.toUpperCase()}</strong>
							</div>`;
					}).join("")}
				</div>
				<dl class="timeline__metrics">
					${rows.map(row => `
						<div class="timeline__metric"><dt>T${row.level} base</dt><dd>${(row.progress.base * 100).toFixed(0)}%</dd></div>
						<div class="timeline__metric"><dt>T${row.level} drill</dt><dd>${(row.progress.drill * 100).toFixed(0)}%</dd></div>
						<div class="timeline__metric"><dt>T${row.level} pillar</dt><dd>${(row.progress.pillar * 100).toFixed(0)}%</dd></div>
						<div class="timeline__metric"><dt>T${row.level} turret</dt><dd>${(row.progress.turret * 100).toFixed(0)}%</dd></div>
					`).join("")}
				</dl>
			</section>
		`;

		return shell.root;
	}
} satisfies Meta<DeploymentArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StaggeredAssembly: Story = {
	play: async ({ canvasElement }) => {
		const t1 = canvasElement.querySelector<HTMLElement>("[data-level='1']");
		const t2 = canvasElement.querySelector<HTMLElement>("[data-level='2']");
		const t3 = canvasElement.querySelector<HTMLElement>("[data-level='3']");
		await expect(t1).not.toBeNull();
		await expect(t2).not.toBeNull();
		await expect(t3).not.toBeNull();
		if (!t1 || !t2 || !t3) return;
		await expect(t1.dataset.stage).toBe("ready");
		await expect(t2.dataset.stage).toBe("drilling");
		await expect(t3.dataset.stage).toBe("drilling");
	}
};
