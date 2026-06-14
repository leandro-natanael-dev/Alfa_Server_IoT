import { ExpressServer } from "./infrastructure/http/express-server.js";
import { MongoDataBase } from "./infrastructure/database/mongoose_config.js";
import { SyncTelemetryUseCase } from "./application/useCases/syncTelemetryUseCase.js";

async function bootstrap() {
  await MongoDataBase.conectar();

  const syncTelemetry = new SyncTelemetryUseCase();
  await syncTelemetry.execute();

  const server = new ExpressServer();
  server.escuchar();
}
bootstrap();
