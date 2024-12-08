import { BaseStorage } from './baseStorage';
import type { User } from '../types/index';
import { performanceMonitor } from '../utils/performance';

class AuthStorage extends BaseStorage<User> {
    private static readonly STORAGE_KEY = 'sentinel_users';
    private initialized = false;
    private currentUser: User | null = null;
    private readonly MAX_LOGIN_ATTEMPTS = 3;
    private loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};
    private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

    constructor() {
        super(AuthStorage.STORAGE_KEY);
        this.initializeData();
        this.checkLoggedUser();
    }

    login(username: string, password: string): boolean {
        const startTime = performanceMonitor.startOperation();
        
        try {
            // Verificar tentativas de login
            if (this.isLockedOut(username)) {
                throw new Error('Conta temporariamente bloqueada. Tente novamente mais tarde.');
            }

            const users = this.getAll();
            const user = users.find(u => u.username === username);

            if (!user) {
                this.recordLoginAttempt(username);
                throw new Error('Usuário ou senha inválidos');
            }

            // Em produção, isso deve usar uma função de hash segura
            if (user.password !== password) {
                this.recordLoginAttempt(username);
                throw new Error('Usuário ou senha inválidos');
            }

            // Login bem-sucedido
            this.currentUser = user;
            localStorage.setItem('user_id', String(user.id));
            this.resetLoginAttempts(username);
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        } finally {
            performanceMonitor.endOperation('login', startTime);
        }
    }

    private isLockedOut(username: string): boolean {
        const attempts = this.loginAttempts[username];
        if (!attempts) return false;

        const now = Date.now();
        if (attempts.count >= this.MAX_LOGIN_ATTEMPTS &&
            now - attempts.lastAttempt < this.LOCKOUT_DURATION) {
            return true;
        }

        // Resetar se o tempo de bloqueio passou
        if (now - attempts.lastAttempt >= this.LOCKOUT_DURATION) {
            this.resetLoginAttempts(username);
        }

        return false;
    }

    private recordLoginAttempt(username: string): void {
        const attempts = this.loginAttempts[username] || { count: 0, lastAttempt: 0 };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        this.loginAttempts[username] = attempts;
    }

    private resetLoginAttempts(username: string): void {
        delete this.loginAttempts[username];
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('user_id');
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }

    private checkLoggedUser(): void {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            const user = this.getById(Number(userId));
            if (user) {
                this.currentUser = user;
            } else {
                this.logout();
            }
        }
    }

    private initializeData(): void {
        if (this.initialized) return;

        try {
            const existingData = this.getAll();
            if (existingData.length === 0) {
                // Criar usuário padrão
                const defaultAdmin: User = {
                    id: 1,
                    username: import.meta.env.VITE_DEFAULT_USERNAME || 'Jean',
                    password: import.meta.env.VITE_DEFAULT_PASSWORD || '31676685',
                    isAdmin: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    failedLoginAttempts: 0
                };
                this.saveItems([defaultAdmin]);
                console.log('AuthStorage: Usuário padrão criado');
            }
            
            this.initialized = true;
        } catch (error) {
            console.error('AuthStorage: Erro ao inicializar dados:', error);
            this.clear();
            this.initialized = true;
        }
    }

    save(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
        const items = this.getAll();
        const newUser: User = {
            ...user,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            failedLoginAttempts: 0
        };
        items.push(newUser);
        this.saveItems(items);
        return newUser;
    }
}

export const authStorage = new AuthStorage();
