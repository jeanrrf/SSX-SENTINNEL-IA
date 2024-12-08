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
    totalUserStorage: number;
}

export abstract class BaseStorage<T extends BaseEntity> {
    protected storageKey: string;
    protected metadata: StorageMetadata;
    private readonly MAX_STORAGE_PER_USER = 50 * 1024 * 1024; // 50MB em bytes

    constructor(storageKey: string) {
        this.storageKey = storageKey;
        this.metadata = this.initializeMetadata();
    }

    protected getUserPrefix(): string {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            return user.prefix || 'jean';
        }
        return 'jean';
    }

    protected getStorageKey(): string {
        return `${this.getUserPrefix()}_${this.storageKey}`;
    }

    protected calculateUserTotalStorage(): number {
        try {
            let totalSize = 0;
            const prefix = this.getUserPrefix();
            
            // Iterar sobre todos os itens no localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        totalSize += new Blob([value]).size;
                    }
                }
            }
            
            return totalSize;
        } catch (error) {
            console.error('Erro ao calcular armazenamento total:', error);
            return 0;
        }
    }

    protected checkStorageLimit(newDataSize: number): boolean {
        const currentTotal = this.calculateUserTotalStorage();
        return (currentTotal + newDataSize) <= this.MAX_STORAGE_PER_USER;
    }

    protected initializeMetadata(): StorageMetadata {
        try {
            const key = this.getStorageKey();
            const storedMetadata = localStorage.getItem(`${key}_metadata`);
            if (storedMetadata) {
                return JSON.parse(storedMetadata);
            }
        } catch (error) {
            console.error('Erro ao inicializar metadata:', error);
        }

        return {
            version: '1.0.0',
            environment: (process.env.NODE_ENV || 'development') as 'development' | 'production',
            lastUpdate: new Date().toISOString(),
            userId: this.getUserPrefix(),
            dataSize: 0,
            totalUserStorage: 0
        };
    }

    protected getItems(): T[] {
        try {
            const key = this.getStorageKey();
            const items = localStorage.getItem(key);
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error('Erro ao ler dados:', error);
            return [];
        }
    }

    protected saveItems(items: T[]): void {
        try {
            const key = this.getStorageKey();
            const dataToSave = JSON.stringify(items);
            const newDataSize = new Blob([dataToSave]).size;

            // Verificar se excede o limite
            if (!this.checkStorageLimit(newDataSize)) {
                throw new Error(`Limite de armazenamento excedido (50MB). Por favor, remova alguns itens antes de adicionar novos.`);
            }

            localStorage.setItem(key, dataToSave);
            this.updateMetadata(items);
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            throw error instanceof Error ? error : new Error('Falha ao salvar dados');
        }
    }

    getAll(): T[] {
        return this.getItems();
    }

    getById(id: number): T | undefined {
        try {
            const items = this.getItems();
            return items.find(item => item.id === id);
        } catch (error) {
            console.error('Erro ao buscar item por ID:', error);
            return undefined;
        }
    }

    save(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
        try {
            const items = this.getItems();
            const newItem = {
                ...item,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } as T;

            items.push(newItem);
            this.saveItems(items);
            return newItem;
        } catch (error) {
            console.error('Erro ao salvar item:', error);
            throw error instanceof Error ? error : new Error('Falha ao salvar item');
        }
    }

    update(item: T): T {
        try {
            const items = this.getItems();
            const index = items.findIndex(i => i.id === item.id);
            
            if (index === -1) {
                throw new Error('Item não encontrado');
            }

            const updatedItem = {
                ...item,
                updatedAt: new Date().toISOString()
            };

            items[index] = updatedItem;
            this.saveItems(items);
            return updatedItem;
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            throw error instanceof Error ? error : new Error('Falha ao atualizar item');
        }
    }

    delete(id: number): void {
        try {
            const items = this.getItems();
            const filtered = items.filter(item => item.id !== id);
            this.saveItems(filtered);
        } catch (error) {
            console.error('Erro ao deletar item:', error);
            throw error instanceof Error ? error : new Error('Falha ao deletar item');
        }
    }

    clear(): void {
        try {
            const key = this.getStorageKey();
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}_metadata`);
            this.metadata = this.initializeMetadata();
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            throw error instanceof Error ? error : new Error('Falha ao limpar dados');
        }
    }

    getStorageInfo(): { used: number; total: number; percentage: number } {
        const usedStorage = this.calculateUserTotalStorage();
        const percentage = (usedStorage / this.MAX_STORAGE_PER_USER) * 100;
        
        return {
            used: usedStorage,
            total: this.MAX_STORAGE_PER_USER,
            percentage: Math.min(100, percentage)
        };
    }

    private updateMetadata(items: T[]): void {
        try {
            const key = this.getStorageKey();
            this.metadata.lastUpdate = new Date().toISOString();
            this.metadata.dataSize = new Blob([JSON.stringify(items)]).size;
            this.metadata.userId = this.getUserPrefix();
            this.metadata.totalUserStorage = this.calculateUserTotalStorage();
            localStorage.setItem(`${key}_metadata`, JSON.stringify(this.metadata));
        } catch (error) {
            console.error('Erro ao atualizar metadata:', error);
        }
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
