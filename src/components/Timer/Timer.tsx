import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaStop, FaClock } from 'react-icons/fa';
import { timerStorage } from '../../services/timerStorage';
import { taskStorage } from '../../services/taskStorage';
import { timeSync } from '../../services/timeSync';
import { formatDuration } from '../../utils/timeUtils';
import { Task } from '../../types';

type TimerTask = Pick<Task, 'id' | 'title' | 'projectId' | 'timeSpent'>;

export const Timer: React.FC = () => {
    const [tasks, setTasks] = useState<TimerTask[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Carregar tarefas e verificar timer ativo
    const loadTasks = useCallback(() => {
        const loadedTasks = taskStorage.getAll().map(task => ({
            id: task.id,
            title: task.title,
            projectId: task.projectId,
            timeSpent: task.timeSpent || 0
        }));
        setTasks(loadedTasks);
    }, []);

    useEffect(() => {
        loadTasks();

        const currentTimer = timerStorage.getCurrentTimer();
        if (currentTimer) {
            const task = taskStorage.getById(currentTimer.taskId);
            if (task) {
                setSelectedTaskId(currentTimer.taskId);
                setIsRunning(true);
                const totalTime = timerStorage.getTaskTotalTime(currentTimer.taskId);
                setElapsedTime(totalTime);
            } else {
                // Se a tarefa não existe mais, limpar o timer
                timerStorage.stopCurrentTimer();
            }
        }
    }, [loadTasks]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning && selectedTaskId) {
            interval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, selectedTaskId]);

    const handleStart = () => {
        if (!selectedTaskId) {
            alert('Por favor, selecione uma tarefa');
            return;
        }

        const task = taskStorage.getById(selectedTaskId);
        if (!task) {
            alert('Tarefa não encontrada');
            return;
        }

        timerStorage.startTimer(selectedTaskId);
        setIsRunning(true);
    };

    const handleStop = () => {
        if (selectedTaskId) {
            timerStorage.stopCurrentTimer();
            setIsRunning(false);
            timeSync.syncTaskTime(selectedTaskId);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <FaClock className="text-blue-400" />
                <span className="font-mono text-white">{formatDuration(elapsedTime)}</span>
            </div>

            <select
                value={selectedTaskId || ''}
                onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                className="bg-gray-900 text-gray-100 rounded-lg px-3 py-2 text-sm min-w-[200px]
                    border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                    hover:border-gray-600 transition-colors duration-300"
                disabled={isRunning}
            >
                <option value="" className="bg-gray-900">Selecione uma tarefa</option>
                {tasks.map(task => (
                    <option key={task.id} value={task.id} className="bg-gray-900">
                        {task.title} ({formatDuration(task.timeSpent || 0)})
                    </option>
                ))}
            </select>

            <button
                onClick={isRunning ? handleStop : handleStart}
                className={`p-2 rounded ${
                    isRunning
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                } transition-colors duration-300`}
            >
                {isRunning ? <FaStop /> : <FaPlay />}
            </button>
        </div>
    );
};
