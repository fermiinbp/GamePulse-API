const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const { sincronizar } = require("../controllers/stats.controller");

const router = Router();

router.post("/sync", autenticar, autorizar("ADMIN"), sincronizar);

module.exports = router;