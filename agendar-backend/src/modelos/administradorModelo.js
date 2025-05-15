import { pool } from "../db.js";

export async function crearTurnos(turno) {
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
    [anio, mes, idMedico, dias, hora_inicio, hora_fin, duracion, idConsultorio]
  );
  return resultado;
}
