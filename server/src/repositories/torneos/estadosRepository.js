import { init, getDbEstados } from "../infrastructure/database.js";

export async function listaEstados() {
  try {
    const dbEstados = getDbEstados();
    const estados = await dbEstados.all("SELECT id, nombre FROM Estados");

    if (!estados) {
      return {
        message: "No se pudo obtener la lista de estados.",
        statusCode: 401,
      };
    }

    return {
      data: estados,
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
