import { openDatabase } from './database';

interface AnalyticsEvent {
    id: number;
    category: string;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, unknown>;
    timestamp: number;
}

class Analytics {
    private isInitialized = false;

    async init() {
        if (this.isInitialized) return;

        const db = await openDatabase();
        db.exec(`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT,
                action TEXT,
                label TEXT,
                value INTEGER,
                metadata TEXT,
                timestamp INTEGER
            )
        `);

        this.isInitialized = true;
    }

    async trackEvent(category: string, action: string, label?: string, value?: number, metadata?: Record<string, unknown>) {
        const event: AnalyticsEvent = {
            id: 0,
            category,
            action,
            label,
            value,
            metadata,
            timestamp: Date.now()
        };

        // Armazenar no banco de dados
        const db = await openDatabase();
        db.run(
            `INSERT INTO analytics_events (category, action, label, value, metadata, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
            [category, action, label ?? '', value ?? 0, JSON.stringify(metadata), event.timestamp]
        );

        // Enviar para Google Analytics em produção
        if (import.meta.env.PROD && window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
                ...metadata
            });
        }

        // Log em desenvolvimento
        if (import.meta.env.DEV) {
            console.log('Analytics Event:', event);
        }
    }

    // Eventos predefinidos
    async trackPageView(page: string) {
        await this.trackEvent('Navigation', 'PageView', page);
    }

    async trackError(error: Error, context?: string) {
        await this.trackEvent('Error', error.name, error.message, undefined, {
            context,
            stack: error.stack
        });
    }

    async trackUserAction(action: string, details?: Record<string, unknown>) {
        await this.trackEvent('UserAction', action, undefined, undefined, details);
    }

    async trackPerformance(metric: string, duration: number) {
        await this.trackEvent('Performance', metric, undefined, duration);
    }

    // Análise de eventos
    async getEventsByCategory(category: string): Promise<AnalyticsEvent[]> {
        const db = await openDatabase();
        const rows = db.exec(`SELECT * FROM analytics_events WHERE category = ?`, [category]);
        return rows[0].values.map((row) => {
            const [id, category, action, label, value, metadata, timestamp] = row as [number, string, string, string, number, string, number];
            return {
                id,
                category,
                action,
                label,
                value,
                metadata: JSON.parse(metadata),
                timestamp
            };
        });
    }

    async getEventsByAction(action: string): Promise<AnalyticsEvent[]> {
        const db = await openDatabase();
        const rows = db.exec(`SELECT * FROM analytics_events WHERE action = ?`, [action]);
        return rows[0].values.map((row) => {
            const typedRow = row as [number, string, string, string, number, string, number];
            return {
                id: typedRow[0],
                category: typedRow[1],
                action: typedRow[2],
                label: typedRow[3],
                value: typedRow[4],
                metadata: JSON.parse(typedRow[5]),
                timestamp: typedRow[6]
            };
        });
    }

    async getEventsByTimeRange(startTime: number, endTime: number): Promise<AnalyticsEvent[]> {
        const db = await openDatabase();
        const rows = db.exec(`SELECT * FROM analytics_events WHERE timestamp BETWEEN ? AND ?`, [startTime, endTime]);
        return rows[0].values.map((row) => {
            const [id, category, action, label, value, metadata, timestamp] = row as unknown as [number, string, string, string, number, string, number];
            return {
                id,
                category,
                action,
                label,
                value,
                metadata: JSON.parse(metadata),
                timestamp
            };
        });
    }

    async clearEvents() {
        const db = await openDatabase();
        db.run(`DELETE FROM analytics_events`);
    }
}

export const analytics = new Analytics();

function trackEvent(_event: string, _data: Record<string, unknown>) {
  // ...existing code...
}

function logError(_context: Record<string, unknown>) {
  // ...existing code...
}

function getAnalyticsData(): Record<string, unknown> {
  // ...existing code...
  return {};
}

export { trackEvent, logError, getAnalyticsData };
