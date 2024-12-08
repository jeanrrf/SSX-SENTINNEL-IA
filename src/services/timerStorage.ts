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
    private readonly CURRENT_TIMER_KEY = 'current_timer';

    constructor() {
        super('timers');
    }

    getCurrentTimer(): TimerEntry | null {
        const currentTimer = localStorage.getItem(this.CURRENT_TIMER_KEY);
        return currentTimer ? JSON.parse(currentTimer) : null;
    }

    startTimer(taskId: number): TimerEntry {
        // Parar timer atual se existir
        this.stopCurrentTimer();

        // Criar nova entrada de timer
        const newEntry: Omit<TimerEntry, 'id' | 'createdAt' | 'updatedAt'> = {
            taskId,
            startTime: new Date().toISOString()
        };

        // Salvar e definir como timer atual
        const entry = this.save(newEntry);
        localStorage.setItem(this.CURRENT_TIMER_KEY, JSON.stringify(entry));

        return entry;
    }

    stopCurrentTimer(): TimerEntry | null {
        const currentTimer = this.getCurrentTimer();
        if (!currentTimer) return null;

        // Limpar timer atual
        localStorage.removeItem(this.CURRENT_TIMER_KEY);

        // Se já tem endTime, não precisa atualizar
        if (currentTimer.endTime) return currentTimer;

        // Atualizar entrada com endTime
        const updatedEntry = {
            ...currentTimer,
            endTime: new Date().toISOString()
        };

        return this.update(updatedEntry);
    }

    getTaskTotalTime(taskId: number): number {
        const entries = this.getAll();
        const taskEntries = entries.filter(entry => entry.taskId === taskId);

        return taskEntries.reduce((total, entry) => {
            const startTime = new Date(entry.startTime).getTime();
            const endTime = entry.endTime ? new Date(entry.endTime).getTime() : Date.now();
            return total + (endTime - startTime);
        }, 0);
    }

    formatTaskTime(taskId: number): string {
        const totalTime = this.getTaskTotalTime(taskId);
        return formatDuration(totalTime);
    }

    save(timer: Omit<TimerEntry, 'id' | 'createdAt' | 'updatedAt'>): TimerEntry {
        const items = this.getAll();
        const newTimer: TimerEntry = {
            ...timer,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newTimer);
        this.saveItems(items);
        return newTimer;
    }

    override clear(): void {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.CURRENT_TIMER_KEY);
    }
}

export const timerStorage = new TimerStorage();
