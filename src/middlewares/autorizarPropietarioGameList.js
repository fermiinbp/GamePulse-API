const GameList = require("../models/GameList");

async function autorizarPropietarioGameList(req, res, next) {
  try {
    const lista = await GameList.findById(req.params.id);

    if (!lista) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    // Los administradores pueden gestionar cualquier lista.
    if (req.usuario.role === "ADMIN") {
      req.gameList = lista;
      return next();
    }

    const esPropietario = lista.owners.some(
      (owner) => owner.toString() === req.usuario.id,
    );

    // Los usuarios normales solo pueden gestionar sus propias listas.
    if (!esPropietario) {
      return res.status(403).json({ error: "No tienes permisos" });
    }

    req.gameList = lista;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = autorizarPropietarioGameList;
