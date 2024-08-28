import { Database } from './dbsqlite.js';

const createUsersTableSql = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('A', 'U', 'V')) DEFAULT 'U',
    FOREIGN KEY (id) REFERENCES login (id)
)
`;

const dbUsers = new Database('users');

export async function openUsersDatabase() {
    await dbUsers.open();
}

export async function createUsersTable() {
    await dbUsers.createTable(createUsersTableSql);
}

export function getDbUsers() {
    return dbUsers.getDbInstance();
}
