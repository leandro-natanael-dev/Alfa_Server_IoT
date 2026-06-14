import express from "express";
import cors from "cors";
import { telemetryRouter } from "./telemetry-router.js";
import { ENV } from "../../config/env.js";

export class ExpressServer {
  private app = express();

  constructor() {
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use("/api", telemetryRouter);
  }

  public escuchar(): void {
    this.app.listen(ENV.PORT, () => {
      console.log(`🚀 Servidor Alfa IoT activo en puerto ${ENV.PORT}`);
    });
  }
}
