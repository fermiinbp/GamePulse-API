const jwt = require("jsonwebtoken");

function autenticarOpcional(req, res, next) {
  const cabecera = req.headers.authorization;

  if (!cabecera) {
    return next();
  }

  if (!cabecera.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no válido" });
  }

  const token = cabecera.split(" ")[1];

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: datos.id,
      role: datos.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token no válido" });
  }
}

module.exports = autenticarOpcional;
