import {
  init,
  getDbEquiposInscritos,
  getDbIntegrantes,
  getTorneoInscripcion,
} from "../../infrastructure/database.js";

// const _getEquipos = ""; en getTorneoInscripcion
const _addEquipos =
  "INSERT INTO equipos_inscritos \
(nombre, evento_categoria_id, foto, userId_create) \
VALUES (?, ?, ?, ?)";

// TODO Agregar consultas sql para agregar y eliminar de equipos.
const _updEquipo = "";
const _delEquipo = "";

const _getIntegrantes =
  "SELECT id, nombre, edad, email, foto \
FROM Integrantes \
WHERE userId_create = ?, equipo_inscrito_id = ?";

const _addIntegrantes =
  "INSERT INTO integrantes \
(equipo_inscrito_id, nombre, edad, email, foto, userId_create) \
VALUES (?, ?, ?, ?, ?, ?)";

// TODO Agregar consultas sql para agregar y eliminar integrantes.
const _updIntegrantes = "";
const _delIntegrantes = "";

export class InscripcionesRepository {
  // TODO Arreglar los errores como en nuevo_torneo.js

  /**
   * Obtener una lista de equipos por usuario.
   * @param {userId:int} param0 Objeto con el id de usuario
   * @returns Lista de equipos correspondientes al usuario que lo cargo
   */
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

  /**
   * Obtener la lista de integrantes asociados a un equipo.
   * @param {userId: int, equipoId: int} param0 Objeto con el id de usuario y id de equipo
   * @returns Lista de integrantes de un equipo.
   */
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
      if (err.local) throw err;

      let error = new Error("Internal Server Error");
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Inscribe un equipo a un torneo en una categoria.
   * @param {int} userId
   * @param {int} eventoCategoriaId
   * @param {{nombre:string, foto?: byte[]}} equipo
   * @return {message: string, statusCode: int}
   * @throws {Error} Codigos de estado controlados 400, 500
   */
  static async inscribirEqiopos({ userId, eventoCategoriaId, equipo }) {
    if (!userId || !eventoCategoriaId || !equipo) {
      let error = new Error("All fields are required");
      error.statusCode = 400;
      error.local = true;
      throw error;
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
  static async #insertarUsuariosEnTransaccion(userId, equipoId, integrantes) {
    const dbIntegrantes = await getDbIntegrantes();

    return new Promise((resolve, reject) => {
      dbIntegrantes.serialize(() => {
        dbIntegrantes.run("BEGIN TRANSACTION", (err) => {
          if (err) {
            return reject(err);
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
  }

  /**
   * @description Agrega un integrante al equipo
   * @param {Object} param0 Todos los csmpos son obligatorios.
   * @param {int} param0.userId Identificador del usuario que lo carga.
   * @param {int} param0.equipoId Identificador del equipo.
   * @param {{nombre:string, edad?:int, email?:string, foto?:byte[]}[]} param0.integrantes integrantes Lista de objetos
   * @returns {message: string, statusCode: int}
   * @throws {Error} Codigos de estado controlados 400, 500
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

  // TODO Terminar de implementar los métodos add y delete de equipos e integrantes.
  static async actualizarEquipo() {
    // _updEquipo
    throw "No implementado.";
  }

  static async eliminarEquipo() {
    // _delEquipo
    throw "No implementado.";
  }

  static async actualizarIntegrante() {
    // _updIntegrantes
    throw "No implementado.";
  }

  static async eliminarIntegrante() {
    // _delIntegrantes
    throw "No implementado.";
  }
}
