const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validarId = require("../middlewares/validarId");
const { listar, crear, actualizar, eliminar, estadisticas } = require("../controllers/review.controller");

const router = Router();

router.get("/", listar);
router.get("/stats", autenticar, autorizar("ANALYST", "ADMIN"), estadisticas);

router.post("/", autenticar, autorizar("USER", "ADMIN"), crear);
router.put("/:id", autenticar, autorizar("USER", "ADMIN"), validarId, actualizar);
router.delete("/:id", autenticar, autorizar("USER", "ADMIN"), validarId, eliminar);

module.exports = router;