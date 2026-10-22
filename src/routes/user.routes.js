const express = require("express");
const { obtener } = require("../controller/user.controller");
const router = express.Router();

router.get("", obtener);

module.exports = router;
