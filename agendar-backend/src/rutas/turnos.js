import express from "express";
import {
  getTurnosPorMedico,
  getTurnosPorEspecialidad,
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
turnosRouter.get("/ocupados/:paciente_id", getTurnosOcupadosPorPaciente);
turnosRouter.put("/reservar", putReservarTurno);
turnosRouter.put("/bloquear", putBloquearTurno);
turnosRouter.put("/liberar", putLiberarTurno);
turnosRouter.put("/cancelar", putCancelarTurno);

export default turnosRouter;
//
