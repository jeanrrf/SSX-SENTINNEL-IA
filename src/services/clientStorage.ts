import { BaseStorage } from './baseStorage';
import { Client } from '../types';

class ClientStorage extends BaseStorage<Client> {
    constructor() {
        super('sentinel_clients');
    }

    getAll(): Client[] {
        const items = localStorage.getItem(this.storageKey);
        return items ? JSON.parse(items) : [];
    }

    save(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
        const items = this.getAll();
        const newClient: Client = {
            ...client,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newClient);
        this.saveItems(items);
        return newClient;
    }

    update(client: Client): Client {
        const items = this.getAll();
        const index = items.findIndex(c => c.id === client.id);
        
        if (index === -1) {
            throw new Error('Client not found');
        }

        const updatedClient: Client = {
            ...client,
            updatedAt: new Date().toISOString()
        };

        items[index] = updatedClient;
        this.saveItems(items);
        return updatedClient;
    }

    getById(id: number): Client | undefined {
        const items = this.getAll();
        return items.find(client => client.id === id);
    }

    delete(id: number): void {
        const items = this.getAll().filter(client => client.id !== id);
        this.saveItems(items);
    }

    saveItems(items: Client[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
    }
}

export const clientStorage = new ClientStorage();
