const { esIdValida } = require("../services/game.service");

function validarId(req, res, next) {
  if (!esIdValida(req.params.id)) {
    return res
      .status(400)
      .json({ error: "Error ID no coincide con ningun de la BBDD" });
  }
  next();
}

module.exports = validarId;
