const { Router } = require("express");
const {
  listar,
  listarMias,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
} = require("../controllers/gamelist.controller");
const router = Router();
const autenticar = require("../middlewares/autenticar");
const validarId = require("../middlewares/validarId");
const autorizar = require("../middlewares/autorizar");

router.get("/", listar);
router.get("/mine", autenticar, listarMias);
router.get("/:id", buscarPorId);

router.post("/", autenticar, crearGameList);
router.patch("/:id", autenticar, autorizar("ADMIN"), validarId, actualizar);
router.delete("/:id", autenticar, autorizar("ADMIN"), validarId, eliminar);

module.exports = router;
