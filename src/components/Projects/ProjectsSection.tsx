import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { projectStorage } from '../../services/projectStorage';
import { clientStorage } from '../../services/clientStorage';
import ProjectModal from './ProjectModal';
import { Project, Client } from '../../types';


export const ProjectsSection: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Carregar projetos e clientes
    useEffect(() => {
        loadData();
    }, []);

    // Função para carregar dados
    const loadData = () => {
        const loadedProjects = projectStorage.getAll();
        const loadedClients = clientStorage.getAll();
        setProjects(loadedProjects);
        setClients(loadedClients);
    };

    // Filtrar projetos
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clients.find(c => c.id === project.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obter nome do cliente
    const getClientName = (clientId: number) => {
        return clients.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
    };

    // Status em português
    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'not_started': 'Não iniciado',
            'in_progress': 'Em andamento',
            'completed': 'Concluído',
            'on_hold': 'Em espera'
        };
        return statusMap[status] || status;
    };

    // Cor do status
    const getStatusColor = (status: string) => {
        const colorMap: { [key: string]: string } = {
            'not_started': 'bg-gray-500',
            'in_progress': 'bg-blue-500',
            'completed': 'bg-green-500',
            'on_hold': 'bg-yellow-500'
        };
        return colorMap[status] || 'bg-gray-500';
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Projetos</h2>
                    <p className="text-gray-400">Gerencie seus projetos e acompanhe o progresso</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedProject(null);
                        loadData(); // Recarregar dados antes de abrir o modal
                        setShowModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <FaPlus />
                    Novo Projeto
                </button>
            </div>

            {/* Barra de pesquisa */}
            <div className="glass-card mb-6 p-4 flex items-center gap-3">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-white flex-1 placeholder-gray-400"
                />
            </div>

            {/* Lista de Projetos */}
            <div className="space-y-4">
                {filteredProjects.map(project => (
                    <div key={project.id} className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                                <p className="text-gray-400">{project.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedProject(project);
                                        loadData(); // Recarregar dados antes de abrir o modal
                                        setShowModal(true);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <FaEdit className="text-blue-400" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
                                            projectStorage.delete(project.id);
                                            setProjects(projectStorage.getAll());
                                        }
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <FaTrash className="text-red-400" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Cliente</p>
                                <p className="text-white">{getClientName(project.clientId)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Status</p>
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)} text-white`}>
                                    {getStatusText(project.status)}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Data Início</p>
                                <p className="text-white">{new Date(project.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Data Fim</p>
                                <p className="text-white">{new Date(project.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Barra de Progresso */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Progresso</span>
                                <span className="text-white">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <ProjectModal
                    project={selectedProject || undefined}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedProject(null);
                    }}
                    onSave={(projectData) => {
                        if (selectedProject) {
                            // Editar projeto existente
                            projectStorage.update({
                                ...projectData,
                                id: selectedProject.id,
                                createdAt: selectedProject.createdAt,
                                updatedAt: new Date().toISOString()
                            });
                        } else {
                            // Criar novo projeto
                            const now = new Date().toISOString();
                            projectStorage.save({
                                ...projectData,
                                id: Date.now(), // Gerar um ID único
                                createdAt: now,
                                updatedAt: now
                            } as Project);
                        }
                        loadData();
                        setShowModal(false);
                        setSelectedProject(null);
                    }}
                />
            )}
        </div>
    );
};

export default ProjectsSection;
