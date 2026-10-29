const mongoose = require("mongoose");
const User = require("../models/User.js");

async function listar() {
  return User.find();
}

async function buscarPorId(id) {
  return User.findById(id);
}

function esIdValida(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = { listar, buscarPorId, esIdValida };
