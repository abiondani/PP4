import express from "express";
import {
    getTurnosPorMedico,
    getTurnosPorEspecialidad,
    putReservarTurno,
    putCancelarTurno,
} from "../controladores/turnoControlador.js";

const turnosRouter = express.Router();

turnosRouter.get("/disponibles/:medico_id", getTurnosPorMedico);
turnosRouter.get(
    "/disponiblesPorEspecialidad/:especialidad_id",
    getTurnosPorEspecialidad
);
turnosRouter.put("/reservar", putReservarTurno);
turnosRouter.put("/cancelar", putCancelarTurno);

export default turnosRouter;
//
