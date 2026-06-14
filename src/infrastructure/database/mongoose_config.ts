import mongoose from "mongoose";
import { ENV } from "../../config/env.js";


export class MongoDataBase {
  static async conectar(): Promise<void> {
    try {
      const uri = ENV.MONGO_URI || "mongodb://127.0.0.1:27017/alfa_iot";
      await mongoose.connect(uri);
      console.log("🍃 Conectado a MongoDB");
    } catch (error: any) {
      console.error("❌ Error de conexión:", error.message);
      process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
    }
  }
}
