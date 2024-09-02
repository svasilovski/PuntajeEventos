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

      if (equipos && equipos?.length == 0) {
        return {
          data: null,
          statusCode: 201,
        };
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
          id, nombre, edad, email, foto \
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

      if (integrantes && integrantes?.length == 0) {
        return {
          data: null,
          statusCode: 201,
        };
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

  /**
   * Inserta los integrantes en la base de datos.
   * @param {int} userId
   * @param {int} equipoId
   * @param {{nombre:string, edad?:int, email?:string, foto?:byte[]}[]} integrantes
   * @returns
   */
  static #insertarUsuariosEnTransaccion = async (
    userId,
    equipoId,
    integrantes,
  ) => {
    const dbIntegrantes = await getDbIntegrantes();

    return new Promise((resolve, reject) => {
      dbIntegrantes.serialize(() => {
        dbIntegrantes.run("BEGIN TRANSACTION", (err) => {
          if (err) {
            return reject(err);
          }

          const stmt = dbIntegrantes.prepare(
            "INSERT INTO integrantes (equipo_inscrito_id, nombre, edad, email, foto, userId_create) VALUES (?, ?, ?, ?, ?, ?)",
          );

          let errorOccurred = false;

          integrantes.forEach((integrante) => {
            stmt.run(
              equipoId,
              integrante.name,
              integrante.edad,
              integrante.email,
              integrante.foto,
              userId,
              (err) => {
                if (err) {
                  errorOccurred = true;
                  dbIntegrantes.run("ROLLBACK", (rollbackErr) => {
                    if (rollbackErr) {
                      let error = new Error(
                        `Error al hacer rollback: ${rollbackErr.message}`,
                      );
                      error.statusCode = 500;
                      error.local = true;
                      throw error;
                    }
                    reject(err);
                  });
                }
              },
            );
          });

          stmt.finalize((err) => {
            if (err) {
              return reject(err);
            }

            if (!errorOccurred) {
              dbIntegrantes.run("COMMIT", (commitErr) => {
                if (commitErr) {
                  return reject(commitErr);
                }
                resolve("Usuarios insertados exitosamente");
              });
            }
          });
        });
      });
    });
  };

  /**
   * @description Agrega un integrante al equipo
   * @param {Object} param0 Todos los csmpos son obligatorios.
   * @param {int} param0.userId Identificador del usuario que lo carga.
   * @param {int} param0.equipoId Identificador del equipo.
   * @param {{nombre:string, edad?:int, email?:string, foto?:byte[]}[]} param0.integrantes integrantes Lista de objetos
   */
  static async inscribirIntegrantes({ userId, equipoId, integrantes }) {
    if (!userId || !equipoId || !integrantes || integrantes?.length > 0) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
    }

    try {
      const dbIntegrantes = getDbIntegrantes();

      const result = await DatabaseHelper.#insertarUsuariosEnTransaccion(
        userId,
        equipoId,
        integrantes,
      );

      return {
        message: result,
        statusCode: 200,
      };
    } catch (err) {
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }
}
