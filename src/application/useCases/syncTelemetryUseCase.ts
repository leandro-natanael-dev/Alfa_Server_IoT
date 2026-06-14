import axios from "axios";
import { ENV } from "../../config/env.js";
import { TelemetryState } from "../telemetry-state.js";
import { TelemetryModel } from "../../infrastructure/database/telemetryModel.js";

export class SyncTelemetryUseCase {
  public async execute(): Promise<void> {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get(ENV.NODEMCU_URL, { timeout: 3000 });
        const rawData = response.data; // Viene como { temperatura: 17.5, humedad: 25.0 }

        // 1. Mapeo para la interfaz IoTData (Memoria)
        TelemetryState.lastestData = {
          sensor: rawData.sensor,
          temperature: rawData.temperatura, // Traducir de temperatura a temperature
          humidity: rawData.humedad, // Traducir de humedad a humidity
          status: rawData.estado,
        };

        // 2. Persistencia en MongoDB con los nombres del Schema
        await TelemetryModel.create({
          temperature: rawData.temperatura,
          humidity: rawData.humedad,
        });

        console.log("✅ Datos persistidos correctamente");
      } catch (error) {
        // ... manejo de error existente
      }
    };

    setInterval(fetchDeviceData, 5000);
    await fetchDeviceData();
  }
}
