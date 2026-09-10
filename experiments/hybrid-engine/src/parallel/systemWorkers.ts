import type { AiBatchInput, AiBatchResult } from "./aiPlanner";
import type { AudioBatchInput, AudioBatchResult } from "./audioPlanner";
import type { CombatBatchInput, CombatBatchResult } from "./combatPlanner";
import type {
  SystemWorkerRequest,
  SystemWorkerResponse,
} from "./systemWorker.worker";
import SystemWorker from "./systemWorker.worker.ts?worker";
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

/** Three persistent system-level workers rather than one worker per entity. */
export class ParallelSystemWorkers {
  readonly workers: Record<WorkerLane, Worker>;

  private nextJobId = 1;
  private readonly pending = new Map<number, PendingJob>();
  private readonly available: Record<WorkerLane, boolean> = {
    combat: true,
    ai: true,
    audio: true,
  };

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
        this.disableLane(
          lane,
          new Error(event.message || `${lane} worker failed`),
        );
      };
      worker.onmessageerror = () => {
        this.disableLane(
          lane,
          new Error(`${lane} worker message could not be decoded`),
        );
      };
    }
  }

  laneAvailable(lane: WorkerLane): boolean {
    return this.available[lane];
  }

  submit<Lane extends WorkerLane>(
    lane: Lane,
    sourceTick: number,
    payload: LanePayloadMap[Lane],
    transfer: Transferable[] = [],
  ): Promise<TickStampedResponse<LaneResultMap[Lane]>> {
    if (!this.available[lane]) {
      return Promise.reject(new Error(`${lane} worker is unavailable`));
    }

    const jobId = this.nextJobId;
    this.nextJobId += 1;
    const request = { lane, jobId, sourceTick, payload } as SystemWorkerRequest;

    return new Promise((resolve, reject) => {
      this.pending.set(jobId, {
        lane,
        resolve: (response) =>
          resolve(response as TickStampedResponse<LaneResultMap[Lane]>),
        reject,
      });
      try {
        this.workers[lane].postMessage(request, transfer);
      } catch (error) {
        this.pending.delete(jobId);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  dispose(): void {
    for (const lane of ["combat", "ai", "audio"] as const) {
      this.available[lane] = false;
      this.workers[lane].terminate();
    }
    for (const pending of this.pending.values()) {
      pending.reject(new Error("Parallel worker runtime disposed"));
    }
    this.pending.clear();
  }

  private disableLane(lane: WorkerLane, error: Error): void {
    this.available[lane] = false;
    this.workers[lane].terminate();
    for (const [jobId, pending] of this.pending.entries()) {
      if (pending.lane === lane) {
        this.pending.delete(jobId);
        pending.reject(error);
      }
    }
  }
}
