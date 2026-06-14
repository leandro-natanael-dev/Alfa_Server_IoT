// src/modules/telemetry/infrastructure/http/telemetry.controller.ts
import { Request, Response } from 'express';
import { CalculateAveragesUseCase } from '../../application/useCases/calculateAverageUseCase.js';
import {GetLatestUseCase as GetLatestTelemetryUseCase} from '../../application/useCases/getLatestUseCase.js';

export class TelemetryController {
    // Inyectamos los casos de uso a través del constructor
    constructor(
        private getLatestUseCase: GetLatestTelemetryUseCase,
        private calculateAveragesUseCase: CalculateAveragesUseCase
    ) {}

    /**
     * GET /api/telemetria
     * Devuelve los últimos datos guardados en la caché de memoria
     */
    public getTelemetry = async (req: Request, res: Response): Promise<void> => {
        try {
            // Ejecutamos el caso de uso específico
            const telemetryData = this.getLatestUseCase.execute();

            // Si hay un error registrado en el estado, respondemos con advertencia
            if (telemetryData.error) {
                res.status(503).json({ 
                    status: 'error', 
                    message: telemetryData.error,
                    data: telemetryData.data 
                });
                return;
            }

            res.status(200).json({ status: 'success', data: telemetryData.data });
        } catch (error: any) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    /**
     * GET /api/stats?range=15min
     * Devuelve los promedios calculados por la base de datos
     */
    public getStats = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extraemos el parámetro de la query (por defecto '15min')
            const range = (req.query.range as string) || '15min';

            // Ejecutamos el caso de uso pasándole el parámetro requerido
            const averages = await this.calculateAveragesUseCase.execute(range);

            if (!averages) {
                res.status(404).json({ 
                    status: 'fail', 
                    message: `No telemetry data found for the range: ${range}` 
                });
                return;
            }

            res.status(200).json({ status: 'success', data: averages });
        } catch (error: any) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
}
