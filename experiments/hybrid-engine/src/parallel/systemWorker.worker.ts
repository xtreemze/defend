import {
  type AiBatchInput,
  type AiBatchResult,
  planAiBatch,
} from "./aiPlanner";
import {
  type AudioBatchInput,
  type AudioBatchResult,
  planAudioBatch,
} from "./audioPlanner";
import {
  type CombatBatchInput,
  type CombatBatchResult,
  solveCombatBatch,
} from "./combatPlanner";
import type { TickStampedRequest, TickStampedResponse } from "./workerProtocol";

export type SystemWorkerRequest =
  | (TickStampedRequest<CombatBatchInput> & { lane: "combat" })
  | (TickStampedRequest<AiBatchInput> & { lane: "ai" })
  | (TickStampedRequest<AudioBatchInput> & { lane: "audio" });

export type SystemWorkerResponse =
  | (TickStampedResponse<CombatBatchResult> & { lane: "combat" })
  | (TickStampedResponse<AiBatchResult> & { lane: "ai" })
  | (TickStampedResponse<AudioBatchResult> & { lane: "audio" });

interface WorkerScope {
  onmessage: ((event: MessageEvent<SystemWorkerRequest>) => void) | null;
  postMessage(message: SystemWorkerResponse, transfer: Transferable[]): void;
}

function buffersForResult(response: SystemWorkerResponse): Transferable[] {
  switch (response.lane) {
    case "combat":
      return [
        response.result.turretIds.buffer as ArrayBuffer,
        response.result.targetIds.buffer as ArrayBuffer,
        response.result.aimPoints.buffer as ArrayBuffer,
        response.result.interceptSeconds.buffer as ArrayBuffer,
      ];
    case "ai":
      return [
        response.result.agentIds.buffer as ArrayBuffer,
        response.result.desiredVelocities.buffer as ArrayBuffer,
      ];
    case "audio":
      return [
        response.result.sourceIds.buffer as ArrayBuffer,
        response.result.distances.buffer as ArrayBuffer,
        response.result.priorities.buffer as ArrayBuffer,
        response.result.dopplerRatios.buffer as ArrayBuffer,
      ];
  }
}

const workerScope = globalThis as unknown as WorkerScope;

workerScope.onmessage = (event) => {
  const request = event.data;
  let response: SystemWorkerResponse;

  switch (request.lane) {
    case "combat":
      response = {
        lane: "combat",
        jobId: request.jobId,
        sourceTick: request.sourceTick,
        result: solveCombatBatch(request.payload),
      };
      break;
    case "ai":
      response = {
        lane: "ai",
        jobId: request.jobId,
        sourceTick: request.sourceTick,
        result: planAiBatch(request.payload),
      };
      break;
    case "audio":
      response = {
        lane: "audio",
        jobId: request.jobId,
        sourceTick: request.sourceTick,
        result: planAudioBatch(request.payload),
      };
      break;
  }

  workerScope.postMessage(response, buffersForResult(response));
};
