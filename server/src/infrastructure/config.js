import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __folder = "../models";

export const paths = {
  login: path.resolve(__dirname, `${__folder}/login.sqlite`),
  users: path.resolve(__dirname, `${__folder}/users.sqlite`),
  eventos: path.resolve(__dirname, `${__folder}/eventos.sqlite`),
  categorias: path.resolve(__dirname, `${__folder}/categorias.sqlite`),
  evento_categoria: path.resolve(
    __dirname,
    `../models/evento_categoria.sqlite`,
  ),
  estados: path.resolve(__dirname, `${__folder}/estados.sqlite`),
  estado_evento_categoria: path.resolve(
    __dirname,
    `${__folder}/estado_evento_categoria.sqlite`,
  ),
  equipos_generales: path.resolve(
    __dirname,
    `${__folder}/equipos_generales.sqlite`,
  ),
  enfrentamientos: path.resolve(
    __dirname,
    `${__folder}/enfrentamientos.sqlite`,
  ),
  tipos_participacion: path.resolve(
    __dirname,
    `${__folder}/tipos_participacion.sqlite`,
  ),
  reglas_evento: path.resolve(__dirname, `${__folder}/reglas_evento.sqlite`),
  equipos_inscritos: path.resolve(
    __dirname,
    `${__folder}/equipos_inscritos.sqlite`,
  ),
  integrantes: path.resolve(__dirname, `${__folder}/integrantes.sqlite`),
  equipos_inscritos_generales: path.resolve(
    __dirname,
    `${__folder}/equipos_inscritos_generales.sqlite`,
  ),
};
