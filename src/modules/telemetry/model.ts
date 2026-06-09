import { Schema, model } from 'mongoose';

export interface IoTData {
  sensor: string;
  temperatura: number;
  humedad: number;
  estado: string;
  createdAt?: Date; 
}

const TelemetrySchema = new Schema<IoTData>({
  sensor: { type: String, required: true },
  temperatura: { type: Number, required: true },
  humedad: { type: Number, required: true },
  estado: { type: String, required: true },
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

export const TelemetryModel = model<IoTData>('Telemetry', TelemetrySchema);