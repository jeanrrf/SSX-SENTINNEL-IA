import { Project } from '../types';
import { BaseStorage } from './baseStorage';

export class ProjectStorage extends BaseStorage<Project> {
    constructor() {
        super('projects');
    }

    getById(id: number): Project | undefined {
        try {
            const projects = this.getItems() || [];
            return projects.find(p => p.id === id);
        } catch (error) {
            console.error('Error getting project by ID:', error);
            return undefined;
        }
    }

    getByClientId(clientId: number): Project[] {
        try {
            const projects = this.getItems() || [];
            return projects.filter(p => p.clientId === clientId);
        } catch (error) {
            console.error('Error getting projects by client ID:', error);
            return [];
        }
    }

    save(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
        try {
            const items = this.getItems() || [];
            const newProject: Project = {
                ...project,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            items.push(newProject);
            this.saveItems(items);
            return newProject;
        } catch (error) {
            console.error('Error saving project:', error);
            throw new Error('Failed to save project');
        }
    }

    override update(project: Project): Project {
        try {
            return super.update({
                ...project,
                clientId: Number(project.clientId)
            });
        } catch (error) {
            console.error('Error updating project:', error);
            throw new Error('Failed to update project');
        }
    }

    override delete(id: number): void {
        try {
            const items = this.getItems() || [];
            const filtered = items.filter(p => p.id !== id);
            this.saveItems(filtered);
        } catch (error) {
            console.error('Error deleting project:', error);
            throw new Error('Failed to delete project');
        }
    }

    override clear(): void {
        try {
            super.clear();
        } catch (error) {
            console.error('Error clearing projects:', error);
            throw new Error('Failed to clear projects');
        }
    }
}

export const projectStorage = new ProjectStorage();
