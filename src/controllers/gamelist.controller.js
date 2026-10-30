const gamelistService = require("../services/gamelist.service");

const ORDENES = {
  name: { name: 1 },
  games: { games: 1 },
};

async function listar(req, res) {
  const { name, games, orden = "name" } = req.query;
  const pagina = Math.max(parseInt(req.query.page) || 1, 1);
  const limite = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  if (!ORDENES[orden]) {
    return res.status(400).json({
      error: `Orden no valido. Usa: ${Object.keys(ORDENES).join(`, `)}`,
    });
  }
  const filtros = { name, games, isPublic: true };
  const { gameslists, total } = await gamelistService.listarGameList(
    filtros,
    ORDENES[orden],
    pagina,
    limite,
  );

  res.json({
    datos: gameslists.map((p) => p.resumen()),
    paginacion: { total, pagina, limite, paginas: Math.ceil(total / limite) },
  });
}

async function listarMias(req, res) {
  const { name, games, orden = "name" } = req.query;
  const pagina = Math.max(parseInt(req.query.page) || 1, 1);
  const limite = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  if (!ORDENES[orden]) {
    return res.status(400).json({
      error: `Orden no valido. Usa: ${Object.keys(ORDENES).join(", ")}`,
    });
  }

  const filtros = {
    name,
    games,
    owners: req.usuario.id,
  };
  console.log("ID del usuario:", req.usuario.id);
  console.log("Filtros enviados:", filtros);
  const { gameslists, total } = await gamelistService.listarGameList(
    filtros,
    ORDENES[orden],
    pagina,
    limite,
  );

  res.json({
    datos: gameslists.map((p) => p.resumen()),
    paginacion: {
      total,
      pagina,
      limite,
      paginas: Math.ceil(total / limite),
    },
  });
}

async function buscarPorId(req, res) {
  const gamelist = await gamelistService.buscarPorId(req.params.id);
  if (!gamelist) {
    return res.status(404).json({ error: "No encontrado" });
  }
  res.json(gamelist);
}

//CRUD

//POST
async function crearGameList(req, res) {
  const { name, games = [], isPublic = false } = req.body;
  const datos = {
    name,
    games,
    isPublic,
    owners: [req.usuario.id],
  };

  console.log("Usuario autenticado:", req.usuario);
  console.log("Datos de la lista:", datos);

  const gamelist = await gamelistService.crearGameList(datos);
  res.status(201).json(gamelist);
}

async function addGame(req, res, next) {
  try {
    const lista = await gamelistService.addGame(req.gameList, req.body.gameId);

    res.status(200).json({
      mensaje: "Juego añadido correctamente",
      lista,
    });
  } catch (error) {
    next(error);
  }
}

//PUT
/* async function actualizar(req, res) {
  const gamelist = await gamelistService.actualizar(req.params.id, req.body);
  if (!gamelist) return res.status(404).json({ error: "Gamelist not found" });
  res.json(gamelist);
} */

async function actualizar(req, res, next) {
  try {
    const lista = await gamelistService.actualizar(req.gameList, req.body);
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

async function actualizarOwners(req, res, next) {
  try {
    const { owners } = req.body;

    const lista = await gamelistService.actualizarOwners(req.gameList, owners);

    res.json(lista);
  } catch (error) {
    next(error);
  }
}

//DELETE
async function eliminar(req, res, next) {
  try {
    await req.gameList.deleteOne();
    res.json({ mensaje: "Lista eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}

async function eliminarJuego(req, res, next) {
  try {
    const lista = await gamelistService.eliminarJuego(
      req.gameList,
      req.params.gameId,
    );

    res.json({
      mensaje: "Juego eliminado de la lista correctamente",
      lista,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  listarMias,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
  actualizarOwners,
  eliminarJuego,
  addGame,
};
