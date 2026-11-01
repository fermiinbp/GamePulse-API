const { validationResult } = require("express-validator");

function validarCampos(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: "Los datos no son validos",
      detalles: errores.array({ onlyFirstError: true }).map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}

module.exports = validarCampos;
