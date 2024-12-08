import { BaseStorage } from './baseStorage';
import { Task } from '../types';
import { projectStorage } from './projectStorage';

class TaskStorage extends BaseStorage<Task> {
    private initialized = false;

    constructor() {
        super('sentinel_tasks');
        this.initializeData();
    }

    getAll(): Task[] {
        const items = localStorage.getItem(this.storageKey);
        return items ? JSON.parse(items) : [];
    }

    save(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
        const items = this.getAll();
        const newTask: Task = {
            ...task,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeSpent: task.timeSpent || 0
        };
        items.push(newTask);
        this.saveItems(items);
        this.updateProjectTimes();
        return newTask;
    }

    update(task: Task): Task {
        const items = this.getAll();
        const index = items.findIndex(t => t.id === task.id);
        
        if (index === -1) {
            throw new Error('Task not found');
        }

        const updatedTask: Task = {
            ...task,
            updatedAt: new Date().toISOString()
        };

        items[index] = updatedTask;
        this.saveItems(items);
        this.updateProjectTimes();
        return updatedTask;
    }

    getById(id: number): Task | undefined {
        const items = this.getAll();
        return items.find(task => task.id === id);
    }

    delete(id: number): void {
        const items = this.getAll().filter(task => task.id !== id);
        this.saveItems(items);
        this.updateProjectTimes();
    }

    getByProjectId(projectId: number): Task[] {
        return this.getAll().filter(task => task.projectId === projectId);
    }

    getByClientId(clientId: number): Task[] {
        return this.getAll().filter(task => task.clientId === clientId);
    }

    saveItems(items: Task[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
    }

    private updateProjectTimes(): void {
        const tasks = this.getAll();
        
        tasks.forEach(task => {
            if (task.projectId) {
                const projectTasks = this.getByProjectId(task.projectId);
                const totalTime = projectTasks.reduce((total, t) => total + (t.timeSpent || 0), 0);
                
                const project = projectStorage.getById(task.projectId);
                if (project) {
                    projectStorage.update({
                        ...project,
                        timeSpent: totalTime
                    });
                }
            }
        });
    }

    private initializeData(): void {
        if (this.initialized) return;

        try {
            const existingData = this.getAll();
            if (existingData.length > 0) {
                console.log('TaskStorage: Dados existentes encontrados');
                this.initialized = true;
                return;
            }

            console.log('TaskStorage: Nenhum dado encontrado, inicializando vazio');
            this.saveItems([]);
            this.initialized = true;
        } catch (error) {
            console.error('TaskStorage: Erro ao inicializar dados:', error);
            this.clear();
            this.saveItems([]);
            this.initialized = true;
        }
    }
}

export const taskStorage = new TaskStorage();
