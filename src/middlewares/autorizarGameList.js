const GameList = require("../models/GameList");

async function autorizarGameList(req, res, next) {
  try {
    const lista = await GameList.findById(req.params.id);

    if (!lista) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    if (lista.isPublic) {
      req.gameList = lista;
      return next();
    }

    if (!req.usuario) {
      return res.status(401).json({ error: "Debes iniciar sesión" });
    }

    if (
      !lista.owners.some((owners) => owners.toString() === req.usuario.id) &&
      req.usuario.role !== "ADMIN"
    ) {
      return res.status(403).json({ error: "No tienes permisos" });
    }

    req.gameList = lista;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = autorizarGameList;
