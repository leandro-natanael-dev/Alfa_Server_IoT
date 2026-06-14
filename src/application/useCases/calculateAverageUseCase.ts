import { TelemetryModel } from "../../infrastructure/database/telemetryModel.js";

export class CalculateAveragesUseCase {
  public async execute(range: string) {
    const now = new Date();
    // Usamos getTime() para restar milisegundos de forma segura y evitar mutaciones extrañas
    let startDate: Date;

    switch (range) {
      case "15min":
        startDate = new Date(now.getTime() - 15 * 60 * 1000);
        break;
      case "8hs":
        startDate = new Date(now.getTime() - 8 * 60 * 60 * 1000);
        break;
      case "24hs":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7dias":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 15 * 60 * 1000);
    }

    const results = await TelemetryModel.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate } 
        } 
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$createdAt",
              unit: range === "15min" || range === "8hs" ? "minute" : "hour",
              binSize: range === "15min" ? 1 : range === "8hs" ? 30 : 1,
            },
          },
          averageTemperature: { $avg: "$temperature" }, 
          averageHumidity: { $avg: "$humidity" },
        },
      },
      { 
        $sort: { _id: 1 } 
      },
    ]);

    // Si la agregación no hace match con nada, MongoDB devuelve un array vacío []
    return results.length > 0 ? results : null;
  }
}

