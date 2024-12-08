import { projectStorage } from './projectStorage';
import { taskStorage } from './taskStorage';
import { clientStorage } from './clientStorage';
import { formatDuration } from '../utils/timeUtils';
import { Task } from '../types';

export interface ReportFilters {
    startDate: string;
    endDate: string;
    clientId?: number;
    projectId?: number;
    status?: Task['status'];
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface TimeReport {
    totalTime: number;
    formattedTime: string;
}

export interface TaskTimeReport {
    taskId: number;
    taskTitle: string;
    projectName: string;
    clientName: string;
    status: Task['status'];
    timeSpent: number;
    formattedTime: string;
}

export interface ClientTimeReport {
    clientId: number;
    clientName: string;
    totalTasks: number;
    completedTasks: number;
    totalTime: number;
    formattedTime: string;
    projects: {
        projectId: number;
        projectName: string;
        totalTime: number;
        formattedTime: string;
        tasks: TaskTimeReport[];
    }[];
}

export interface StatusTimeReport {
    status: Task['status'];
    totalTasks: number;
    totalTime: number;
    formattedTime: string;
}

class ReportService {
    // Relatório geral por período
    getTimeReport(filters: ReportFilters): TimeReport {
        const tasks = this.filterTasks(taskStorage.getAll(), filters);
        const totalTime = tasks.reduce((total, task) => total + task.timeSpent, 0);
        
        return {
            totalTime,
            formattedTime: formatDuration(totalTime)
        };
    }

    // Relatório detalhado por cliente
    getClientReport(filters: ReportFilters): ClientTimeReport[] {
        const clients = clientStorage.getAll();
        return clients.map(client => {
            const clientProjects = projectStorage.getByClientId(client.id);
            const projects = clientProjects.map(project => {
                const tasks = this.filterTasks(
                    taskStorage.getByProjectId(project.id),
                    filters
                );

                const totalTime = tasks.reduce((total, task) => total + task.timeSpent, 0);

                return {
                    projectId: project.id,
                    projectName: project.name,
                    totalTime,
                    formattedTime: formatDuration(totalTime),
                    tasks: tasks.map(task => ({
                        taskId: task.id,
                        taskTitle: task.title,
                        projectName: project.name,
                        clientName: client.name,
                        status: task.status,
                        timeSpent: task.timeSpent,
                        formattedTime: formatDuration(task.timeSpent)
                    }))
                };
            });

            const totalTime = projects.reduce((total, project) => total + project.totalTime, 0);
            const allTasks = projects.flatMap(p => p.tasks);

            return {
                clientId: client.id,
                clientName: client.name,
                totalTasks: allTasks.length,
                completedTasks: allTasks.filter(t => t.status === 'done').length,
                totalTime,
                formattedTime: formatDuration(totalTime),
                projects
            };
        }).filter(report => report.totalTime > 0); // Mostrar apenas clientes com tempo registrado
    }

    // Relatório por status
    getStatusReport(filters: ReportFilters): StatusTimeReport[] {
        const tasks = this.filterTasks(taskStorage.getAll(), filters);
        const statusGroups = this.groupBy(tasks, 'status');
        
        return Object.entries(statusGroups).map(([status, tasks]) => {
            const totalTime = tasks.reduce((total, task) => total + task.timeSpent, 0);
            return {
                status: status as Task['status'],
                totalTasks: tasks.length,
                totalTime,
                formattedTime: formatDuration(totalTime)
            };
        });
    }

    // Filtrar tarefas baseado nos filtros
    private filterTasks(tasks: Task[], filters: ReportFilters): Task[] {
        return tasks.filter(task => {
            // Filtrar por data
            const taskDate = new Date(task.createdAt);
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            
            if (taskDate < startDate || taskDate > endDate) return false;

            // Filtrar por cliente
            if (filters.clientId) {
                const project = projectStorage.getById(task.projectId);
                if (!project || project.clientId !== filters.clientId) return false;
            }

            // Filtrar por projeto
            if (filters.projectId && task.projectId !== filters.projectId) return false;

            // Filtrar por status
            if (filters.status && task.status !== filters.status) return false;

            return true;
        });
    }

    // Agrupar array por chave
    private groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
        return array.reduce((groups, item) => {
            const value = item[key] as unknown as string;
            return {
                ...groups,
                [value]: [...(groups[value] || []), item]
            };
        }, {} as { [key: string]: T[] });
    }

    // Obter datas inicial e final do período
    getPeriodDates(period: ReportFilters['period']): { startDate: string; endDate: string } {
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
            case 'daily':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }

        return {
            startDate: startDate.toISOString(),
            endDate: now.toISOString()
        };
    }
}

export const reportService = new ReportService();
