/*
Acá se va a manejar la creación de nuevos torneos.
  - Listar todos los torneos. Solo para usuarios y administradores.
  - Listar tornes para inscripción. Solo usuarios registrados.
  - Listar torneos activos y pronto a comenzar. Todos los usuarios pueden acceder.
  - Crear torneo. Solo pueden crear torneos los usuarios
  - Modificar torneo. Solo pueden crear torneos los usuarios que tienen el permiso
  - Eliminar Torneo. Solo pueden crear torneos los usuarios que tienen el permiso
  - Generación automatica de llaves del evento.
    -Crear un trigger en C/C++ extendiendo la capacidad de la base SQite
*/
import {
  init,
  getDbEventos,
  getDbCategorias,
  getDbEventoCategoria,
  getDbEstadoEventoCategoria,
  getDbEquiposGenerales,
  getDbEnfrentamientos,
  getDbReglasEvento,
  getDbEquiposInscritosGenerales,
} from "../../infrastructure/database.js";

const _listar =
  "SELECT id, nombre, fecha_inicio, num_max_competidores FROM Eventos WHERE userId_alta = ?";
const _getOne =
  "SELECT id, nombre, fecha_inicio, num_max_competidores FROM Eventos WHERE userId_alta = ? AND id = ?";
const _add =
  "INSERT INTO Eventos (nombre, fecha_inicio, num_max_competidores, userId_alta, userId_modificacion) VALUES (?, ?, ?, ?, ?)";
const _edit =
  "UPDATE Eventos SET nombre = ?, fecha_inicio = ?, num_max_competidores = ?, userId_modificacion = ? WHERE id = ?";
const _delete =
  "UPDATE Eventos SET userId_baja = ?, fecha_baja = CURRENT_TIMESTAMP WHERE id = ?";

export class NuevoTorneoRepository {
  static async listaTorneos({ userId }) {
    if (!userId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbEvento = getDbEventos();
      const eventos = dbEvento.all(_listar, userId);

      if (eventos && eventos?.length == 0) {
        return {
          data: null,
          statusCode: 201,
        };
      }

      return {
        data: eventos,
        statusCode: 200,
      };
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  static async getTorneo({ userId, torneoId }) {
    if (!userId && !torneoId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbEvento = getDbEventos();
      const evento = dbEvento.get(_getOne, userId, torneoId);

      if (evento) {
        return {
          data: null,
          statusCode: 201,
        };
      }

      return {
        data: evento,
        statusCode: 200,
      };
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  static #validaTorneo(objTorneo, add = true) {
    return (
      objTorneo &&
      (typeof objTorneo.id === "number" && add
        ? objTorneo.id === 0
        : objTorneo.id > 0) &&
      typeof objTorneo.name === "string" &&
      Date.isValid(objTorneo.fecha_inicio)
    );
  }

  static async addTorneo({ userId, torneo }) {
    if (!userId && !torneo) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    if (!this.#validaTorneo(torneo)) {
      let error = new Error("Invalid format param torneo");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbEvento = getDbEventos();

      const stmt = await dbEvento.run(_add, [
        torneo?.nombre,
        torneo?.fecha_inicio,
        torneo?.num_max_competidores,
        userId,
        userId,
      ]);

      return {
        data: null,
        statusCode: 201,
      };
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  static async modifyTorneo({ userId, torneo }) {
    if (!userId && !torneo) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbEvento = getDbEventos();
      // TODO Desarrollar Modificar torneo
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  static async deleteTorneo({ userId, torneoId }) {
    if (!userId && !torneoId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbEvento = getDbEventos();
      // TODO Agregar delete torneo, es una baja logica.
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }
}
