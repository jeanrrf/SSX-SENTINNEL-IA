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
    /**
     * Metadata related to the task, which can include any additional information
     * that is not covered by the other properties.
     */
    metadata?: Record<string, unknown>;
    projects?: number[]; // IDs dos projetos associados ao cliente
    tasks?: number[]; // IDs das tarefas associadas ao cliente      
    tagHelper?: string[]; // Tags associadas ao cliente
    priority?: 'low' | 'medium' | 'high'; // Prioridade do cliente  
    timeSpent?: number; // Tempo total gasto no cliente
    totalProjects?: number; // Total de projetos associados ao cliente
    totalTasks?: number; // Total de tarefas associadas ao cliente
    totalInvoices?: number; // Total de faturas associadas ao cliente
    totalPayments?: number; // Total de pagamentos associados ao cliente
    totalOutstanding?: number; // Total de valor pendente associado ao cliente
    totalTimeSpent?: number; // Tempo total gasto no cliente
    totalTimeBilled?: number; // Tempo total faturado ao cliente
    totalTimeUnbilled?: number; // Tempo total não faturado ao cliente
    totalTimeEstimated?: number; // Tempo total estimado para o cliente
    totalTimeRemaining?: number; // Tempo total restante para o cliente
    totalTimeOverdue?: number; // Tempo total atrasado para o cliente
    totalTimeLogged?: number; // Tempo total registrado para o cliente
    totalTimeTracked?: number; // Tempo total rastreado para o cliente
    totalTimeApproved?: number; // Tempo total aprovado para o cliente
    totalTimeRejected?: number; // Tempo total rejeitado para o cliente
    totalTimeSubmitted?: number; // Tempo total enviado para o cliente
    totalTimePending?: number; // Tempo total pendente para o cliente
    totalTimeInvoiced?: number; // Tempo total faturado para o cliente
    totalTimePaid?: number; // Tempo total pago para o cliente
    totalTimeUnpaid?: number; // Tempo total não pago para o cliente
    totalTimeBudgeted?: number; // Tempo total orçado para o cliente
    totalTimeActual?: number; // Tempo total real para o cliente
    totalTimePlanned?: number; // Tempo total planejado para o cliente
    totalTimeScheduled?: number; // Tempo total agendado para o cliente
    totalTimeReserved?: number; // Tempo total reservado para o cliente
    totalTimeBlocked?: number; // Tempo total bloqueado para o cliente
    totalTimeAvailable?: number; // Tempo total disponível para o cliente
    totalTimeAllocated?: number; // Tempo total alocado para o cliente
    totalTimeCommitted?: number; // Tempo total comprometido para o cliente
    totalTimeConfirmed?: number; // Tempo total confirmado para o cliente
    totalTimeCancelled?: number; // Tempo total cancelado para o cliente
    totalTimePostponed?: number; // Tempo total adiado para o cliente
    totalTimeRescheduled?: number; // Tempo total reagendado para o cliente
    totalTimeRelocated?: number; // Tempo total relocado para o cliente
    totalTimeReassigned?: number; // Tempo total reatribuído para o cliente
    totalTimeDelegated?: number; // Tempo total delegado para o cliente
    totalTimeEscalated?: number; // Tempo total escalado para o cliente
    totalTimeDeviated?: number; // Tempo total desviado para o cliente
    totalTimeAdjusted?: number; // Tempo total ajustado para o cliente
    totalTimeRevised?: number; // Tempo total revisado para o cliente
    totalTimeAmended?: number; // Tempo total alterado para o cliente
    totalTimeUpdated?: number; // Tempo total atualizado para o cliente
    totalTimeModified?: number; // Tempo total modificado para o cliente
    totalTimeChanged?: number; // Tempo total alterado para o cliente

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
    // Tags associated with the task, e.g., ['urgent', 'backend', 'UI']
    tags?: string[];
    timeSpent: number;
    metadata?: Record<string, unknown>;
    priority?: 'low' | 'medium' | 'high';
}

// Tarefa
export interface Task extends BaseEntity {
    title: string;
    description: string;
    clientId: number;
    projectId: number;
    status: 'to_do' | 'in_progress' | 'completed' | 'review' | 'blocked';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    timeSpent: number;
    assignedTo?: string[];
    // IDs of tasks that this task depends on
    dependencies?: number[];
    metadata?: Record<string, unknown>;
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
    totalTimeSpent: number;
    activeTimers: number;
    projectsProgress: { [key: string]: number };
    tasksPriority: { [key: string]: number };
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
    userId: number;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        inApp: boolean;
    };
    preferences: {
        itemsPerPage: number;
        viewMode: 'list' | 'board' | 'calendar';
        showCompletedTasks: boolean;
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
    metadata?: Record<string, unknown>;
}

// Relatório
export interface Report extends BaseEntity {
    type: 'project' | 'client' | 'task' | 'time';
    name: string;
    parameters: { [key: string]: unknown };
    generatedBy: string;
    format: 'pdf' | 'excel' | 'csv';
    url?: string;
    metadata?: Record<string, unknown>;
}

// Auditoria
export interface AuditLog extends BaseEntity {
    action: string;
    entityType: 'client' | 'project' | 'task' | 'timer';
    entityId: number;
    userId: string;
    changes?: { [key: string]: unknown };
    metadata?: { [key: string]: unknown };
}

type SomeType = {
  someProperty: string;
  property1: string | number; // Replace 'any' with specific types
  property2: Record<string, unknown>; // Replace 'any' with specific types
  property3: Array<{ key: string; value: unknown }>; // Replace 'any' with specific types
  property4: { [key: string]: unknown }; // Replace 'any' with specific types
};

type AnotherType = {
  anotherProperty: number;
};

type ExampleType = {
  exampleProperty: SomeType | AnotherType;
};

type MyType = {
  myProperty: ExampleType;
};

export type {
  SomeType,
  AnotherType,
  ExampleType,
  MyType,
};

declare global {
  interface Window {
    /**
     * The dataLayer is an array used by Google Tag Manager to store and manage data.
     * It allows you to send information to Google Tag Manager, which can then be used
     * to trigger tags and pass data to other services.
     */
    dataLayer: unknown[];

    /**
     * The gtag function is used to send data to Google Analytics.
     * It allows you to track events, page views, and other interactions on your website.
     * @param args - The arguments passed to the gtag function.
     */
    gtag: (...args: unknown[]) => void;
  }
}
