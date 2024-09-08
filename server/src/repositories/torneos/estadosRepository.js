import { init, getDbEstados } from "../infrastructure/database.js";

export async function listaEstados() {
  try {
    const dbEstados = getDbEstados();
    const estados = await dbEstados.all("SELECT id, nombre FROM Estados");

    if (!estados) {
      let error = new Error("No se pudo obtener la lista de estados.");
      error.statusCode = 401;
      error.local = true;
      throw error;
    }

    return {
      data: estados,
      statusCode: 200,
    };
  } catch (err) {
    if (err.local) throw err;

    let error = new Error("Internal Server Error");
    error.statusCode = 500;
    throw error;
  }
}
