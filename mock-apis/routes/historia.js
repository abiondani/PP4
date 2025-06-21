const express = require("express");
const router = express.Router();
const { getHistoria } = require("../controllers/historiaController");

router.post("/", getHistoria);

module.exports = router;
