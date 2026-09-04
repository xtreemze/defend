export type RaiderTier = 1 | 2 | 3;

export type DeterrenceState =
	| "CONTESTED"
	| "ADAPTING"
	| "PROBING"
	| "DETERRENT_QUIET"
	| "STRATEGIC_STARVATION";

export type DeterrencePolicyId =
	| "competent-defense"
	| "intentional-leak"
	| "over-fortified"
	| "resource-conservative"
	| "passive-isolation";

export interface DeterrencePolicyProfile {
	id: DeterrencePolicyId;
	label: string;
	defenseStrength: number;
	deliberateLeakBias: number;
	upkeepPerOpportunity: number;
}

export interface RaiderEconomyProfile {
	tier: RaiderTier;
	committedEnergy: number;
	extractionPotential: number;
	baseBreachChance: number;
	resistance: number;
	recoverableFraction: number;
}

export interface DeterrenceModelConfig {
	horizon: number;
	maxDefenderEnergy: number;
	initialDefenderEnergy: number;
	initialAttackerConfidence: number;
	collectionEfficiency: number;
	confidenceSmoothing: number;
	idleConfidenceDecay: number;
	travelCost: number;
	breachLossMultiplier: number;
	starvationThreshold: number;
	confidenceHysteresis: number;
}

export interface DeterrenceStep {
	opportunity: number;
	stateBefore: DeterrenceState;
	stateAfter: DeterrenceState;
	defenderEnergyBefore: number;
	defenderEnergyAfter: number;
	attackerConfidenceBefore: number;
	attackerConfidenceAfter: number;
	raidOccurred: boolean;
	tier: RaiderTier | null;
	breached: boolean;
	remainingViability: number;
	committedEnergy: number;
	extractedEnergy: number;
	defenderRecoveredEnergy: number;
	defenderBreachLoss: number;
	attackerNetReturn: number;
}

export interface DeterrenceStateCounts {
	contested: number;
	adapting: number;
	probing: number;
	quiet: number;
	starvation: number;
}

export interface DeterrenceSummary {
	policy: DeterrencePolicyId;
	label: string;
	survivalOpportunities: number;
	ruined: boolean;
	endingDefenderEnergy: number;
	raids: number;
	breaches: number;
	totalAttackerCommittedEnergy: number;
	totalAttackerExtractedEnergy: number;
	totalDefenderRecoveredEnergy: number;
	totalDefenderBreachLoss: number;
	attackerReturnOnCommitment: number;
	stateCounts: DeterrenceStateCounts;
}

export interface DeterrenceScenarioResult {
	policy: DeterrencePolicyProfile;
	steps: DeterrenceStep[];
	summary: DeterrenceSummary;
}

const UINT32_RANGE = 4294967296;

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function nonNegative(value: number, fallback = 0): number {
	return Math.max(0, finite(value, fallback));
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, finite(value, minimum)));
}

function clamp01(value: number): number {
	return clamp(value, 0, 1);
}

function normalizedConfig(config: DeterrenceModelConfig): DeterrenceModelConfig {
	const maximum = Math.max(1, nonNegative(config.maxDefenderEnergy, 30000));
	return {
		horizon: Math.max(1, Math.floor(nonNegative(config.horizon, 120))),
		maxDefenderEnergy: maximum,
		initialDefenderEnergy: clamp(
			config.initialDefenderEnergy,
			0,
			maximum
		),
		initialAttackerConfidence: clamp01(config.initialAttackerConfidence),
		collectionEfficiency: clamp01(config.collectionEfficiency),
		confidenceSmoothing: clamp01(config.confidenceSmoothing),
		idleConfidenceDecay: clamp01(config.idleConfidenceDecay),
		travelCost: nonNegative(config.travelCost),
		breachLossMultiplier: nonNegative(config.breachLossMultiplier, 1),
		starvationThreshold: clamp(config.starvationThreshold, 0, maximum),
		confidenceHysteresis: clamp(config.confidenceHysteresis, 0, 0.2)
	};
}

function normalizedPolicy(
	policy: DeterrencePolicyProfile
): DeterrencePolicyProfile {
	return {
		id: policy.id,
		label: policy.label,
		defenseStrength: clamp01(policy.defenseStrength),
		deliberateLeakBias: clamp(policy.deliberateLeakBias, -0.5, 0.5),
		upkeepPerOpportunity: nonNegative(policy.upkeepPerOpportunity)
	};
}

function normalizedRaider(
	profile: RaiderEconomyProfile
): RaiderEconomyProfile {
	return {
		tier: profile.tier,
		committedEnergy: nonNegative(profile.committedEnergy),
		extractionPotential: nonNegative(profile.extractionPotential),
		baseBreachChance: clamp01(profile.baseBreachChance),
		resistance: clamp01(profile.resistance),
		recoverableFraction: clamp01(profile.recoverableFraction)
	};
}

/**
 * Deterministic 32-bit LCG. This is an experiment repeatability tool, not a
 * gameplay-randomness recommendation.
 */
export function createDeterrenceRandom(seed: number): () => number {
	let state = Math.floor(finite(seed, 1)) >>> 0;
	return () => {
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
		return state / UINT32_RANGE;
	};
}

function candidateState(
	confidence: number,
	energy: number,
	config: DeterrenceModelConfig
): DeterrenceState {
	if (energy <= config.starvationThreshold && confidence < 0.18) {
		return "STRATEGIC_STARVATION";
	}
	if (confidence >= 0.62) return "CONTESTED";
	if (confidence >= 0.42) return "ADAPTING";
	if (confidence >= 0.2) return "PROBING";
	return "DETERRENT_QUIET";
}

/**
 * Small confidence hysteresis prevents one marginal result from bouncing the
 * conceptual world state across a threshold every opportunity.
 */
export function resolveDeterrenceState(
	previous: DeterrenceState,
	confidenceInput: number,
	energyInput: number,
	configInput: DeterrenceModelConfig
): DeterrenceState {
	const config = normalizedConfig(configInput);
	const confidence = clamp01(confidenceInput);
	const energy = clamp(energyInput, 0, config.maxDefenderEnergy);
	const hysteresis = config.confidenceHysteresis;

	if (
		previous === "STRATEGIC_STARVATION" &&
		energy <= config.starvationThreshold * 1.15 &&
		confidence < 0.2 + hysteresis
	) {
		return "STRATEGIC_STARVATION";
	}
	if (energy <= config.starvationThreshold && confidence < 0.18) {
		return "STRATEGIC_STARVATION";
	}

	if (previous === "CONTESTED" && confidence >= 0.62 - hysteresis) {
		return "CONTESTED";
	}
	if (
		previous === "ADAPTING" &&
		confidence >= 0.42 - hysteresis &&
		confidence < 0.62 + hysteresis
	) {
		return "ADAPTING";
	}
	if (
		previous === "PROBING" &&
		confidence >= 0.2 - hysteresis &&
		confidence < 0.42 + hysteresis
	) {
		return "PROBING";
	}
	if (
		previous === "DETERRENT_QUIET" &&
		confidence < 0.2 + hysteresis
	) {
		return "DETERRENT_QUIET";
	}

	return candidateState(confidence, energy, config);
}

export function deterrenceRaidChance(state: DeterrenceState): number {
	if (state === "CONTESTED") return 0.94;
	if (state === "ADAPTING") return 0.72;
	if (state === "PROBING") return 0.42;
	if (state === "DETERRENT_QUIET") return 0.12;
	return 0.06;
}

export function selectDeterrenceRaidTier(
	state: DeterrenceState,
	randomValue: number
): RaiderTier {
	const value = clamp01(randomValue);
	if (state === "CONTESTED") {
		if (value < 0.25) return 1;
		if (value < 0.7) return 2;
		return 3;
	}
	if (state === "ADAPTING") {
		if (value < 0.45) return 1;
		if (value < 0.85) return 2;
		return 3;
	}
	return value < 0.9 ? 1 : 2;
}

function raiderForTier(
	tier: RaiderTier,
	profiles: RaiderEconomyProfile[]
): RaiderEconomyProfile {
	for (let index = 0; index < profiles.length; index += 1) {
		if (profiles[index].tier === tier) {
			return normalizedRaider(profiles[index]);
		}
	}
	throw new Error(`Missing Raider ${tier} economy profile`);
}

function stateCounts(): DeterrenceStateCounts {
	return {
		contested: 0,
		adapting: 0,
		probing: 0,
		quiet: 0,
		starvation: 0
	};
}

function countState(
	counts: DeterrenceStateCounts,
	state: DeterrenceState
): void {
	if (state === "CONTESTED") counts.contested += 1;
	else if (state === "ADAPTING") counts.adapting += 1;
	else if (state === "PROBING") counts.probing += 1;
	else if (state === "DETERRENT_QUIET") counts.quiet += 1;
	else counts.starvation += 1;
}

export function runDeterrenceScenario(
	policyInput: DeterrencePolicyProfile,
	configInput: DeterrenceModelConfig,
	raiderProfiles: RaiderEconomyProfile[],
	seed = 1
): DeterrenceScenarioResult {
	const policy = normalizedPolicy(policyInput);
	const config = normalizedConfig(configInput);
	const random = createDeterrenceRandom(seed);
	const steps: DeterrenceStep[] = [];

	let defenderEnergy = config.initialDefenderEnergy;
	let attackerConfidence = config.initialAttackerConfidence;
	let state = candidateState(attackerConfidence, defenderEnergy, config);

	for (let opportunity = 0; opportunity < config.horizon; opportunity += 1) {
		const energyBefore = defenderEnergy;
		const confidenceBefore = attackerConfidence;
		const stateBefore = state;

		defenderEnergy = Math.max(
			0,
			defenderEnergy - policy.upkeepPerOpportunity
		);

		state = resolveDeterrenceState(
			state,
			attackerConfidence,
			defenderEnergy,
			config
		);

		if (defenderEnergy <= 0) {
			steps.push({
				opportunity,
				stateBefore,
				stateAfter: state,
				defenderEnergyBefore: energyBefore,
				defenderEnergyAfter: 0,
				attackerConfidenceBefore: confidenceBefore,
				attackerConfidenceAfter: attackerConfidence,
				raidOccurred: false,
				tier: null,
				breached: false,
				remainingViability: 0,
				committedEnergy: 0,
				extractedEnergy: 0,
				defenderRecoveredEnergy: 0,
				defenderBreachLoss: 0,
				attackerNetReturn: 0
			});
			break;
		}

		const raidOccurred = random() < deterrenceRaidChance(state);
		if (!raidOccurred) {
			attackerConfidence = clamp01(
				attackerConfidence - config.idleConfidenceDecay
			);
			state = resolveDeterrenceState(
				state,
				attackerConfidence,
				defenderEnergy,
				config
			);
			steps.push({
				opportunity,
				stateBefore,
				stateAfter: state,
				defenderEnergyBefore: energyBefore,
				defenderEnergyAfter: defenderEnergy,
				attackerConfidenceBefore: confidenceBefore,
				attackerConfidenceAfter: attackerConfidence,
				raidOccurred: false,
				tier: null,
				breached: false,
				remainingViability: 0,
				committedEnergy: 0,
				extractedEnergy: 0,
				defenderRecoveredEnergy: 0,
				defenderBreachLoss: 0,
				attackerNetReturn: 0
			});
			continue;
		}

		const tier = selectDeterrenceRaidTier(state, random());
		const raider = raiderForTier(tier, raiderProfiles);
		const breachChance = clamp01(
			raider.baseBreachChance +
				policy.deliberateLeakBias -
				policy.defenseStrength * (0.52 - raider.resistance * 0.18)
		);
		const breached = random() < breachChance;
		let remainingViability = 0;
		if (breached) {
			const jitter = (random() - 0.5) * 0.08;
			remainingViability = clamp(
				0.86 -
					policy.defenseStrength *
						(0.78 - raider.resistance * 0.2) +
					jitter,
				0.08,
				0.95
			);
		}

		const extractedEnergy = breached
			? raider.extractionPotential * remainingViability
			: 0;
		const defenderBreachLoss =
			extractedEnergy * config.breachLossMultiplier;

		const liberatedFraction = clamp01(
			0.35 +
				policy.defenseStrength * 0.55 -
				remainingViability * 0.25
		);
		const defenderRecoveredEnergy = Math.min(
			raider.committedEnergy,
			raider.committedEnergy *
				raider.recoverableFraction *
				liberatedFraction *
				config.collectionEfficiency
		);

		defenderEnergy = clamp(
			defenderEnergy + defenderRecoveredEnergy - defenderBreachLoss,
			0,
			config.maxDefenderEnergy
		);

		const attackerNetReturn =
			extractedEnergy - raider.committedEnergy - config.travelCost;
		const normalizedOutcome = clamp01(
			0.5 +
				attackerNetReturn /
					(2 * Math.max(1, raider.committedEnergy))
		);
		attackerConfidence = clamp01(
			(1 - config.confidenceSmoothing) * attackerConfidence +
				config.confidenceSmoothing * normalizedOutcome
		);
		state = resolveDeterrenceState(
			state,
			attackerConfidence,
			defenderEnergy,
			config
		);

		steps.push({
			opportunity,
			stateBefore,
			stateAfter: state,
			defenderEnergyBefore: energyBefore,
			defenderEnergyAfter: defenderEnergy,
			attackerConfidenceBefore: confidenceBefore,
			attackerConfidenceAfter: attackerConfidence,
			raidOccurred: true,
			tier,
			breached,
			remainingViability,
			committedEnergy: raider.committedEnergy,
			extractedEnergy,
			defenderRecoveredEnergy,
			defenderBreachLoss,
			attackerNetReturn
		});

		if (defenderEnergy <= 0) break;
	}

	const counts = stateCounts();
	let raids = 0;
	let breaches = 0;
	let committed = 0;
	let extracted = 0;
	let recovered = 0;
	let breachLoss = 0;
	let attackerNet = 0;

	for (let index = 0; index < steps.length; index += 1) {
		const step = steps[index];
		countState(counts, step.stateAfter);
		if (step.raidOccurred) raids += 1;
		if (step.breached) breaches += 1;
		committed += step.committedEnergy;
		extracted += step.extractedEnergy;
		recovered += step.defenderRecoveredEnergy;
		breachLoss += step.defenderBreachLoss;
		attackerNet += step.attackerNetReturn;
	}

	return {
		policy,
		steps,
		summary: {
			policy: policy.id,
			label: policy.label,
			survivalOpportunities: steps.length,
			ruined: defenderEnergy <= 0,
			endingDefenderEnergy: defenderEnergy,
			raids,
			breaches,
			totalAttackerCommittedEnergy: committed,
			totalAttackerExtractedEnergy: extracted,
			totalDefenderRecoveredEnergy: recovered,
			totalDefenderBreachLoss: breachLoss,
			attackerReturnOnCommitment:
				committed <= 0 ? 0 : attackerNet / committed,
			stateCounts: counts
		}
	};
}

export function compareDeterrencePolicies(
	policies: DeterrencePolicyProfile[],
	config: DeterrenceModelConfig,
	raiderProfiles: RaiderEconomyProfile[],
	seed = 1
): DeterrenceScenarioResult[] {
	const results: DeterrenceScenarioResult[] = [];
	for (let index = 0; index < policies.length; index += 1) {
		results.push(
			runDeterrenceScenario(policies[index], config, raiderProfiles, seed)
		);
	}
	return results;
}

/**
 * Normalized lab defaults only. These values are deliberately injectable and
 * must not be treated as production balance. The raider commitment/extraction
 * scale mirrors current design hypotheses so the experiment can reason about
 * anti-farming and deterrence before live tuning.
 */
export const DEFAULT_DETERRENCE_CONFIG: DeterrenceModelConfig = {
	horizon: 120,
	maxDefenderEnergy: 30000,
	initialDefenderEnergy: 30000,
	initialAttackerConfidence: 0.72,
	collectionEfficiency: 0.78,
	confidenceSmoothing: 0.14,
	idleConfidenceDecay: 0.008,
	travelCost: 500,
	breachLossMultiplier: 1,
	starvationThreshold: 6500,
	confidenceHysteresis: 0.05
};

export const DEFAULT_DETERRENCE_RAIDERS: RaiderEconomyProfile[] = [
	{
		tier: 1,
		committedEnergy: 3000,
		extractionPotential: 7720,
		baseBreachChance: 0.38,
		resistance: 0.18,
		recoverableFraction: 0.6
	},
	{
		tier: 2,
		committedEnergy: 12000,
		extractionPotential: 30440,
		baseBreachChance: 0.44,
		resistance: 0.34,
		recoverableFraction: 0.55
	},
	{
		tier: 3,
		committedEnergy: 27000,
		extractionPotential: 68160,
		baseBreachChance: 0.5,
		resistance: 0.5,
		recoverableFraction: 0.5
	}
];

export const DEFAULT_DETERRENCE_POLICIES: DeterrencePolicyProfile[] = [
	{
		id: "competent-defense",
		label: "Competent defense",
		defenseStrength: 0.74,
		deliberateLeakBias: 0,
		upkeepPerOpportunity: 340
	},
	{
		id: "intentional-leak",
		label: "Intentional leak / farm",
		defenseStrength: 0.46,
		deliberateLeakBias: 0.19,
		upkeepPerOpportunity: 230
	},
	{
		id: "over-fortified",
		label: "Over-fortified",
		defenseStrength: 0.91,
		deliberateLeakBias: 0,
		upkeepPerOpportunity: 560
	},
	{
		id: "resource-conservative",
		label: "Resource-conservative",
		defenseStrength: 0.63,
		deliberateLeakBias: 0.02,
		upkeepPerOpportunity: 280
	},
	{
		id: "passive-isolation",
		label: "Passive isolation",
		defenseStrength: 0.16,
		deliberateLeakBias: 0.08,
		upkeepPerOpportunity: 120
	}
];
