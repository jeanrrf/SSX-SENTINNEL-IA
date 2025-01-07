import { openDatabase } from './database';

export class StorageCleanup {
    async cleanDevData(): Promise<void> {
        if (process.env.NODE_ENV === 'development') {
            const db = await openDatabase();
            db.run(`DELETE FROM analytics_events`);
            // Adicione outras tabelas conforme necessário
        }
    }

    async exportData(): Promise<Record<string, unknown>> {
        const db = await openDatabase();
        const rows = db.exec(`SELECT * FROM analytics_events`);
        return {
            analytics_events: rows[0].values
        };
    }

    async importData(data: Record<string, unknown>): Promise<void> {
        const db = await openDatabase();
        if (data.analytics_events) {
            db.run(`DELETE FROM analytics_events`);
            for (const event of data.analytics_events as any[]) {
                db.run(
                    `INSERT INTO analytics_events (category, action, label, value, metadata, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
                    [event.category, event.action, event.label, event.value, JSON.stringify(event.metadata), event.timestamp]
                );
            }
        }
    }
}

const storageCleanup = new StorageCleanup();

export const cleanupDevData = async () => {
    await storageCleanup.cleanDevData();
};

export const exportAllData = async () => {
    const data = await storageCleanup.exportData();
    return JSON.stringify(data);
};

export const importAllData = async (jsonData: string): Promise<boolean> => {
    try {
        const data = JSON.parse(jsonData);
        await storageCleanup.importData(data);
        return true;
    } catch {
        return false;
    }
};

function cleanStorage(_keys: string[]) {
  // ...existing code...
}

function removeItem(_key: string) {
  // ...existing code...
}

export { cleanStorage, removeItem };
