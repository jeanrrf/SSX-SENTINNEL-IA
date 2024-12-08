import { taskStorage } from './taskStorage';
import { timerStorage } from './timerStorage';
import { Task } from '../types';

export const timeSync = {
    syncTaskTime(taskId: number): void {
        const task = taskStorage.getById(taskId);
        if (task) {
            const totalTime = timerStorage.getTaskTotalTime(taskId);
            taskStorage.update({
                ...task,
                timeSpent: totalTime
            });
        }
    },

    syncAllTasks(): void {
        const tasks = taskStorage.getAll();
        tasks.forEach(task => {
            const totalTime = timerStorage.getTaskTotalTime(task.id);
            if (task.timeSpent !== totalTime) {
                taskStorage.update({
                    ...task,
                    timeSpent: totalTime
                });
            }
        });
    },

    getProjectTotalTime(projectId: number): number {
        const projectTasks = taskStorage.getByProjectId(projectId);
        return projectTasks.reduce((total: number, task: Task) => 
            total + (task.timeSpent || 0), 0);
    },

    getClientTotalTime(clientId: number): number {
        const clientTasks = taskStorage.getByClientId(clientId);
        return clientTasks.reduce((total: number, task: Task) => 
            total + (task.timeSpent || 0), 0);
    }
};
