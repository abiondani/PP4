const express = require("express");
const {
  metricasPorMes,
  metricasPorAnio,
} = require("../controladores/metricasControlador");

const metricasRouter = express.Router();

metricasRouter.get("/mes/:mes", metricasPorMes);
metricasRouter.get("/anio/:anio", metricasPorAnio);

module.exports = metricasRouter;
