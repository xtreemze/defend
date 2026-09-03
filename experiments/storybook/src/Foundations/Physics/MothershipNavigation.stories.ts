import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect } from "storybook/test";
import {
	createMothershipNavigationState,
	navigationVectorLength,
	projectMothershipTargetForSector,
	setMothershipRaidSector,
	stepMothershipNavigation,
	type MothershipNavigationConfig,
	type MothershipNavigationState,
	type NavigationVector2
} from "@defend/gameplay/mothershipNavigation";
import { createLabShell } from "../../labTheme";

type NavigationArgs = {
	simulationSeconds: number;
	maxAcceleration: number;
	linearDamping: number;
	attractionStrength: number;
	captureInwardSpeed: number;
};

interface TracePoint {
	time: number;
	position: NavigationVector2;
	reserve: number;
	phase: string;
}

interface NavigationTrace {
	points: TracePoint[];
	finalState: MothershipNavigationState;
	captureAt: number | null;
	maximumSteeringAcceleration: number;
}

function config(args: NavigationArgs): MothershipNavigationConfig {
	return {
		maxAcceleration: args.maxAcceleration,
		maxSpeed: 22,
		linearDamping: args.linearDamping,
		arrivalRadius: 4,
		arrivalBrakeGain: 1.2,
		minimumCruiseSpeed: 4,
		approachSpeedPerDistance: 0.38,
		warningRadius: 31,
		criticalRadius: 17,
		safeTargetRadius: 35,
		targetLaunchOffset: 24,
		attractionStrength: args.attractionStrength,
		criticalAttractionStrength: 34,
		criticalBasePull: 0.45,
		captureRadiusFactor: 0.55,
		captureInwardSpeed: args.captureInwardSpeed,
		capturedAccelerationMultiplier: 1.35,
		overspeedFactor: 1.35,
		hoverDrainPerSecond: 0.0025,
		movementDrainPerAcceleration: 0.00028
	};
}

function simulate(
	initial: MothershipNavigationState,
	seconds: number,
	deltaSeconds: number,
	calibration: MothershipNavigationConfig
): NavigationTrace {
	let state = initial;
	const points: TracePoint[] = [];
	let captureAt: number | null = null;
	let maximumSteeringAcceleration = 0;
	let elapsed = 0;
	while (elapsed <= seconds + 1e-9) {
		points.push({
			time: elapsed,
			position: { x: state.position.x, z: state.position.z },
			reserve: state.reserve,
			phase: state.phase
		});
		const step = stepMothershipNavigation(state, deltaSeconds, calibration);
		state = step.state;
		elapsed += deltaSeconds;
		maximumSteeringAcceleration = Math.max(
			maximumSteeringAcceleration,
			navigationVectorLength(step.steeringAcceleration)
		);
		if (captureAt === null && step.captureStarted) {
			captureAt = elapsed;
		}
	}
	return { points, finalState: state, captureAt, maximumSteeringAcceleration };
}

function path(points: TracePoint[], scale: number, centerX: number, centerY: number): string {
	return points
		.map((point, index) => {
			const x = centerX + point.position.x * scale;
			const y = centerY + point.position.z * scale;
			return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
		})
		.join(" ");
}

const meta = {
	title: "Foundations/Physics/Mothership Navigation",
	tags: ["test", "visual"],
	args: {
		simulationSeconds: 12,
		maxAcceleration: 7.2,
		linearDamping: 0.42,
		attractionStrength: 19,
		captureInwardSpeed: 3
	},
	argTypes: {
		simulationSeconds: { control: { type: "range", min: 4, max: 24, step: 1 } },
		maxAcceleration: { control: { type: "range", min: 2, max: 14, step: 0.2 } },
		linearDamping: { control: { type: "range", min: 0, max: 1.2, step: 0.02 } },
		attractionStrength: { control: { type: "range", min: 0, max: 40, step: 1 } },
		captureInwardSpeed: { control: { type: "range", min: 0.5, max: 10, step: 0.5 } }
	},
	render: (args: NavigationArgs) => {
		const calibration = config(args);
		const start = { x: 48, z: 30 };
		const nearSector = { x: 4, z: 3 };
		const farSector = { x: -66, z: 46 };
		const projection = projectMothershipTargetForSector(
			nearSector,
			start,
			calibration
		);
		const safeTargetDistance = navigationVectorLength(projection.desiredPosition);

		let farState = createMothershipNavigationState(start, 1, nearSector, calibration);
		farState = setMothershipRaidSector(farState, farSector, calibration);
		const farTrace = simulate(farState, args.simulationSeconds, 1 / 60, calibration);

		const captureBase = createMothershipNavigationState(
			{ x: 13, z: 0 },
			1,
			nearSector,
			calibration
		);
		const captureState: MothershipNavigationState = {
			...captureBase,
			velocity: { x: -8, z: 0 },
			phase: "critical"
		};
		const captureTrace = simulate(captureState, 2, 1 / 60, calibration);
		const capture30 = simulate(captureState, 2, 1 / 30, calibration);
		const capture60 = simulate(captureState, 2, 1 / 60, calibration);

		const centerX = 250;
		const centerY = 180;
		const worldScale = 2.2;
		const warningR = calibration.warningRadius * worldScale;
		const criticalR = calibration.criticalRadius * worldScale;
		const safeR = calibration.safeTargetRadius * worldScale;
		const desiredX = centerX + projection.desiredPosition.x * worldScale;
		const desiredY = centerY + projection.desiredPosition.z * worldScale;
		const nearX = centerX + nearSector.x * worldScale;
		const nearY = centerY + nearSector.z * worldScale;

		const shell = createLabShell(
			"Foundations / physics",
			"Mothership inertia and silo attraction",
			"Ground input chooses intent, not position. A near-silo raid sector is projected to a safe ship target, but persistent inward momentum can still carry the vessel into the attraction field and eventually remove steering authority. Propulsion energy follows engine steering effort; the silo field itself is external."
		);

		shell.frame.innerHTML = `
			<style>
				.nav-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr); gap:16px; }
				.nav-map { width:100%; min-height:410px; }
				.nav-ring { fill:none; vector-effect:non-scaling-stroke; }
				.nav-warning { stroke:rgba(228,185,128,.28); stroke-dasharray:6 5; }
				.nav-critical { stroke:rgba(239,90,104,.38); stroke-width:1.5; }
				.nav-safe { stroke:rgba(73,215,209,.22); stroke-dasharray:3 5; }
				.nav-far-path { fill:none; stroke:#e4b980; stroke-width:2.2; }
				.nav-capture-path { fill:none; stroke:#b46bd3; stroke-width:2.2; }
				.nav-sector { fill:#49d7d1; }
				.nav-target { fill:none; stroke:#f4edf7; stroke-width:2; }
				.nav-link { stroke:rgba(244,237,247,.26); stroke-dasharray:4 4; }
				.nav-label { fill:rgba(244,237,247,.5); font-size:10px; }
			</style>
			<div class="nav-grid">
				<section class="lab__panel lab__stage">
					<svg class="nav-map" viewBox="0 0 500 370" aria-label="Mothership navigation traces around the silo">
						<circle class="nav-ring nav-safe" cx="${centerX}" cy="${centerY}" r="${safeR}" />
						<circle class="nav-ring nav-warning" cx="${centerX}" cy="${centerY}" r="${warningR}" />
						<circle class="nav-ring nav-critical" cx="${centerX}" cy="${centerY}" r="${criticalR}" />
						<circle cx="${centerX}" cy="${centerY}" r="9" fill="rgba(73,215,209,.38)" />
						<path class="nav-far-path" d="${path(farTrace.points, worldScale, centerX, centerY)}" />
						<path class="nav-capture-path" d="${path(captureTrace.points, worldScale, centerX, centerY)}" />
						<line class="nav-link" x1="${nearX}" y1="${nearY}" x2="${desiredX}" y2="${desiredY}" />
						<circle class="nav-sector" cx="${nearX}" cy="${nearY}" r="5" />
						<circle class="nav-target" cx="${desiredX}" cy="${desiredY}" r="6" />
						<text class="nav-label" x="18" y="24">copper = commanded far reposition · violet = dangerous inertial approach</text>
					</svg>
				</section>
				<aside class="lab__panel lab__panel--padded">
					<h2 class="lab__section-title">Navigation contract</h2>
					<dl class="lab__metrics">
						<div class="lab__metric"><dt>Near target projected</dt><dd data-projected="${projection.projected}">${projection.projected ? "YES" : "NO"}</dd></div>
						<div class="lab__metric"><dt>Safe target radius</dt><dd data-target-distance="${safeTargetDistance}">${safeTargetDistance.toFixed(2)}</dd></div>
						<div class="lab__metric"><dt>Max engine acceleration</dt><dd data-max-steering="${farTrace.maximumSteeringAcceleration}">${farTrace.maximumSteeringAcceleration.toFixed(2)}</dd></div>
						<div class="lab__metric"><dt>Far final speed</dt><dd>${navigationVectorLength(farTrace.finalState.velocity).toFixed(2)}</dd></div>
						<div class="lab__metric"><dt>Far reserve</dt><dd>${(farTrace.finalState.reserve * 100).toFixed(2)}%</dd></div>
						<div class="lab__metric"><dt>Capture @ 60 Hz</dt><dd data-capture60="${capture60.captureAt ?? -1}">${capture60.captureAt === null ? "—" : `${capture60.captureAt.toFixed(3)} s`}</dd></div>
						<div class="lab__metric"><dt>Capture @ 30 Hz</dt><dd data-capture30="${capture30.captureAt ?? -1}">${capture30.captureAt === null ? "—" : `${capture30.captureAt.toFixed(3)} s`}</dd></div>
						<div class="lab__metric"><dt>Captured movement cost</dt><dd>${(captureTrace.finalState.totalMovementEnergy * 100).toFixed(3)}%</dd></div>
					</dl>
				</aside>
			</div>
		`;
		return shell.root;
	}
} satisfies Meta<NavigationArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjectionInertiaAndCapture: Story = {
	play: async ({ canvasElement, args }) => {
		const projected = canvasElement.querySelector<HTMLElement>("[data-projected]");
		const targetDistance = canvasElement.querySelector<HTMLElement>("[data-target-distance]");
		const maxSteering = canvasElement.querySelector<HTMLElement>("[data-max-steering]");
		const capture30 = canvasElement.querySelector<HTMLElement>("[data-capture30]");
		const capture60 = canvasElement.querySelector<HTMLElement>("[data-capture60]");
		await expect(projected).not.toBeNull();
		await expect(targetDistance).not.toBeNull();
		await expect(maxSteering).not.toBeNull();
		await expect(capture30).not.toBeNull();
		await expect(capture60).not.toBeNull();
		if (!projected || !targetDistance || !maxSteering || !capture30 || !capture60) return;

		await expect(projected.dataset.projected).toBe("true");
		await expect(Number(targetDistance.dataset.targetDistance)).toBeGreaterThanOrEqual(35 - 1e-9);
		await expect(Number(maxSteering.dataset.maxSteering)).toBeLessThanOrEqual(args.maxAcceleration + 1e-9);
		const t30 = Number(capture30.dataset.capture30);
		const t60 = Number(capture60.dataset.capture60);
		if (t30 >= 0 && t60 >= 0) {
			await expect(Math.abs(t30 - t60)).toBeLessThan(0.08);
		}
	}
};
