import { Database } from "../dbsqlite.js";

const dbName = "categorias";
const createTable = `
  CREATE TABLE IF NOT EXISTS Categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
  )`;

const dbInstance = new Database(dbName);

export async function openCategoriasDatabase() {
  await dbInstance.open();
}

export async function createCategoriasTable() {
  await dbInstance.createTable(createTable);
}

export function getDbCategorias() {
  return dbInstance.getDbInstance();
}
