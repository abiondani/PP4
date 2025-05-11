import { pool } from "../db.js";

export async function obtenerPacientePorId(id) {
    const [filas] = await pool.query(
        "SELECT * FROM pacientes WHERE paciente_id = ?",
        [id]
    );
    return filas[0];
}

export async function crearPaciente(paciente) {
    const { id_externo, nombre, apellido, nro_obra_social, correo } = paciente;
    const [resultado] = await pool.query(
        `INSERT INTO pacientes 
     (id_externo, nombre, apellido, nro_obra_social, correo) 
     VALUES (?, ?, ?, ?, ?)`,
        [id_externo, nombre, apellido, nro_obra_social, correo]
    );
    return resultado.insertId;
}

export async function eliminarPacientePorIdExterno(idExterno) {
    const [resultado] = await pool.query(
        "DELETE FROM pacientes WHERE id_externo = ?",
        [idExterno]
    );
    return resultado.affectedRows;
}

export async function actualizarPacientePorIdExterno(idExterno, datos) {
    const { nombre, apellido, nro_obra_social, correo } = datos;
    const [resultado] = await pool.query(
        `UPDATE pacientes 
     SET nombre = ?, apellido = ?, nro_obra_social = ?, correo = ? 
     WHERE id_externo = ?`,
        [nombre, apellido, nro_obra_social, correo, idExterno]
    );
    return resultado.affectedRows;
}
