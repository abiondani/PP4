const express = require("express");
const {
  getTurnosPorMedico,
  getTurnosPorEspecialidad,
  getTurnosPorEspecialidadYFecha,
  getTurnosOcupadosPorPaciente,
  putReservarTurno,
  putBloquearTurno,
  putLiberarTurno,
  putCancelarTurno,
  getTurnosDeHoy,
  cambiarEstado,
} = require("../controladores/turnoControlador.js");

const turnosRouter = express.Router();

turnosRouter.get("/disponibles/:medico_id", getTurnosPorMedico);
turnosRouter.get(
  "/disponiblesPorEspecialidad/:especialidad_id",
  getTurnosPorEspecialidad
);
turnosRouter.post(
  "/disponiblesPorEspecialidadYFecha",
  getTurnosPorEspecialidadYFecha
);
turnosRouter.get("/ocupados/:paciente_id", getTurnosOcupadosPorPaciente);
turnosRouter.put("/reservar", putReservarTurno);
turnosRouter.put("/bloquear", putBloquearTurno);
turnosRouter.put("/liberar", putLiberarTurno);
turnosRouter.put("/cancelar", putCancelarTurno);
turnosRouter.get(
  "/disponiblesPorFecha/:especialidad_id",
  getTurnosPorEspecialidadYFecha
);
turnosRouter.get("/hoy/:medico_id", getTurnosDeHoy);
turnosRouter.put("/:turno_id/estado", cambiarEstado);
module.exports = turnosRouter;
