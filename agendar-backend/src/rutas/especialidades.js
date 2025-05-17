import express from "express";
import { getEspecialidad } from "../controladores/especialidadControlador.js";

const especialidadesRouter = express.Router();

especialidadesRouter.get("/", getEspecialidad);

export default especialidadesRouter;
