import express from "express";
import {
  getPaciente,
  postPaciente,
  deletePaciente,
  putPaciente,
} from "../controladores/pacienteControlador.js";

const pacientesRouter = express.Router();

pacientesRouter.get("/:id", getPaciente);
pacientesRouter.post("/", postPaciente);
pacientesRouter.delete("/:id_externo", deletePaciente);
pacientesRouter.put("/:id_externo", putPaciente);

export default pacientesRouter;
