import { Database } from "../dbsqlite.js";

const dbName = "equipos_inscritos";
const createTable = `
  CREATE TABLE IF NOT EXISTS EquiposInscritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      evento_categoria_id INTEGER NOT NULL,
      foto BLOB,
      isValid INTEGER DEFAULT 0 CHECK (isValid IN (0, 1)),
      FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id)
  )`;

const dbInstance = new Database(dbName);

export async function openEquiposInscritosDatabase() {
  await dbInstance.open();
}

export async function createEquiposInscritosTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEquiposInscritos() {
  return dbInstance.getDbInstance();
}
