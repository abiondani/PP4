const { getPool } = require("../db.js");

const generarTokenEncuesta = async (token) => {
  const pool = getPool();
  await pool.query("INSERT INTO token_encuestas (token) VALUES (?)", [token]);
};

const obtenerTokenEncuesta = async (token) => {
  const pool = getPool();
  const [filas] = await pool.query(
    "SELECT * FROM token_encuestas WHERE token = ?",
    [token]
  );
  return filas[0];
};

const guardarRespuestaEncuesta = async (token, respuestas) => {
  const pool = getPool();
  const {
    respuesta1,
    respuesta2,
    respuesta3,
    respuesta4,
    respuesta5,
    respuesta6,
  } = respuestas;
  await pool.query(
    `INSERT INTO respuestas (token, respuesta1, respuesta2, respuesta3, respuesta4, respuesta5, respuesta6, fecha_respuesta)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      token,
      respuesta1,
      respuesta2,
      respuesta3,
      respuesta4,
      respuesta5,
      respuesta6,
    ]
  );
  await pool.query("UPDATE token_encuestas SET usado = TRUE WHERE token = ?", [
    token,
  ]);
};

const obtenerPreguntasEncuesta = async () => {
  const pool = getPool();
  const [filas] = await pool.query("SELECT * FROM preguntas_encuesta");
  return filas;
};

module.exports = {
  generarTokenEncuesta,
  obtenerTokenEncuesta,
  guardarRespuestaEncuesta,
  obtenerPreguntasEncuesta,
};
