import express from "express";
import { loginUsuario } from "../controladores/loginControlador.js";

const loginRouter = express.Router();

loginRouter.post("/", loginUsuario);

export default loginRouter;
