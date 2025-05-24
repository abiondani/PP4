const express = require("express");
const { loginUsuario } = require("../controladores/loginControlador.js");

const loginRouter = express.Router();

loginRouter.post("/", loginUsuario);

module.exports = loginRouter;
