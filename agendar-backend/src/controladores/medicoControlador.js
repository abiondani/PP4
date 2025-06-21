const {
  obtenerMedicoPorId,
  obtenerMedicoPorIdExterno,
  crearMedico,
  actualizarMedicoPorIdExterno,
  eliminarMedicoPorIdExterno,
} = require("../modelos/medicoModelo.js");

async function getMedico(req, res) {
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

async function getMedicoPorIdExterno(req, res) {
  try {
    const medico = await obtenerMedicoPorIdExterno(req.params.id);
    if (!medico) {
      return res.status(404).json({ mensaje: "Médico no encontrado" });
    }
    res.json(medico);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener médico" });
  }
}

async function postMedico(req, res) {
  try {
    const nuevoId = await crearMedico(req.body);
    res.status(201).json({ mensaje: "Médico creado", id: nuevoId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear médico" });
  }
}

async function deleteMedico(req, res) {
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

async function putMedico(req, res) {
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

module.exports = {
  getMedico,
  getMedicoPorIdExterno,
  postMedico,
  deleteMedico,
  putMedico,
};
