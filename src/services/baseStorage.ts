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
        // Sempre usar o prefixo do Jean
        this.storageKey = `jean_${storageKey}`;
        this.metadata = this.initializeMetadata();
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
            userId: 'jean',
            dataSize: 0
        };
    }

    getAll(): T[] {
        try {
            const items = localStorage.getItem(this.storageKey);
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error('Erro ao ler dados:', error);
            return [];
        }
    }

    protected saveItems(items: T[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            this.updateMetadata(items.length);
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    protected updateMetadata(dataSize: number): void {
        this.metadata = {
            ...this.metadata,
            lastUpdate: new Date().toISOString(),
            dataSize
        };
        localStorage.setItem(`${this.storageKey}_metadata`, JSON.stringify(this.metadata));
    }

    getById(id: number): T | undefined {
        return this.getAll().find(item => item.id === id);
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(`${this.storageKey}_metadata`);
        this.metadata = this.initializeMetadata();
    }

    protected validateEntity(entity: T): boolean {
        return (
            typeof entity === 'object' &&
            entity !== null &&
            'id' in entity &&
            'createdAt' in entity &&
            'updatedAt' in entity
        );
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
