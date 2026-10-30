const mongoose = require("mongoose");
const User = require("../models/User");
const Game = require("../models/Game");
const GameList = require("../models/GameList");

function construirFiltro({ name, games, owners, isPublic }) {
  const filtro = {};
  if (name) filtro.name = name;
  if (games) filtro.games;
  if (owners) filtro.owners = owners;
  if (isPublic === true) {
    filtro.isPublic = true;
  }
  return filtro;
}

async function listarGameList(filtros, orden, pagina, limite) {
  const filtro = construirFiltro(filtros);
  console.log("Filtro final de MongoDB:", filtro);
  const [gameslists, total] = await Promise.all([
    GameList.find(filtro)
      .populate("owners", "username")
      .sort(orden)
      .skip((pagina - 1) * limite)
      .limit(limite),
    GameList.countDocuments(filtro),
  ]);
  console.log("Total de listas encontradas:", total);
  return { gameslists, total };
}

async function buscarPorId(id) {
  return GameList.findById(id);
}

async function crearGameList(datos) {
  datos.games = await validarJuegos(datos.games);
  return GameList.create(datos);
}

async function addGame(lista, gameId) {
  // Comprobar que el juego existe en la colección Game.
  const [idValidado] = await validarJuegos([gameId]);

  // Comprobar que el juego no está ya en la lista.
  const yaExiste = lista.games.some((game) => game.toString() === idValidado);

  if (yaExiste) {
    const error = new Error("El juego ya está en esta lista");
    error.status = 409;
    throw error;
  }

  // Añadir el juego y guardar los cambios.
  lista.games.push(idValidado);

  await lista.save();

  return lista;
}

async function actualizar(lista, datos) {
  const { name, games, isPublic } = datos;

  if (isPublic !== undefined && typeof isPublic !== "boolean") {
    const error = new Error("isPublic debe ser un valor booleano");
    error.status = 400;
    throw error;
  }

  if (name !== undefined) {
    lista.name = name;
  }

  if (games !== undefined) {
    lista.games = await validarJuegos(games);
  }

  if (isPublic !== undefined && typeof isPublic !== "boolean") {
    lista.isPublic = isPublic;
  }

  await lista.save();

  return lista;
}

async function actualizarOwners(lista, owners) {
  if (!Array.isArray(owners) || owners.length === 0) {
    const error = new Error("Debes proporcionar al menos un propietario");
    error.status = 400;
    throw error;
  }
  const usuarios = await User.find({
    _id: { $in: owners },
  });

  if (usuarios.length !== new Set(owners).size) {
    const error = new Error("Uno o varios usuarios no existen");
    error.status = 400;
    throw error;
  }

  lista.owners = owners;
  await lista.save();
  return lista;
}

async function eliminar(id) {
  return GameList.findByIdAndDelete(id);
}

async function eliminarJuego(lista, gameId) {
  const indice = lista.games.findIndex((game) => game.toString() === gameId);

  if (indice === -1) {
    const error = new Error("El juego no pertenece a esta lista");
    error.status = 404;
    throw error;
  }

  lista.games.splice(indice, 1);

  await lista.save();

  return lista;
}

function esIdValidad(id) {
  return mongoose.isValidObjectId(id);
}

async function validarJuegos(gameIds) {
  if (!Array.isArray(gameIds)) {
    const error = new Error("Los juegos deben ser un array");
    error.status = 400;
    throw error;
  }

  const idsUnicos = [...new Set(gameIds.map((id) => id.toString()))];

  const juegos = await Game.find({
    _id: { $in: idsUnicos },
  }).select("_id");

  if (juegos.length !== idsUnicos.length) {
    const error = new Error("Uno o varios juegos no existen");
    error.status = 400;
    throw error;
  }

  return idsUnicos;
}

module.exports = {
  listarGameList,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
  esIdValidad,
  actualizarOwners,
  eliminarJuego,
  addGame,
};
