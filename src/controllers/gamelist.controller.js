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
    owner: req.usuario.id,
  };

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
    owner: req.usuario.id,
  };

  const gamelist = await gamelistService.crearGameList(datos);
  res.status(201).json(gamelist);
}

//PUT
async function actualizar(req, res) {
  const gamelist = await gamelistService.actualizar(req.params.id, req.body);
  if (!gamelist) return res.status(404).json({ error: "Gamelist not found" });
  res.json(gamelist);
}

//DELETE
async function eliminar(req, res) {
  const gamelist = await gamelistService.eliminar(req.params.id);
  if (!gamelist) return res.status(404).json({ error: "GameList not found" });
  res.status(204).end();
}

module.exports = {
  listar,
  listarMias,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
};
