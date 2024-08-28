import { openLoginDatabase, createLoginTable, getDbLogin } from "./dbLogin.js";
import { openUsersDatabase, createUsersTable, getDbUsers } from "./dbUsers.js";
import {
  openTorneosDatabase,
  createTorneosTable,
  getDbEventos,
  getDbCategorias,
  getDbEventoCategoria,
  getDbEstados,
  getDbEstadoEventoCategoria,
  getDbEquiposGenerales,
  getDbEnfrentamientos,
  getDbTiposParticipacion,
  getDbReglasEvento,
  getDbEquiposInscritos,
  getDbIntegrantes,
  getDbEquiposInscritosGenerales,
} from "./dbTorneos.js";

export async function init() {
  await openLoginDatabase();
  await openUsersDatabase();
  await openTorneosDatabase();
  await createLoginTable();
  await createUsersTable();
  await createTorneosTable();
}

export {
  getDbLogin,
  getDbUsers,
  getDbEventos,
  getDbCategorias,
  getDbEventoCategoria,
  getDbEstados,
  getDbEstadoEventoCategoria,
  getDbEquiposGenerales,
  getDbEnfrentamientos,
  getDbTiposParticipacion,
  getDbReglasEvento,
  getDbEquiposInscritos,
  getDbIntegrantes,
  getDbEquiposInscritosGenerales,
};
