import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Database {
    constructor(dbName) {
        this.dbName = dbName;
        this.dbInstance = null;
    }

    async open() {
        this.dbInstance = await open({
            filename: path.resolve(__dirname, `../models/${this.dbName}.sqlite`),
                                     driver: sqlite3.Database
        });
    }

    async createTable(createTableSql) {
        if (!this.dbInstance) {
            throw new Error('Database not opened. Call open() first.');
        }
        await this.dbInstance.exec(createTableSql);
    }

    getDbInstance() {
        if (!this.dbInstance) {
            throw new Error('Database not opened. Call open() first.');
        }
        return this.dbInstance;
    }
}
