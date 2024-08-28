import { Database } from './dbsqlite.js';

const createTablesSql = [
    `CREATE TABLE IF NOT EXISTS Eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        fecha_inicio DATE NOT NULL,
        num_max_competidores INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Evento_Categoria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evento_id INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,
        FOREIGN KEY (evento_id) REFERENCES Eventos(id),
        FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Estados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS Estado_Evento_Categoria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evento_categoria_id INTEGER NOT NULL,
        estado_id INTEGER NOT NULL,
        FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id),
        FOREIGN KEY (estado_id) REFERENCES Estados(id)
    )`,
    `CREATE TABLE IF NOT EXISTS EquiposGenerales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        evento_categoria_id INTEGER NOT NULL,
        FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Enfrentamientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grupo INTEGER NOT NULL,
        equipo1 INTEGER NOT NULL,
        equipo2 INTEGER NOT NULL,
        FOREIGN KEY (equipo1) REFERENCES EquiposGenerales(id),
        FOREIGN KEY (equipo2) REFERENCES EquiposGenerales(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Tipos_Participacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS Reglas_Evento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        evento_id INTEGER NOT NULL,
        tipo_participacion_id INTEGER NOT NULL,
        cantidad_integrantes INTEGER,
        datos_requeridos TEXT,
        FOREIGN KEY (evento_id) REFERENCES Eventos(id),
        FOREIGN KEY (tipo_participacion_id) REFERENCES Tipos_Participacion(id)
    )`,
    `CREATE TABLE IF NOT EXISTS EquiposInscritos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        evento_categoria_id INTEGER NOT NULL,
        foto BLOB,
        isValid INTEGER DEFAULT 0 CHECK (isValid IN (0, 1)),
        FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Integrantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        equipo_inscrito_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        edad INTEGER,
        email TEXT,
        foto BLOB,
        FOREIGN KEY (equipo_inscrito_id) REFERENCES EquiposInscritos(id)
    )`,
    `CREATE TABLE IF NOT EXISTS EquiposInscritos_Generales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        equipo_inscrito_id INTEGER NOT NULL,
        equipo_general_id INTEGER NOT NULL,
        FOREIGN KEY (equipo_inscrito_id) REFERENCES EquiposInscritos(id),
        FOREIGN KEY (equipo_general_id) REFERENCES EquiposGenerales(id)
    );`
]

const insertDataSql = [
    `INSERT INTO Estados (nombre) VALUES
    ('Creado'),
    ('Inscripción'),
    ('Por iniciar'),
    ('En curso'),
    ('Finalizado'),
    ('Detenido')
    ON CONFLICT (nombre) DO NOTHING`,
    `INSERT INTO Tipos_Participacion (nombre) VALUES
    ('individual'),
    ('grupal')
    ON CONFLICT (nombre) DO NOTHING`
]

const dbTorneos = new Database('torneos');

export async function openTorneosDatabase() {
    await dbTorneos.open();
}

export async function createTorneosTable() {
    for (const sql of createTablesSql) {
        await dbTorneos.createTable(sql);
    }

    const dbInstance = dbTorneos.getDbInstance();

    for (const sql of insertDataSql) {
        await dbInstance.run(sql);
    }
}

export function getDbTorneos() {
    return dbTorneos.getDbInstance();
}
