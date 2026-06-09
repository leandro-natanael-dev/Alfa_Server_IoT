import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // Agregar esto
import { ENV } from './config/env.ts';
import { getTelemetry } from './modules/telemetry/controller';
import { telemetryService } from './modules/telemetry/service';

const app = express();
app.use(cors());
app.use(express.json());

// NUEVO: Conexión a MongoDB antes de iniciar el servicio
mongoose.connect(ENV.MONGO_URI || "mongodb://127.0.0.1:27017/alfa_iot")
  .then(() => {
    console.log('🍃 Conectado a MongoDB');
    telemetryService.iniciarSincronizacion();
  })
  .catch(err => console.error('❌ Error de conexión:', err.message));

app.get('/api/telemetria', getTelemetry);

app.listen(ENV.PORT, () => {
 console.log(`🚀 Servidor Alfa IoT activo en puerto ${ENV.PORT}`);
});