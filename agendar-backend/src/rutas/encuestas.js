const express = require("express");
const {
  crearTokenEncuesta,
  validarTokenEncuesta,
  enviarRespuestaEncuesta,
  obtenerPreguntas,
} = require("../controladores/encuestaControlador");

const encuestasRouter = express.Router();

encuestasRouter.post("/generar", crearTokenEncuesta);
encuestasRouter.get("/validar/:token", validarTokenEncuesta);
encuestasRouter.post("/responder/:token", enviarRespuestaEncuesta);
encuestasRouter.get("/preguntas", obtenerPreguntas);

module.exports = encuestasRouter;
