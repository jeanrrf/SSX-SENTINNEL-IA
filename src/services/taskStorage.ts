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
        try {
            return this.getItems() || [];
        } catch (error) {
            console.error('Error getting tasks:', error);
            return [];
        }
    }

    save(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
        try {
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
        } catch (error) {
            console.error('Error saving task:', error);
            throw new Error('Failed to save task');
        }
    }

    update(task: Task): Task {
        try {
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
        } catch (error) {
            console.error('Error updating task:', error);
            throw new Error('Failed to update task');
        }
    }

    getById(id: number): Task | undefined {
        try {
            const items = this.getAll();
            return items.find(task => task.id === id);
        } catch (error) {
            console.error('Error getting task by ID:', error);
            return undefined;
        }
    }

    getByProjectId(projectId: number): Task[] {
        try {
            return this.getAll().filter(task => task.projectId === projectId);
        } catch (error) {
            console.error('Error getting tasks by project ID:', error);
            return [];
        }
    }

    delete(id: number): void {
        try {
            const items = this.getAll().filter(task => task.id !== id);
            this.saveItems(items);
            this.updateProjectTimes();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw new Error('Failed to delete task');
        }
    }

    updateTimeSpent(taskId: number, timeSpent: number): void {
        try {
            const task = this.getById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            this.update({
                ...task,
                timeSpent
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
                        totalTimeSpent: timeSpent
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
