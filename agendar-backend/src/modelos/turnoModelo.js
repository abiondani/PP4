const { getPool } = require("../db.js");

async function obtenerTurnosDisponiblesPorMedico(medico_id) {
  const pool = getPool();
  const [filas] = await pool.query(
    `SELECT * FROM turnos 
     WHERE medico_id = ? AND estado_id = 'L'`,
    [medico_id]
  );
  return filas;
}

async function obtenerTurnosPorFecha() {
  const pool = getPool();
  const estado = "R";
  const [filas] = await pool.query(
    `SELECT turno_id, paciente_id FROM turnos    
     WHERE DATE(fecha) = DATE(now())+3 AND estado_id = ?`,
    [estado]
  );
  return filas;
}

async function obtenerTurnosOcupadosPorPaciente(paciente_id) {
  const pool = getPool();
  const [filas] = await pool.query(
    `SELECT * FROM turnos 
     WHERE paciente_id = ?`,
    [paciente_id]
  );
  return filas;
}

async function obtenerTurnosDisponiblesPorEspecialidad(especialidad_id) {
  const pool = getPool();
  const [filas] = await pool.query(
    `SELECT m.*, t.*
  FROM turnos as t
 INNER
  JOIN medicos as m
    ON m.medico_id = t.medico_id
 WHERE t.especialidad_id = ?
   AND t.estado_id = 'L'
   AND t.fecha >= NOW()
   AND DATE(fecha) =
   (
    	SELECT MIN(DATE(fecha))
       FROM turnos as t2
      WHERE t2.especialidad_id = t.especialidad_id
        AND t2.estado_id = 'L'
        AND t2.fecha >= NOW()
   )
ORDER
   BY t.fecha
	, m.apellido
`,
    [especialidad_id]
  );
  return filas;
}

async function obtenerTurnosDisponiblesPorEspecialidadYFecha(
  especialidad_id,
  fecha
) {
  const pool = getPool();
  const [filas] = await pool.query(
    `SELECT m.*, t.*
  FROM turnos as t
 INNER
  JOIN medicos as m
    ON m.medico_id = t.medico_id
 WHERE t.especialidad_id = ?
   AND t.estado_id = 'L'
   AND t.fecha >= NOW()
   AND DATE(fecha) = ?   
ORDER
   BY t.fecha
	, m.apellido
`,
    [especialidad_id, fecha]
  );
  return filas;
}

async function reservarTurno(turno_id, paciente_id) {
  const pool = getPool();
  const [resultado] = await pool.query(
    `UPDATE turnos 
     SET paciente_id = ?, estado_id = 'R', fecha_estado = NOW()
     WHERE turno_id = ? AND estado_id = 'B'`,
    [paciente_id, turno_id]
  );
  if (resultado.affectedRows === 0) {
    throw new Error("El turno ya está reservado o no existe");
  }
}

async function bloquearTurno(turno_id) {
  const pool = getPool();
  const [resultado] = await pool.query(
    `UPDATE turnos 
     SET estado_id = 'B', fecha_estado = NOW()
     WHERE turno_id = ? AND estado_id = 'L'`,
    [turno_id]
  );
  if (resultado.affectedRows === 0) {
    throw new Error("No se pudo bloquear el turno");
  }
}

async function liberarTurno(turno_id) {
  const pool = getPool();
  const [resultado] = await pool.query(
    `UPDATE turnos 
     SET estado_id = 'L', fecha_estado = NOW()
     WHERE turno_id = ? AND estado_id = 'B'`,
    [turno_id]
  );
  if (resultado.affectedRows === 0) {
    throw new Error("No se pudo liberar el turno");
  }
}

async function cancelarTurno(turno_id) {
  const pool = getPool();
  const [resultado] = await pool.query(
    `UPDATE turnos 
     SET paciente_id = NULL, estado_id = 'L', fecha_estado = NOW()
     WHERE turno_id = ? AND estado_id = 'R'`,
    [turno_id]
  );
  if (resultado.affectedRows === 0) {
    throw new Error(
      "No se puede cancelar el turno (no  es tuyo o ya fue atendido)"
    );
  }
}

async function obtenerTurnoPorID(turno_id) {
  const pool = getPool();
  const [filas] = await pool.query(
    `SELECT * FROM turnos 
     WHERE turno_id = ?`,
    [turno_id]
  );
  return filas[0];
}

module.exports = {
  obtenerTurnosDisponiblesPorMedico,
  obtenerTurnosOcupadosPorPaciente,
  obtenerTurnosDisponiblesPorEspecialidad,
  obtenerTurnosDisponiblesPorEspecialidadYFecha,
  reservarTurno,
  bloquearTurno,
  liberarTurno,
  cancelarTurno,
  obtenerTurnoPorID,
  obtenerTurnosPorFecha,
};
