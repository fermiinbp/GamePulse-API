function manejarErrores(err, req, res, next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El body está mal" });
  }
  if (err.type === "ValidationError") {
    const errores = Object.values(err.erros).map((e) => e.message);
    return res.status(400).json({ erro: "Los datos no son validos" });
  }
  if (err.name === "CastError") {
    return req.status(400).json({ error: "Valor no válido" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Valor repetido" });
  }

  console.error("****", err.message);
  return res.status(500).json({ error: "Error de servidor interno" });
}

module.exports = manejarErrores;
