const express = require("express");
const { registro, login, perfil } = require("../controller/auth.controller");
const autenticar = require("../middleware/autenticar");

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/perfil", autenticar, perfil);

module.exports = router;
