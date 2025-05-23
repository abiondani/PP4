import express from "express";
import {
  getTurnosPorMedico,
  getTurnosPorEspecialidad,
  getTurnosPorEspecialidadYFecha,
  getTurnosOcupadosPorPaciente,
  putReservarTurno,
  putBloquearTurno,
  putLiberarTurno,
  putCancelarTurno,
} from "../controladores/turnoControlador.js";

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

export default turnosRouter;
//
