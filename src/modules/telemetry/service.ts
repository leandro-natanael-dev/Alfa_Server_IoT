import axios from 'axios';
import { ENV } from '../../config/env.ts';
import { IoTData } from './model.ts';

class TelemetryService {
  // Guardamos la lectura en memoria (temporalmente, hasta poner la Base de Datos)
  private cacheLectura: IoTData | null = null;
  private cacheError: string | null = null;

  // El Worker asíncrono que consulta al NodeMCU
  public async iniciarSincronizacion(): Promise<void> {
    const consultarPlaca = async () => {
      try {
        const respuesta = await axios.get<IoTData>(ENV.NODEMCU_URL, { timeout: 3000 });
        this.cacheLectura = respuesta.data;
        this.cacheError = null;
        console.log(`[📡 IoT Sync] T: ${this.cacheLectura.temperatura}°C | H: ${this.cacheLectura.humedad}%`);
      } catch (error: any) {
        this.cacheError = `NodeMCU inaccesible: ${error.message}`;
        console.error(`[⚠️ IoT Error] ${this.cacheError}`);
      }
    };

    // Ejecuta de inmediato y luego cada 5 segundos
    await consultarPlaca();
    setInterval(consultarPlaca, 5000);
  }

  // Método que usará el controlador para obtener los datos al instante
  public getUltimaLectura() {
    return {
      datos: this.cacheLectura,
      error: this.cacheError,
    };
  }
}

// Exportamos una única instancia del servicio (Singleton)
export const telemetryService = new TelemetryService();
