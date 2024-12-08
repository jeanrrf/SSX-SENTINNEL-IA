import { BaseStorage } from './baseStorage';
import { Client } from '../types';

class ClientStorage extends BaseStorage<Client> {
    constructor() {
        super('clients');
    }

    getAll(): Client[] {
        return super.getAll();
    }

    save(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
        return super.save(client);
    }

    update(client: Client): Client {
        return super.update(client);
    }

    getById(id: number): Client | undefined {
        return super.getById(id);
    }

    delete(id: number): void {
        super.delete(id);
    }
}

export const clientStorage = new ClientStorage();
