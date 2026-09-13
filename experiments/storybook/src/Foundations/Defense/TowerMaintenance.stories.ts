import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import type { GeothermalStream } from "@defend/gameplay/geothermalDrill";
import {
	startTowerMaintenance,
	stepTowerMaintenance,
	type TowerMaintenanceSchedule,
	type TowerMaintenanceState
} from "@defend/gameplay/towerMaintenance";
import { createLabShell } from "../../labTheme";

type MaintenanceArgs = {
	elapsedSeconds: number;
	streamNear: boolean;
	drillReach: number;
};

const schedule: TowerMaintenanceSchedule = {
	isolateEnd: 0.35,
	openEnd: 0.85,
	redrillEnd: 1.75,
	reconnectEnd: 2.3,
	completeAt: 3.15
};

function streams(near: boolean): GeothermalStream[] {
	return [
		{
			id: "maintenance-vein",
			active: true,
			points: near
				? [
						{ x: 34, y: -9, z: -8 },
						{ x: 11, y: -9, z: -7 },
						{ x: 18, y: -12, z: 22 }
					]
				: [
						{ x: 52, y: -9, z: -18 },
						{ x: 40, y: -10, z: -12 },
						{ x: 46, y: -12, z: 26 }
					]
		}
	];
}

function simulate(elapsedSeconds: number, near: boolean, reach: number): TowerMaintenanceState {
	let state = startTowerMaintenance();
	const target = Math.max(0, elapsedSeconds);
	const step = 1 / 60;
	while (state.elapsedSeconds + step < target && state.stage !== "complete") {
		state = stepTowerMaintenance(
			state,
			step,
			schedule,
			{ x: 0, y: 0, z: 0 },
			streams(near),
			reach
		);
	}
	if (state.elapsedSeconds < target && state.stage !== "complete") {
		state = stepTowerMaintenance(
			state,
			target - state.elapsedSeconds,
			schedule,
			{ x: 0, y: 0, z: 0 },
			streams(near),
			reach
		);
	}
	return state;
}

const meta = {
	title: "Foundations/Defense/Tower Maintenance",
	tags: ["test", "visual"],
	args: {
		elapsedSeconds: 2.05,
		streamNear: true,
		drillReach: 24
	},
	argTypes: {
		elapsedSeconds: { control: { type: "range", min: 0, max: 3.5, step: 0.05 } },
		streamNear: { control: "boolean" },
		drillReach: { control: { type: "range", min: 8, max: 40, step: 1 } }
	},
	render: (args: MaintenanceArgs) => {
		const state = simulate(args.elapsedSeconds, args.streamNear, args.drillReach);
		const shell = createLabShell(
			"Foundations / defense",
			"Visible tower maintenance",
			"Maintenance is a physical service cycle, not a hidden timer: isolate firing, open the structure, extend/retry the drill, illuminate a recovered connection, then recalibrate before returning to service. Geology may move nearby, but only an explicit maintenance cycle retries the search."
		);

		const stages = [
			["isolate", 0, schedule.isolateEnd],
			["open", schedule.isolateEnd, schedule.openEnd],
			["redrill", schedule.openEnd, schedule.redrillEnd],
			["reconnect", schedule.redrillEnd, schedule.reconnectEnd],
			["calibrate", schedule.reconnectEnd, schedule.completeAt]
		] as const;
		const total = schedule.completeAt;
		const now = Math.min(100, (Math.max(0, args.elapsedSeconds) / total) * 100);

		shell.frame.innerHTML = `
			<style>
				.service-layout { display:grid; grid-template-columns:minmax(0,1fr) 300px; gap:16px; }
				.service-stage { min-height:330px; display:grid; place-items:center; position:relative; overflow:hidden; }
				.service-tower { width:150px; height:180px; position:relative; display:flex; align-items:flex-end; justify-content:center; }
				.service-base { width:120px; height:38px; border:2px solid rgba(228,185,128,.82); background:rgba(228,185,128,.07); transform:scaleX(${(1 + state.serviceExposure * 0.12).toFixed(3)}); }
				.service-pillar { position:absolute; bottom:38px; width:25px; height:80px; border:2px solid rgba(228,185,128,.72); }
				.service-turret { position:absolute; bottom:112px; width:78px; height:32px; border:2px solid rgba(228,185,128,.82); transform:translateY(${(-state.serviceExposure * 12).toFixed(2)}px); }
				.service-drill { position:absolute; top:178px; left:50%; width:4px; height:${(112 * state.drillProgress).toFixed(1)}px; transform:translateX(-50%); background:rgba(73,215,209,${(0.25 + state.connectionGlow * 0.75).toFixed(3)}); box-shadow:0 0 ${Math.round(18 * state.connectionGlow)}px rgba(73,215,209,.75); }
				.service-ground { position:absolute; left:8%; right:8%; top:178px; border-top:1px solid rgba(244,237,247,.16); }
				.service-core { position:absolute; bottom:78px; width:10px; height:24px; background:rgba(73,215,209,${state.connected ? (0.25 + state.connectionGlow * 0.75).toFixed(3) : "0.06"}); }
				.service-lock { position:absolute; top:18px; left:18px; font-size:11px; letter-spacing:.08em; color:rgba(244,237,247,.56); }
				.service-timeline { position:relative; height:52px; margin-top:18px; border:1px solid rgba(244,237,247,.08); background:rgba(8,2,14,.4); }
				.service-segment { position:absolute; top:11px; height:28px; border-right:1px solid rgba(8,2,14,.5); display:grid; place-items:center; font-size:9px; color:rgba(12,3,20,.76); font-weight:700; }
				.service-now { position:absolute; top:0; bottom:0; width:2px; background:#f4edf7; box-shadow:0 0 8px rgba(244,237,247,.4); }
			</style>
			<div class="service-layout">
				<section class="lab__panel lab__stage service-stage">
					<div class="service-lock">${state.firingLocked ? "FIRING LOCKED — SERVICE" : "FIRING AVAILABLE"}</div>
					<div class="service-ground"></div>
					<div class="service-tower">
						<div class="service-base"></div><div class="service-pillar"></div><div class="service-turret"></div><div class="service-core"></div><div class="service-drill"></div>
					</div>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Service state</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>Stage</dt><dd data-stage="${state.stage}">${state.stage.toUpperCase()}</dd></div>
						<div class="lab__metric"><dt>Firing lock</dt><dd data-locked="${state.firingLocked}">${state.firingLocked ? "LOCKED" : "CLEAR"}</dd></div>
						<div class="lab__metric"><dt>Search attempted</dt><dd data-search="${state.searchAttempted}">${state.searchAttempted ? "YES" : "NO"}</dd></div>
						<div class="lab__metric"><dt>Connection</dt><dd data-connected="${state.connected}">${state.connected ? state.connectedStreamId : "DRY"}</dd></div>
						<div class="lab__metric"><dt>Drill extension</dt><dd>${(state.drillProgress * 100).toFixed(0)}%</dd></div>
						<div class="lab__metric"><dt>Calibration</dt><dd>${(state.calibrationProgress * 100).toFixed(0)}%</dd></div>
					</dl>
					<div class="service-timeline">
						${stages.map(([label,start,end], index) => `<div class="service-segment" style="left:${(start / total) * 100}%;width:${((end-start) / total) * 100}%;background:rgba(${index === 2 || index === 3 ? "73,215,209" : "228,185,128"},${0.42 + index * 0.06})">${label}</div>`).join("")}
						<div class="service-now" style="left:${now}%"></div>
					</div>
				</aside>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<MaintenanceArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServiceAndRetry: Story = {
	play: async ({ canvasElement }) => {
		const stage = canvasElement.querySelector<HTMLElement>("[data-stage]");
		const locked = canvasElement.querySelector<HTMLElement>("[data-locked]");
		const search = canvasElement.querySelector<HTMLElement>("[data-search]");
		const connected = canvasElement.querySelector<HTMLElement>("[data-connected]");
		await expect(stage).not.toBeNull();
		await expect(locked).not.toBeNull();
		await expect(search).not.toBeNull();
		await expect(connected).not.toBeNull();
		if (!stage || !locked || !search || !connected) return;
		await expect(stage.dataset.stage).toBe("reconnecting");
		await expect(locked.dataset.locked).toBe("true");
		await expect(search.dataset.search).toBe("true");
		await expect(connected.dataset.connected).toBe("true");
	}
};
