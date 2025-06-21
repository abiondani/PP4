const {
  obtenerTurnosDisponiblesPorMedico,
  obtenerTurnosDisponiblesPorEspecialidad,
  obtenerTurnosDisponiblesPorEspecialidadYFecha,
  obtenerTurnosOcupadosPorPaciente,
  obtenerTurnosDelDiaPorIdMedico,
  reservarTurno,
  bloquearTurno,
  liberarTurno,
  cancelarTurno,
  actualizarEstadoTurno,
} = require("../modelos/turnoModelo.js");
const {
  enviarCancelacion,
  enviarConfirmacion,
  enviarEncuesta,
} = require("../controladores/emailControlador.js");
const {
  crearTokenEncuesta,
} = require("../controladores/encuestaControlador.js");

async function getTurnosPorMedico(req, res) {
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

async function getTurnosOcupadosPorPaciente(req, res) {
  try {
    const turnos = await obtenerTurnosOcupadosPorPaciente(
      req.params.paciente_id
    );
    if (turnos.length === 0) {
      return res.status(404).json({
        mensaje: "El paciente seleccionado no posee turnos ocupados.",
      });
    }
    res.json(turnos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener turnos ocupados: " + error.message,
    });
  }
}

async function getTurnosPorEspecialidad(req, res) {
  try {
    const turnos = await obtenerTurnosDisponiblesPorEspecialidad(
      req.params.especialidad_id
    );
    if (turnos.length === 0) {
      return res.status(404).json({
        mensaje: "La especialidad seleccionada no posee turnos disponibles.",
      });
    }
    res.json(turnos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener turnos disponibles: " + error.message,
    });
  }
}

async function getTurnosPorEspecialidadYFecha(req, res) {
  try {
    const { especialidad_id, fecha } = req.body;
    const turnos = await obtenerTurnosDisponiblesPorEspecialidadYFecha(
      especialidad_id,
      fecha
    );
    if (turnos.length === 0) {
      return res.status(404).json({
        mensaje:
          "La especialidad seleccionada no posee turnos disponibles para ese día.",
      });
    }
    res.json(turnos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener turnos disponibles: " + error.message,
    });
  }
}

async function putReservarTurno(req, res) {
  const { turno_id, paciente_id } = req.body;
  try {
    await reservarTurno(turno_id, paciente_id);
    enviarConfirmacion(turno_id, paciente_id);
    res.json({ mensaje: "Turno reservado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function putBloquearTurno(req, res) {
  const { turno_id } = req.body;
  try {
    await bloquearTurno(turno_id);
    res.json({ mensaje: "Turno bloqueado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function putLiberarTurno(req, res) {
  const { turno_id } = req.body;
  try {
    await liberarTurno(turno_id);
    res.json({ mensaje: "Turno liberado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function putCancelarTurno(req, res) {
  const { turno_id, paciente_id } = req.body;
  try {
    await cancelarTurno(turno_id);
    enviarCancelacion(turno_id, paciente_id);
    res.json({ mensaje: "Turno cancelado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getTurnosDeHoy = async (req, res) => {
  const medico_id = req.params.medico_id;
  try {
    const turnos = await obtenerTurnosDelDiaPorIdMedico(medico_id);
    res.json(turnos);
  } catch (error) {
    console.error("Error al obtener turnos:", error.message);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

const cambiarEstado = async (req, res) => {
  const turno_id = req.params.turno_id;
  const { estado_id } = req.body;

  if (!["A", "U"].includes(estado_id)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  try {
    await actualizarEstadoTurno(turno_id, estado_id);
    if (estado_id === "A") {
      const token = await crearTokenEncuesta();
      enviarEncuesta(turno_id, token);
    }
    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar estado:", error.message);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};

module.exports = {
  getTurnosPorMedico,
  getTurnosOcupadosPorPaciente,
  getTurnosPorEspecialidad,
  getTurnosPorEspecialidadYFecha,
  getTurnosDeHoy,
  putReservarTurno,
  putBloquearTurno,
  putLiberarTurno,
  putCancelarTurno,
  cambiarEstado,
};
