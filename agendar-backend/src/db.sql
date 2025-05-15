DROP DATABASE IF EXISTS agendar;
CREATE DATABASE agendar;
USE agendar;

CREATE TABLE pacientes (
    paciente_id INT AUTO_INCREMENT PRIMARY KEY,
    id_externo 		VARCHAR(100) UNIQUE,
    nombre 			VARCHAR(100) NOT NULL,
    apellido 		VARCHAR(100) NOT NULL,
    nro_obra_social	VARCHAR(50),
    correo			VARCHAR(100)
);

CREATE TABLE especialidades (
    especialidad_id	INT AUTO_INCREMENT PRIMARY KEY,
    descripcion 	VARCHAR(100) NOT NULL
);

CREATE TABLE medicos (
    medico_id		INT AUTO_INCREMENT PRIMARY KEY,
    id_externo 		VARCHAR(100) UNIQUE,
    nombre 			VARCHAR(100) NOT NULL,
    apellido 		VARCHAR(100) NOT NULL,
    matricula 		VARCHAR(50) NOT NULL
);

CREATE TABLE medicos_especialidades (
    medico_id 		INT,
    especialidad_id INT,
    PRIMARY KEY (medico_id, especialidad_id),
    FOREIGN KEY (medico_id) REFERENCES medicos(medico_id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(especialidad_id)
);

CREATE TABLE consultorios (
    consultorio_id	INT AUTO_INCREMENT PRIMARY KEY,
    descripcion		VARCHAR(100) NOT NULL
);

CREATE TABLE estados (
    estado_id		CHAR(1) PRIMARY KEY,		 		
    descripcion 	VARCHAR(20) NOT NULL
);

CREATE TABLE turnos (
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

DROP PROCEDURE IF EXISTS generar_turnos;


CREATE PROCEDURE generar_turnos(
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

INSERT INTO especialidades (descripcion) VALUES ('Especialiad de prueba');
INSERT INTO consultorios (descripcion) VALUES ('consultorio de prueba');
INSERT INTO estados (estado_id, descripcion) VALUES ('L', 'Libre'),('R', 'Reservado'),('A', 'Atendido');
INSERT INTO medicos (id_externo, nombre, apellido, matricula) VALUES ('pruebaIdExterno', 'pruebaNombre', 'pruebaApellido', 'pruebaMatricula');
INSERT INTO pacientes (id_externo, nombre, apellido, nro_obra_social) VALUES ('pruebaIdExternoPaciente', 'pruebaNombrePAciente', 'pruebaApellidoPaciente', '6025552255');
INSERT into medicos_especialidades (medico_id, especialidad_id) VALUES (1,1);
CALL generar_turnos(2025,5,1,'Miercoles,Jueves', 70000, 100000, 30, 1);
