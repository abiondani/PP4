import { pool } from "../db.js";

export async function verificarCredenciales(usuario, contrasena) {
  const [filas] = await pool.query(
    "SELECT id, usuario, nombre, apellido, email, rol FROM usuarios WHERE usuario = ? AND contrasena = ?",
    [usuario, contrasena]
  );

  if (filas.length === 0) return null;

  return filas[0];
}
