import { openDatabase } from '../utils/database';
import { Client } from '../types';

class ClientStorageSQLite {
    private db: import('sqlite3').Database | undefined;

    constructor() {
        this.db = undefined;
        this.init();
    }

    private async init() {
        this.db = await openDatabase();
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone TEXT,
                address TEXT,
                company TEXT,
                status TEXT,
                notes TEXT,
                metadata TEXT,
                createdAt TEXT,
                updatedAt TEXT
            )
        `);
    }

    async getAll(): Promise<Client[]> {
        const result = this.db.exec(`SELECT * FROM clients`);
        return result[0]?.values.map((row: unknown) => this.mapRowToClient(row as Client)) || [];
    }

    async save(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            INSERT INTO clients (name, email, phone, address, company, status, notes, metadata, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(client.name, client.email, client.phone, client.address, client.company, client.status, client.notes, JSON.stringify(client.metadata), now, now);
        return { ...client, id: this.db.lastInsertRowid, createdAt: now, updatedAt: now };
    }

    async update(client: Client): Promise<Client> {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, company = ?, status = ?, notes = ?, metadata = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(client.name, client.email, client.phone, client.address, client.company, client.status, client.notes, JSON.stringify(client.metadata), now, client.id);
        return { ...client, updatedAt: now };
    }

    async getById(id: number): Promise<Client | undefined> {
        const result = this.db?.exec(`SELECT * FROM clients WHERE id = ?`, [id]);
        return result?.[0]?.values.map((row: { [key: string]: string }) => this.mapRowToClient(row))[0];
    }

    async delete(id: number): Promise<void> {
        this.db.exec(`DELETE FROM clients WHERE id = ?`, [id]);
    }

    private mapRowToClient(row: { [key: string]: string }): Client {
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            address: row.address,
            company: row.company,
            status: row.status,
            notes: row.notes,
            metadata: JSON.parse(row.metadata),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }
}

export const clientStorageSQLite = new ClientStorageSQLite();
