import {
    obtenerTurnosDisponiblesPorMedico,
    obtenerTurnosDisponiblesPorEspecialidad,
    reservarTurno,
    bloquearTurno,
    liberarTurno,
    cancelarTurno,
} from "../modelos/turnoModelo.js";

export async function getTurnosPorMedico(req, res) {
    try {
        const turnos = await obtenerTurnosDisponiblesPorMedico(
            req.params.medico_id
        );
        if (turnos.length === 0) {
            return res.status(404).json({
                mensaje: "El médico seleccionado no posee turnos disponibles.",
            });
        }
        res.json(turnos);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener turnos disponibles: " + error.message,
        });
    }
}

export async function getTurnosPorEspecialidad(req, res) {
    try {
        const turnos = await obtenerTurnosDisponiblesPorEspecialidad(
            req.params.especialidad_id
        );
        if (turnos.length === 0) {
            return res.status(404).json({
                mensaje:
                    "La especialidad seleccionada no posee turnos disponibles.",
            });
        }
        res.json(turnos);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener turnos disponibles: " + error.message,
        });
    }
}

export async function putReservarTurno(req, res) {
    const { turno_id, paciente_id } = req.body;
    try {
        await reservarTurno(turno_id, paciente_id);
        res.json({ mensaje: "Turno reservado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function putBloquearTurno(req, res) {
    const { turno_id } = req.body;
    try {
        await bloquearTurno(turno_id);
        res.json({ mensaje: "Turno bloqueado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function putLiberarTurno(req, res) {
    const { turno_id } = req.body;
    try {
        await liberarTurno(turno_id);
        res.json({ mensaje: "Turno liberado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function putCancelarTurno(req, res) {
    const { turno_id } = req.body;
    try {
        await cancelarTurno(turno_id);
        res.json({ mensaje: "Turno cancelado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
