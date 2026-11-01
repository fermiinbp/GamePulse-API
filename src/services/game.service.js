const Game = require("../models/Game.js");

const ORDENES = ["name", "-name", "releaseDate", "-releaseDate"];

function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listar({ genero, buscar, gratis, desarrollador, orden, page = 1, limit = 10 } = {}) {
    const filtro = {};
    if (genero) filtro.genres = genero;
    if (desarrollador) filtro.developers = desarrollador;
    if (buscar) filtro.name = { $regex: escaparRegex(buscar), $options: "i" };
    if (gratis === "true") filtro.isFree = true;
    if (gratis === "false") filtro.isFree = false;

    const ordenFinal = ORDENES.includes(orden) ? orden : "name";

    const [data, total] = await Promise.all([
        Game.find(filtro)
            .sort(ordenFinal)
            .skip((page - 1) * limit)
            .limit(limit),
        Game.countDocuments(filtro)
    ]);

    return { data, total };
}

async function generos() {
    const lista = await Game.distinct("genres");
    return lista.sort();
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

module.exports = { listar, generos, buscarPorId, crear, actualizar, eliminar };