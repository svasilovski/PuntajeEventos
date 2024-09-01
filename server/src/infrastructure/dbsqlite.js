import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { paths } from "./config.js";

export class Database {
  constructor(dbName) {
    this.dbName = dbName;
    this.dbInstance = null;
  }

  async open() {
    this.dbInstance = await open({
      filename: paths[this.dbName],
      driver: sqlite3.Database,
    });
  }

  async createTable(createTableSql) {
    if (!this.dbInstance) {
      throw new Error("Database not opened. Call open() first.");
    }
    await this.dbInstance.exec(createTableSql);
  }

  getDbInstance() {
    if (!this.dbInstance) {
      throw new Error("Database not opened. Call open() first.");
    }
    return this.dbInstance;
  }
}
