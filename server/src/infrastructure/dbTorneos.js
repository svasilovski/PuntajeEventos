import {
  openEventosDatabase,
  createEventosTable,
  getDbEventos,
} from "./torneos/eventos.js";
import {
  openCategoriasDatabase,
  createCategoriasTable,
  getDbCategorias,
} from "./torneos/categorias.js";
import {
  openEventoCategoriaDatabase,
  createEventoCategoriaTable,
  getDbEventoCategoria,
} from "./torneos/evento_categoria.js";
import {
  openEstadosDatabase,
  createEstadosTable,
  getDbEstados,
} from "./torneos/estados.js";
import {
  openEstadoEventoCategoriaDatabase,
  createEstadoEventoCategoriaTable,
  getDbEstadoEventoCategoria,
} from "./torneos/estado_evento_categoria.js";
import {
  openEquiposGeneralesDatabase,
  createEquiposGeneralesTable,
  getDbEquiposGenerales,
} from "./torneos/equipos_generales.js";
import {
  openEnfrentamientosDatabase,
  createEnfrentamientosTable,
  getDbEnfrentamientos,
} from "./torneos/enfrentamientos.js";
import {
  openTiposParticipacionDatabase,
  createTiposParticipacionTable,
  getDbTiposParticipacion,
} from "./torneos/tipos_participacion.js";
import {
  openReglasEventoDatabase,
  createReglasEventoTable,
  getDbReglasEvento,
} from "./torneos/reglas_evento.js";
import {
  openEquiposInscritosDatabase,
  createEquiposInscritosTable,
  getDbEquiposInscritos,
} from "./torneos/equipos_inscritos.js";
import {
  openIntegrantesDatabase,
  createIntegrantesTable,
  getDbIntegrantes,
} from "./torneos/integrantes.js";
import {
  openEquiposInscritosGeneralesDatabase,
  createEquiposInscritosGeneralesTable,
  getDbEquiposInscritosGenerales,
} from "./torneos/equipos_inscritos_generales.js";
import { getTorneoInscripcion } from "./torneos/get_torneo_inscripcion.js";

export async function openTorneosDatabase() {
  await openEventosDatabase();
  await openCategoriasDatabase();
  await openEventoCategoriaDatabase();
  await openEstadosDatabase();
  await openEstadoEventoCategoriaDatabase();
  await openEquiposGeneralesDatabase();
  await openEnfrentamientosDatabase();
  await openTiposParticipacionDatabase();
  await openReglasEventoDatabase();
  await openEquiposInscritosDatabase();
  await openIntegrantesDatabase();
  await openEquiposInscritosGeneralesDatabase();
}

export async function createTorneosTable() {
  await createEventosTable();
  await createCategoriasTable();
  await createEventoCategoriaTable();
  await createEstadosTable();
  await createEstadoEventoCategoriaTable();
  await createEquiposGeneralesTable();
  await createEnfrentamientosTable();
  await createTiposParticipacionTable();
  await createReglasEventoTable();
  await createEquiposInscritosTable();
  await createIntegrantesTable();
  await createEquiposInscritosGeneralesTable();
}

export {
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
  getTorneoInscripcion,
};
