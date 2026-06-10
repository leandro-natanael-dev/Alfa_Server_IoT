// src/modules/telemetry/controller.ts
import { Request, Response } from 'express';
import { telemetryService } from './service.ts';

export const getTelemetry = (req: Request, res: Response): void => {
  // Aquí es donde ocurre el error si el método no existe en la instancia exportada
  const { datos, error } = telemetryService.getUltimaLectura();

  if (error && !datos) {
    res.status(502).json({ success: false, message: error });
    return;
  }

  res.status(200).json({
    success: true,
    actualizado: new Date().toISOString(),
    telemetria: datos,
    alerta_conexion: error ? 'Alerta: Usando última lectura guardada. Placa desconectada.' : null
  });
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const { rango } = req.query;
  
  try {
    const stats = await telemetryService.getPromedios(rango as string);

    if (!stats) {
      res.status(200).json({ 
        success: true, 
        data: [], 
        message: `No hay suficientes datos históricos para el rango de ${rango} solicitado.` 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error interno al procesar las estadísticas." 
    });
  }
};
