const mongoose = require("mongoose");
const User = require("../models/User");
const Game = require("../models/Game");
const GameList = require("../models/GameList");

function construirFiltro({ name, games, owner, isPublic }) {
  const filtro = {};
  if (name) filtro.name = name;
  if (games) filtro.games;
  if (owner) filtro.owner = owner;
  if (isPublic === true) {
    filtro.isPublic = true;
  }
  return filtro;
}

async function listarGameList(filtros, orden, pagina, limite) {
  const filtro = construirFiltro(filtros);
  const [gameslists, total] = await Promise.all([
    GameList.find(filtro)
      .sort(orden)
      .skip((pagina - 1) * limite)
      .limit(limite),
    GameList.countDocuments(filtro),
  ]);

  return { gameslists, total };
}

async function buscarPorId(id) {
  return GameList.findById(id);
}

async function crearGameList(datos) {
  return GameList.create(datos);
}

async function actualizar(id, datos) {
  return GameList.findByIdAndUpdate(id, datos, {
    returnDocument: "after",
    runValidators: true,
  });
}

async function eliminar(id) {
  return GameList.findByIdAndDelete(id);
}

function esIdValidad(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = {
  listarGameList,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
  esIdValidad,
};
