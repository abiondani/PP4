import { pool } from "../db.js";

export async function obtenerMedicoPorId(id) {
  const [filas] = await pool.query(
    "SELECT * FROM medicos WHERE medico_id = ?",
    [id]
  );
  return filas[0];
}

export async function crearMedico(medico) {
  const { idExterno, nombre, apellido, matricula } = medico;
  const [resultado] = await pool.query(
    `INSERT INTO medicos 
     (id_externo, nombre, apellido, matricula) 
     VALUES (?, ?, ?, ?)`,
    [idExterno, nombre, apellido, matricula]
  );
  return resultado.insertId;
}

export async function eliminarMedicoPorIdExterno(idExterno) {
  const [resultado] = await pool.query(
    "DELETE FROM medicos WHERE id_externo = ?",
    [idExterno]
  );
  return resultado.affectedRows;
}

export async function actualizarMedicoPorIdExterno(idExterno, datos) {
  const { nombre, apellido, matricula } = datos;
  const [resultado] = await pool.query(
    `UPDATE medicos 
     SET nombre = ?, apellido = ?, matricula = ? 
     WHERE id_externo = ?`,
    [nombre, apellido, matricula, idExterno]
  );
  return resultado.affectedRows;
}
