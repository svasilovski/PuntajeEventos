import { Database } from "../dbsqlite.js";

const dbName = "equipos_generales";
const createTable = `
  CREATE TABLE IF NOT EXISTS EquiposGenerales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      evento_categoria_id INTEGER NOT NULL,
      FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id)
  )`;

const dbInstance = new Database(dbName);

export async function openEquiposGeneralesDatabase() {
  await dbInstance.open();
}

export async function createEquiposGeneralesTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEquiposGenerales() {
  return dbInstance.getDbInstance();
}
