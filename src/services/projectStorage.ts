import { Project } from '../types';
import { BaseStorage } from './baseStorage';

export class ProjectStorage extends BaseStorage<Project> {
    constructor() {
        super('projects');
    }

    getById(id: number): Project | undefined {
        return super.getById(id);
    }

    getByClientId(clientId: number): Project[] {
        try {
            return this.getAll().filter(p => p.clientId === clientId);
        } catch (error) {
            console.error('Error getting projects by client ID:', error);
            return [];
        }
    }

    save(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
        return super.save(project);
    }

    override update(project: Project): Project {
        return super.update({
            ...project,
            clientId: Number(project.clientId)
        });
    }

    override delete(id: number): void {
        super.delete(id);
    }

    override clear(): void {
        super.clear();
    }
}

export const projectStorage = new ProjectStorage();
