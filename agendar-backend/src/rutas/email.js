const express = require("express");
const router = express.Router();
const {
  enviarNotificacionMasiva,
} = require("../controladores/emailControlador");

router.post("/", enviarNotificacionMasiva);

module.exports = router;
