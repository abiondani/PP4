const express = require("express");
const {
    getPaciente,
    getPacientePorIdExterno,
    getAllPacientes,
    postPaciente,
    deletePaciente,
    putPaciente,
} = require("../controladores/pacienteControlador.js");

const pacientesRouter = express.Router();

pacientesRouter.get("/:id", getPaciente);
pacientesRouter.get("/externo/:id", getPacientePorIdExterno);
pacientesRouter.get("/", getAllPacientes);
pacientesRouter.post("/", postPaciente);
pacientesRouter.delete("/:id_externo", deletePaciente);
pacientesRouter.put("/:id_externo", putPaciente);

module.exports = pacientesRouter;
