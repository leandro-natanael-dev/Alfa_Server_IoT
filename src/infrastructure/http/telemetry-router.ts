import { Router } from "express";
import { TelemetryController } from "./telemetry-controller.js";
import { GetLatestUseCase } from "../../application/useCases/getLatestUseCase.js";
import { CalculateAveragesUseCase } from "../../application/useCases/calculateAverageUseCase.js";

const telemetryRouter = Router();

const getLatestUseCase = new GetLatestUseCase();
const calculateAveragesUseCase = new CalculateAveragesUseCase();

const telemetryController = new TelemetryController(
  getLatestUseCase,
  calculateAveragesUseCase,
);

telemetryRouter.get("/telemetry", telemetryController.getTelemetry);
telemetryRouter.get("/stats", telemetryController.getStats);

export { telemetryRouter };
