const gamelistService = require("../services/gamelist.service");

async function listar(req, res) {
  const gamelist = await gamelistService.listarGameList();
  res.status(200).json(gamelist.map((p) => p.resumen()));
}

async function buscarPorId(req, res) {
  const gamelist = await gamelistService.buscarPorId(req.params.id);
  if (!pelicula) {
    return res.status(404).json({ error: "No encontrado" });
  }
  res.json(gamelist);
}

//CRUD

//POST
async function crearGameList(req, res) {
  const gamelist = await gamelistService.crearGameList(req.body);
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
  res.status(204).end;
}

module.exports = { listar, buscarPorId, crearGameList, actualizar, eliminar };
