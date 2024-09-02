import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { paths } from "../config.js";

export async function getTorneoInscripcion(userId) {
  if (!userId) {
    let error = new Error("All fields are required");
    error.statusCode = 400;
    error.local = true;
    throw error;
  }

  const dbInMemory = await open({
    filename: ":memory:",
    driver: sqlite3.Database,
  });

  async function runSQL(sql) {
    try {
      await dbInMemory.exec(sql);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  try {
    await runSQL(`ATTACH DATABASE '${paths.equipos_inscritos}' AS dbo`);
    await runSQL(`ATTACH DATABASE '${paths.evento_categoria}' AS dbo`);
    await runSQL(`ATTACH DATABASE '${paths.categorias}' AS dbo`);
    await runSQL(`ATTACH DATABASE '${paths.eventos}' AS dbo`);

    const rows = await dbInMemory.all(
      `SELECT
          e.id,
          e.nombre,
          ev.nombre AS evento,
          c.nombre AS categoria,
          e.foto
        FROM dbo.EquiposInscritos e
        JOIN dbo.Evento_Categoria ec ON e.evento_categoria_id = ec.id
        JOIN dbo.Eventos ev ON ec.evento_id = ev.id
        JOIN dbo.Categorias c ON ec.categoria_id = c.id
        WHERE e.userId_create = ?`,
      userId,
    );

    if (!rows) {
      let error = new Error("No se pudo obtener la lista de equipos.");
      error.statusCode = 401;
      error.local = true;
      throw error;
    }

    return rows;
  } catch (err) {
    if (err.local) throw err;

    let error = new Error("Internal Server Error");
    error.statusCode = 500;
    throw error;
  } finally {
    await dbInMemory.close();
  }
}
