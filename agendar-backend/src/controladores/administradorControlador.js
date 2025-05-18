import { crearTurnos } from "../modelos/administradorModelo.js";
import { listarTurnos } from "../modelos/administradorModelo.js";
import { eliminarTurnoPorId } from "../modelos/administradorModelo.js";

export async function postTurnos(req, res) {
  try {
    const turnos = await crearTurnos(req.body);
    if (!turnos) {
      return res.status(404).json({ mensaje: "Turnos no creados" });
    }
    res.json(turnos);
  } catch (error) {
    console.error("Error en postTurnos:", error);
    res
      .status(500)
      .json({ error: "Error al crear los turnos", detalles: error.message });
  }
}

export async function getTurnos(req, res) {
  try {
    const turnos = await listarTurnos();
    res.json(turnos);
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
}

export async function deleteTurno(req, res) {
  try {
    const turnoId = req.params.id;
    await eliminarTurnoPorId(turnoId);
    res.status(200).json({ mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar turno." });
  }
}
