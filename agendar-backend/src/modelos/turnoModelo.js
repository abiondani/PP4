import { pool } from "../db.js";

export async function obtenerTurnosDisponiblesPorMedico(medico_id) {
  const [filas] = await pool.query(
    `SELECT * FROM turnos 
     WHERE medico_id = ? AND estado_id = 'L'`,
    [medico_id]
  );
  return filas;
}

export async function reservarTurno(turno_id, paciente_id) {
  const [resultado] = await pool.query(
    `UPDATE turnos 
     SET paciente_id = ?, estado_id = 'R', fecha_estado = NOW()
     WHERE turno_id = ? AND estado_id = 'L'`,
    [paciente_id, turno_id]
  );
  if (resultado.affectedRows === 0) {
    throw new Error("El turno ya está reservado o no existe");
  }
}

export async function cancelarTurno(turno_id, paciente_id) {
  const [resultado] = await pool.query(
    `UPDATE turnos 
     SET paciente_id = NULL, estado_id = 'L', fecha_estado = NOW()
     WHERE turno_id = ? AND paciente_id = ? AND estado_id = 'R'`,
    [turno_id, paciente_id]
  );
  if (resultado.affectedRows === 0) {
    throw new Error(
      "No se puede cancelar el turno (no es tuyo o ya fue atendido)"
    );
  }
}
