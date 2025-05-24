const { crearTurnos } = require("../modelos/administradorModelo.js");
const { listarTurnos } = require("../modelos/administradorModelo.js");
const { eliminarTurnoPorId } = require("../modelos/administradorModelo.js");
const { modificarTurno } = require("../modelos/administradorModelo.js");

async function postTurnos(req, res) {
    try {
        const turnos = await crearTurnos(req.body);
        if (!turnos) {
            return res.status(404).json({ mensaje: "Turnos no creados" });
        }
        res.json(turnos);
    } catch (error) {
        console.error("Error en postTurnos:", error);
        res.status(500).json({
            error: "Error al crear los turnos",
            detalles: error.message,
        });
    }
}

async function getTurnos(req, res) {
    try {
        const turnos = await listarTurnos();
        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ error: "Error al obtener los turnos" });
    }
}

async function deleteTurno(req, res) {
    try {
        const turnoId = req.params.id;
        await eliminarTurnoPorId(turnoId);
        res.status(200).json({ mensaje: "Turno eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar turno." });
    }
}

async function putTurno(req, res) {
    try {
        const turnoId = req.params.id;
        const datos = req.body;
        await modificarTurno(turnoId, datos);
        res.json({ mensaje: "Turno modificado correctamente" });
    } catch (error) {
        console.error("Error al modificar turno:", error);
        res.status(500).json({ error: "Error al modificar turno." });
    }
}

module.exports = {
    postTurnos,
    getTurnos,
    deleteTurno,
    putTurno,
};
