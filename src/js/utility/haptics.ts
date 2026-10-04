type HapticEvent =
	| "shoot"
	| "hit"
	| "explode"
	| "bankHit"
	| "newWave"
	| "addTower"
	| "removeTower"
	| "defeat"
	| "victory";

interface HapticSpec {
	pattern: number[];
	priority: number;
	cooldown: number;
}

// Short, distinct pulses; stronger events outrank and interrupt weaker ones.
const specs: { [key in HapticEvent]: HapticSpec } = {
	shoot: { pattern: [2], priority: 0, cooldown: 350 },
	hit: { pattern: [8], priority: 1, cooldown: 100 },
	explode: { pattern: [22], priority: 2, cooldown: 80 },
	addTower: { pattern: [12, 25, 12], priority: 3, cooldown: 60 },
	removeTower: { pattern: [30], priority: 3, cooldown: 60 },
	newWave: { pattern: [18, 40, 18], priority: 4, cooldown: 500 },
	bankHit: { pattern: [45, 30, 45], priority: 5, cooldown: 250 },
	victory: { pattern: [30, 50, 30, 50, 120], priority: 6, cooldown: 1000 },
	defeat: { pattern: [90, 60, 90, 60, 260], priority: 6, cooldown: 1000 }
};

const canVibrate =
	typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

let busyUntil = 0;
let busyPriority = -1;
const lastFired: { [key: string]: number } = {};

function haptic(event: HapticEvent) {
	if (!canVibrate) {
		return;
	}
	const spec = specs[event];
	const now = Date.now();
	if (now - (lastFired[event] || 0) < spec.cooldown) {
		return;
	}
	if (now < busyUntil && spec.priority <= busyPriority) {
		return;
	}
	lastFired[event] = now;
	busyPriority = spec.priority;
	busyUntil = now + spec.pattern.reduce((total, ms) => total + ms, 0);
	navigator.vibrate(spec.pattern);
}

export { haptic, HapticEvent };
