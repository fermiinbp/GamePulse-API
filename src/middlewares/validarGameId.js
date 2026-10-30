const mongoose = require("mongoose");

function validarGameId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.gameId)) {
    return res.status(400).json({
      error: "El ID del juego no es válido",
    });
  }

  next();
}

module.exports = validarGameId;
