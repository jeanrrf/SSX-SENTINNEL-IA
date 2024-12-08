import React, { useState } from 'react';
import { Task } from '../../types';
import { taskStorage } from '../../services/taskStorage';
import { formatDuration } from '../../utils/timeUtils';

interface TimeAdjustModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onTimeAdjusted: () => void;
}

const TimeAdjustModal: React.FC<TimeAdjustModalProps> = ({ task, isOpen, onClose, onTimeAdjusted }) => {
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [seconds, setSeconds] = useState('0');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Converter para segundos
        const totalSeconds = 
            parseInt(hours) * 3600 + 
            parseInt(minutes) * 60 + 
            parseInt(seconds);

        // Atualizar a tarefa
        const updatedTask = {
            ...task,
            timeSpent: totalSeconds,
            updatedAt: new Date().toISOString()
        };

        taskStorage.update(updatedTask);
        onTimeAdjusted();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
                <h3 className="text-xl font-semibold mb-4 text-white">Ajustar Tempo</h3>
                <p className="text-gray-300 mb-4">
                    Tempo atual: {formatDuration(task.timeSpent || 0)}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Horas
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Minutos
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Segundos
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={(e) => setSeconds(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimeAdjustModal;
