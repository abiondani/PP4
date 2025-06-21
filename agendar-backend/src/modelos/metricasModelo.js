const { getPool } = require("../db.js");

const obtenerRespuestasPorMes = async (mes) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM respuestas WHERE MONTH(fecha_respuesta) = ?",
    [mes]
  );
  return rows;
};

const obtenerRespuestasPorAnio = async (anio) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM respuestas WHERE YEAR(fecha_respuesta) = ?",
    [anio]
  );
  return rows;
};

const obtenerPreguntas = async () => {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM preguntas_encuesta");
  return rows;
};

module.exports = {
  obtenerRespuestasPorMes,
  obtenerRespuestasPorAnio,
  obtenerPreguntas,
};
