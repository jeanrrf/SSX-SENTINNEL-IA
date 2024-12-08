// Tipos base com campos comuns
interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}

// Cliente
export interface Client extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    status: 'active' | 'inactive';
    notes: string;
    metadata?: Record<string, any>;
}

// Projeto
export interface Project extends BaseEntity {
    name: string;
    description: string;
    clientId: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    startDate: string;
    endDate: string;
    progress: number;
    team: string[];
    timeSpent: number;
    metadata?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
}

// Tarefa
export interface Task extends BaseEntity {
    title: string;
    description: string;
    clientId: number;
    projectId: number;
    status: 'todo' | 'doing' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    timeSpent: number;
    assignedTo?: string[];
    dependencies?: number[];
    metadata?: Record<string, any>;
    tags?: string[];
}

// Timer
export interface TimerEntry extends BaseEntity {
    taskId: number;
    startTime: string;
    endTime?: string;
    duration?: number;
    userId: string;
    notes?: string;
}

// Timer Task (versão simplificada da Task para o Timer)
export interface TimerTask {
    id: number;
    title: string;
    timeSpent: number;
}

// Dashboard Stats
export interface DashboardStats {
    totalClients: number;
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalTimeSpent: string;
    activeTimers: number;
    projectsProgress: Record<string, number>;
    tasksPriority: Record<string, number>;
}

// Projeto Form Data
export interface ProjectFormData {
  name: string;
  description: string;
  clientId: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  startDate: string;
  endDate: string;
  progress: number;
  timeSpent: number;
  team: string[];
}

// Configurações do Usuário
export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        desktop: boolean;
        taskReminders: boolean;
        projectUpdates: boolean;
    };
    display: {
        tasksPerPage: number;
        defaultView: 'list' | 'board' | 'calendar';
        compactMode: boolean;
    };
}

// Notificação
export interface Notification extends BaseEntity {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    read: boolean;
    userId: string;
    link?: string;
    metadata?: Record<string, any>;
}

// Relatório
export interface Report extends BaseEntity {
    type: 'project' | 'client' | 'task' | 'time';
    name: string;
    parameters: Record<string, any>;
    generatedBy: string;
    format: 'pdf' | 'excel' | 'csv';
    url?: string;
    metadata?: Record<string, any>;
}

// Auditoria
export interface AuditLog extends BaseEntity {
    action: string;
    entityType: 'client' | 'project' | 'task' | 'timer';
    entityId: number;
    userId: string;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
