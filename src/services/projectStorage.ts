import { Project } from '../types';
import { BaseStorage } from './baseStorage';

export class ProjectStorage extends BaseStorage<Project> {
    constructor() {
        super('projects');
    }

    // Obter projeto por ID
    getById(id: number): Project | undefined {
        const projects = this.getAll();
        return projects.find(p => p.id === id);
    }

    // Obter projetos por cliente
    getByClientId(clientId: number): Project[] {
        return this.getAll().filter(p => p.clientId === clientId);
    }

    // Salvar novo projeto
    save(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
        const items = this.getAll();
        const newProject: Project = {
            ...project,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newProject);
        this.saveItems(items);
        return newProject;
    }

    // Atualizar projeto existente
    override update(project: Project): Project {
        return super.update({
            ...project,
            clientId: Number(project.clientId) // Garantir que clientId seja número
        });
    }

    // Excluir projeto
    override delete(id: number): void {
        const items = this.getAll();
        const filtered = items.filter(p => p.id !== id);
        this.saveItems(filtered);
    }

    // Limpar todos os dados
    override clear(): void {
        super.clear();
    }
}

export const projectStorage = new ProjectStorage();
