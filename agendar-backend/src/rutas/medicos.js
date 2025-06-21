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
medicosRouter.post("/", postMedico);
medicosRouter.delete("/:id", deleteMedico);
medicosRouter.put("/:id", putMedico);
medicosRouter.get("/externo/:id", getMedicoPorIdExterno);

module.exports = medicosRouter;
