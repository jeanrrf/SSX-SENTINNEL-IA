import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Project, Client } from '../../types';
import { clientStorage } from '../../services/clientStorage';

type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

interface ProjectModalProps {
    project?: Project;
    onClose: () => void;
    onSave: (project: ProjectFormData) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: project?.name || '',
        description: project?.description || '',
        clientId: project?.clientId || 0,
        status: project?.status || 'not_started',
        startDate: project?.startDate || new Date().toISOString().split('T')[0],
        endDate: project?.endDate || new Date().toISOString().split('T')[0],
        progress: project?.progress || 0,
        timeSpent: project?.timeSpent || 0,
        team: project?.team || []
    });

    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const loadedClients = clientStorage.getAll().filter(c => c.status === 'active');
        setClients(loadedClients);

        if (!project && loadedClients.length > 0) {
            setFormData(prev => ({
                ...prev,
                clientId: loadedClients[0].id
            }));
        }
    }, [project]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'clientId' ? Number(value) : 
                    name === 'progress' ? Math.min(100, Math.max(0, Number(value))) : 
                    name === 'timeSpent' ? Number(value) : 
                    value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {project ? 'Editar Projeto' : 'Novo Projeto'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nome do Projeto
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="Digite o nome do projeto"
                        />
                    </div>

                    {/* Cliente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cliente
                        </label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        >
                            <option value="" className="bg-gray-900">Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} className="bg-gray-900">
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="Digite a descrição do projeto"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        >
                            <option value="not_started" className="bg-gray-900">Não Iniciado</option>
                            <option value="in_progress" className="bg-gray-900">Em Andamento</option>
                            <option value="completed" className="bg-gray-900">Concluído</option>
                            <option value="on_hold" className="bg-gray-900">Em Pausa</option>
                            <option value="cancelled" className="bg-gray-900">Cancelado</option>
                        </select>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Data de Início
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                    border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                    hover:border-gray-600 transition-colors duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Data de Término
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                    border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                    hover:border-gray-600 transition-colors duration-300"
                            />
                        </div>
                    </div>

                    {/* Progresso */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Progresso ({formData.progress}%)
                        </label>
                        <input
                            type="range"
                            name="progress"
                            value={formData.progress}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="5"
                            className="w-full bg-gray-900 text-gray-100 rounded-lg
                                accent-blue-500 cursor-pointer"
                        />
                    </div>

                    {/* Tempo Gasto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tempo Gasto (horas)
                        </label>
                        <input
                            type="number"
                            name="timeSpent"
                            value={formData.timeSpent}
                            onChange={handleChange}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        />
                    </div>

                    {/* Equipe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Equipe (separar por vírgula)
                        </label>
                        <input
                            type="text"
                            name="team"
                            value={formData.team.join(', ')}
                            onChange={(e) => {
                                const teamArray = e.target.value
                                    .split(',')
                                    .map(member => member.trim())
                                    .filter(member => member !== '');
                                setFormData(prev => ({ ...prev, team: teamArray }));
                            }}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="João Silva, Maria Santos"
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            {project ? 'Salvar Alterações' : 'Criar Projeto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;