import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	createGeothermalReservoirState,
	stepGeothermalReservoir,
	type GeothermalReservoirConfig,
	type GeothermalReservoirPhase,
	type GeothermalReservoirState
} from "@defend/gameplay/geothermalReservoir";
import { createLabShell } from "../../labTheme";

type ReservoirArgs = {
	simulationSeconds: number;
	heavyDrawPerSecond: number;
	deepReplenishPerSecond: number;
	pressureBuildPerSecond: number;
};

interface TracePoint {
	time: number;
	energy: number;
	pressure: number;
	phase: GeothermalReservoirPhase;
}

interface ScenarioTrace {
	points: TracePoint[];
	finalState: GeothermalReservoirState;
	eruptionAt: number | null;
	retreatAt: number | null;
	relocationAt: number | null;
}

function config(args: ReservoirArgs): GeothermalReservoirConfig {
	return {
		capacity: 1,
		depletedThreshold: 0.075,
		retreatDelaySeconds: 6,
		retreatDurationSeconds: 3.2,
		deepReplenishPerSecond: args.deepReplenishPerSecond,
		pressureBuildPerSecond: args.pressureBuildPerSecond,
		pressureReliefPerEnergy: 0.8,
		drawRateForPressureSuppression: 0.02,
		eruptionThreshold: 0.96,
		eruptionDurationSeconds: 5.5,
		eruptionEnergyLossPerSecond: 0.07,
		pressureAfterEruption: 0.18
	};
}

function simulate(
	requestedDrawPerSecond: number,
	seconds: number,
	deltaSeconds: number,
	calibration: GeothermalReservoirConfig
): ScenarioTrace {
	let state = createGeothermalReservoirState(0.72, 0.25, calibration);
	const points: TracePoint[] = [];
	let eruptionAt: number | null = null;
	let retreatAt: number | null = null;
	let relocationAt: number | null = null;
	let elapsed = 0;

	while (elapsed <= seconds + 1e-9) {
		points.push({
			time: elapsed,
			energy: state.accessibleEnergy,
			pressure: state.pressure,
			phase: state.phase
		});
		const step = stepGeothermalReservoir(
			state,
			requestedDrawPerSecond,
			deltaSeconds,
			calibration
		);
		state = step.state;
		elapsed += deltaSeconds;
		if (eruptionAt === null && step.eruptionStarted) eruptionAt = elapsed;
		if (retreatAt === null && step.retreatStarted) retreatAt = elapsed;
		if (relocationAt === null && step.relocationReady) relocationAt = elapsed;
	}

	return { points, finalState: state, eruptionAt, retreatAt, relocationAt };
}

function linePath(
	points: TracePoint[],
	seconds: number,
	value: (point: TracePoint) => number,
	top: number,
	height: number
): string {
	const width = 560;
	return points
		.map((point, index) => {
			const x = 18 + (point.time / Math.max(seconds, 0.001)) * width;
			const y = top + height - Math.max(0, Math.min(1, value(point))) * height;
			return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
		})
		.join(" ");
}

function marker(time: number | null, seconds: number, label: string, top: number): string {
	if (time === null) return "";
	const x = 18 + (time / Math.max(seconds, 0.001)) * 560;
	return `<line class="reservoir-marker" x1="${x}" y1="${top}" x2="${x}" y2="${top + 92}" /><text class="reservoir-label" x="${x + 4}" y="${top + 12}">${label}</text>`;
}

const meta = {
	title: "Foundations/Physics/Geothermal Reservoir",
	tags: ["test", "visual"],
	args: {
		simulationSeconds: 60,
		heavyDrawPerSecond: 0.04,
		deepReplenishPerSecond: 0.0055,
		pressureBuildPerSecond: 0.018
	},
	argTypes: {
		simulationSeconds: { control: { type: "range", min: 20, max: 120, step: 5 } },
		heavyDrawPerSecond: { control: { type: "range", min: 0.005, max: 0.07, step: 0.001 } },
		deepReplenishPerSecond: { control: { type: "range", min: 0, max: 0.02, step: 0.0005 } },
		pressureBuildPerSecond: { control: { type: "range", min: 0, max: 0.04, step: 0.001 } }
	},
	render: (args: ReservoirArgs) => {
		const calibration = config(args);
		const heavy = simulate(
			args.heavyDrawPerSecond,
			args.simulationSeconds,
			0.1,
			calibration
		);
		const idle = simulate(0, args.simulationSeconds, 0.1, calibration);
		const heavyEnergy = linePath(heavy.points, args.simulationSeconds, point => point.energy, 34, 92);
		const heavyPressure = linePath(heavy.points, args.simulationSeconds, point => point.pressure, 34, 92);
		const idleEnergy = linePath(idle.points, args.simulationSeconds, point => point.energy, 174, 92);
		const idlePressure = linePath(idle.points, args.simulationSeconds, point => point.pressure, 174, 92);

		const shell = createLabShell(
			"Foundations / physics",
			"Geothermal reservoir lifecycle",
			"Compare two consequences of the same local magma-access rules: concentrated sustained tower fire can deplete a stream until it retreats, while a rich under-used source can accumulate pressure until it erupts. Relocation geometry remains outside this scalar contract."
		);

		shell.frame.innerHTML = `
			<style>
				.reservoir-grid { display:grid; grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr); gap:16px; }
				.reservoir-svg { width:100%; min-height:320px; }
				.reservoir-axis { stroke:rgba(244,237,247,.12); stroke-width:1; }
				.reservoir-energy { fill:none; stroke:#49d7d1; stroke-width:2.4; }
				.reservoir-pressure { fill:none; stroke:#e4b980; stroke-width:1.8; stroke-dasharray:5 4; }
				.reservoir-marker { stroke:rgba(244,237,247,.28); stroke-width:1; stroke-dasharray:3 3; }
				.reservoir-label { fill:rgba(244,237,247,.52); font-size:10px; }
				.reservoir-title { fill:rgba(244,237,247,.68); font-size:12px; font-weight:600; }
				.reservoir-key { display:flex; gap:14px; margin-top:10px; font-size:11px; color:rgba(244,237,247,.58); }
				.reservoir-swatch { display:inline-block; width:18px; height:2px; margin-right:6px; vertical-align:middle; background:#49d7d1; }
				.reservoir-swatch--pressure { background:#e4b980; }
			</style>
			<div class="reservoir-grid">
				<section class="lab__panel lab__stage">
					<svg class="reservoir-svg" viewBox="0 0 610 300" aria-label="Geothermal energy and pressure traces">
						<line class="reservoir-axis" x1="18" y1="126" x2="578" y2="126" />
						<line class="reservoir-axis" x1="18" y1="266" x2="578" y2="266" />
						<text class="reservoir-title" x="18" y="22">concentrated sustained draw</text>
						<text class="reservoir-title" x="18" y="162">rich / unused source</text>
						<path class="reservoir-energy" d="${heavyEnergy}" />
						<path class="reservoir-pressure" d="${heavyPressure}" />
						<path class="reservoir-energy" d="${idleEnergy}" />
						<path class="reservoir-pressure" d="${idlePressure}" />
						${marker(heavy.retreatAt, args.simulationSeconds, "retreat", 34)}
						${marker(heavy.relocationAt, args.simulationSeconds, "relocate", 34)}
						${marker(idle.eruptionAt, args.simulationSeconds, "eruption", 174)}
					</svg>
					<div class="reservoir-key"><span><i class="reservoir-swatch"></i>accessible energy</span><span><i class="reservoir-swatch reservoir-swatch--pressure"></i>pressure</span></div>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Outcomes</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>Heavy-draw phase</dt><dd data-heavy-phase="${heavy.finalState.phase}">${heavy.finalState.phase}</dd></div>
						<div class="lab__metric"><dt>Heavy retreat</dt><dd data-heavy-retreat="${heavy.retreatAt ?? -1}">${heavy.retreatAt === null ? "—" : `${heavy.retreatAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>Relocation ready</dt><dd data-heavy-relocation="${heavy.relocationAt ?? -1}">${heavy.relocationAt === null ? "—" : `${heavy.relocationAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>Idle phase</dt><dd data-idle-phase="${idle.finalState.phase}">${idle.finalState.phase}</dd></div>
						<div class="lab__metric"><dt>Idle eruption</dt><dd data-idle-eruption="${idle.eruptionAt ?? -1}">${idle.eruptionAt === null ? "—" : `${idle.eruptionAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>Deep replenish</dt><dd>${calibration.deepReplenishPerSecond.toFixed(4)} /s</dd></div>
					</dl>
				</aside>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<ReservoirArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DepletionVersusPressure: Story = {
	play: async ({ canvasElement, args }) => {
		const heavyRetreat = canvasElement.querySelector<HTMLElement>("[data-heavy-retreat]");
		const heavyRelocation = canvasElement.querySelector<HTMLElement>("[data-heavy-relocation]");
		const idleEruption = canvasElement.querySelector<HTMLElement>("[data-idle-eruption]");
		await expect(heavyRetreat).not.toBeNull();
		await expect(heavyRelocation).not.toBeNull();
		await expect(idleEruption).not.toBeNull();
		if (!heavyRetreat || !heavyRelocation || !idleEruption) return;

		const calibration = config(args);
		const heavy30 = simulate(args.heavyDrawPerSecond, args.simulationSeconds, 1 / 30, calibration);
		const heavy60 = simulate(args.heavyDrawPerSecond, args.simulationSeconds, 1 / 60, calibration);
		const idle30 = simulate(0, args.simulationSeconds, 1 / 30, calibration);
		const idle60 = simulate(0, args.simulationSeconds, 1 / 60, calibration);

		if (heavy30.retreatAt !== null && heavy60.retreatAt !== null) {
			await expect(Math.abs(heavy30.retreatAt - heavy60.retreatAt)).toBeLessThan(0.2);
		}
		if (idle30.eruptionAt !== null && idle60.eruptionAt !== null) {
			await expect(Math.abs(idle30.eruptionAt - idle60.eruptionAt)).toBeLessThan(0.2);
		}
	}
};
