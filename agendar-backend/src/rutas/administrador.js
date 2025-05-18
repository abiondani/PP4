import express from "express";
import { postTurnos } from "../controladores/administradorControlador.js";
import { getTurnos } from "../controladores/administradorControlador.js";
import { deleteTurno } from "../controladores/administradorControlador.js";

const administradoresRouter = express.Router();

administradoresRouter.post("/", postTurnos);
administradoresRouter.get("/turnos", getTurnos);
administradoresRouter.delete("/turnos/:id", deleteTurno);

export default administradoresRouter;
