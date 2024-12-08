export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface Task extends BaseEntity {
    title: string;
    description: string;
    status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
    priority: 'low' | 'medium' | 'high';
    projectId: number;
    clientId: number;
    dueDate?: string;
    timeSpent?: number;
}

export interface Project extends BaseEntity {
    name: string;
    clientId: number;
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
    startDate: string;
    endDate: string;
    progress: number;
    team: string[];
}

export interface Client extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'active' | 'inactive';
}

export interface DashboardStats {
    totalClients: number;
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalTimeSpent: string;
}

export interface TimerEntry extends BaseEntity {
    taskId: number;
    startTime: string;
    endTime?: string;
}

export interface User extends BaseEntity {
    username: string;
    password: string;
    isAdmin: boolean;
    lastLogin?: string;
    failedLoginAttempts?: number;
    lockedUntil?: string;
}
