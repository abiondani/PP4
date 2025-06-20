const { getPool } = require("../db.js");

async function obtenerPacientePorId(id) {
  const pool = getPool();
  const [filas] = await pool.query(
    "SELECT * FROM pacientes WHERE paciente_id = ?",
    [id]
  );
  return filas[0];
}

async function obtenerTodosLosPacientes() {
  const pool = getPool();
  const [filas] = await pool.query("SELECT correo FROM pacientes");
  return filas;
}

async function crearPaciente(paciente) {
  const pool = getPool();
  const { id_externo, nombre, apellido, nro_obra_social, correo } = paciente;
  const [resultado] = await pool.query(
    `INSERT INTO pacientes 
     (id_externo, nombre, apellido, nro_obra_social, correo) 
     VALUES (?, ?, ?, ?, ?)`,
    [id_externo, nombre, apellido, nro_obra_social, correo]
  );
  return resultado.insertId;
}

async function eliminarPacientePorIdExterno(idExterno) {
  const pool = getPool();
  const [resultado] = await pool.query(
    "DELETE FROM pacientes WHERE id_externo = ?",
    [idExterno]
  );
  return resultado.affectedRows;
}

async function actualizarPacientePorIdExterno(idExterno, datos) {
  const pool = getPool();
  const { nombre, apellido, nro_obra_social, correo } = datos;
  const [resultado] = await pool.query(
    `UPDATE pacientes 
     SET nombre = ?, apellido = ?, nro_obra_social = ?, correo = ? 
     WHERE id_externo = ?`,
    [nombre, apellido, nro_obra_social, correo, idExterno]
  );
  return resultado.affectedRows;
}

module.exports = {
  obtenerPacientePorId,
  obtenerTodosLosPacientes,
  crearPaciente,
  eliminarPacientePorIdExterno,
  actualizarPacientePorIdExterno,
};
