const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const { sincronizar } = require("../controllers/stats.controller");

const router = Router();

router.post("/sync", autenticar, autorizar("admin"), sincronizar);

module.exports = router;