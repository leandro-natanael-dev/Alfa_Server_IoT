import { TelemetryState } from "../telemetry-state.js";

export class GetLatestUseCase {
  public execute() {
    return {
      data: TelemetryState.lastestData,
      error: TelemetryState.lastError,
    };
  }
}

