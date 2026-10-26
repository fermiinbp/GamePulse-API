const mongoose = require("mongoose");

function validarId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "El id no es válido" });
  }
  next();
}

module.exports = validarId;