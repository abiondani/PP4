const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pacientesRouter = require("./rutas/pacientes.js");
const medicosRouter = require("./rutas/medicos.js");
const administradoresRouter = require("./rutas/administrador.js");
const turnosRouter = require("./rutas/turnos.js");
const especialidadesRouter = require("./rutas/especialidades.js");
const { crearBaseDeDatosSiNoExiste } = require("./db.js");
const emailRouter = require("./rutas/email");
const encuestasRouter = require("./rutas/encuestas.js");
const metricasRouter = require("./rutas/metricas.js");
require("./cron/recordatorios.js");

dotenv.config();

const app = express();
const host = process.env.BE_HOST;
const puerto = process.env.BE_PORT;
app.use(cors());
app.use(express.json());
app.use("/api/pacientes", pacientesRouter);
app.use("/api/medicos", medicosRouter);
app.use("/api/administradores", administradoresRouter);
app.use("/api/turnos", turnosRouter);
app.use("/api/especialidades", especialidadesRouter);
app.use("/api/notificaciones", emailRouter);
app.use("/api/encuestas", encuestasRouter);
app.use("/api/metricas", metricasRouter);

crearBaseDeDatosSiNoExiste();
module.exports = app;

if (process.env.NODE_ENV !== "test") {
  app.listen(puerto, () => {
    console.log(`Servidor escuchando en ${host}:${puerto}`);
  });
}
