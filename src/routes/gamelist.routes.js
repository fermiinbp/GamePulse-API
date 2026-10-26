const { Router } = require("express");
const {
  listar,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
} = require("../controllers/gamelist.controller");
const router = Router();
const autenticar = require("../middlewares/autenticar");
const validarId = require("../middlewares/validarId");

router.get("", listar);
router.get("/:id", buscarPorId);
router.post("/:id/gamelist", autenticar, validarId, crearGameList);

module.exports = router;
