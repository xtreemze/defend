import SystemWorker from "./systemWorker.worker.ts?worker";
import type { AiBatchInput, AiBatchResult } from "./aiPlanner";
import type { AudioBatchInput, AudioBatchResult } from "./audioPlanner";
import type { CombatBatchInput, CombatBatchResult } from "./combatPlanner";
import type {
  SystemWorkerRequest,
  SystemWorkerResponse,
} from "./systemWorker.worker";
import type { TickStampedResponse, WorkerLane } from "./workerProtocol";

interface LanePayloadMap {
  combat: CombatBatchInput;
  ai: AiBatchInput;
  audio: AudioBatchInput;
}

interface LaneResultMap {
  combat: CombatBatchResult;
  ai: AiBatchResult;
  audio: AudioBatchResult;
}

interface PendingJob {
  lane: WorkerLane;
  resolve(response: SystemWorkerResponse): void;
  reject(error: Error): void;
}

export type SystemWorkerFactory = (lane: WorkerLane) => Worker;

function defaultWorkerFactory(lane: WorkerLane): Worker {
  return new SystemWorker({ name: `defend-${lane}-worker` });
}

/**
 * Three persistent system-level workers rather than one worker per entity.
 *
 * Callers decide when to submit based on their multi-rate policy. Returned
 * snapshots remain tick stamped and must pass resultIsFresh() plus authoritative
 * lifecycle/physics checks before they are applied.
 */
export class ParallelSystemWorkers {
  readonly workers: Record<WorkerLane, Worker>;

  private nextJobId = 1;
  private readonly pending = new Map<number, PendingJob>();

  constructor(factory: SystemWorkerFactory = defaultWorkerFactory) {
    this.workers = {
      combat: factory("combat"),
      ai: factory("ai"),
      audio: factory("audio"),
    };

    for (const lane of ["combat", "ai", "audio"] as const) {
      const worker = this.workers[lane];
      worker.onmessage = (event: MessageEvent<SystemWorkerResponse>) => {
        const pending = this.pending.get(event.data.jobId);
        if (!pending || pending.lane !== lane) {
          return;
        }
        this.pending.delete(event.data.jobId);
        pending.resolve(event.data);
      };
      worker.onerror = (event) => {
        this.rejectLane(
          lane,
          new Error(event.message || `${lane} worker failed`),
        );
      };
    }
  }

  submit<Lane extends WorkerLane>(
    lane: Lane,
    sourceTick: number,
    payload: LanePayloadMap[Lane],
    transfer: Transferable[] = [],
  ): Promise<TickStampedResponse<LaneResultMap[Lane]>> {
    const jobId = this.nextJobId;
    this.nextJobId += 1;

    const request = {
      lane,
      jobId,
      sourceTick,
      payload,
    } as SystemWorkerRequest;

    return new Promise((resolve, reject) => {
      this.pending.set(jobId, {
        lane,
        resolve: (response) =>
          resolve(response as TickStampedResponse<LaneResultMap[Lane]>),
        reject,
      });
      this.workers[lane].postMessage(request, transfer);
    });
  }

  dispose(): void {
    for (const worker of Object.values(this.workers)) {
      worker.terminate();
    }
    for (const pending of this.pending.values()) {
      pending.reject(new Error("Parallel worker runtime disposed"));
    }
    this.pending.clear();
  }

  private rejectLane(lane: WorkerLane, error: Error): void {
    for (const [jobId, pending] of this.pending.entries()) {
      if (pending.lane === lane) {
        this.pending.delete(jobId);
        pending.reject(error);
      }
    }
  }
}
