CREATE DATABASE IF NOT EXISTS agendar;
USE agendar;

CREATE TABLE IF NOT EXISTS pacientes (
    paciente_id INT AUTO_INCREMENT PRIMARY KEY,
    id_externo 		VARCHAR(100) UNIQUE,
    nombre 			VARCHAR(100) NOT NULL,
    apellido 		VARCHAR(100) NOT NULL,
    nro_obra_social	VARCHAR(50),
    correo			VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS especialidades (
    especialidad_id	INT AUTO_INCREMENT PRIMARY KEY,
    descripcion 	VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS medicos (
    medico_id		INT AUTO_INCREMENT PRIMARY KEY,
    id_externo 		VARCHAR(100) UNIQUE,
    nombre 			VARCHAR(100) NOT NULL,
    apellido 		VARCHAR(100) NOT NULL,
    matricula 		VARCHAR(50) NOT NULL  
);

CREATE TABLE IF NOT EXISTS medicos_especialidades (
    medico_id 		INT,
    especialidad_id INT,
    PRIMARY KEY (medico_id, especialidad_id),
    FOREIGN KEY (medico_id) REFERENCES medicos(medico_id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(especialidad_id)
);

CREATE TABLE IF NOT EXISTS consultorios (
    consultorio_id	INT AUTO_INCREMENT PRIMARY KEY,
    descripcion		VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS estados (
    estado_id		CHAR(1) PRIMARY KEY,		 		
    descripcion 	VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS turnos (
    turno_id		INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id		INT,
    medico_id 		INT NOT NULL,
    especialidad_id	INT NOT NULL,
    fecha			DATETIME NOT NULL,
    duracion		INT NOT NULL,
    consultorio_id	INT NOT NULL,
    estado_id 		CHAR(1) DEFAULT 'L',
    fecha_estado	DATETIME,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (medico_id) REFERENCES medicos(medico_id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(especialidad_id),
    FOREIGN KEY (consultorio_id) REFERENCES consultorios(consultorio_id),
    FOREIGN KEY (estado_id) REFERENCES estados(estado_id)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    rol VARCHAR(50) DEFAULT 'usuario',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS token_encuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(100) UNIQUE,
  usado BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(100),
  respuesta1 INT,
  respuesta2 INT,
  respuesta3 INT,
  respuesta4 INT,
  respuesta5 INT,
  respuesta6 INT,
  fecha_respuesta DATETIME
);

CREATE TABLE IF NOT EXISTS preguntas_encuesta (
    pregunta_id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(250)
);

CREATE PROCEDURE IF NOT EXISTS generar_turnos(
    IN anio INT,
    IN mes INT,
    IN medico_id_in INT,
    IN dias VARCHAR(255),
    IN hora_inicio TIME,
    IN hora_fin TIME,
    IN duracion_minutos INT,
    IN consultorio_id INT
)
BEGIN
    DECLARE fecha DATE;
    DECLARE nombre_dia VARCHAR(20);
    DECLARE hora_actual TIME;
    DECLARE especialidad_id_in INT;
   
   
    SELECT especialidad_id INTO especialidad_id_in
    FROM medicos_especialidades
    WHERE medico_id = medico_id_in
    LIMIT 1;

    SET fecha = STR_TO_DATE(CONCAT(anio, '-', mes, '-01'), '%Y-%m-%d');

    WHILE MONTH(fecha) = mes DO
        SET nombre_dia = CASE DAYOFWEEK(fecha)
            WHEN 1 THEN 'Domingo'
            WHEN 2 THEN 'Lunes'
            WHEN 3 THEN 'Martes'
            WHEN 4 THEN 'Miercoles'
            WHEN 5 THEN 'Jueves'
            WHEN 6 THEN 'Viernes'
            WHEN 7 THEN 'Sabado'
        END;

        IF FIND_IN_SET(nombre_dia, dias) > 0 THEN
           
            SET hora_actual = hora_inicio;
            WHILE hora_actual < hora_fin DO
                INSERT INTO turnos (paciente_id, medico_id, especialidad_id, fecha, duracion, consultorio_id, estado_id, fecha_estado)
                VALUES (NULL, medico_id_in, especialidad_id_in, CONCAT(fecha, ' ', hora_actual), duracion_minutos, consultorio_id, 'L', NOW());
            
                SET hora_actual = ADDTIME(hora_actual, SEC_TO_TIME(duracion_minutos * 60));
            END WHILE;

        END IF;
       
        SET fecha = DATE_ADD(fecha, INTERVAL 1 DAY);
    END WHILE;
    
    SELECT 'success' AS mensaje;

END;

-- SP para eliminar un turno
CREATE PROCEDURE IF NOT EXISTS eliminar_turno (
    IN turno_id_in INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM turnos WHERE turno_id = turno_id_in) THEN
        DELETE FROM turnos WHERE turno_id = turno_id_in;
        SELECT 'Turno eliminado correctamente.' AS mensaje;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El turno no existe.';
    END IF;
END;

CREATE PROCEDURE IF NOT EXISTS modificar_turno(
    IN p_turno_id INT,
    IN p_fecha DATETIME,
    IN p_duracion INT,
    IN p_estado_id CHAR(1)
)
BEGIN
    UPDATE turnos
    SET
        fecha = p_fecha,
        duracion = p_duracion,
        estado_id = p_estado_id,
        fecha_estado = NOW()
    WHERE turno_id = p_turno_id;
END;

-- INSERTS básicos que generen registros en la tabla

INSERT INTO especialidades (descripcion)
SELECT 'Especialidad de prueba'
WHERE NOT EXISTS (
    SELECT 1 FROM especialidades WHERE descripcion = 'Especialidad de prueba'
);

INSERT INTO consultorios (descripcion)
SELECT 'consultorio de prueba'
WHERE NOT EXISTS (
    SELECT 1 FROM consultorios WHERE descripcion = 'consultorio de prueba'
);

INSERT INTO estados (estado_id, descripcion)
SELECT 'L', 'Libre' WHERE NOT EXISTS (SELECT 1 FROM estados WHERE estado_id = 'L')
UNION ALL
SELECT 'R', 'Reservado' WHERE NOT EXISTS (SELECT 1 FROM estados WHERE estado_id = 'R')
UNION ALL
SELECT 'A', 'Atendido' WHERE NOT EXISTS (SELECT 1 FROM estados WHERE estado_id = 'A')
UNION ALL
SELECT 'B', 'Bloqueado' WHERE NOT EXISTS (SELECT 1 FROM estados WHERE estado_id = 'B')
UNION ALL
SELECT 'U', 'Ausente' WHERE NOT EXISTS (SELECT 1 FROM estados WHERE estado_id = 'U');


INSERT INTO medicos (id_externo, nombre, apellido, matricula)
SELECT '100000003', 'Juan Pablo', 'Sparo', '2389238923'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE id_externo = '100000003'
);

INSERT INTO medicos (id_externo, nombre, apellido, matricula)
SELECT '100000004', 'Sebastian', 'Longhitano', '49348348'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE id_externo = '100000004'
);

INSERT INTO pacientes (id_externo, nombre, apellido, nro_obra_social, correo)
SELECT '100000001', 'Alejandro', 'Biondani', '6025552255', 'abiondani@gmail.com'
WHERE NOT EXISTS (
    SELECT 1 FROM pacientes WHERE id_externo = '100000001'
);

INSERT INTO pacientes (id_externo, nombre, apellido, nro_obra_social, correo)
SELECT '100000002', 'Luciano', 'Lopez', '2342354325', 'lucianolop88@gmail.com'
WHERE NOT EXISTS (
    SELECT 1 FROM pacientes WHERE id_externo = '100000002'
);

INSERT INTO medicos_especialidades (medico_id, especialidad_id)
SELECT 1, 1
WHERE NOT EXISTS (
    SELECT 1 FROM medicos_especialidades WHERE medico_id = 1 AND especialidad_id = 1
);

INSERT INTO usuarios (usuario, contrasena, nombre, apellido, email, rol)
SELECT * FROM (
    SELECT 
        'admin' AS usuario,
        'admin123' AS contrasena,
        'Juan' AS nombre,
        'Pérez' AS apellido,
        'admin@example.com' AS email,
        'admin' AS rol
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE usuario = 'admin'
) LIMIT 1;

INSERT INTO preguntas_encuesta (pregunta)
SELECT 'En general, ¿qué tan satisfecho está con la atención recibida en nuestra clínica?'
WHERE NOT EXISTS (
    SELECT 1 FROM preguntas_encuesta
    WHERE pregunta = 'En general, ¿qué tan satisfecho está con la atención recibida en nuestra clínica?'
);

INSERT INTO preguntas_encuesta (pregunta)
SELECT '¿Qué tan satisfecho está con la amabilidad y profesionalismo del personal?'
WHERE NOT EXISTS (
    SELECT 1 FROM preguntas_encuesta
    WHERE pregunta = '¿Qué tan satisfecho está con la amabilidad y profesionalismo del personal?'
);
INSERT INTO preguntas_encuesta (pregunta)
SELECT '¿Qué tan satisfecho está con el tiempo de espera para ser atendido?'
WHERE NOT EXISTS (
    SELECT 1 FROM preguntas_encuesta
    WHERE pregunta = '¿Qué tan satisfecho está con el tiempo de espera para ser atendido?'
);
INSERT INTO preguntas_encuesta (pregunta)
SELECT '¿Qué tan satisfecho está con la explicación de su diagnóstico y tratamiento?'
WHERE NOT EXISTS (
    SELECT 1 FROM preguntas_encuesta
    WHERE pregunta = '¿Qué tan satisfecho está con la explicación de su diagnóstico y tratamiento?'
);
INSERT INTO preguntas_encuesta (pregunta)
SELECT '¿Qué tan satisfecho está con la limpieza y comodidad de las instalaciones?'
WHERE NOT EXISTS (
    SELECT 1 FROM preguntas_encuesta
    WHERE pregunta = '¿Qué tan satisfecho está con la limpieza y comodidad de las instalaciones?'
);
INSERT INTO preguntas_encuesta (pregunta)
SELECT '¿Qué tan satisfecho está con la comunicación con su médico/a?'
WHERE NOT EXISTS (
    SELECT 1 FROM preguntas_encuesta
    WHERE pregunta = '¿Qué tan satisfecho está con la comunicación con su médico/a?'
);


/*  CALL generar_turnos(2025,5,1,'Miercoles,Jueves,Sábado', 70000, 100000, 30, 1);
*/