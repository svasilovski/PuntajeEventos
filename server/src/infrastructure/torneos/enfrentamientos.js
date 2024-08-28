import { Database } from "../dbsqlite.js";

const dbName = "enfrentamientos";
const createTable = `
  CREATE TABLE IF NOT EXISTS Enfrentamientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grupo INTEGER NOT NULL,
      equipo1 INTEGER NOT NULL,
      equipo2 INTEGER NOT NULL,
      FOREIGN KEY (equipo1) REFERENCES EquiposGenerales(id),
      FOREIGN KEY (equipo2) REFERENCES EquiposGenerales(id)
  )`;

const dbInstance = new Database(dbName);

export async function openEnfrentamientosDatabase() {
  await dbInstance.open();
}

export async function createEnfrentamientosTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEnfrentamientos() {
  return dbInstance.getDbInstance();
}
