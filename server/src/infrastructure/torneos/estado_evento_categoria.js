import { Database } from "../dbsqlite.js";

const dbName = "estado_evento_categoria";
const createTable = `
  CREATE TABLE IF NOT EXISTS Estado_Evento_Categoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evento_categoria_id INTEGER NOT NULL,
      estado_id INTEGER NOT NULL,
      FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id),
      FOREIGN KEY (estado_id) REFERENCES Estados(id)
  )`;

const dbInstance = new Database(dbName);

export async function openEstadoEventoCategoriaDatabase() {
  await dbInstance.open();
}

export async function createEstadoEventoCategoriaTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEstadoEventoCategoria() {
  return dbInstance.getDbInstance();
}
