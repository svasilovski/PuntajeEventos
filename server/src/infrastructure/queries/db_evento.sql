CREATE TABLE IF NOT EXISTS Eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    num_max_competidores INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Evento_Categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES Eventos(id),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
);

CREATE TABLE IF NOT EXISTS Estados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

INSERT INTO Estados (nombre) VALUES
('Creado'),
('Inscripción'),
('Por iniciar'),
('En curso'),
('Finalizado'),
('Detenido')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS Estado_Evento_Categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_categoria_id INTEGER NOT NULL,
    estado_id INTEGER NOT NULL,
    FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id),
    FOREIGN KEY (estado_id) REFERENCES Estados(id)
);

CREATE TABLE IF NOT EXISTS EquiposGenerales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    evento_categoria_id INTEGER NOT NULL,
    FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id)
);

CREATE TABLE IF NOT EXISTS Enfrentamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grupo INTEGER NOT NULL,
    equipo1 INTEGER NOT NULL,
    equipo2 INTEGER NOT NULL,
    FOREIGN KEY (equipo1) REFERENCES EquiposGenerales(id),
    FOREIGN KEY (equipo2) REFERENCES EquiposGenerales(id)
);

CREATE TABLE IF NOT EXISTS Tipos_Participacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

INSERT INTO Tipos_Participacion (nombre) VALUES
('individual'),
('grupal')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS Reglas_Evento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    tipo_participacion_id INTEGER NOT NULL,
    cantidad_integrantes INTEGER,
    datos_requeridos TEXT,
    FOREIGN KEY (evento_id) REFERENCES Eventos(id),
    FOREIGN KEY (tipo_participacion_id) REFERENCES Tipos_Participacion(id)
);

CREATE TABLE IF NOT EXISTS EquiposInscritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    evento_categoria_id INTEGER NOT NULL,
    foto BLOB,
    isValid INTEGER DEFAULT 0 CHECK (isValid IN (0, 1)),
    FOREIGN KEY (evento_categoria_id) REFERENCES Evento_Categoria(id)
);

CREATE TABLE IF NOT EXISTS Integrantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_inscrito_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    edad INTEGER,
    email TEXT,
    foto BLOB,
    FOREIGN KEY (equipo_inscrito_id) REFERENCES EquiposInscritos(id)
);

CREATE TABLE IF NOT EXISTS EquiposInscritos_Generales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_inscrito_id INTEGER NOT NULL,
    equipo_general_id INTEGER NOT NULL,
    FOREIGN KEY (equipo_inscrito_id) REFERENCES EquiposInscritos(id),
    FOREIGN KEY (equipo_general_id) REFERENCES EquiposGenerales(id)
);

/*
Analizar realizarlo de forma manual en un SP

CREATE TRIGGER IF NOT EXISTS after_isValid_update
AFTER UPDATE OF isValid ON EquiposInscritos
FOR EACH ROW
WHEN OLD.isValid = 0 AND NEW.isValid = 1
BEGIN
    -- Esta cosnulta funciona pero no está bien asumida las relaciones:
    -- Verifica si el número de equipos válidos coincide con el número de equipos generales
    INSERT INTO EquiposInscritos_Generales (equipo_inscrito_id, equipo_general_id)
    SELECT ins.id, gen.id
    FROM
        (SELECT id FROM EquiposInscritos WHERE isValid = 1 AND evento_categoria_id = NEW.evento_categoria_id ORDER BY RANDOM()) AS ins
    JOIN
        (SELECT id FROM EquiposGenerales WHERE evento_categoria_id = NEW.evento_categoria_id ORDER BY RANDOM()) AS gen
    ON
        ROW_NUMBER() OVER() = ROW_NUMBER() OVER()
    WHERE
        (SELECT COUNT(*) FROM EquiposInscritos WHERE isValid = 1 AND evento_categoria_id = NEW.evento_categoria_id) =
        (SELECT COUNT(*) FROM EquiposGenerales WHERE evento_categoria_id = NEW.evento_categoria_id)
    AND
        (SELECT COUNT(*) FROM EquiposInscritos WHERE isValid = 1 AND evento_categoria_id = NEW.evento_categoria_id) =
        (SELECT COUNT(*) FROM EquiposGenerales WHERE evento_categoria_id = NEW.evento_categoria_id);


    -- Esta consulta no funciona, pero tiene las validaciones:

    DECLARE
        valid_count INTEGER;
        general_count INTEGER;
        evento_id INTEGER;

    SELECT evento_categoria_id INTO evento_id
    FROM EquiposInscritos
    WHERE id = NEW.id;

    SELECT COUNT(*) INTO valid_count
    FROM EquiposInscritos
    WHERE isValid = 1 AND evento_categoria_id = evento_id;

    SELECT COUNT(*) INTO general_count
    FROM EquiposGenerales
    WHERE evento_categoria_id = evento_id;

    IF valid_count = general_count THEN
        DELETE FROM EquiposInscritos_Generales
        WHERE equipo_inscrito_id IN (
            SELECT id FROM EquiposInscritos WHERE evento_categoria_id = evento_id
        );

        CREATE TEMP TABLE TempEmparejamiento AS
        SELECT
            ins.id AS equipo_inscrito_id,
            gen.id AS equipo_general_id
        FROM
            (SELECT id FROM EquiposInscritos WHERE isValid = 1 AND evento_categoria_id = evento_id ORDER BY RANDOM()) AS ins
        JOIN
            (SELECT id FROM EquiposGenerales WHERE evento_categoria_id = evento_id ORDER BY RANDOM()) AS gen
        ON
            ROW_NUMBER() OVER() = ROW_NUMBER() OVER();

        DECLARE
            emparejamiento_inscrito_count INTEGER;
            emparejamiento_general_count INTEGER;

        SELECT COUNT(DISTINCT equipo_inscrito_id) INTO emparejamiento_inscrito_count
        FROM TempEmparejamiento;

        SELECT COUNT(DISTINCT equipo_general_id) INTO emparejamiento_general_count
        FROM TempEmparejamiento;

        IF emparejamiento_inscrito_count = valid_count AND
           emparejamiento_general_count = valid_count THEN
            INSERT INTO EquiposInscritos_Generales (equipo_inscrito_id, equipo_general_id)
            SELECT equipo_inscrito_id, equipo_general_id
            FROM TempEmparejamiento;
        END IF;

        DROP TABLE TempEmparejamiento;
    END IF;

END;
*/
