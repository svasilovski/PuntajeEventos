import { Database } from "../dbsqlite.js";

const dbName = "equipos_inscritos_generales";
const createTable = `
  CREATE TABLE IF NOT EXISTS EquiposInscritos_Generales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipo_inscrito_id INTEGER NOT NULL,
      equipo_general_id INTEGER NOT NULL,
      FOREIGN KEY (equipo_inscrito_id) REFERENCES EquiposInscritos(id),
      FOREIGN KEY (equipo_general_id) REFERENCES EquiposGenerales(id)
  )`;

const dbInstance = new Database(dbName);

export async function openEquiposInscritosGeneralesDatabase() {
  await dbInstance.open();
}

export async function createEquiposInscritosGeneralesTable() {
  await dbInstance.createTable(createTable);
}

export function getDbEquiposInscritosGenerales() {
  return dbInstance.getDbInstance();
}
