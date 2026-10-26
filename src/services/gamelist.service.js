const mongoose = require("mongoose");
const User = require("../models/User");
const Game = require("../models/Game");
const GameList = require("../models/GameList");

async function listarGameList() {
  return GameList.find();
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
