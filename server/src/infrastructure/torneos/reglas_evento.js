import { Database } from "../dbsqlite.js";

const dbName = "reglas_evento";
const createTable = `
  CREATE TABLE IF NOT EXISTS Reglas_Evento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    tipo_participacion_id INTEGER NOT NULL,
    cantidad_integrantes INTEGER,
    datos_requeridos TEXT,
    FOREIGN KEY (evento_id) REFERENCES Eventos(id),
    FOREIGN KEY (tipo_participacion_id) REFERENCES Tipos_Participacion(id)
  )`;

const dbInstance = new Database(dbName);

export async function openReglasEventoDatabase() {
  await dbInstance.open();
}

export async function createReglasEventoTable() {
  await dbInstance.createTable(createTable);
}

export function getDbReglasEvento() {
  return dbInstance.getDbInstance();
}
