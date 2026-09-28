export type WorldResidueFamily = "impact" | "wreck" | "fortress" | "geology" | "energy";

export type WorldResidueKind =
	| "minor-impact"
	| "heavy-impact"
	| "mothership-hulk"
	| "fortress-remnant"
	| "eruption"
	| "geothermal-depletion"
	| "extraction-depletion";

export interface WorldResidueEvent {
	id: string;
	regionId: string;
	kind: WorldResidueKind;
	occurredAtSeconds: number;
	magnitude: number;
	gameplayConsequence: boolean;
}

export interface WorldResidueRecord {
	key: string;
	regionId: string;
	family: WorldResidueFamily;
	dominantKind: WorldResidueKind;
	eventCount: number;
	firstOccurredAtSeconds: number;
	lastOccurredAtSeconds: number;
	intensity: number;
	peakMagnitude: number;
	landmark: boolean;
	gameplayConsequence: boolean;
}

export interface CompactedWorldResidue {
	totalEvents: number;
	impactEvents: number;
	wreckEvents: number;
	fortressEvents: number;
	geologyEvents: number;
	energyEvents: number;
	impactIntensity: number;
	wreckIntensity: number;
	fortressIntensity: number;
	geologyIntensity: number;
	energyIntensity: number;
}

export interface WorldResidueState {
	records: WorldResidueRecord[];
	compacted: CompactedWorldResidue;
}

export interface WorldResidueConfig {
	maxRecords: number;
}

export interface WorldResidueSummary {
	recordCount: number;
	representedEventCount: number;
	compactedEventCount: number;
	hasMothershipHulk: boolean;
	hasWreckHistory: boolean;
	hasFortressRemnant: boolean;
	impactIntensity: number;
	geologyIntensity: number;
	energyIntensity: number;
	heavilyContested: boolean;
}

export const DEFAULT_WORLD_RESIDUE_CONFIG: WorldResidueConfig = {
	maxRecords: 16
};

function finite(value: number, fallback: number): number {
	if (value !== value || value === Infinity || value === -Infinity) return fallback;
	return value;
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, finite(value, minimum)));
}

function clamp01(value: number): number {
	return clamp(value, 0, 1);
}

function safeText(value: string, fallback: string): string {
	if (typeof value !== "string") return fallback;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : fallback;
}

function normalizedConfig(config: WorldResidueConfig): WorldResidueConfig {
	return {
		maxRecords: Math.max(1, Math.min(128, Math.floor(finite(config.maxRecords, 16))))
	};
}

function normalizedEvent(event: WorldResidueEvent): WorldResidueEvent {
	return {
		id: safeText(event.id, "unknown-event"),
		regionId: safeText(event.regionId, "unknown-region"),
		kind: event.kind,
		occurredAtSeconds: Math.max(0, finite(event.occurredAtSeconds, 0)),
		magnitude: clamp01(event.magnitude),
		gameplayConsequence: event.gameplayConsequence === true
	};
}

export function worldResidueFamily(kind: WorldResidueKind): WorldResidueFamily {
	if (kind === "minor-impact" || kind === "heavy-impact") return "impact";
	if (kind === "mothership-hulk") return "wreck";
	if (kind === "fortress-remnant") return "fortress";
	if (kind === "eruption" || kind === "geothermal-depletion") return "geology";
	return "energy";
}

export function worldResidueIsLandmark(kind: WorldResidueKind): boolean {
	return kind === "mothership-hulk" || kind === "fortress-remnant";
}

function emptyCompacted(): CompactedWorldResidue {
	return {
		totalEvents: 0,
		impactEvents: 0,
		wreckEvents: 0,
		fortressEvents: 0,
		geologyEvents: 0,
		energyEvents: 0,
		impactIntensity: 0,
		wreckIntensity: 0,
		fortressIntensity: 0,
		geologyIntensity: 0,
		energyIntensity: 0
	};
}

export function createWorldResidueState(): WorldResidueState {
	return { records: [], compacted: emptyCompacted() };
}

function copyCompacted(source: CompactedWorldResidue): CompactedWorldResidue {
	return {
		totalEvents: Math.max(0, Math.floor(finite(source.totalEvents, 0))),
		impactEvents: Math.max(0, Math.floor(finite(source.impactEvents, 0))),
		wreckEvents: Math.max(0, Math.floor(finite(source.wreckEvents, 0))),
		fortressEvents: Math.max(0, Math.floor(finite(source.fortressEvents, 0))),
		geologyEvents: Math.max(0, Math.floor(finite(source.geologyEvents, 0))),
		energyEvents: Math.max(0, Math.floor(finite(source.energyEvents, 0))),
		impactIntensity: clamp01(source.impactIntensity),
		wreckIntensity: clamp01(source.wreckIntensity),
		fortressIntensity: clamp01(source.fortressIntensity),
		geologyIntensity: clamp01(source.geologyIntensity),
		energyIntensity: clamp01(source.energyIntensity)
	};
}

function saturatedMerge(current: number, incoming: number): number {
	const a = clamp01(current);
	const b = clamp01(incoming);
	return 1 - (1 - a) * (1 - b);
}

function recordKey(event: WorldResidueEvent): string {
	if (worldResidueIsLandmark(event.kind)) {
		return `landmark:${event.kind}:${event.id}`;
	}
	return `aggregate:${event.regionId}:${worldResidueFamily(event.kind)}`;
}

function recordFromEvent(event: WorldResidueEvent): WorldResidueRecord {
	return {
		key: recordKey(event),
		regionId: event.regionId,
		family: worldResidueFamily(event.kind),
		dominantKind: event.kind,
		eventCount: 1,
		firstOccurredAtSeconds: event.occurredAtSeconds,
		lastOccurredAtSeconds: event.occurredAtSeconds,
		intensity: event.magnitude,
		peakMagnitude: event.magnitude,
		landmark: worldResidueIsLandmark(event.kind),
		gameplayConsequence: event.gameplayConsequence
	};
}

function mergeRecord(record: WorldResidueRecord, event: WorldResidueEvent): WorldResidueRecord {
	const eventMagnitude = clamp01(event.magnitude);
	const dominantKind = eventMagnitude >= record.peakMagnitude ? event.kind : record.dominantKind;
	return {
		key: record.key,
		regionId: record.regionId,
		family: record.family,
		dominantKind,
		eventCount: Math.max(1, record.eventCount) + 1,
		firstOccurredAtSeconds: Math.min(record.firstOccurredAtSeconds, event.occurredAtSeconds),
		lastOccurredAtSeconds: Math.max(record.lastOccurredAtSeconds, event.occurredAtSeconds),
		intensity: saturatedMerge(record.intensity, eventMagnitude),
		peakMagnitude: Math.max(record.peakMagnitude, eventMagnitude),
		landmark: record.landmark,
		gameplayConsequence: record.gameplayConsequence || event.gameplayConsequence
	};
}

function foldRecord(compacted: CompactedWorldResidue, record: WorldResidueRecord): void {
	const events = Math.max(1, Math.floor(finite(record.eventCount, 1)));
	compacted.totalEvents += events;
	if (record.family === "impact") {
		compacted.impactEvents += events;
		compacted.impactIntensity = saturatedMerge(compacted.impactIntensity, record.intensity);
	} else if (record.family === "wreck") {
		compacted.wreckEvents += events;
		compacted.wreckIntensity = saturatedMerge(compacted.wreckIntensity, record.intensity);
	} else if (record.family === "fortress") {
		compacted.fortressEvents += events;
		compacted.fortressIntensity = saturatedMerge(compacted.fortressIntensity, record.intensity);
	} else if (record.family === "geology") {
		compacted.geologyEvents += events;
		compacted.geologyIntensity = saturatedMerge(compacted.geologyIntensity, record.intensity);
	} else {
		compacted.energyEvents += events;
		compacted.energyIntensity = saturatedMerge(compacted.energyIntensity, record.intensity);
	}
}

function retentionScore(record: WorldResidueRecord, newestTime: number): number {
	const age = Math.max(0, newestTime - record.lastOccurredAtSeconds);
	const recency = 1 / (1 + age / 60);
	return (
		(record.landmark ? 8 : 0) +
		(record.gameplayConsequence ? 2 : 0) +
		record.intensity * 3 +
		recency
	);
}

function lowestRetentionIndex(records: WorldResidueRecord[], newestTime: number): number {
	let selected = 0;
	let selectedScore = retentionScore(records[0], newestTime);
	for (let index = 1; index < records.length; index += 1) {
		const score = retentionScore(records[index], newestTime);
		if (score < selectedScore) {
			selected = index;
			selectedScore = score;
		}
	}
	return selected;
}

export function appendWorldResidueEvent(
	state: WorldResidueState,
	eventInput: WorldResidueEvent,
	configInput: WorldResidueConfig = DEFAULT_WORLD_RESIDUE_CONFIG
): WorldResidueState {
	const config = normalizedConfig(configInput);
	const event = normalizedEvent(eventInput);
	const records = state.records.slice();
	const compacted = copyCompacted(state.compacted);
	const key = recordKey(event);
	let found = -1;
	for (let index = 0; index < records.length; index += 1) {
		if (records[index].key === key) {
			found = index;
			break;
		}
	}
	if (found >= 0) records[found] = mergeRecord(records[found], event);
	else records.push(recordFromEvent(event));

	while (records.length > config.maxRecords) {
		const victim = lowestRetentionIndex(records, event.occurredAtSeconds);
		foldRecord(compacted, records[victim]);
		records.splice(victim, 1);
	}

	return { records, compacted };
}

export function buildWorldResidueState(
	events: WorldResidueEvent[],
	config: WorldResidueConfig = DEFAULT_WORLD_RESIDUE_CONFIG
): WorldResidueState {
	let state = createWorldResidueState();
	for (let index = 0; index < events.length; index += 1) {
		state = appendWorldResidueEvent(state, events[index], config);
	}
	return state;
}

function recordFamilyIntensity(records: WorldResidueRecord[], family: WorldResidueFamily): number {
	let intensity = 0;
	for (let index = 0; index < records.length; index += 1) {
		if (records[index].family === family) {
			intensity = saturatedMerge(intensity, records[index].intensity);
		}
	}
	return intensity;
}

function recordEventCount(records: WorldResidueRecord[]): number {
	let total = 0;
	for (let index = 0; index < records.length; index += 1) {
		total += Math.max(1, Math.floor(finite(records[index].eventCount, 1)));
	}
	return total;
}

export function summarizeWorldResidue(state: WorldResidueState): WorldResidueSummary {
	let hasMothershipHulk = false;
	let hasFortressRemnant = false;
	for (let index = 0; index < state.records.length; index += 1) {
		const record = state.records[index];
		if (record.dominantKind === "mothership-hulk") hasMothershipHulk = true;
		if (record.dominantKind === "fortress-remnant") hasFortressRemnant = true;
	}
	const impactIntensity = saturatedMerge(
		recordFamilyIntensity(state.records, "impact"),
		state.compacted.impactIntensity
	);
	const geologyIntensity = saturatedMerge(
		recordFamilyIntensity(state.records, "geology"),
		state.compacted.geologyIntensity
	);
	const energyIntensity = saturatedMerge(
		recordFamilyIntensity(state.records, "energy"),
		state.compacted.energyIntensity
	);
	const representedEventCount = recordEventCount(state.records) + state.compacted.totalEvents;
	return {
		recordCount: state.records.length,
		representedEventCount,
		compactedEventCount: state.compacted.totalEvents,
		hasMothershipHulk,
		hasWreckHistory: hasMothershipHulk || state.compacted.wreckEvents > 0,
		hasFortressRemnant: hasFortressRemnant || state.compacted.fortressEvents > 0,
		impactIntensity,
		geologyIntensity,
		energyIntensity,
		heavilyContested: impactIntensity >= 0.72
	};
}
