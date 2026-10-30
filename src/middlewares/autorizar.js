function autorizar(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ error: "No tienes permisos" });
    }
    next();
  };
}

module.exports = autorizar;
