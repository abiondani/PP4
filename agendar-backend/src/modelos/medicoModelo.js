const { getPool } = require("../db.js");

async function obtenerMedicoPorId(id) {
  const pool = getPool();
  const [filas] = await pool.query(
    "SELECT * FROM medicos WHERE medico_id = ?",
    [id]
  );
  return filas[0];
}

async function obtenerMedicoPorIdExterno(id) {
  const pool = getPool();
  const [filas] = await pool.query(
    "SELECT medico_id as id, nombre FROM medicos WHERE id_externo = ?",
    [id]
  );
  return filas[0];
}

async function crearMedico(medico) {
  const pool = getPool();
  const { idExterno, nombre, apellido, matricula } = medico;
  const [resultado] = await pool.query(
    `INSERT INTO medicos 
     (id_externo, nombre, apellido, matricula) 
     VALUES (?, ?, ?, ?)`,
    [idExterno, nombre, apellido, matricula]
  );
  return resultado.insertId;
}

async function eliminarMedicoPorIdExterno(idExterno) {
  const pool = getPool();
  const [resultado] = await pool.query(
    "DELETE FROM medicos WHERE id_externo = ?",
    [idExterno]
  );
  return resultado.affectedRows;
}

async function actualizarMedicoPorIdExterno(idExterno, datos) {
  const pool = getPool();
  const { nombre, apellido, matricula } = datos;
  const [resultado] = await pool.query(
    `UPDATE medicos 
     SET nombre = ?, apellido = ?, matricula = ? 
     WHERE id_externo = ?`,
    [nombre, apellido, matricula, idExterno]
  );
  return resultado.affectedRows;
}

module.exports = {
  obtenerMedicoPorId,
  crearMedico,
  eliminarMedicoPorIdExterno,
  actualizarMedicoPorIdExterno,
  obtenerMedicoPorIdExterno,
};
