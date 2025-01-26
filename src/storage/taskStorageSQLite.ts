import { openDatabase } from '../utils/database';
import { Task } from '../types';

class TaskStorageSQLite {
    private db: any;

    constructor() {
        this.init();
    }

    private async init() {
        this.db = await openDatabase();
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                projectId INTEGER,
                description TEXT,
                status TEXT,
                priority TEXT,
                dueDate TEXT,
                createdAt TEXT,
                updatedAt TEXT
            )
        `);
    }

    async getAll(): Promise<Task[]> {
        const result = this.db.exec(`SELECT * FROM tasks`);
        return result[0]?.values.map((row: any) => this.mapRowToTask(row)) || [];
    }

    async save(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            INSERT INTO tasks (name, projectId, description, status, priority, dueDate, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(task.name, task.projectId, task.description, task.status, task.priority, task.dueDate, now, now);
        return { ...task, id: this.db.lastInsertRowid, createdAt: now, updatedAt: now };
    }

    async update(task: Task): Promise<Task> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE tasks SET name = ?, projectId = ?, description = ?, status = ?, priority = ?, dueDate = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(task.name, task.projectId, task.description, task.status, task.priority, task.dueDate, now, task.id);
        return { ...task, updatedAt: now };
    }

    async getById(id: number): Promise<Task | undefined> {
        const result = this.db.exec(`SELECT * FROM tasks WHERE id = ?`, [id]);
        return result[0]?.values.map((row: any) => this.mapRowToTask(row))[0];
    }

    async delete(id: number): Promise<void> {
        this.db.exec(`DELETE FROM tasks WHERE id = ?`, [id]);
    }

    private mapRowToTask(row: any): Task {
        return {
            id: row[0],
            name: row[1],
            projectId: row[2],
            description: row[3],
            status: row[4],
            priority: row[5],
            dueDate: row[6],
            createdAt: row[7],
            updatedAt: row[8]
        };
    }
}

export const taskStorageSQLite = new TaskStorageSQLite();
