import { clientStorage } from '../services/clientStorage';
import { projectStorage } from '../services/projectStorage';
import { taskStorage } from '../services/taskStorage';
import { timerStorage } from '../services/timerStorage';

export class StorageCleanup {
    private storages: any[];

    constructor(storages: any[]) {
        this.storages = storages;
    }

    cleanDevData(): void {
        this.storages.forEach(storage => {
            if (process.env.NODE_ENV === 'development') {
                storage.clear();
            }
        });
    }

    exportData(): Record<string, any> {
        const data: Record<string, any> = {};
        this.storages.forEach(storage => {
            const key = storage.constructor.name.toLowerCase().replace('storage', '');
            data[key] = storage.exportData();
        });
        return data;
    }

    importData(data: Record<string, any>): void {
        this.storages.forEach(storage => {
            const key = storage.constructor.name.toLowerCase().replace('storage', '');
            if (data[key]) {
                storage.importData(data[key]);
            }
        });
    }
}

const storages = [
    clientStorage,
    projectStorage,
    taskStorage,
    timerStorage
];

const storageCleanup = new StorageCleanup(storages);

export const cleanupDevData = () => {
    storageCleanup.cleanDevData();
};

export const exportAllData = () => {
    const data = storageCleanup.exportData();
    return JSON.stringify(data);
};

export const importAllData = (jsonData: string): boolean => {
    try {
        const data = JSON.parse(jsonData);
        storageCleanup.importData(data);
        return true;
    } catch {
        return false;
    }
};
