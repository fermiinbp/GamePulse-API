const { validationResult } = require("express-validator");

// Se pone después de las reglas de express-validator.
// Si alguna regla ha fallado, corta la petición con un 400 y la lista de errores.
function validarCampos(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: "Los datos no son validos",
      // onlyFirstError: un solo mensaje por campo aunque falle más de una regla
      detalles: errores.array({ onlyFirstError: true }).map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}

module.exports = validarCampos;
