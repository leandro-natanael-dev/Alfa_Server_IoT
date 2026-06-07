import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.ts';
import { getTelemetry } from './modules/telemetry/controller.ts';
import { telemetryService } from './modules/telemetry/service.ts';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de la API mapeado al controlador
app.get('/api/telemetria', getTelemetry);

// Arrancar el Worker de fondo para el NodeMCU
telemetryService.iniciarSincronizacion();

// Levantar el servidor Express
app.listen(ENV.PORT, () => {
  console.log(`\n🚀 Servidor Alfa IoT inicializado en la arquitectura limpia.`);
  console.log(`🌍 API disponible en: http://localhost:${ENV.PORT}/api/telemetria`);
});
