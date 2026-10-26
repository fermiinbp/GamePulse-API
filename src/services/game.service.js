const mongoose = require("mongoose");
const Game = require("../models/Game.js");

async function listar(genero) {
    const filtro = genero ? { genres: genero } : {};
    return Game.find(filtro)
        .sort({ name: 1 })
        .limit(20);
}

async function buscarPorId(id) {
    return Game.findById(id);
}

async function crear(datos) {
    return Game.create(datos);
}

async function actualizar(id, datos) {
    return Game.findByIdAndUpdate(
        id,
        datos,
        {
            returnDocument: "after",
            runValidators: true
        }
    );
}

async function eliminar(id) {
    return Game.findByIdAndDelete(id);
}

function esIdValido(id) {
    return mongoose.isValidObjectId(id);
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar, esIdValido};