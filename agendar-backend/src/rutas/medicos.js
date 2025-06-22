const express = require("express");
const {
    getMedico,
    getMedicoPorIdExterno,
    postMedico,
    deleteMedico,
    putMedico,
} = require("../controladores/medicoControlador.js");

const medicosRouter = express.Router();

medicosRouter.get("/:id", getMedico);
medicosRouter.get("/externo/:id", getMedicoPorIdExterno);
medicosRouter.post("/", postMedico);
medicosRouter.delete("/:id", deleteMedico);
medicosRouter.put("/:id", putMedico);

module.exports = medicosRouter;
