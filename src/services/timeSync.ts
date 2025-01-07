import { taskStorage } from './taskStorage';
import { timerStorage } from './timerStorage';
import { Task } from '../types';

class TimeSync {
    syncTaskTime(taskId: number) {
        const task = taskStorage.getById(taskId);
        if (!task) return;

        const currentTimer = timerStorage.getCurrentTimer();
        if (!currentTimer) return;

        const now = Math.floor(Date.now() / 1000); // Convert to seconds
        const elapsedSeconds = now - currentTimer.startTime;
        
        const currentTimeSpent = task.timeSpent || 0;
        const newTimeSpent = currentTimeSpent + elapsedSeconds;

        taskStorage.updateTimeSpent(taskId, newTimeSpent);
    }

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
    }

    getProjectTotalTime(projectId: number): number {
        const projectTasks = taskStorage.getByProjectId(projectId);
        return projectTasks.reduce((total: number, task: Task) => 
            total + (task.timeSpent || 0), 0);
    }

    getClientTotalTime(clientId: number): number {
        const clientTasks = taskStorage.getByClientId(clientId);
        return clientTasks.reduce((total: number, task: Task) => 
            total + (task.timeSpent || 0), 0);
    }
}

export const timeSync = new TimeSync();
