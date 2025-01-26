// Este arquivo foi substituído por taskStorageSQLite.ts
import { BaseStorage } from './baseStorage';
import { Task } from '../types';
import { projectStorage } from './projectStorage';

class TaskStorage extends BaseStorage<Task> {
    private initialized = false;

    constructor() {
        super('tasks');
        this.initializeData();
    }

    getAll(): Task[] {
        return super.getAll();
    }

    save(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
        const newTask = super.save({
            ...task,
            timeSpent: task.timeSpent || 0
        });
        this.updateProjectTimes();
        return newTask;
    }

    update(task: Task): Task {
        const updatedTask = super.update(task);
        this.updateProjectTimes();
        return updatedTask;
    }

    getById(id: number): Task | undefined {
        return super.getById(id);
    }

    getByProjectId(projectId: number): Task[] {
        try {
            return this.getAll().filter(task => task.projectId === projectId);
        } catch (error) {
            console.error('Error getting tasks by project ID:', error);
            return [];
        }
    }

    getByClientId(clientId: number): Task[] {
        try {
            return this.getAll().filter(task => task.clientId === clientId);
        } catch (error) {
            console.error('Error getting tasks by client ID:', error);
            return [];
        }
    }

    delete(id: number): void {
        super.delete(id);
        this.updateProjectTimes();
    }

    updateTimeSpent(taskId: number, timeSpent: number): void {
        try {
            const task = this.getById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            // Ensure timeSpent is treated as seconds
            this.update({
                ...task,
                timeSpent: Math.floor(timeSpent) // Ensure we store whole seconds
            });
        } catch (error) {
            console.error('Error updating time spent:', error);
            throw new Error('Failed to update time spent');
        }
    }

    private updateProjectTimes(): void {
        try {
            const tasks = this.getAll();
            const projectTimes = new Map<number, number>();

            // Calcular tempo total por projeto
            tasks.forEach(task => {
                const currentTime = projectTimes.get(task.projectId) || 0;
                projectTimes.set(task.projectId, currentTime + (task.timeSpent || 0));
            });

            // Atualizar tempo em cada projeto
            projectTimes.forEach((timeSpent, projectId) => {
                const project = projectStorage.getById(projectId);
                if (project) {
                    projectStorage.update({
                        ...project,
                        timeSpent: timeSpent
                    });
                }
            });
        } catch (error) {
            console.error('Error updating project times:', error);
        }
    }

    private initializeData(): void {
        if (this.initialized) return;

        try {
            const tasks = this.getAll();
            if (tasks.length > 0) {
                this.updateProjectTimes();
            }
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing task data:', error);
        }
    }
}

export const taskStorage = new TaskStorage();
