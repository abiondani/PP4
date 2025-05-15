import express from "express";
import dotenv from "dotenv";
import pacientesRouter from "./rutas/pacientes.js";
import medicosRouter from "./rutas/medicos.js";
import { crearBaseDeDatosSiNoExiste } from "./db.js";

dotenv.config();

const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/pacientes", pacientesRouter);
app.use("/api/medicos", medicosRouter);

crearBaseDeDatosSiNoExiste();
app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
