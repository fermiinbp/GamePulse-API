const User = require("../models/User.js");

async function listar() {
  return User.find();
}

async function buscarPorId(id) {
  return User.findById(id);
}

module.exports = { listar, buscarPorId };
