import { clientStorage } from './clientStorage';
import { Client } from '../types';

export const backupService = {
    backup(): void {
        const data = {
            clients: clientStorage.getAll(),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('backup', JSON.stringify(data));
    },

    restore(): void {
        const backup = localStorage.getItem('backup');
        if (backup) {
            const data = JSON.parse(backup);
            if (data.clients) {
                data.clients.forEach((client: Client) => {
                    clientStorage.save(client);
                });
            }
        }
    },

    exportToFile(): void {
        const data = {
            clients: clientStorage.getAll(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentinnell-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
