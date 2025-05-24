const { getPool } = require("../db.js");

async function crearTurnos(turno) {
    const pool = getPool();
    const {
        anio,
        mes,
        idMedico,
        dias,
        hora_inicio,
        hora_fin,
        duracion,
        idConsultorio,
    } = turno;
    const [resultado] = await pool.query(
        "CALL generar_turnos(?, ?, ?, ?, ?, ?, ?, ?);",
        [
            anio,
            mes,
            idMedico,
            dias,
            hora_inicio,
            hora_fin,
            duracion,
            idConsultorio,
        ]
    );
    return resultado;
}

async function listarTurnos() {
    const pool = getPool();
    const [resultado] = await pool.query(`
    SELECT 
      t.turno_id,
      CONCAT(m.nombre, ' ', m.apellido) AS medico,
      e.descripcion AS especialidad,
      t.fecha,
      t.duracion,
      c.descripcion AS consultorio,
      es.descripcion AS estado
    FROM turnos t
    JOIN medicos m ON t.medico_id = m.medico_id
    JOIN especialidades e ON t.especialidad_id = e.especialidad_id
    JOIN consultorios c ON t.consultorio_id = c.consultorio_id
    JOIN estados es ON t.estado_id = es.estado_id
    ORDER BY t.fecha ASC
  `);
    return resultado;
}

async function eliminarTurnoPorId(turnoId) {
    const pool = getPool();
    const [resultado] = await pool.query("CALL eliminar_turno(?)", [turnoId]);
    return resultado;
}

async function modificarTurno(turnoId, datos) {
    const pool = getPool();
    const { fecha, duracion, estado_id } = datos;

    const [resultado] = await pool.query("CALL modificar_turno(?, ?, ?, ?)", [
        turnoId,
        fecha,
        duracion,
        estado_id,
    ]);

    return resultado;
}

module.exports = {
    crearTurnos,
    listarTurnos,
    eliminarTurnoPorId,
    modificarTurno,
};
