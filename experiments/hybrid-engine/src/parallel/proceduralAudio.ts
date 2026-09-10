import proceduralAudioWorkletUrl from "./proceduralAudio.worklet.js?url";

export interface ProceduralVoiceControl {
  id: number;
  frequencyHz: number;
  gain: number;
  dopplerRatio: number;
  pan: number;
}

/**
 * Create the hard-real-time procedural renderer. The ordinary audio worker may
 * rank sources and prepare controls, but only the AudioWorklet writes samples.
 */
export async function createProceduralAudioNode(
  context: AudioContext,
): Promise<AudioWorkletNode> {
  await context.audioWorklet.addModule(proceduralAudioWorkletUrl);
  return new AudioWorkletNode(context, "defend-procedural-audio", {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });
}

export function updateProceduralVoices(
  node: AudioWorkletNode,
  voices: readonly ProceduralVoiceControl[],
): void {
  node.port.postMessage(voices);
}
