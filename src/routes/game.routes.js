const { Router } = require("express");
const validarId = require("../middlewares/validarId");
const { listar, obtener, crear, actualizar, eliminar } = require("../controllers/game.controller");

const router = Router();

router.get("/", listar);
router.get("/:id", validarId, obtener);

router.post("/", crear);
router.patch("/:id", validarId, actualizar);
router.delete("/:id", validarId, eliminar);

module.exports = router;