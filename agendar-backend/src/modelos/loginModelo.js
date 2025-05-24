const { getPool } = require("../db.js");

async function verificarCredenciales(usuario, contrasena) {
    const pool = getPool();
    const [filas] = await pool.query(
        "SELECT id, usuario, nombre, apellido, email, rol FROM usuarios WHERE usuario = ? AND contrasena = ?",
        [usuario, contrasena]
    );

    if (filas.length === 0) return null;

    return filas[0];
}

module.exports = {
    verificarCredenciales,
};
