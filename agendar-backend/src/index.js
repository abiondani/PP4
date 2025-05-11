import express from "express";
import dotenv from "dotenv";
import pacientesRouter from "./rutas/pacientes.js";
import { crearBaseDeDatosSiNoExiste } from "./db.js";

dotenv.config();

const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/pacientes", pacientesRouter);

crearBaseDeDatosSiNoExiste();
app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
