import express from "express";
import { postTurnos } from "../controladores/administradorControlador.js";

const administradoresRouter = express.Router();

administradoresRouter.post("/", postTurnos);

export default administradoresRouter;
