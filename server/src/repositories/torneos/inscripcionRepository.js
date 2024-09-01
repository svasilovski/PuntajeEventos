import {
  init,
  getDbEquiposInscritos,
  getDbIntegrantes,
  getTorneoInscripcion,
} from "../infrastructure/database.js";

export class InscripcionesRepository {
  static async listaEquipos({ userId }) {
    if (!userId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const equipos = await getTorneoInscripcion(userId);

      if (!equipos) {
        let error = new Error("No se pudo obtener la lista de equipos.");
        error.statusCode = 401;
        error.local = true;
        throw error;
      }

      return {
        data: equipos,
        statusCode: 200,
      };
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  static async listaIntegrantes({ userId, equipoId }) {
    if (!userId || !equipoId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbIntegrantes = getDbIntegrantes();
      const integrantes = await dbIntegrantes.get(
        "SELECT \
          id, equipo_inscrito_id, nombre, edad, email, foto \
        FROM Integrantes \
        WHERE userId_create = ?, equipo_inscrito_id = ?",
        userId,
        equipoId,
      );

      if (!integrantes) {
        let error = new Error("No se pudo obtener la lista de integrantes.");
        error.statusCode = 401;
        error.local = true;
        throw error;
      }

      return {
        data: integrantes,
        statusCode: 200,
      };
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  // TODO Agregar los campos necesarios para agregar en la tabla
  static async inscribirEqiopos({ eventoId, categoriaId }) {
    if (!eventoId || !categoriaId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbEquipos = getDbEquiposInscritos();
      // TODO Insertar un equipo
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  // TODO Agregar los campos necesarios para agregar en la tabla
  static async inscribirIntegrantes({ userId, equipoId }) {
    if (!eventoId || !categoriaId) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbIntegrantes = getDbIntegrantes();
      // TODO Insertar un equipo
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }
}
