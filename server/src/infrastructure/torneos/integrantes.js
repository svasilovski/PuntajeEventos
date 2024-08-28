import { Database } from "../dbsqlite.js";

const dbName = "integrantes";
const createTable = `
  CREATE TABLE IF NOT EXISTS Integrantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_inscrito_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    edad INTEGER,
    email TEXT,
    foto BLOB,
    FOREIGN KEY (equipo_inscrito_id) REFERENCES EquiposInscritos(id)
  )`;

const dbInstance = new Database(dbName);

export async function openIntegrantesDatabase() {
  await dbInstance.open();
}

export async function createIntegrantesTable() {
  await dbInstance.createTable(createTable);
}

export function getDbIntegrantes() {
  return dbInstance.getDbInstance();
}
