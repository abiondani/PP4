import { crearTurnos } from "../modelos/administradorModelo.js";
import { listarTurnos } from "../modelos/administradorModelo.js";

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
