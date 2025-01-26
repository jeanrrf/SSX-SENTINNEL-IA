import { openDatabase } from '../utils/database';
import { Timer } from '../types';

class TimerStorageSQLite {
    private db: any;

    constructor() {
        this.init();
    }

    private async init() {
        this.db = await openDatabase();
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS timers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                taskId INTEGER,
                startTime TEXT,
                endTime TEXT,
                duration INTEGER,
                createdAt TEXT,
                updatedAt TEXT
            )
        `);
    }

    async getAll(): Promise<Timer[]> {
        const result = this.db.exec(`SELECT * FROM timers`);
        return result[0]?.values.map((row: any) => this.mapRowToTimer(row)) || [];
    }

    async save(timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Timer> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            INSERT INTO timers (taskId, startTime, endTime, duration, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmt.run(timer.taskId, timer.startTime, timer.endTime, timer.duration, now, now);
        return { ...timer, id: this.db.lastInsertRowid, createdAt: now, updatedAt: now };
    }

    async update(timer: Timer): Promise<Timer> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE timers SET taskId = ?, startTime = ?, endTime = ?, duration = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(timer.taskId, timer.startTime, timer.endTime, timer.duration, now, timer.id);
        return { ...timer, updatedAt: now };
    }

    async getById(id: number): Promise<Timer | undefined> {
        const result = this.db.exec(`SELECT * FROM timers WHERE id = ?`, [id]);
        return result[0]?.values.map((row: any) => this.mapRowToTimer(row))[0];
    }

    async delete(id: number): Promise<void> {
        this.db.exec(`DELETE FROM timers WHERE id = ?`, [id]);
    }

    private mapRowToTimer(row: any): Timer {
        return {
            id: row[0],
            taskId: row[1],
            startTime: row[2],
            endTime: row[3],
            duration: row[4],
            createdAt: row[5],
            updatedAt: row[6]
        };
    }
}

export const timerStorageSQLite = new TimerStorageSQLite();
