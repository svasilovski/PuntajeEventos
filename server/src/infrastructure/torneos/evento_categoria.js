import { Database } from "../dbsqlite.js";

const dbName = "evento_categoria";
const createTable = `
  CREATE TABLE IF NOT EXISTS Evento_Categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES Eventos(id),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
  )`;

const dbInstance = new Database(dbName);

export async function openEventoCategoriaDatabase() {
  await dbInstance.open();
}

export async function createEventoCategoriaTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEventoCategoria() {
  return dbInstance.getDbInstance();
}
