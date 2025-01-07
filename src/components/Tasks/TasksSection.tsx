import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaClock } from 'react-icons/fa';
import { taskStorage } from '../../services/taskStorage';
import { projectStorage } from '../../services/projectStorage';
import { clientStorage } from '../../services/clientStorage';
import { timerStorage } from '../../services/timerStorage';
import { formatDuration } from '../../utils/timeUtils';
import TaskModal from './TaskModal';
import TimeAdjustModal from './TimeAdjustModal';
import { Task, Project, Client } from '../../types';

interface KanbanColumn {
    title: string;
    status: Task['status'];
}

const KANBAN_COLUMNS: KanbanColumn[] = [
    { title: 'A Fazer', status: 'to_do' },
    { title: 'Em Progresso', status: 'in_progress' },
    { title: 'Concluído', status: 'completed' }
];

const TasksSection: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
    const [filterProject, setFilterProject] = useState<Project['id'] | ''>('');
    const [filterClient, setFilterClient] = useState<Client['id'] | ''>('');
    const [filterPriority, setFilterPriority] = useState<Task['priority'] | ''>('');
    const [currentTimer, setCurrentTimer] = useState<number | null>(null);
    const [timeAdjustTask, setTimeAdjustTask] = useState<Task | null>(null);

    // Carregar tarefas
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const loadedTasks = taskStorage.getAll();
        setTasks(loadedTasks);
    };

    // Atualizar timer atual
    useEffect(() => {
        const timer = timerStorage.getCurrentTimer();
        if (timer) {
            setCurrentTimer(timer.taskId);
        } else {
            setCurrentTimer(null);
        }
    }, []);

    // Filtrar tarefas
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProject = !filterProject || task.projectId === filterProject;
        const project = projectStorage.getById(task.projectId);
        const matchesClient = !filterClient || project?.clientId === filterClient;
        const matchesPriority = !filterPriority || task.priority === filterPriority;
        return matchesSearch && matchesProject && matchesClient && matchesPriority;
    });

    // Agrupar tarefas por status

    // Obter nome do projeto

    // Obter nome do cliente
    const getClientName = (projectId: Project['id']): string => {
        const project = projectStorage.getById(projectId);
        if (!project) return 'Projeto não encontrado';
        
        const client = clientStorage.getById(project.clientId);
        return client?.name || 'Cliente não encontrado';
    };

    // Cor da prioridade
    const getPriorityColor = (priority: Task['priority']) => {
        const colors = {
            low: 'border-l-4 border-l-blue-500',
            medium: 'border-l-4 border-l-yellow-500',
            high: 'border-l-4 border-l-red-500'
        };
        return colors[priority];
    };

    // Obter tempo total gasto

    // Cor da coluna
    const getColumnColor = (status: Task['status']): string => {
        const colors: Record<Task['status'], string> = {
            'to_do': 'bg-blue-500',
            'in_progress': 'bg-yellow-500',
            'completed': 'bg-green-500',
            'review': 'bg-purple-500',
            'blocked': 'bg-red-500'
        };
        return colors[status];
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
        e.dataTransfer.setData('taskId', task.id.toString());
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: Task['status']) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            const updatedTask = { ...task, status: newStatus };
            await taskStorage.update(updatedTask);
            loadData();
        }
    };

    // Controle do timer
    const toggleTimer = (taskId: number) => {
        if (currentTimer === taskId) {
            timerStorage.stopCurrentTimer();
            setCurrentTimer(null);
        } else {
            timerStorage.startTimer(taskId);
            setCurrentTimer(taskId);
        }
        // Atualizar lista de tarefas para refletir novo tempo
        setTasks(taskStorage.getAll());
    };

    const handleTimeAdjust = (task: Task) => {
        setTimeAdjustTask(task);
    };

    return (
        <div className="p-4 lg:p-8 h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Tarefas</h2>
                    <p className="text-gray-400">Gerencie suas tarefas com visualização Kanban</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedTask(undefined);
                        setShowModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 
                        flex items-center gap-2 transition-colors duration-300"
                >
                    <FaPlus />
                    Nova Tarefa
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar tarefas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-900 text-gray-100 rounded-lg
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        />
                    </div>
                </div>

                <select
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value ? Number(e.target.value) : '')}
                    className="bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                        border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                        hover:border-gray-600 transition-colors duration-300"
                >
                    <option value="" className="bg-gray-900">Todos os Clientes</option>
                    {clientStorage.getAll().map(client => (
                        <option key={client.id} value={client.id} className="bg-gray-900">
                            {client.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value ? Number(e.target.value) : '')}
                    className="bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                        border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                        hover:border-gray-600 transition-colors duration-300"
                >
                    <option value="" className="bg-gray-900">Todos os Projetos</option>
                    {projectStorage.getAll()
                        .filter(project => !filterClient || project.clientId === filterClient)
                        .map(project => (
                            <option key={project.id} value={project.id} className="bg-gray-900">
                                {project.name}
                            </option>
                        ))}
                </select>

                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | '')}
                    className="bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                        border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                        hover:border-gray-600 transition-colors duration-300"
                >
                    <option value="" className="bg-gray-900">Todas as Prioridades</option>
                    <option value="low" className="bg-gray-900">Baixa</option>
                    <option value="medium" className="bg-gray-900">Média</option>
                    <option value="high" className="bg-gray-900">Alta</option>
                </select>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[calc(100vh-20rem)]">
                {KANBAN_COLUMNS.map(column => (
                    <div
                        key={column.status} 
                        className="w-full glass-card rounded-xl p-4 flex flex-col"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.status)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-3 h-3 rounded-full ${getColumnColor(column.status)}`}></div>
                            <h3 className="font-semibold text-white">{column.title}</h3>
                            <span className="ml-auto text-sm text-gray-400">
                                {filteredTasks.filter(task => task.status === column.status).length}
                            </span>
                        </div>

                        {/* Tasks Container */}
                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {filteredTasks
                                .filter(task => task.status === column.status)
                                .map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setShowModal(true);
                                        }}
                                        className={`
                                            p-4 rounded-lg cursor-pointer
                                            transform transition-all duration-200
                                            hover:scale-[1.02] hover:shadow-lg
                                            glass-card
                                            ${getPriorityColor(task.priority)}
                                        `}
                                        style={{
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    >
                                        {/* Task Title */}
                                        <h4 className="font-medium text-white mb-2">{task.title}</h4>
                                        
                                        {/* Task Description */}
                                        {task.description && (
                                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Task Metadata */}
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {/* Client Tag */}
                                            {task.projectId && (
                                                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                                    {getClientName(task.projectId)}
                                                </span>
                                            )}
                                            
                                            {/* Project Tag */}
                                            {task.projectId && (
                                                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                                    {projectStorage.getById(task.projectId)?.name}
                                                </span>
                                            )}
                                            
                                            {/* Due Date */}
                                            {task.dueDate && (
                                                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 flex items-center gap-1">
                                                    <FaClock size={12} className="shrink-0" />
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}

                                            {/* Time Spent */}
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                              <FaClock />
                                              <span>{formatDuration(task.timeSpent || 0)}</span>
                                            </div>

                                            {/* Timer Button */}
                                            <button
                                                onClick={() => toggleTimer(task.id)}
                                                className={`p-1.5 rounded ${currentTimer === task.id ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                            >
                                                <FaClock className="text-white" />
                                            </button>

                                            {/* Time Adjust Button */}
                                            <button
                                                onClick={() => handleTimeAdjust(task)}
                                                className="p-1.5 rounded bg-orange-500 hover:bg-orange-600"
                                            >
                                                <FaClock className="text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedTask(undefined);
                    }}
                    onSave={(taskData) => {
                        if (selectedTask) {
                            taskStorage.update({
                                ...taskData,
                                id: selectedTask.id,
                                createdAt: selectedTask.createdAt,
                                updatedAt: new Date().toISOString(),
                                timeSpent: selectedTask.timeSpent
                            });
                        } else {
                            taskStorage.save({
                                ...taskData,
                                id: Date.now(),
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                timeSpent: 0
                            } as Task);
                        }
                        loadData();
                        setShowModal(false);
                        setSelectedTask(undefined);
                    }}
                />
            )}

            {timeAdjustTask && (
                <TimeAdjustModal
                    task={timeAdjustTask}
                    isOpen={true}
                    onClose={() => setTimeAdjustTask(null)}
                    onTimeAdjusted={loadData}
                />
            )}
        </div>
    );
};

export default TasksSection;
