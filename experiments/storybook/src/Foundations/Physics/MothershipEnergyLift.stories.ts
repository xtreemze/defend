import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	createMothershipEnergyLiftState,
	stepMothershipEnergyLift,
	type MothershipEnergyLiftConfig,
	type MothershipEnergyLiftState
} from "@defend/gameplay/mothershipEnergyLift";
import { createLabShell } from "../../labTheme";

type LiftArgs = {
	simulationSeconds: number;
	externalSpendPerSecond: number;
	extractionAtSeconds: number;
	extractionEnergy: number;
};

interface TracePoint {
	time: number;
	reserve: number;
	altitude: number;
	phase: string;
}

interface LiftTrace {
	points: TracePoint[];
	finalState: MothershipEnergyLiftState;
	fallAt: number | null;
	hulkAt: number | null;
}

function config(): MothershipEnergyLiftConfig {
	return {
		capacity: 1,
		lowReserve: 0.38,
		criticalReserve: 0.2,
		fallReserve: 0.1,
		hoverDrainPerSecond: 0.0065,
		fallDrainPerSecond: 0.002,
		startAltitude: 56,
		hulkCenterAltitude: 18,
		reserveSagDistance: 12,
		maxLiftStiffness: 4.4,
		minimumLiftStiffnessFactor: 0.32,
		baseVerticalDamping: 1.1,
		additionalVerticalDamping: 3.1,
		baseWobbleAmplitude: 0.08,
		depletionWobbleAmplitude: 1.5,
		baseWobbleFrequency: 1.2,
		depletionWobbleFrequency: 1.8,
		gravity: 9.81,
		impactBounceThreshold: 4,
		impactRestitution: 0.12,
		allowFallRecovery: false
	};
}

function simulate(
	seconds: number,
	deltaSeconds: number,
	externalSpendPerSecond: number,
	extractionAtSeconds: number | null,
	extractionEnergy: number
): LiftTrace {
	const calibration = config();
	let state = createMothershipEnergyLiftState(calibration.capacity, calibration);
	const points: TracePoint[] = [];
	let fallAt: number | null = null;
	let hulkAt: number | null = null;
	let elapsed = 0;
	let extractionApplied = false;

	while (elapsed <= seconds + 1e-9) {
		points.push({
			time: elapsed,
			reserve: state.reserve / calibration.capacity,
			altitude: state.altitude,
			phase: state.phase
		});
		const shouldExtract =
			extractionAtSeconds !== null &&
			!extractionApplied &&
			elapsed <= extractionAtSeconds &&
			elapsed + deltaSeconds > extractionAtSeconds;
		const step = stepMothershipEnergyLift(
			state,
			{
				inflowEnergy: shouldExtract ? extractionEnergy : 0,
				externalSpendEnergy: externalSpendPerSecond * deltaSeconds
			},
			deltaSeconds,
			calibration
		);
		state = step.state;
		if (shouldExtract) extractionApplied = true;
		elapsed += deltaSeconds;
		if (fallAt === null && step.fallStarted) fallAt = elapsed;
		if (hulkAt === null && step.becameHulk) hulkAt = elapsed;
		if (state.phase === "hulk" && elapsed > (hulkAt ?? elapsed) + 1) break;
	}
	return { points, finalState: state, fallAt, hulkAt };
}

function linePath(
	points: TracePoint[],
	seconds: number,
	value: (point: TracePoint) => number,
	top: number,
	height: number
): string {
	const width = 540;
	return points
		.map((point, index) => {
			const x = 20 + (point.time / Math.max(1, seconds)) * width;
			const normalized = Math.max(0, Math.min(1, value(point)));
			const y = top + height - normalized * height;
			return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
		})
		.join(" ");
}

function eventMarker(
	time: number | null,
	seconds: number,
	label: string,
	top: number,
	height: number
): string {
	if (time === null || time > seconds) return "";
	const x = 20 + (time / Math.max(1, seconds)) * 540;
	return `<line class="lift-marker" x1="${x}" y1="${top}" x2="${x}" y2="${top + height}" /><text class="lift-label" x="${x + 4}" y="${top + 12}">${label}</text>`;
}

const meta = {
	title: "Foundations/Physics/Mothership Energy & Lift",
	tags: ["test", "visual"],
	args: {
		simulationSeconds: 170,
		externalSpendPerSecond: 0.002,
		extractionAtSeconds: 70,
		extractionEnergy: 0.35
	},
	argTypes: {
		simulationSeconds: { control: { type: "range", min: 80, max: 240, step: 5 } },
		externalSpendPerSecond: { control: { type: "range", min: 0, max: 0.01, step: 0.00025 } },
		extractionAtSeconds: { control: { type: "range", min: 10, max: 160, step: 5 } },
		extractionEnergy: { control: { type: "range", min: 0, max: 0.7, step: 0.025 } }
	},
	render: (args: LiftArgs) => {
		const calibration = config();
		const dry = simulate(
			args.simulationSeconds,
			0.1,
			args.externalSpendPerSecond,
			null,
			0
		);
		const replenished = simulate(
			args.simulationSeconds,
			0.1,
			args.externalSpendPerSecond,
			args.extractionAtSeconds,
			args.extractionEnergy
		);
		const dry30 = simulate(
			args.simulationSeconds,
			1 / 30,
			args.externalSpendPerSecond,
			null,
			0
		);
		const dry60 = simulate(
			args.simulationSeconds,
			1 / 60,
			args.externalSpendPerSecond,
			null,
			0
		);

		const reserveDry = linePath(dry.points, args.simulationSeconds, point => point.reserve, 36, 92);
		const altitudeDry = linePath(
			dry.points,
			args.simulationSeconds,
			point =>
				(point.altitude - calibration.hulkCenterAltitude) /
				(calibration.startAltitude - calibration.hulkCenterAltitude),
			36,
			92
		);
		const reserveRefill = linePath(replenished.points, args.simulationSeconds, point => point.reserve, 186, 92);
		const altitudeRefill = linePath(
			replenished.points,
			args.simulationSeconds,
			point =>
				(point.altitude - calibration.hulkCenterAltitude) /
				(calibration.startAltitude - calibration.hulkCenterAltitude),
			186,
			92
		);

		const shell = createLabShell(
			"Foundations / physics",
			"Mothership energy and loss of lift",
			"One teal reserve is authoritative for suspension and all externally requested spending. Hover creates a finite raid horizon; movement/launch demand shortens it; extraction can extend it. Once the configured loss-of-lift threshold is crossed, this fixture follows the current irreversible-fall hypothesis through impact and a persistent hulk."
		);

		shell.frame.innerHTML = `
			<style>
				.lift-grid { display:grid; grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr); gap:16px; }
				.lift-chart { width:100%; min-height:340px; }
				.lift-axis { stroke:rgba(244,237,247,.12); stroke-width:1; }
				.lift-reserve { fill:none; stroke:#49d7d1; stroke-width:2.3; }
				.lift-altitude { fill:none; stroke:#e4b980; stroke-width:1.9; stroke-dasharray:6 4; }
				.lift-marker { stroke:rgba(244,237,247,.28); stroke-width:1; stroke-dasharray:3 3; }
				.lift-label { fill:rgba(244,237,247,.52); font-size:10px; }
				.lift-title { fill:rgba(244,237,247,.68); font-size:12px; font-weight:600; }
				.lift-key { display:flex; gap:14px; margin-top:10px; font-size:11px; color:rgba(244,237,247,.58); }
				.lift-swatch { display:inline-block; width:18px; height:2px; margin-right:6px; vertical-align:middle; background:#49d7d1; }
				.lift-swatch--alt { background:#e4b980; }
			</style>
			<div class="lift-grid">
				<section class="lab__panel lab__stage">
					<svg class="lift-chart" viewBox="0 0 590 315" aria-label="Mothership reserve and altitude traces">
						<line class="lift-axis" x1="20" y1="128" x2="560" y2="128" />
						<line class="lift-axis" x1="20" y1="278" x2="560" y2="278" />
						<text class="lift-title" x="20" y="23">raid without extraction</text>
						<text class="lift-title" x="20" y="173">same spend + successful extraction</text>
						<path class="lift-reserve" d="${reserveDry}" />
						<path class="lift-altitude" d="${altitudeDry}" />
						<path class="lift-reserve" d="${reserveRefill}" />
						<path class="lift-altitude" d="${altitudeRefill}" />
						${eventMarker(dry.fallAt, args.simulationSeconds, "fall", 36, 92)}
						${eventMarker(dry.hulkAt, args.simulationSeconds, "hulk", 36, 92)}
						${eventMarker(args.extractionAtSeconds, args.simulationSeconds, "extract", 186, 92)}
						${eventMarker(replenished.fallAt, args.simulationSeconds, "fall", 186, 92)}
						${eventMarker(replenished.hulkAt, args.simulationSeconds, "hulk", 186, 92)}
					</svg>
					<div class="lift-key"><span><i class="lift-swatch"></i>reserve</span><span><i class="lift-swatch lift-swatch--alt"></i>altitude</span></div>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Lifecycle outcomes</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>Dry fall</dt><dd data-dry-fall="${dry.fallAt ?? -1}">${dry.fallAt === null ? "—" : `${dry.fallAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>Dry hulk</dt><dd data-dry-hulk="${dry.hulkAt ?? -1}">${dry.hulkAt === null ? "—" : `${dry.hulkAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>Replenished fall</dt><dd data-refill-fall="${replenished.fallAt ?? -1}">${replenished.fallAt === null ? "—" : `${replenished.fallAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>Replenished hulk</dt><dd>${replenished.hulkAt === null ? "—" : `${replenished.hulkAt.toFixed(1)} s`}</dd></div>
						<div class="lab__metric"><dt>30 Hz dry hulk</dt><dd data-hulk30="${dry30.hulkAt ?? -1}">${dry30.hulkAt === null ? "—" : `${dry30.hulkAt.toFixed(3)} s`}</dd></div>
						<div class="lab__metric"><dt>60 Hz dry hulk</dt><dd data-hulk60="${dry60.hulkAt ?? -1}">${dry60.hulkAt === null ? "—" : `${dry60.hulkAt.toFixed(3)} s`}</dd></div>
						<div class="lab__metric"><dt>Final dry phase</dt><dd>${dry.finalState.phase}</dd></div>
						<div class="lab__metric"><dt>Final refill phase</dt><dd>${replenished.finalState.phase}</dd></div>
					</dl>
				</aside>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<LiftArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiniteRaidHorizon: Story = {
	play: async ({ canvasElement }) => {
		const dryFall = canvasElement.querySelector<HTMLElement>("[data-dry-fall]");
		const dryHulk = canvasElement.querySelector<HTMLElement>("[data-dry-hulk]");
		const refillFall = canvasElement.querySelector<HTMLElement>("[data-refill-fall]");
		const hulk30 = canvasElement.querySelector<HTMLElement>("[data-hulk30]");
		const hulk60 = canvasElement.querySelector<HTMLElement>("[data-hulk60]");
		await expect(dryFall).not.toBeNull();
		await expect(dryHulk).not.toBeNull();
		await expect(refillFall).not.toBeNull();
		await expect(hulk30).not.toBeNull();
		await expect(hulk60).not.toBeNull();
		if (!dryFall || !dryHulk || !refillFall || !hulk30 || !hulk60) return;

		const fall = Number(dryFall.dataset.dryFall);
		const hulk = Number(dryHulk.dataset.dryHulk);
		const refill = Number(refillFall.dataset.refillFall);
		if (fall >= 0 && hulk >= 0) await expect(fall).toBeLessThan(hulk);
		if (fall >= 0 && refill >= 0) await expect(fall).toBeLessThan(refill);
		const t30 = Number(hulk30.dataset.hulk30);
		const t60 = Number(hulk60.dataset.hulk60);
		if (t30 >= 0 && t60 >= 0) {
			await expect(Math.abs(t30 - t60)).toBeLessThan(0.12);
		}
	}
};
