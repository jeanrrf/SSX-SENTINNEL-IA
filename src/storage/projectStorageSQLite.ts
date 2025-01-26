import { openDatabase } from '../utils/database';
import { Project } from '../types';

class ProjectStorageSQLite {
    private db: any;

    constructor() {
        this.init();
    }

    private async init() {
        this.db = await openDatabase();
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                clientId INTEGER,
                description TEXT,
                status TEXT,
                startDate TEXT,
                endDate TEXT,
                progress INTEGER,
                team TEXT,
                createdAt TEXT,
                updatedAt TEXT
            )
        `);
    }

    async getAll(): Promise<Project[]> {
        const result = this.db.exec(`SELECT * FROM projects`);
        return result[0]?.values.map((row: any) => this.mapRowToProject(row)) || [];
    }

    async save(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            INSERT INTO projects (name, clientId, description, status, startDate, endDate, progress, team, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(project.name, project.clientId, project.description, project.status, project.startDate, project.endDate, project.progress, JSON.stringify(project.team), now, now);
        return { ...project, id: this.db.lastInsertRowid, createdAt: now, updatedAt: now };
    }

    async update(project: Project): Promise<Project> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE projects SET name = ?, clientId = ?, description = ?, status = ?, startDate = ?, endDate = ?, progress = ?, team = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(project.name, project.clientId, project.description, project.status, project.startDate, project.endDate, project.progress, JSON.stringify(project.team), now, project.id);
        return { ...project, updatedAt: now };
    }

    async getById(id: number): Promise<Project | undefined> {
        const result = this.db.exec(`SELECT * FROM projects WHERE id = ?`, [id]);
        return result[0]?.values.map((row: any) => this.mapRowToProject(row))[0];
    }

    async delete(id: number): Promise<void> {
        this.db.exec(`DELETE FROM projects WHERE id = ?`, [id]);
    }

    private mapRowToProject(row: any): Project {
        return {
            id: row[0],
            name: row[1],
            clientId: row[2],
            description: row[3],
            status: row[4],
            startDate: row[5],
            endDate: row[6],
            progress: row[7],
            team: JSON.parse(row[8]),
            createdAt: row[9],
            updatedAt: row[10]
        };
    }
}

export const projectStorageSQLite = new ProjectStorageSQLite();
