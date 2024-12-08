import { BaseStorage } from './baseStorage';
import { formatDuration } from '../utils/timeUtils';

interface TimerEntry {
    id: number;
    taskId: number;
    startTime: string;
    endTime?: string;
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
                startTime: new Date().toISOString()
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
                endTime: new Date().toISOString(),
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

    calculateTotalTime(taskId: number): number {
        try {
            const entries = this.getByTaskId(taskId);
            return entries.reduce((total, entry) => {
                if (!entry.endTime) return total;
                
                const start = new Date(entry.startTime).getTime();
                const end = new Date(entry.endTime).getTime();
                return total + (end - start);
            }, 0);
        } catch (error) {
            console.error('Error calculating total time:', error);
            return 0;
        }
    }

    formatTotalTime(taskId: number): string {
        try {
            const totalMs = this.calculateTotalTime(taskId);
            return formatDuration(totalMs);
        } catch (error) {
            console.error('Error formatting total time:', error);
            return '00:00:00';
        }
    }
}

export const timerStorage = new TimerStorage();
