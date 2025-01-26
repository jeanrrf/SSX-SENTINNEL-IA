import * as SQLite from 'sqlite3';

export async function openDatabase() {
    return new Promise<SQLite.Database>((resolve, reject) => {
        const db = new SQLite.Database(':memory:', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}
