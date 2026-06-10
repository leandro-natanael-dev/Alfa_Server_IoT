// src/modules/telemetry/service.ts
import axios from "axios";
import { ENV } from "../../config/env.ts";
import { IoTData, TelemetryModel } from "./model.ts";
// Importa tu TelemetryModel aquí si ya usas Mongoose

class TelemetryService {
  private cacheLectura: IoTData | null = null;
  private cacheError: string | null = null;

  public async iniciarSincronizacion(): Promise<void> {
    const consultarPlaca = async () => {
      try {
        const respuesta = await axios.get<IoTData>(ENV.NODEMCU_URL, {
          timeout: 3000,
        });
        this.cacheLectura = respuesta.data;
        this.cacheError = null;

        // Lógica de persistencia en BD
        await TelemetryModel.create(this.cacheLectura);
        console.log(`[💾 DB] Datos persistidos correctamente`);
      } catch (error: any) {
        this.cacheError = `NodeMCU inaccesible: ${error.message}`;
        // Opcional: recuperar último de la BD
        console.error(`[⚠️ IoT Error] ${this.cacheError}`);
      }
    };

    await consultarPlaca();
    setInterval(consultarPlaca, 5000);
  }

  public getUltimaLectura() {
    return {
      datos: this.cacheLectura,
      error: this.cacheError,
    };
  }

  public async getPromedios(rango: string) {
    try {
      const ahora = new Date();
      let fechaInicio = new Date();

      switch (rango) {
        case "15min":
          fechaInicio.setMinutes(ahora.getMinutes() - 15);
          break;
        case "8hs":
          fechaInicio.setHours(ahora.getHours() - 8);
          break;
        case "24hs":
          fechaInicio.setHours(ahora.getHours() - 24);
          break;
        case "7dias":
          fechaInicio.setDate(ahora.getDate() - 7);
          break;
        default:
          fechaInicio.setMinutes(ahora.getMinutes() - 15);
      }

      const resultados = await TelemetryModel.aggregate([
        // Filtramos por el campo correcto: createdAt
        { $match: { createdAt: { $gte: fechaInicio } } },
        {
          $group: {
            _id: {
              $dateTrunc: {
                date: "$createdAt",
                unit: rango === "15min" || rango === "8hs" ? "minute" : "hour",
                binSize: rango === "15min" ? 1 : rango === "8hs" ? 30 : 1,
              },
            },
            tempPromedio: { $avg: "$temperatura" },
            humPromedio: { $avg: "$humedad" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return resultados.length > 0 ? resultados : null;
    } catch (err) {
      console.error("Error en agregación:", err);
      throw err; // Esto permite que el controlador capture el error y envíe el 500 con detalle
    }
  }
}

export const telemetryService = new TelemetryService();
