import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbLogin;
let dbUsers;

async function openDatabases() {
    dbLogin = await open({
        filename: path.resolve(__dirname, '../models/login.sqlite'),
        driver: sqlite3.Database
    });

    dbUsers = await open({
        filename: path.resolve(__dirname, '../models/users.sqlite'),
        driver: sqlite3.Database
    });
}

async function createLoginTable() {
    await dbLogin.exec(`
    CREATE TABLE IF NOT EXISTS login (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    `);
}

async function createUsersTable() {
    await dbUsers.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT CHECK(role IN ('A', 'U', 'V')) DEFAULT 'U',
        FOREIGN KEY (id) REFERENCES login (id)
    )
    `);
}

export async function init() {
    await openDatabases();
    await createLoginTable();
    await createUsersTable();
}

export function getDbLogin() {
    return dbLogin;
}

export function getDbUsers() {
    return dbUsers;
}
