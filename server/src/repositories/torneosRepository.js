import { listaEstados } from "./torneos/estadosRepository";
import { listaTiposParticipacion } from "./torneos/tipos_participacionRepository";
import { NuevoTorneoRepository } from "./torneos/nuevo_torneoRepository";
import { InscripcionesRepository } from "./torneos/inscripcionRepository";

// Torneos
listaTorneos = async (userId) =>
  await NuevoTorneoRepository.listaTorneos(userId);

// Inscripciones
listaEquipos = async () => await InscripcionesRepository.listaEquipos();
listaIntegrantes = async () => await InscripcionesRepository.listaIntegrantes();
inscribirEquipo = async () => await InscripcionesRepository.inscribirEqiopos();
agregarIntegrantes = async () =>
  await InscripcionesRepository.inscribirIntegrantes();
// TODO Editar Equipo
// TODO Eliminar de Equipo
// TODO Editar Integrante
// TODO Eliminar Integrane/s

export {
  listaEstados,
  listaTiposParticipacion,
  listaTorneos,
  listaEquipos,
  listaIntegrantes,
  inscribirEquipo,
  agregarIntegrantes,
};
