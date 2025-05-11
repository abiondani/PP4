import express from "express";
import {
    getPaciente,
    postPaciente,
    deletePaciente,
    putPaciente,
} from "../controladores/pacienteControlador.js";

const router = express.Router();

router.get("/:id", getPaciente);
router.post("/", postPaciente);
router.delete("/:id_externo", deletePaciente);
router.put("/:id_externo", putPaciente);

export default router;
