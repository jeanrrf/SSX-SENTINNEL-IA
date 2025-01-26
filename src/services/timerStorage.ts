// Este arquivo foi substituído por timerStorageSQLite.ts
import { BaseStorage } from './baseStorage';
import { formatDuration } from '../utils/timeUtils';

interface TimerEntry {
    id: number;
    taskId: number;
    startTime: number; // Convert to seconds
    endTime?: number; // Convert to seconds
    createdAt: string;
    updatedAt: string;
}

class TimerStorage extends BaseStorage<TimerEntry> {
    private readonly CURRENT_TIMER_KEY = 'jean_current_timer';

    constructor() {
        super('timers');
    }

    getCurrentTimer(): TimerEntry | null {
        try {
            const currentTimer = localStorage.getItem(this.CURRENT_TIMER_KEY);
            return currentTimer ? JSON.parse(currentTimer) : null;
        } catch (error) {
            console.error('Error getting current timer:', error);
            return null;
        }
    }

    startTimer(taskId: number): TimerEntry {
        try {
            // Parar timer atual se existir
            this.stopCurrentTimer();

            // Criar nova entrada de timer
            const newEntry: Omit<TimerEntry, 'id' | 'createdAt' | 'updatedAt'> = {
                taskId,
                startTime: Math.floor(Date.now() / 1000) // Convert to seconds
            };

            // Salvar e definir como timer atual
            const entry = super.save(newEntry);
            localStorage.setItem(this.CURRENT_TIMER_KEY, JSON.stringify(entry));

            return entry;
        } catch (error) {
            console.error('Error starting timer:', error);
            throw new Error('Failed to start timer');
        }
    }

    stopCurrentTimer(): TimerEntry | null {
        try {
            const currentTimer = this.getCurrentTimer();
            if (!currentTimer) return null;

            // Limpar timer atual
            localStorage.removeItem(this.CURRENT_TIMER_KEY);

            // Se já tem endTime, não precisa atualizar
            if (currentTimer.endTime) return currentTimer;

            // Atualizar com horário de término
            const updatedTimer: TimerEntry = {
                ...currentTimer,
                endTime: Math.floor(Date.now() / 1000), // Convert to seconds
                updatedAt: new Date().toISOString()
            };

            return super.update(updatedTimer);
        } catch (error) {
            console.error('Error stopping timer:', error);
            return null;
        }
    }

    getByTaskId(taskId: number): TimerEntry[] {
        try {
            return this.getAll().filter(timer => timer.taskId === taskId);
        } catch (error) {
            console.error('Error getting timers by task ID:', error);
            return [];
        }
    }

    getTaskTotalTime(taskId: number): number {
        try {
            const currentTimer = this.getCurrentTimer();
            if (!currentTimer || currentTimer.taskId !== taskId) {
                return 0;
            }

            const now = Math.floor(Date.now() / 1000); // Convert to seconds
            return now - currentTimer.startTime;
        } catch (error) {
            console.error('Error calculating task total time:', error);
            return 0;
        }
    }

    calculateTotalTime(taskId: number): number {
        try {
            const entries = this.getByTaskId(taskId);
            return entries.reduce((total, entry) => {
                if (!entry.endTime) return total;
                
                return total + (entry.endTime - entry.startTime);
            }, 0);
        } catch (error) {
            console.error('Error calculating total time:', error);
            return 0;
        }
    }

    formatTotalTime(taskId: number): string {
        try {
            const totalMs = this.calculateTotalTime(taskId);
            return formatDuration(totalMs * 1000); // Convert to milliseconds
        } catch (error) {
            console.error('Error formatting total time:', error);
            return '00:00:00';
        }
    }
}

export const timerStorage = new TimerStorage();
