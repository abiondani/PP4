const { getPool } = require("../db.js");

async function obtenerEspecialidades() {
    const pool = getPool();
    const [filas] = await pool.query("SELECT * FROM especialidades");
    return filas;
}

module.exports = {
    obtenerEspecialidades,
};
