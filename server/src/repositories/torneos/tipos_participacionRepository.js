import { init, getDbTiposParticipacion } from "../infrastructure/database.js";

export async function listaTiposParticipacion() {
  try {
    const dbTiposParticipacion = getDbTiposParticipacion();
    const tipoParticipaciones = await dbTiposParticipacion.all(
      "SELECT id, nombre FROM Tipos_Participacion",
    );

    if (!tipoParticipaciones) {
      return {
        message: "No se pudo obtener la lista tipos de participación.",
        statusCode: 401,
      };
    }

    return {
      data: tipoParticipaciones,
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
