import { z } from 'zod';
import { AppError } from './errorHandling';

// Schemas de validação
export const clientSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    company: z.string().min(2, 'Empresa deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^\+?[\d\s-()]{8,}$/, 'Telefone inválido'),
    address: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    notes: z.string().optional()
});

export const projectSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    clientId: z.number().positive(),
    status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    progress: z.number().min(0).max(100),
    team: z.array(z.string()),
    timeSpent: z.number().min(0)
});

export const taskSchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
    description: z.string(),
    clientId: z.number().positive(),
    projectId: z.number().positive(),
    status: z.enum(['todo', 'doing', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    timeSpent: z.number().min(0)
});

// Função genérica de validação
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(
                'Erro de validação',
                'VALIDATION_ERROR',
                'medium',
                {
                    validationErrors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                }
            );
        }
        throw error;
    }
}

// Validadores específicos
export const validateClient = (data: unknown) => validate(clientSchema, data);
export const validateProject = (data: unknown) => validate(projectSchema, data);
export const validateTask = (data: unknown) => validate(taskSchema, data);

// Validações customizadas
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};
