export interface TurretSlewLimits {
	maxAngularSpeed: number;
	angularAcceleration: number;
	aimTolerance: number;
	fireAngularSpeedTolerance: number;
}

export interface TurretSlewState {
	yaw: number;
	angularVelocity: number;
}

export interface TurretSlewStep extends TurretSlewState {
	aimError: number;
	ready: boolean;
}

const TWO_PI = Math.PI * 2;

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function sign(value: number): number {
	if (value > 0) {
		return 1;
	}
	if (value < 0) {
		return -1;
	}
	return 0;
}

function positive(value: number): number {
	return Math.max(0, finite(value));
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, finite(value, minimum)));
}

export function normalizeYaw(yaw: number): number {
	const value = finite(yaw);
	return Math.atan2(Math.sin(value), Math.cos(value));
}

export function shortestYawDelta(currentYaw: number, targetYaw: number): number {
	return normalizeYaw(finite(targetYaw) - finite(currentYaw));
}

/**
 * Heading away from the silo in the X/Z plane. Yaw zero points toward +Z.
 * Renderers whose model-forward axis differs can apply a fixed model offset.
 */
export function outwardRestYaw(
	towerX: number,
	towerZ: number,
	siloX: number,
	siloZ: number
): number {
	const dx = finite(towerX) - finite(siloX);
	const dz = finite(towerZ) - finite(siloZ);
	if (Math.abs(dx) + Math.abs(dz) < 1e-9) {
		return 0;
	}
	return normalizeYaw(Math.atan2(dx, dz));
}

export function turretReadyToFire(
	currentYaw: number,
	targetYaw: number,
	angularVelocity: number,
	aimTolerance: number,
	fireAngularSpeedTolerance: number
): boolean {
	return (
		Math.abs(shortestYawDelta(currentYaw, targetYaw)) <= positive(aimTolerance) &&
		Math.abs(finite(angularVelocity)) <= positive(fireAngularSpeedTolerance)
	);
}

/**
 * Advance one acceleration-limited turret slew step. The desired angular speed
 * uses braking distance so the turret decelerates before reaching the target
 * rather than snapping or oscillating through it.
 */
export function stepTurretSlew(
	state: TurretSlewState,
	targetYaw: number,
	deltaSeconds: number,
	limits: TurretSlewLimits
): TurretSlewStep {
	const dt = positive(deltaSeconds);
	const maxSpeed = positive(limits.maxAngularSpeed);
	const acceleration = positive(limits.angularAcceleration);
	const tolerance = positive(limits.aimTolerance);
	const fireSpeedTolerance = positive(limits.fireAngularSpeedTolerance);
	let yaw = normalizeYaw(state.yaw);
	let velocity = clamp(state.angularVelocity, -maxSpeed, maxSpeed);
	let error = shortestYawDelta(yaw, targetYaw);

	if (dt > 0 && acceleration > 0 && maxSpeed > 0 && Math.abs(error) > 1e-9) {
		const brakingSpeed = Math.sqrt(2 * acceleration * Math.abs(error));
		const desiredSpeed = Math.min(maxSpeed, brakingSpeed);
		const desiredVelocity = sign(error) * desiredSpeed;
		const maxVelocityChange = acceleration * dt;
		velocity += clamp(
			desiredVelocity - velocity,
			-maxVelocityChange,
			maxVelocityChange
		);
		velocity = clamp(velocity, -maxSpeed, maxSpeed);

		const proposedStep = velocity * dt;
		if (
			sign(proposedStep) === sign(error) &&
			Math.abs(proposedStep) >= Math.abs(error)
		) {
			yaw = normalizeYaw(targetYaw);
			velocity = 0;
		} else {
			yaw = normalizeYaw(yaw + proposedStep);
		}
	}

	error = shortestYawDelta(yaw, targetYaw);
	if (
		Math.abs(error) <= tolerance &&
		Math.abs(velocity) <= fireSpeedTolerance
	) {
		velocity = 0;
	}

	return {
		yaw,
		angularVelocity: velocity,
		aimError: error,
		ready: turretReadyToFire(
			yaw,
			targetYaw,
			velocity,
			tolerance,
			fireSpeedTolerance
		)
	};
}

export function yawDegrees(yaw: number): number {
	const degrees = (normalizeYaw(yaw) * 180) / Math.PI;
	return (degrees + 360) % 360;
}

export function yawRadians(degrees: number): number {
	return normalizeYaw((finite(degrees) * TWO_PI) / 360);
}
