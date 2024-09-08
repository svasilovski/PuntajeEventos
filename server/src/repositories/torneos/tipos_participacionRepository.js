import { init, getDbTiposParticipacion } from "../infrastructure/database.js";

export async function listaTiposParticipacion() {
  try {
    const dbTiposParticipacion = getDbTiposParticipacion();
    const tipoParticipaciones = await dbTiposParticipacion.all(
      "SELECT id, nombre FROM Tipos_Participacion",
    );

    if (!tipoParticipaciones) {
      let error = new Error(
        "No se pudo obtener la lista tipos de participación.",
      );
      error.statusCode = 401;
      error.local = true;
      throw error;
    }

    return {
      data: tipoParticipaciones,
      statusCode: 200,
    };
  } catch (err) {
    if (err.local) throw err;

    let error = new Error("Internal Server Error");
    error.statusCode = 500;
    throw error;
  }
}
