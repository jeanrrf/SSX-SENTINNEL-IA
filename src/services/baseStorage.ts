interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}

interface StorageMetadata {
    version: string;
    lastUpdate: string;
    environment: 'development' | 'production';
    userId?: string;
    dataSize: number;
}

export abstract class BaseStorage<T extends BaseEntity> {
    protected storageKey: string;
    protected metadata: StorageMetadata;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
        this.metadata = this.initializeMetadata();

        // Define prefixo único por usuário
        const userId = localStorage.getItem('user_id');
        if (userId) {
            this.storageKey = `${userId}_${this.storageKey}`;
        }
    }

    protected initializeMetadata(): StorageMetadata {
        const storedMetadata = localStorage.getItem(`${this.storageKey}_metadata`);
        if (storedMetadata) {
            return JSON.parse(storedMetadata);
        }
        return {
            version: '1.0.0',
            environment: (process.env.NODE_ENV || 'development') as 'development' | 'production',
            lastUpdate: new Date().toISOString(),
            dataSize: 0
        };
    }

    getAll(): T[] {
        const items = localStorage.getItem(this.storageKey);
        return items ? JSON.parse(items) : [];
    }

    protected saveItems(items: T[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        this.updateMetadata();
    }

    abstract save(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T;

    update(item: T): T {
        const items = this.getAll();
        const index = items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            items[index] = { ...items[index], ...item };
            this.saveItems(items);
            return items[index];
        }
        return item;
    }

    delete(id: number): void {
        const items = this.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        this.saveItems(filteredItems);
    }

    getById(id: number): T | undefined {
        const items = this.getAll();
        return items.find(item => item.id === id);
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(`${this.storageKey}_metadata`);
        this.metadata = this.initializeMetadata();
    }

    protected updateMetadata(): void {
        this.metadata.lastUpdate = new Date().toISOString();
        localStorage.setItem(`${this.storageKey}_metadata`, JSON.stringify(this.metadata));
    }

    getMetadata(): StorageMetadata {
        return { ...this.metadata };
    }

    isDevEnvironment(): boolean {
        return this.metadata.environment === 'development';
    }

    clearDevData(): void {
        if (this.isDevEnvironment()) {
            this.clear();
        }
    }

    exportData(): T[] {
        return this.getAll();
    }

    importData(data: T[]): void {
        this.saveItems(data);
    }
}
