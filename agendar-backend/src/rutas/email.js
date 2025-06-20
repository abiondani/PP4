const express = require("express");
const router = express.Router();
const { enviarMensaje } = require("../controladores/emailControlador");

router.post("/", enviarMensaje);

module.exports = router;
