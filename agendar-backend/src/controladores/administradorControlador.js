import { crearTurnos } from "../modelos/administradorModelo.js";

export async function postTurnos(req, res) {
  try {
    const turnos = await crearTurnos(req.body);
    if (!turnos) {
      return res.status(404).json({ mensaje: "Turnos no creados" });
    }
    res.json(medico);
  } catch (error) {
    res.status(500).json({ error: "Error al crear los turnos" });
  }
}
