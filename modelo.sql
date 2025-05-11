DROP DATABASE IF EXISTS agendar;
CREATE DATABASE agendar;
USE agendar;

CREATE TABLE pacientes (
    paciente_id		INT AUTO_INCREMENT PRIMARY KEY,
    id_externo 		VARCHAR(100),
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

