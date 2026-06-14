import { IoTData } from "../domain/entities/IoTData.js";

export class TelemetryState {
  public static lastestData: IoTData | null = null;
  public static lastError: string | null = null;
}
