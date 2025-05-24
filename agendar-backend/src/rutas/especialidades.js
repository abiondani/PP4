const express = require("express");
const {
    getEspecialidad,
} = require("../controladores/especialidadControlador.js");

const especialidadesRouter = express.Router();

especialidadesRouter.get("/", getEspecialidad);

module.exports = especialidadesRouter;
