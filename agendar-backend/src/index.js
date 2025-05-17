import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pacientesRouter from "./rutas/pacientes.js";
import medicosRouter from "./rutas/medicos.js";
import administradoresRouter from "./rutas/administrador.js";
import turnosRouter from "./rutas/turnos.js";
import especialidadesRouter from "./rutas/especialidades.js";
import { crearBaseDeDatosSiNoExiste } from "./db.js";
import loginRouter from "./rutas/login.js";

dotenv.config();

const app = express();
const puerto = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/pacientes", pacientesRouter);
app.use("/api/medicos", medicosRouter);
app.use("/administradores", administradoresRouter);
app.use("/api/turnos", turnosRouter);
app.use("/api/especialidades", especialidadesRouter);
app.use("/api/login", loginRouter);

crearBaseDeDatosSiNoExiste();
app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
