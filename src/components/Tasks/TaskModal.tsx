import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Task, Project, Client } from '../../types';
import { projectStorage } from '../../services/projectStorage';
import { clientStorage } from '../../services/clientStorage';

interface TaskModalProps {
    task?: Task;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeSpent'>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'to_do',
        priority: task?.priority || 'medium',
        projectId: task?.projectId || 0,
        clientId: task?.clientId || 0,
        dueDate: task?.dueDate || ''
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        setProjects(projectStorage.getAll());
        setClients(clientStorage.getAll());
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                        {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Título
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Cliente
                        </label>
                        <select
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: Number(e.target.value) })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            required
                        >
                            <option value="" className="bg-gray-900">Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} className="bg-gray-900">
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Projeto
                        </label>
                        <select
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            required
                        >
                            <option value="" className="bg-gray-900">Selecione um projeto</option>
                            {projects
                                .filter(project => !formData.clientId || project.clientId === formData.clientId)
                                .map(project => (
                                    <option key={project.id} value={project.id} className="bg-gray-900">
                                        {project.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        >
                            <option value="to_do" className="bg-gray-900">A Fazer</option>
                            <option value="in_progress" className="bg-gray-900">Em Progresso</option>
                            <option value="review" className="bg-gray-900">Em Revisão</option>
                            <option value="completed" className="bg-gray-900">Concluído</option>
                            <option value="blocked" className="bg-gray-900">Bloqueado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Prioridade
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        >
                            <option value="low" className="bg-gray-900">Baixa</option>
                            <option value="medium" className="bg-gray-900">Média</option>
                            <option value="high" className="bg-gray-900">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Data de Entrega
                        </label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {task ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
