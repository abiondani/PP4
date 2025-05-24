const express = require("express");
const {
    getPaciente,
    postPaciente,
    deletePaciente,
    putPaciente,
} = require("../controladores/pacienteControlador.js");

const pacientesRouter = express.Router();

pacientesRouter.get("/:id", getPaciente);
pacientesRouter.post("/", postPaciente);
pacientesRouter.delete("/:id_externo", deletePaciente);
pacientesRouter.put("/:id_externo", putPaciente);

module.exports = pacientesRouter;
