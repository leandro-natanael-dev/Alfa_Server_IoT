import { IoTData } from "../entities/IoTData.js";

export interface ITelemetryRepo {
  save(data: IoTData): Promise<void>;
  getLatest(): Promise<IoTData | null>;
  getAverages(
    range: string,
  ): Promise<{ temperature: number; humidity: number }>;
}
