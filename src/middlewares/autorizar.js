function autorizar(...rolesPermitidos) {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ error: "No tienes permisos para esta acción" });
        }
        next();
    };
}

module.exports = autorizar;