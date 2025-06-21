const express = require("express");
const router = express.Router();
const { getToken, login } = require("../controllers/authController");

router.post("/token", getToken);
router.post("/login", login);

module.exports = router;
