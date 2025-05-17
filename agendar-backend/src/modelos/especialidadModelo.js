import { pool } from "../db.js";

export async function obtenerEspecialidades() {
    const [filas] = await pool.query("SELECT * FROM especialidades");
    return filas;
}
