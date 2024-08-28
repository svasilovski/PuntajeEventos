import { Database } from "../dbsqlite.js";

const dbName = "tipos_participacion";
const createTable = `
  CREATE TABLE IF NOT EXISTS Tipos_Participacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
  )`;
const insertDataSql = `
  INSERT INTO Tipos_Participacion (nombre) VALUES
  ('individual'),
  ('grupal')
  ON CONFLICT (nombre) DO NOTHING`;

const dbInstance = new Database(dbName);

export async function openTiposParticipacionDatabase() {
  await dbInstance.open();
}

export async function createTiposParticipacionTable() {
  await dbInstance.createTable(createTable);
  await dbInstance.getDbInstance().run(insertDataSql);
}

export function getDbTiposParticipacion() {
  return dbInstance.getDbInstance();
}
