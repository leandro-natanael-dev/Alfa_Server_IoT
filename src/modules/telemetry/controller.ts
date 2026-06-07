import {Request, Response} from 'express';
import {telemetryService} from './service.ts';

export const getTelemetry = (req: Request, res: Response): void => {
    const {datos, error} = telemetryService.getUltimaLectura();
    if(error && !datos) {
        res.status(502).json({ success: false, message: error });
        return;
    }
    res.status(200).json({
        success: true,
        actualizado: new Date().toISOString(),
        telemetria: datos,
        alerta_conexion: error ? 'Alerta: Usando última lectura guardada. Placa desconectada.' : null
    });
}