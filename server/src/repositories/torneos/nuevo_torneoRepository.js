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
    if (!userId || isNaN(userId) || userId <= 0) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbEvento = getDbEventos();
      const eventos = dbEvento.all(_listar, userId);

      if (!eventos) {
        return {
          message: "Resource not found",
          statusCode: 404,
        };
      }

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
      return {
        message: "Internal server error.",
        statusCode: 500,
      };
    }
  }

  static async getTorneo({ userId, torneoId }) {
    if (
      !userId ||
      !torneoId ||
      isNaN(userId) ||
      userId <= 0 ||
      isNaN(torneoId) ||
      torneoId <= 0
    ) {
      return {
        message: "Invalid parameters",
        statusCode: 400,
      };
    }

    try {
      const dbEvento = getDbEventos();
      const evento = dbEvento.get(_getOne, userId, torneoId);

      if (!evento) {
        return {
          message: "Not found.",
          statusCode: 404,
        };
      }

      return {
        data: evento,
        statusCode: 200,
      };
    } catch (err) {
      return {
        message: "Internal server error.",
        statusCode: 500,
      };
    }
  }

  static #validaTorneo(objTorneo, add = true) {
    return (
      objTorneo &&
      !isNaN(objTorneo?.id) &&
      (typeof objTorneo.id === "number" && add
        ? objTorneo.id === 0
        : objTorneo.id > 0) &&
      typeof objTorneo.name === "string" &&
      Date.isValid(objTorneo.fecha_inicio)
    );
  }

  static async addTorneo({ userId, torneo }) {
    if (
      !userId ||
      !torneo ||
      isNaN(userId) ||
      userId <= 0 ||
      !this.#validaTorneo(torneo)
    ) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
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

      if (stmt === 0) {
        return {
          message: "Resource not found.",
          statusCode: 404,
        };
      }
      return {
        message: "Add Sucessfull",
        statusCode: 201,
      };
    } catch (err) {
      if (err.message.includes("syntax error")) {
        return {
          message: "Bad request",
          statusCode: 400,
        };
      }

      return {
        message: "Internal server error",
        statusCode: 500,
      };
    }
  }

  static async modifyTorneo({ userId, torneo }) {
    if (
      !userId ||
      !torneo ||
      isNaN(userId) ||
      userId <= 0 ||
      !this.#validaTorneo(torneo, false)
    ) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbEvento = getDbEventos();

      const stmt = await dbEvento.run(_edit, [
        torneo?.nombre,
        torneo?.fecha_inicio,
        torneo?.num_max_competidores,
        userId,
        torneo?.id,
      ]);

      if (stmt === 0) {
        return {
          message: "Resource not found.",
          statusCode: 404,
        };
      }

      return {
        message: "Torneo actualizado correctamente.",
        statusCode: 200,
      };
    } catch (err) {
      if (err.message.includes("syntax error")) {
        return {
          message: "Bad request",
          statusCode: 400,
        };
      }

      return {
        message: "Internal server error",
        statusCode: 500,
      };
    }
  }

  static async deleteTorneo({ userId, torneoId }) {
    if (
      !userId ||
      !torneoId ||
      isNaN(userId) ||
      isNaN(torneoId) ||
      userId <= 0 ||
      torneoId <= 0
    ) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbEvento = getDbEventos();

      const stmt = await dbEvento.run(_delete, [userId, torneoId]);
      if (stmt === 0) {
        return {
          message: "Resource not found.",
          statusCode: 404,
        };
      }
      return {
        message: "Delete Sucessfull",
        statusCode: 204,
      };
    } catch (err) {
      if (err.message.includes("syntax error")) {
        return {
          message: "Bad request",
          statusCode: 400,
        };
      }

      return {
        message: "Internal server error.",
        statusCode: 500,
      };
    }
  }
}
