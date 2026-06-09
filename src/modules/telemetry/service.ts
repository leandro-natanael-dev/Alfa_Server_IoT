// src/modules/telemetry/service.ts
import axios from 'axios';
import { ENV } from '../../config/env.ts';
import { IoTData } from './model.ts';
// Importa tu TelemetryModel aquí si ya usas Mongoose

class TelemetryService {
  private cacheLectura: IoTData | null = null;
  private cacheError: string | null = null;

  public async iniciarSincronizacion(): Promise<void> {
    const consultarPlaca = async () => {
      try {
        const respuesta = await axios.get<IoTData>(ENV.NODEMCU_URL, { timeout: 3000 });
        this.cacheLectura = respuesta.data;
        this.cacheError = null;
        
        // Lógica de persistencia en BD
        // await TelemetryModel.create(this.cacheLectura);
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

  // ESTE ES EL MÉTODO QUE FALTA O NO SE RECONOCE
  public getUltimaLectura() {
    return {
      datos: this.cacheLectura,
      error: this.cacheError,
    };
  }
}

export const telemetryService = new TelemetryService();