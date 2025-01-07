import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaProjectDiagram, FaTasks, FaCheckCircle, FaClock } from 'react-icons/fa';
import { clientStorage } from '../../services/clientStorage';
import { projectStorage } from '../../services/projectStorage';
import { taskStorage } from '../../services/taskStorage';
import { Task, Project, Client, DashboardStats } from '../../types';
import { formatDuration } from '../../utils/timeUtils';

const DashboardSection: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalClients: 0,
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        totalTimeSpent: 0,
        activeTimers: 0,
        projectsProgress: {},
        tasksPriority: {}
    });
    
    const [recentTasks, setRecentTasks] = useState<Task[]>([]);
    const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
    const [clientsMap, setClientsMap] = useState<Record<number, Client>>({});
    const [projectsMap, setProjectsMap] = useState<Record<number, Project>>({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = () => {
            try {
                // Carregar clientes
                const clientsList = clientStorage.getAll();
                const clientsMap = clientsList.reduce((acc, client) => {
                    acc[client.id] = client;
                    return acc;
                }, {} as Record<number, Client>);
                setClientsMap(clientsMap);

                // Carregar projetos
                const projectsList = projectStorage.getAll();
                const projectsMap = projectsList.reduce((acc, project) => {
                    acc[project.id] = project;
                    return acc;
                }, {} as Record<number, Project>);
                setProjectsMap(projectsMap);

                // Carregar tarefas
                // Carregar tarefas
                const tasks = taskStorage.getAll();
                const completedTasks = tasks.filter(task => task.status === 'completed').length;
                // Calcular tempo total
                const totalSeconds = tasks.reduce((total, task) => {
                    return total + (task.timeSpent || 0);
                }, 0);

                // Pegar tarefas recentes (últimas 5)
                const recentTasks = [...tasks]
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5);

                // Pegar tarefas próximas (próximas 5)
                const upcomingTasks = tasks
                    .filter(task => {
                        if (!task.dueDate || task.status === 'completed') return false;
                        const dueDate = new Date(task.dueDate);
                        return dueDate > new Date();
                    })
                    .sort((a, b) => {
                        const dateA = new Date(a.dueDate!);
                        const dateB = new Date(b.dueDate!);
                        return dateA.getTime() - dateB.getTime();
                    })
                    .slice(0, 5);

                // Atualizar estado
                setStats({
                    totalClients: clientsList.length,
                    totalProjects: projectsList.length,
                    totalTasks: tasks.length,
                    completedTasks,
                    totalTimeSpent: totalSeconds,
                    activeTimers: 0,
                    projectsProgress: {},
                    tasksPriority: {}
                });

                setRecentTasks(recentTasks);
                setUpcomingTasks(upcomingTasks);
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
            }
        };

        loadData();
        const interval = setInterval(loadData, 30000); // Atualizar a cada 30 segundos

        return () => clearInterval(interval);
    }, []);

    const getClientName = (clientId: number) => {
        return clientsMap[clientId]?.name || 'Cliente não encontrado';
    };

    const getProjectName = (projectId: number) => {
        return projectsMap[projectId]?.name || 'Projeto não encontrado';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sem data';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Dashboard</h1>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div
                    onClick={() => navigate('/clients')}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4 shadow-lg 
                        hover:bg-gray-800/70 hover:scale-105 hover:shadow-xl 
                        active:scale-95 active:bg-gray-800/90 
                        cursor-pointer transform transition-all duration-300 ease-in-out"
                >
                    <div className="p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20">
                        <FaUsers className="text-3xl text-blue-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total de Clientes</p>
                        <p className="text-2xl font-bold text-gray-100">{stats.totalClients}</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/projects')}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4 shadow-lg 
                        hover:bg-gray-800/70 hover:scale-105 hover:shadow-xl 
                        active:scale-95 active:bg-gray-800/90 
                        cursor-pointer transform transition-all duration-300 ease-in-out"
                >
                    <div className="p-3 rounded-full bg-green-500/10 group-hover:bg-green-500/20">
                        <FaProjectDiagram className="text-3xl text-green-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total de Projetos</p>
                        <p className="text-2xl font-bold text-gray-100">{stats.totalProjects}</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/tasks')}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4 shadow-lg 
                        hover:bg-gray-800/70 hover:scale-105 hover:shadow-xl 
                        active:scale-95 active:bg-gray-800/90 
                        cursor-pointer transform transition-all duration-300 ease-in-out"
                >
                    <div className="p-3 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20">
                        <FaTasks className="text-3xl text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total de Tarefas</p>
                        <p className="text-2xl font-bold text-gray-100">{stats.totalTasks}</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/tasks?status=done')}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4 shadow-lg 
                        hover:bg-gray-800/70 hover:scale-105 hover:shadow-xl 
                        active:scale-95 active:bg-gray-800/90 
                        cursor-pointer transform transition-all duration-300 ease-in-out"
                >
                    <div className="p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20">
                        <FaCheckCircle className="text-3xl text-purple-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Tarefas Concluídas</p>
                        <p className="text-2xl font-bold text-gray-100">{stats.completedTasks}</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/tasks')}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4 shadow-lg 
                        hover:bg-gray-800/70 hover:scale-105 hover:shadow-xl 
                        active:scale-95 active:bg-gray-800/90 
                        cursor-pointer transform transition-all duration-300 ease-in-out"
                >
                    <div className="p-3 rounded-full bg-red-500/10 group-hover:bg-red-500/20">
                        <FaClock className="text-3xl text-red-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Tempo Total</p>
                        <p className="text-2xl font-bold text-gray-100">{formatDuration(stats.totalTimeSpent)}</p>
                    </div>
                </div>
            </div>

            {/* Seção de tarefas recentes e próximas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tarefas Recentes */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-100 mb-4">Tarefas Recentes</h2>
                    <div className="space-y-4">
                        {recentTasks.map(task => (
                            <div key={task.id} 
                                className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 
                                hover:bg-gray-700/70 hover:scale-[1.02] hover:shadow-lg 
                                active:scale-[0.98] active:bg-gray-700/90
                                cursor-pointer transform transition-all duration-300 ease-in-out"
                                onClick={() => navigate(`/tasks/${task.id}`)}
                            >
                                <h3 className="text-gray-100 font-semibold">{task.title}</h3>
                                <div className="mt-2 text-sm text-gray-400 space-y-1">
                                    <p className="flex items-center gap-2">
                                        <FaUsers className="text-blue-400" />
                                        {getClientName(task.clientId)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaProjectDiagram className="text-green-400" />
                                        {getProjectName(task.projectId)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaTasks className="text-yellow-400" />
                                        Status: {task.status}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-purple-400" />
                                        Prioridade: {task.priority}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentTasks.length === 0 && (
                            <p className="text-gray-400 text-center py-4">Nenhuma tarefa recente</p>
                        )}
                    </div>
                </div>

                {/* Próximas Tarefas */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-100 mb-4">Próximas Tarefas</h2>
                    <div className="space-y-4">
                        {upcomingTasks.map(task => (
                            <div key={task.id} 
                                className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 
                                hover:bg-gray-700/70 hover:scale-[1.02] hover:shadow-lg 
                                active:scale-[0.98] active:bg-gray-700/90
                                cursor-pointer transform transition-all duration-300 ease-in-out"
                                onClick={() => navigate(`/tasks/${task.id}`)}
                            >
                                <h3 className="text-gray-100 font-semibold">{task.title}</h3>
                                <div className="mt-2 text-sm text-gray-400 space-y-1">
                                    <p className="flex items-center gap-2">
                                        <FaUsers className="text-blue-400" />
                                        {getClientName(task.clientId)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaProjectDiagram className="text-green-400" />
                                        {getProjectName(task.projectId)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaClock className="text-red-400" />
                                        Entrega: {formatDate(task.dueDate)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-purple-400" />
                                        Prioridade: {task.priority}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {upcomingTasks.length === 0 && (
                            <p className="text-gray-400 text-center py-4">Nenhuma tarefa próxima</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSection;
