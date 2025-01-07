import * as Sentry from '@sentry/react';
import { openDatabase } from './database';

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
        public context?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const initErrorTracking = () => {
    if (import.meta.env.VITE_APP_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.VITE_APP_SENTRY_DSN,
            environment: import.meta.env.MODE,
            tracesSampleRate: 1.0,
        });
    }
};

export const logError = async (error: Error | AppError, context?: Record<string, unknown>) => {
    const errorDetails = {
        message: error.message,
        stack: error.stack,
        context: context || (error as AppError).context,
        severity: (error as AppError).severity || 'medium',
        code: (error as AppError).code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
    };

    // Log local para desenvolvimento
    if (import.meta.env.DEV) {
        console.error('Error:', errorDetails);
    }

    // Log remoto para produção
    if (import.meta.env.PROD) {
        Sentry.captureException(error, {
            extra: errorDetails
        });
    }

    // Armazenar no banco de dados
    const db = await openDatabase();
    db.run(
        `INSERT INTO error_logs (message, stack, context, severity, code, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [errorDetails.message, errorDetails.stack || '', JSON.stringify(errorDetails.context), errorDetails.severity, errorDetails.code, errorDetails.timestamp]
    );

    return errorDetails;
};

export const handleError = async (error: Error, context: Record<string, unknown>) => {
    await logError(error, context);
};
