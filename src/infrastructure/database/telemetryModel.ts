import { Schema, model, Document } from "mongoose";

export interface ITelemetry extends Document {
  temperature: number;
  humidity: number;
  createdAt: Date;
  updatedAt: Date;
}

const TelemetrySchema = new Schema<ITelemetry>(
  {
    temperature: { type: "number", required: true },
    humidity: { type: "number", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TelemetryModel = model<ITelemetry>("Telemetry", TelemetrySchema);
