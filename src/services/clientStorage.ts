import { BaseStorage } from './baseStorage';
import { Client } from '../types';

class ClientStorage extends BaseStorage<Client> {
    constructor() {
        super('clients');
    }

    getAll(): Client[] {
        try {
            return this.getItems() || [];
        } catch (error) {
            console.error('Error getting clients:', error);
            return [];
        }
    }

    save(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
        try {
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
        } catch (error) {
            console.error('Error saving client:', error);
            throw new Error('Failed to save client');
        }
    }

    update(client: Client): Client {
        try {
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
        } catch (error) {
            console.error('Error updating client:', error);
            throw new Error('Failed to update client');
        }
    }

    getById(id: number): Client | undefined {
        try {
            const items = this.getAll();
            return items.find(client => client.id === id);
        } catch (error) {
            console.error('Error getting client by ID:', error);
            return undefined;
        }
    }

    delete(id: number): void {
        try {
            const items = this.getAll().filter(client => client.id !== id);
            this.saveItems(items);
        } catch (error) {
            console.error('Error deleting client:', error);
            throw new Error('Failed to delete client');
        }
    }

    saveItems(items: Client[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
    }
}

export const clientStorage = new ClientStorage();
