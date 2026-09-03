import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	findReachableGeothermalSource,
	type GeothermalSource
} from "@defend/gameplay/geothermalDrill";
import {
	outwardRestYaw,
	stepTurretSlew,
	type TurretSlewLimits,
	type TurretSlewState,
	yawDegrees,
	yawRadians
} from "@defend/gameplay/turretDynamics";
import { createLabShell } from "../../labTheme";

type TowerDynamicsArgs = {
	targetHeadingDegrees: number;
	simulationSeconds: number;
	drillReach: number;
	initialSourceDistance: number;
	migratedSourceDistance: number;
};

interface SlewTrace {
	readyAt: number | null;
	maximumSpeed: number;
	finalError: number;
	path: string;
}

const T2_LIMITS: TurretSlewLimits = {
	maxAngularSpeed: 2.45,
	angularAcceleration: 6.8,
	aimTolerance: yawRadians(3.5)
};

const T3_LIMITS: TurretSlewLimits = {
	maxAngularSpeed: 1.15,
	angularAcceleration: 2.2,
	aimTolerance: yawRadians(2.5)
};

function simulateSlew(
	initialYaw: number,
	targetYaw: number,
	seconds: number,
	limits: TurretSlewLimits,
	chartOffsetY: number
): SlewTrace {
	const dt = 1 / 60;
	const steps = Math.max(1, Math.ceil(seconds / dt));
	let state: TurretSlewState = { yaw: initialYaw, angularVelocity: 0 };
	let readyAt: number | null = null;
	let maximumSpeed = 0;
	let finalError = 0;
	const points: string[] = [];

	for (let index = 0; index <= steps; index += 1) {
		const elapsed = Math.min(seconds, index * dt);
		const step = stepTurretSlew(state, targetYaw, dt, limits);
		state = step;
		maximumSpeed = Math.max(maximumSpeed, Math.abs(step.angularVelocity));
		finalError = Math.abs(step.aimError);
		if (readyAt === null && step.ready) {
			readyAt = elapsed;
		}
		const x = 20 + (elapsed / Math.max(seconds, dt)) * 380;
		const normalizedError = Math.min(1, finalError / Math.PI);
		const y = chartOffsetY - normalizedError * 92;
		points.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
	}

	return {
		readyAt,
		maximumSpeed,
		finalError,
		path: points.join(" ")
	};
}

function dialVector(yaw: number, length: number): { x: number; y: number } {
	return {
		x: Math.sin(yaw) * length,
		y: -Math.cos(yaw) * length
	};
}

function drillSources(distance: number): GeothermalSource[] {
	return [
		{ id: "east-stream", x: distance, y: -8, z: 0, active: true },
		{ id: "deep-west", x: -42, y: -20, z: 12, active: true }
	];
}

const meta = {
	title: "Foundations/Defense/Tower Dynamics",
	tags: ["test", "visual"],
	args: {
		targetHeadingDegrees: 180,
		simulationSeconds: 5,
		drillReach: 24,
		initialSourceDistance: 44,
		migratedSourceDistance: 15
	},
	argTypes: {
		targetHeadingDegrees: { control: { type: "range", min: 0, max: 359, step: 1 } },
		simulationSeconds: { control: { type: "range", min: 1, max: 8, step: 0.25 } },
		drillReach: { control: { type: "range", min: 8, max: 48, step: 1 } },
		initialSourceDistance: { control: { type: "range", min: 10, max: 70, step: 1 } },
		migratedSourceDistance: { control: { type: "range", min: 4, max: 48, step: 1 } }
	},
	render: (args: TowerDynamicsArgs) => {
		const restYaw = outwardRestYaw(0, 20, 0, 0);
		const targetYaw = yawRadians(args.targetHeadingDegrees);
		const t2 = simulateSlew(restYaw, targetYaw, args.simulationSeconds, T2_LIMITS, 128);
		const t3 = simulateSlew(restYaw, targetYaw, args.simulationSeconds, T3_LIMITS, 260);
		const restVector = dialVector(restYaw, 48);
		const targetVector = dialVector(targetYaw, 48);

		const towerOrigin = { x: 0, y: 0, z: 0 };
		const initialSearch = findReachableGeothermalSource(
			towerOrigin,
			drillSources(args.initialSourceDistance),
			args.drillReach
		);
		const migratedSearch = findReachableGeothermalSource(
			towerOrigin,
			drillSources(args.migratedSourceDistance),
			args.drillReach
		);

		const shell = createLabShell(
			"Foundations / defense",
			"Tower dynamics",
			"Compare deterministic T2/T3 slew behavior and the dry-tower drilling lifecycle without rendering or physics noise. The source may migrate into range, but the cached tower state remains dry until maintenance explicitly retries the search."
		);

		shell.frame.innerHTML = `
			<style>
				.tower-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(280px,0.65fr); gap:16px; }
				.tower-svg { width:100%; min-height:360px; }
				.tower-axis { stroke:rgba(244,237,247,.14); stroke-width:1; }
				.tower-t2 { fill:none; stroke:#e4b980; stroke-width:2.2; }
				.tower-t3 { fill:none; stroke:rgba(228,185,128,.5); stroke-width:3.4; }
				.tower-rest { stroke:rgba(244,237,247,.34); stroke-dasharray:5 4; stroke-width:1.5; }
				.tower-target { stroke:#efb15f; stroke-width:2; }
				.tower-dial { fill:rgba(12,3,20,.72); stroke:rgba(228,185,128,.26); }
				.drill-stage { position:relative; height:210px; overflow:hidden; }
				.drill-ground { position:absolute; left:0; right:0; top:62px; border-top:1px solid rgba(244,237,247,.18); }
				.drill-tower { position:absolute; left:46%; top:28px; width:32px; height:34px; border:1px solid rgba(228,185,128,.8); background:rgba(228,185,128,.08); }
				.drill-line { position:absolute; left:calc(46% + 15px); top:62px; width:1px; height:90px; background:rgba(244,237,247,.28); }
				.drill-source { position:absolute; top:130px; width:16px; height:16px; border-radius:50%; background:#49d7d1; box-shadow:0 0 18px rgba(73,215,209,.65); }
				.drill-reach { position:absolute; left:calc(46% - 74px); top:72px; width:180px; height:118px; border:1px dashed rgba(73,215,209,.22); border-radius:50%; }
				.state-row { display:grid; grid-template-columns:1fr auto; gap:10px; padding:8px 0; border-bottom:1px solid rgba(244,237,247,.08); }
				.state-row strong { font-weight:600; }
			</style>
			<div class="tower-grid">
				<section class="lab__panel lab__stage">
					<svg class="tower-svg" viewBox="0 0 440 320" aria-label="T2 and T3 turret acquisition traces">
						<line class="tower-axis" x1="20" y1="128" x2="410" y2="128" />
						<line class="tower-axis" x1="20" y1="260" x2="410" y2="260" />
						<path class="tower-t2" d="${t2.path}" />
						<path class="tower-t3" d="${t3.path}" />
						<text x="22" y="26" fill="rgba(244,237,247,.55)" font-size="11">absolute aim error → zero</text>
						<text x="22" y="147" fill="#e4b980" font-size="11">T2 interceptor</text>
						<text x="22" y="279" fill="rgba(228,185,128,.62)" font-size="11">T3 siege</text>
						<circle class="tower-dial" cx="360" cy="68" r="54" />
						<line class="tower-rest" x1="360" y1="68" x2="${360 + restVector.x}" y2="${68 + restVector.y}" />
						<line class="tower-target" x1="360" y1="68" x2="${360 + targetVector.x}" y2="${68 + targetVector.y}" />
					</svg>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Slew contract</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>Rest heading</dt><dd>${yawDegrees(restYaw).toFixed(1)}°</dd></div>
						<div class="lab__metric"><dt>Target heading</dt><dd>${yawDegrees(targetYaw).toFixed(1)}°</dd></div>
						<div class="lab__metric"><dt>T2 ready</dt><dd data-t2-ready="${t2.readyAt ?? -1}">${t2.readyAt === null ? "not yet" : `${t2.readyAt.toFixed(2)} s`}</dd></div>
						<div class="lab__metric"><dt>T3 ready</dt><dd data-t3-ready="${t3.readyAt ?? -1}">${t3.readyAt === null ? "not yet" : `${t3.readyAt.toFixed(2)} s`}</dd></div>
						<div class="lab__metric"><dt>T2 peak slew</dt><dd data-t2-speed="${t2.maximumSpeed}">${t2.maximumSpeed.toFixed(2)} rad/s</dd></div>
						<div class="lab__metric"><dt>T3 peak slew</dt><dd data-t3-speed="${t3.maximumSpeed}">${t3.maximumSpeed.toFixed(2)} rad/s</dd></div>
					</dl>
				</aside>
				<section class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Geothermal retry</h2>
					<div class="drill-stage" aria-label="Tower drill reach and migrating magma source">
						<div class="drill-ground"></div><div class="drill-tower"></div><div class="drill-line"></div><div class="drill-reach"></div>
						<div class="drill-source" style="left:${Math.max(8, Math.min(88, 46 + args.migratedSourceDistance))}%"></div>
					</div>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<div class="state-row"><span>Initial construction search</span><strong data-initial-connected="${initialSearch.connected}">${initialSearch.connected ? "CONNECTED" : "DRY"}</strong></div>
					<div class="state-row"><span>Source migrates</span><strong>tower remains DRY</strong></div>
					<div class="state-row"><span>Maintenance retries search</span><strong data-retry-connected="${migratedSearch.connected}">${migratedSearch.connected ? "CONNECTED" : "DRY"}</strong></div>
					<div class="state-row"><span>Reach budget</span><strong>${args.drillReach.toFixed(0)}</strong></div>
					<div class="state-row"><span>Retry distance</span><strong>${migratedSearch.distance === null ? "—" : migratedSearch.distance.toFixed(1)}</strong></div>
				</aside>
			</div>
		`;

		return shell.root;
	}
} satisfies Meta<TowerDynamicsArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AcquisitionAndDrilling: Story = {
	play: async ({ canvasElement }) => {
		const t2Ready = canvasElement.querySelector<HTMLElement>("[data-t2-ready]");
		const t3Ready = canvasElement.querySelector<HTMLElement>("[data-t3-ready]");
		const t2Speed = canvasElement.querySelector<HTMLElement>("[data-t2-speed]");
		const t3Speed = canvasElement.querySelector<HTMLElement>("[data-t3-speed]");
		const initial = canvasElement.querySelector<HTMLElement>("[data-initial-connected]");
		const retry = canvasElement.querySelector<HTMLElement>("[data-retry-connected]");
		await expect(t2Ready).not.toBeNull();
		await expect(t3Ready).not.toBeNull();
		await expect(t2Speed).not.toBeNull();
		await expect(t3Speed).not.toBeNull();
		await expect(initial).not.toBeNull();
		await expect(retry).not.toBeNull();
		if (!t2Ready || !t3Ready || !t2Speed || !t3Speed || !initial || !retry) return;

		await expect(Number(t2Speed.dataset.t2Speed)).toBeLessThanOrEqual(T2_LIMITS.maxAngularSpeed + 1e-9);
		await expect(Number(t3Speed.dataset.t3Speed)).toBeLessThanOrEqual(T3_LIMITS.maxAngularSpeed + 1e-9);
		await expect(initial.dataset.initialConnected).toBe("false");
		await expect(retry.dataset.retryConnected).toBe("true");

		const t2Time = Number(t2Ready.dataset.t2Ready);
		const t3Time = Number(t3Ready.dataset.t3Ready);
		if (t2Time >= 0 && t3Time >= 0) {
			await expect(t2Time).toBeLessThan(t3Time);
		}
	}
};
