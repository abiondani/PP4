import express from "express";
import {
  getTurnosPorMedico,
  putReservarTurno,
  putCancelarTurno,
} from "../controladores/turnoControlador.js";

const router = express.Router();

router.get("/disponibles/:medico_id", getTurnosPorMedico);
router.put("/reservar", putReservarTurno);
router.put("/cancelar", putCancelarTurno);

export default router;
//
