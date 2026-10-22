function manejarErrores(err, req, res, next) {
  if(err.type === "entity.parse.failed")
    return res.status(400).json({error: "El body esta mal"})
  if(err.name === "ValidationError"){
    const errores = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({error: "Los datos no son validos"})
  }
  if(err.name === "CastError"){
    return res.status(400).json({error: "Valido no valido"})
  }
  if(err.code === 11000){
    return res.status(409).json({error: "Valor repetido"})
  }

  console.error("🤯", err.message);
  return res.status(500).json({error: "Error de servidor interno"})

}

module.exports = manejarErrores;