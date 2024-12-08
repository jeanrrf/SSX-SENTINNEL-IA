import { BaseStorage } from './baseStorage';

interface User {
    id: number;
    username: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    role: 'admin' | 'tester';
    prefix: string;
}

class AuthStorage extends BaseStorage<User> {
    private static readonly MAX_LOGIN_ATTEMPTS = 3;
    private loginAttempts: number = 0;
    private lockoutTime: number | null = null;

    constructor() {
        super('auth');
        this.initializeUsers();
    }

    private initializeUsers() {
        const users = this.getAll();
        if (users.length === 0) {
            // Adicionar usuário admin
            this.save({
                username: 'jean',
                password: '31676685',
                role: 'admin',
                prefix: 'jean'
            } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);

            // Adicionar usuários convidados
            this.save({
                username: 'paulo',
                password: 'convidado@auth1',
                role: 'tester',
                prefix: 'paulo'
            } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);

            this.save({
                username: 'dercilei',
                password: 'convidado@auth2',
                role: 'tester',
                prefix: 'dercilei'
            } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
        }
    }

    login(username: string, password: string): { success: boolean; message: string; user?: User } {
        try {
            // Verificar bloqueio
            if (this.isLocked()) {
                const remainingTime = Math.ceil((this.lockoutTime! - Date.now()) / 1000);
                return {
                    success: false,
                    message: `Conta bloqueada. Tente novamente em ${remainingTime} segundos.`
                };
            }

            const users = this.getAll();
            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

            if (!user || user.password !== password) {
                this.loginAttempts++;
                
                if (this.loginAttempts >= AuthStorage.MAX_LOGIN_ATTEMPTS) {
                    this.lockAccount();
                    return {
                        success: false,
                        message: 'Conta bloqueada por 5 minutos devido a múltiplas tentativas.'
                    };
                }

                return {
                    success: false,
                    message: `Credenciais inválidas. Tentativas restantes: ${AuthStorage.MAX_LOGIN_ATTEMPTS - this.loginAttempts}`
                };
            }

            // Login bem sucedido
            this.loginAttempts = 0;
            this.lockoutTime = null;
            localStorage.setItem('currentUser', JSON.stringify(user));

            return {
                success: true,
                message: 'Login realizado com sucesso!',
                user
            };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return {
                success: false,
                message: 'Erro ao processar login. Tente novamente.'
            };
        }
    }

    getCurrentUser(): User | null {
        try {
            const userStr = localStorage.getItem('currentUser');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    }

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }

    logout(): void {
        localStorage.removeItem('currentUser');
    }

    private isLocked(): boolean {
        if (!this.lockoutTime) return false;
        if (Date.now() > this.lockoutTime) {
            this.loginAttempts = 0;
            this.lockoutTime = null;
            return false;
        }
        return true;
    }

    private lockAccount(): void {
        this.lockoutTime = Date.now() + (5 * 60 * 1000); // 5 minutos
    }
}

export const authStorage = new AuthStorage();
