function manejarErrores(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El body está mal" });
  }
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Los datos no son validos", detalles: errores });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Valor no válido" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Valor repetido" });
  }

  // Errores con status 4xx (por ejemplo, los que lanza express) se devuelven tal cual
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error("****", err.message);
  return res.status(500).json({ error: "Error de servidor interno" });
}

module.exports = manejarErrores;
