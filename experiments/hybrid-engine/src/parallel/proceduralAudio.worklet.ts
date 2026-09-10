interface ProceduralVoiceControl {
  id: number;
  frequencyHz: number;
  gain: number;
  dopplerRatio: number;
  pan: number;
}

interface VoiceState extends ProceduralVoiceControl {
  phase: number;
  currentGain: number;
}

interface AudioWorkletProcessorLike {
  readonly port: MessagePort;
}

declare const sampleRate: number;
declare const AudioWorkletProcessor: {
  prototype: AudioWorkletProcessorLike;
  new (): AudioWorkletProcessorLike;
};
declare function registerProcessor(
  name: string,
  processorCtor: new () => AudioWorkletProcessorLike & {
    process(
      inputs: Float32Array[][],
      outputs: Float32Array[][],
      parameters: Record<string, Float32Array>,
    ): boolean;
  },
): void;

const TWO_PI = Math.PI * 2;
const MAX_VOICES = 64;
const GAIN_SMOOTHING_SECONDS = 0.004;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

class DefendProceduralAudioProcessor extends AudioWorkletProcessor {
  private readonly voices = new Map<number, VoiceState>();

  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent<ProceduralVoiceControl[]>) => {
      const controls = event.data.slice(0, MAX_VOICES);
      const activeIds = new Set<number>();

      for (const control of controls) {
        const id = Math.max(0, Math.floor(finiteOr(control.id, 0)));
        activeIds.add(id);
        const existing = this.voices.get(id);
        const normalized: ProceduralVoiceControl = {
          id,
          frequencyHz: clamp(finiteOr(control.frequencyHz, 0), 0, 24000),
          gain: clamp(finiteOr(control.gain, 0), 0, 1),
          dopplerRatio: clamp(finiteOr(control.dopplerRatio, 1), 0.5, 2),
          pan: clamp(finiteOr(control.pan, 0), -1, 1),
        };

        if (existing) {
          existing.frequencyHz = normalized.frequencyHz;
          existing.gain = normalized.gain;
          existing.dopplerRatio = normalized.dopplerRatio;
          existing.pan = normalized.pan;
        } else {
          this.voices.set(id, {
            ...normalized,
            phase: 0,
            currentGain: 0,
          });
        }
      }

      for (const voice of this.voices.values()) {
        if (!activeIds.has(voice.id)) {
          voice.gain = 0;
        }
      }
    };
  }

  process(
    _inputs: Float32Array[][],
    outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>,
  ): boolean {
    const output = outputs[0];
    if (!output || output.length === 0) {
      return true;
    }

    const left = output[0];
    const right = output[1] ?? output[0];
    const smoothing = 1 - Math.exp(-1 / (sampleRate * GAIN_SMOOTHING_SECONDS));

    for (const voice of this.voices.values()) {
      const phaseStep =
        (TWO_PI * voice.frequencyHz * voice.dopplerRatio) / sampleRate;
      const leftGain = Math.sqrt((1 - voice.pan) * 0.5);
      const rightGain = Math.sqrt((1 + voice.pan) * 0.5);

      for (let sampleIndex = 0; sampleIndex < left.length; sampleIndex += 1) {
        voice.currentGain += (voice.gain - voice.currentGain) * smoothing;
        const sample = Math.sin(voice.phase) * voice.currentGain;
        left[sampleIndex] += sample * leftGain;
        right[sampleIndex] += sample * rightGain;
        voice.phase += phaseStep;
        if (voice.phase >= TWO_PI) {
          voice.phase -= TWO_PI;
        }
      }
    }

    for (const [id, voice] of this.voices.entries()) {
      if (voice.gain === 0 && voice.currentGain < 1e-5) {
        this.voices.delete(id);
      }
    }

    return true;
  }
}

registerProcessor("defend-procedural-audio", DefendProceduralAudioProcessor);
