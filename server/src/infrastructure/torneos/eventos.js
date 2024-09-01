import { Database } from "../dbsqlite.js";

const dbName = "eventos";
const createTable = `
  CREATE TABLE IF NOT EXISTS Eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    num_max_competidores INTEGER NOT NULL,
    userId_alta INTEGER NOT NULL,
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    userId_modificacion INTEGER NOT NULL,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    userId_baja INTEGER,
    fecha_baja DATETIME DEFAULT NULL
  )`;

const dbInstance = new Database(dbName);

export async function openEventosDatabase() {
  await dbInstance.open();
}

export async function createEventosTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEventos() {
  return dbInstance.getDbInstance();
}
