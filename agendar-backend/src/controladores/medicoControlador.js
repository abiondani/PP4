import {
  obtenerMedicoPorId,
  crearMedico,
  actualizarMedicoPorIdExterno,
  eliminarMedicoPorIdExterno,
} from "../modelos/medicoModelo.js";

export async function getMedico(req, res) {
  try {
    const medico = await obtenerMedicoPorId(req.params.id);
    if (!medico) {
      return res.status(404).json({ mensaje: "Médico no encontrado" });
    }
    res.json(medico);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener médico" });
  }
}

export async function postMedico(req, res) {
  try {
    const nuevoId = await crearMedico(req.body);
    res.status(201).json({ mensaje: "Médico creado", id: nuevoId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear médico" });
  }
}

export async function deleteMedico(req, res) {
  try {
    const filasAfectadas = await eliminarMedicoPorIdExterno(req.params.id);
    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: "Médico no encontrado" });
    }
    res.json({ mensaje: "Médico eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar médico" });
  }
}

export async function putMedico(req, res) {
  try {
    const filasAfectadas = await actualizarMedicoPorIdExterno(
      req.params.id,
      req.body
    );
    if (filasAfectadas === 0) {
      return res.status(404).json({ mensaje: "Médico no encontrado" });
    }
    res.json({ mensaje: "Médico actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar médico" });
  }
}
