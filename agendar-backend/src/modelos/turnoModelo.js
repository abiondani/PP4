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

const obtenerTurnosDelDiaPorIdMedico = async (medico_id) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT 
      t.turno_id,
      t.fecha,
      t.duracion,
      t.estado_id,
      e.descripcion AS estado,
      p.nombre AS paciente_nombre,
      p.id_externo AS id_externo_paciente,
      TIME(t.fecha) AS hora
    FROM turnos t
    JOIN pacientes p ON t.paciente_id = p.paciente_id
    JOIN estados e ON t.estado_id = e.estado_id
    WHERE DATE(t.fecha) = CURDATE()
      AND t.medico_id = ?
      AND t.estado_id = 'R'
      AND NOW() < ADDTIME(t.fecha, SEC_TO_TIME(t.duracion * 60))
    ORDER BY t.fecha`,
    [medico_id]
  );
  return rows;
};

async function obtenerTurnosPorFecha() {
  const pool = getPool();
  const estado = "R";
  const [filas] = await pool.query(
    `SELECT turno_id, paciente_id FROM turnos    
     WHERE DATE(fecha) = DATE(now())+1 AND estado_id = ?`,
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

const actualizarEstadoTurno = async (turno_id, estado_id) => {
  const pool = getPool();
  const [result] = await pool.query(
    `UPDATE turnos 
     SET estado_id = ?, fecha_estado = NOW()
     WHERE turno_id = ?`,
    [estado_id, turno_id]
  );
  return result;
};

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
  obtenerTurnosDelDiaPorIdMedico,
  reservarTurno,
  bloquearTurno,
  liberarTurno,
  cancelarTurno,
  obtenerTurnoPorID,
  obtenerTurnosPorFecha,
  actualizarEstadoTurno,
};
