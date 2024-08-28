import { Database } from "../dbsqlite.js";

const dbName = "estados";
const createTable = `
  CREATE TABLE IF NOT EXISTS Estados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
  )`;

const insertDataSql = `
  INSERT INTO Estados (nombre) VALUES
  ('Creado'),
  ('Inscripción'),
  ('Por iniciar'),
  ('En curso'),
  ('Finalizado'),
  ('Detenido')
  ON CONFLICT (nombre) DO NOTHING`;

const dbInstance = new Database(dbName);

export async function openEstadosDatabase() {
  await dbInstance.open();
}

export async function createEstadosTable() {
  await dbInstance.createTable(createTable).then(async () => {
    await dbInstance.getDbInstance().run(insertDataSql);
  });
}

export function getDbEstados() {
  return dbInstance.getDbInstance();
}
