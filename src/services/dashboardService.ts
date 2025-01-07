import { clientStorage } from './clientStorage';

// Tipos de dados
interface Project {
  id: number;
  name: string;
  clientId: number;
  status: 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado';
  startDate: string;
  endDate: string;
  budget: number;
  hoursLogged: number;
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  status: 'pendente' | 'em_progresso' | 'concluida';
  priority: 'baixa' | 'media' | 'alta';
  dueDate: string;
  assignedTo: string;
}

// Funções auxiliares
const calculateProjectMetrics = (projects: Project[]) => {
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalHours = projects.reduce((sum, project) => sum + project.hoursLogged, 0);
  const statusCount = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { totalBudget, totalHours, statusCount };
};

const calculateTaskMetrics = (tasks: Task[]) => {
  const statusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCount = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { statusCount, priorityCount };
};

// Serviço principal
export const dashboardService = {
  getProjectData: () => {
    // Em um ambiente real, isso viria do backend
    return [];
  },

  getTaskData: () => {
    // Em um ambiente real, isso viria do backend
    return [];
  },

  getDashboardMetrics: () => {
    const clients = clientStorage.getAll();
    const projects: Project[] = dashboardService.getProjectData();
    const tasks: Task[] = dashboardService.getTaskData();

    const projectMetrics = calculateProjectMetrics(projects);
    const taskMetrics = calculateTaskMetrics(tasks);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      clients: {
        total: clients.length,
        active: clients.filter(client => client.status === 'active').length,
        inactive: clients.filter(client => client.status === 'inactive').length,
        newThisMonth: clients.filter(client => {
          const clientDate = new Date(client.id);
          return clientDate >= firstDayOfMonth;
        }).length,
        topCompanies: Object.entries(
          clients.reduce((acc, client) => {
            acc[client.company] = (acc[client.company] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
          .map(([company, count]) => ({ company, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
      },
      projects: {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'em_andamento').length,
        completed: projects.filter(p => p.status === 'concluido').length,
        delayed: projects.filter(p => p.status === 'atrasado').length,
        totalBudget: projectMetrics.totalBudget,
        totalHours: projectMetrics.totalHours,
        averageProjectValue: projectMetrics.totalBudget / projects.length
      },
      tasks: {
        total: tasks.length,
        pending: taskMetrics.statusCount.pendente || 0,
        inProgress: taskMetrics.statusCount.em_progresso || 0,
        completed: taskMetrics.statusCount.concluida || 0,
        highPriority: taskMetrics.priorityCount.alta || 0,
        dueSoon: tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && task.status !== 'concluida';
        }).length
      }
    };
  }
};
