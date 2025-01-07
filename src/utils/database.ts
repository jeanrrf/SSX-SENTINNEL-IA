import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function openDatabase() {
  if (!db) {
    const SQL = await initSqlJs({
      locateFile: file => `path/to/${file}` // Ensure this path is correct
    });
    db = new SQL.Database();
  }
  return db;
}
