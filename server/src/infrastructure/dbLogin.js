import { Database } from './dbsqlite.js';

const createLoginTableSql = `
CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
`;

const dbLogin = new Database('login');

export async function openLoginDatabase() {
    await dbLogin.open();
}

export async function createLoginTable() {
    await dbLogin.createTable(createLoginTableSql);
}

export function getDbLogin() {
    return dbLogin.getDbInstance();
}
