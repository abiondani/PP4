const express = require("express");
const { postTurnos } = require("../controladores/administradorControlador.js");
const { getTurnos } = require("../controladores/administradorControlador.js");
const { deleteTurno } = require("../controladores/administradorControlador.js");
const { putTurno } = require("../controladores/administradorControlador.js");

const administradoresRouter = express.Router();

administradoresRouter.post("/", postTurnos);
administradoresRouter.get("/turnos", getTurnos);
administradoresRouter.delete("/turnos/:id", deleteTurno);
administradoresRouter.put("/turnos/:id", putTurno);

module.exports = administradoresRouter;
