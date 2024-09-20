import { listaEstados } from "./torneos/estadosRepository";
import { listaTiposParticipacion } from "./torneos/tipos_participacionRepository";
import { NuevoTorneoRepository } from "./torneos/nuevo_torneoRepository";
import { InscripcionesRepository } from "./torneos/inscripcionRepository";

// Torneos
listaTorneos = async (userId) =>
  await NuevoTorneoRepository.listaTorneos(userId);
obtenerTorneo = async ({ userId, torneoId }) =>
  await NuevoTorneoRepository.getTorneo(param0);
agregarTorneo = async ({ userId, torneo }) =>
  await NuevoTorneoRepository.addTorneo(param0);
modificarTorneo = async ({ userId, torneo }) =>
  await NuevoTorneoRepository.modifyTorneo(param0);
eliminarTorneo = async ({ userId, torneoId }) =>
  await NuevoTorneoRepository.deleteTorneo(param0);

// Inscripciones
listaEquipos = async () => await InscripcionesRepository.listaEquipos();
listaIntegrantes = async () => await InscripcionesRepository.listaIntegrantes();
inscribirEquipo = async () => await InscripcionesRepository.inscribirEqipos();
agregarIntegrantes = async () =>
  await InscripcionesRepository.inscribirIntegrantes();
editarEquipo = async ({ userId, eventoCategoriaId, equipo }) =>
  await InscripcionesRepository.actualizarEquipo(param0);
eliminarEquipo = async ({ userId, equipoId }) =>
  await InscripcionesRepository.eliminarEquipo(param0);
editarIntegrantes = async ({ userId, equipoId, integrante }) =>
  await InscripcionesRepository.actualizarIntegrante(param0);
eliminarIntegrante = async ({ userId, equipoId, integranteId }) =>
  await InscripcionesRepository.eliminarIntegrante(param0);

export {
  listaEstados,
  listaTiposParticipacion,
  listaTorneos,
  obtenerTorneo,
  agregarTorneo,
  modificarTorneo,
  eliminarTorneo,
  listaEquipos,
  listaIntegrantes,
  inscribirEquipo,
  agregarIntegrantes,
  editarEquipo,
  eliminarEquipo,
  editarIntegrantes,
  eliminarIntegrante,
};
