import * as Sentry from '@sentry/react';

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
        public context?: Record<string, any>
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

export const logError = (error: Error | AppError, context?: Record<string, any>) => {
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

    return errorDetails;
};
