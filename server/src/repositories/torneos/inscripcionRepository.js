import {
  init,
  getDbEquiposInscritos,
  getDbIntegrantes,
  getTorneoInscripcion,
} from "../../infrastructure/database.js";

const _addEquipos =
  "INSERT INTO equipos_inscritos \
(nombre, evento_categoria_id, foto, userId_create) \
VALUES (?, ?, ?, ?)";

const _updEquipo =
  "UPDATE equipos_inscritos SET \
nombre = ?, evento_categoria_id = ?, foto = ? \
userId_create = ?, fecha_modificacion CURRENT_TIMESTAMP  \
VALUES id = ?";

const _delEquipo =
  "UPDATE equipos_inscritos SET \
userId_create = ?, fecha_baja CURRENT_TIMESTAMP  \
VALUES id = ?";

const _getIntegrantes =
  "SELECT id, nombre, edad, email, foto \
FROM Integrantes \
WHERE userId_create = ?, equipo_inscrito_id = ?";

const _addIntegrantes =
  "INSERT INTO integrantes \
(equipo_inscrito_id, nombre, edad, email, foto, userId_create) \
VALUES (?, ?, ?, ?, ?, ?)";

const _updIntegrante =
  "UPDATE integrantes SET \
equipo_inscrito_id = ?,\
nombre = ?,\
edad = ?,\
email = ?,\
foto = ?,\
userId_create = ?,\
fecha_modificacion CURRENT_TIMESTAMP \
WHERE id = ?";

const _delIntegrante =
  "UPDATE integrantes SET userId_create = ?, fecha_baja = CURRENT_TIMESTAMP WHERE id = ?";

export class InscripcionesRepository {
  /**
   * @param {{userId: number}} param0 Objeto con el id de usuario
   * @returns {{data: {id: number, nombre: string, edad: number, email: string, foto: byte[]}[] | null | undefined, message: string | undefined, statusCode: number}} Lista de equipos correspondientes al usuario que lo cargo.
   * 200 Successfull, 201 No data content, 400 Bad request, 500 Internal server error.
   */
  static async listaEquipos({ userId }) {
    if (!userId) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
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

  /**
   * Obtener la lista de integrantes asociados a un equipo.
   * @param {{userId: number, equipoId: number}} param0 Objeto con el id de usuario y id de equipo
   * @returns {{data: {id: number, nombre: string, edad: number, email: string, foto: byte[]}[] | null | undefined, message: string | undefined, statusCode: number}} Lista de integrantes de un equipo.
   * 200 Successfull, 201 No data content, 400 Bad request, 500 Internal server error.
   */
  static async listaIntegrantes({ userId, equipoId }) {
    if (!userId || !equipoId) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbIntegrantes = getDbIntegrantes();
      const integrantes = await dbIntegrantes.get(
        _getIntegrantes,
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

  /**
   *
   * @param {{userId: number, eventoCategoriaId: number, equipo: {nombre:string, foto?: byte[]}}} param0
   * @returns {message: string, statusCode: number} 201 Successfull, 400 Bad request, 500 Internal server error.
   */
  static async inscribirEqipos({ userId, eventoCategoriaId, equipo }) {
    if (!userId || !eventoCategoriaId || !equipo) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbEquipos = getDbEquiposInscritos();

      await dbEquipos.run(_addEquipos, [
        equipo.nombre,
        eventoCategoriaId,
        equipo.foto,
        userId,
      ]);

      return {
        message: "Equipo registrado correctamente.",
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
        message: "Internal server error.",
        statusCode: 500,
      };
    }
  }

  /**
   * @param {number} userId
   * @param {number} equipoId
   * @param {{name: string, edad: number, email: string, foto: byte[]}[]} integrantes
   * @returns {message: string, statusCode: number} 200 Successfull, 400 Bad request, 500 Internal server error.
   */
  static async #insertarUsuariosEnTransaccion(userId, equipoId, integrantes) {
    const dbIntegrantes = await getDbIntegrantes();

    return new Promise((resolve, reject) => {
      dbIntegrantes.serialize(() => {
        dbIntegrantes.run("BEGIN TRANSACTION", (err) => {
          if (err) {
            return reject({
              message: `Error al iniciar la transacción: ${err.message}`,
              statusCode: 500,
            });
          }

          const stmt = dbIntegrantes.prepare(_addIntegrantes);

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
                      reject({
                        message: `Error al hacer rollback: ${rollbackErr.message}`,
                        statusCode: 500,
                      });
                    }
                  });
                  reject({
                    message: "Error al guardar usuarios",
                    statusCode: 400,
                  });
                }
              },
            );
          });

          stmt.finalize((err) => {
            if (err) {
              return reject({
                message: `Error al finalizar la sentencia: ${err.message}`,
                statusCode: 500,
              });
            }

            if (!errorOccurred) {
              dbIntegrantes.run("COMMIT", (commitErr) => {
                if (commitErr) {
                  return reject({
                    message: commitErr.message,
                    statusCode: 500,
                  });
                }
                resolve({
                  message: "Usuarios insertados exitosamente",
                  statusCode: 200,
                });
              });
            }
          });
        });
      });
    });
  }

  /**
   * @param {{userId: int, equipoId: int, integrantes: {nombre:string, edad?:int, email?:string, foto?:byte[]}[]}} param0
   * @returns {message: string, statusCode: number} 200 Successfull, 400 Bad request, 500 Internal server error.
   */
  static async inscribirIntegrantes({ userId, equipoId, integrantes }) {
    if (!userId || !equipoId || !integrantes || integrantes?.length > 0) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      await DatabaseHelper.#insertarUsuariosEnTransaccion(
        userId,
        equipoId,
        integrantes,
      )
        .try((message) => {
          return message;
        })
        .catch((err) => {
          return err;
        });
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

  /**
   * @param {{userId: int, eventoCategoriaId: int, equipo: {id: int, nombre:string, foto?: byte[]}}} param0
   * @returns {message: string, statusCode: number} 201 No data content, 400 Bad request, 500 Internal server error.
   */
  static async actualizarEquipo({ userId, eventoCategoriaId, equipo }) {
    if (!userId || !eventoCategoriaId || !equipo) {
      return {
        message: "All fields are required",
        statusCode: 400,
      };
    }

    try {
      const dbEquipos = getDbEquiposInscritos();

      await dbEquipos.run(_updEquipo, [
        equipo.nombre,
        eventoCategoriaId,
        equipo.foto,
        userId,
        equipo.id,
      ]);

      return {
        message: "Add sucessfull",
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

  /**
   * @param {{userId: int, equipoId:int}} param0
   * @returns {message: string, statusCode: number} 204 Successfull, 400 Bas request, 404 Not fount, 500 Internal server errror.
   */
  static async eliminarEquipo({ userId, equipoId }) {
    if (
      !userId ||
      !equipoId ||
      isNaN(userId) ||
      isNaN(equipoId) ||
      userId <= 0 ||
      equipoId <= 0
    ) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbEquipos = getDbEquiposInscritos();
      const stmt = await dbEquipos.run(_delEquipo, [userId, equipoId]);

      if (stmt === 0) {
        return {
          message: "Resource not found.",
          statusCode: 404,
        };
      }

      return {
        message: "Delete sucessfull",
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

  /**
   * @param {{userId: number, equipoId: number, integrante: {id: number, name: string, edad: number,email: string, foto: byte[]}}} param0
   * @returns {message: string, statusCode: number} 201 Successfull, 400 Bad request, 500 Internal server error.
   */
  static async actualizarIntegrante({ userId, equipoId, integrante }) {
    if (!userId || !equipoId || !integrante) {
      return {
        message: "All fields are required",
        statusCode: 400,
      };
    }

    try {
      const dbEquipos = getDbEquiposInscritos();

      await dbEquipos.run(_updIntegrante, [
        equipoId,
        integrante.name,
        integrante.edad,
        integrante.email,
        integrante.foto,
        userId,
        integrante.id,
      ]);

      return {
        message: "Add sucessfull",
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

  /**
   * @param {{userId: number, equipoId: number, integranteId: number}} param0
   * @returns {message: string, statusCode: number} 204 No data content, 400 Bas request, 404 Not fount, 500 Internal server errror.
   */
  static async eliminarIntegrante({ userId, equipoId, integranteId }) {
    if (
      !userId ||
      !equipoId ||
      isNaN(userId) ||
      isNaN(equipoId) ||
      isNaN(integranteId) ||
      userId <= 0 ||
      equipoId <= 0 ||
      integranteId <= 0
    ) {
      return {
        message: "Invalid parameters.",
        statusCode: 400,
      };
    }

    try {
      const dbEquipos = getDbEquiposInscritos();

      const stmt = await dbEquipos.run(_delIntegrante, [
        userId,
        equipoId,
        integranteId,
      ]);

      if (stmt === 0) {
        return {
          message: "Resource not found.",
          statusCode: 404,
        };
      }

      return {
        message: "Delete sucessfull",
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
