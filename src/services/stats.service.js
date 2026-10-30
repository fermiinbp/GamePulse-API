const Game = require("../models/Game");
const GameStat = require("../models/GameStat");
const steam = require("./steam.service");

async function registrarSnapshot(juego) {
    const jugadores = await steam.obtenerJugadores(juego.steamAppId);
    const precio = await steam.obtenerPrecio(juego.steamAppId);

    return GameStat.create({
        gameId: juego._id,
        currentPlayers: jugadores,
        ...precio
    });
}

async function sincronizar() {
    const juegos = await Game.find();
    const errores = [];
    let correctos = 0;

    for (const juego of juegos) {
        try {
            await registrarSnapshot(juego);
            correctos++;
        } catch (err) {
            errores.push({ steamAppId: juego.steamAppId, name: juego.name, error: err.message });
        }
    }

    return { total: juegos.length, correctos, errores };
}

async function historial(gameId, limite = 30) {
    return GameStat.find({ gameId }).sort({ recordedAt: -1 }).limit(limite);
}

async function trending(limite = 5) {
    const resultados = await GameStat.aggregate([
        { $sort: { recordedAt: -1 } },
        { $group: { _id: "$gameId", ultima: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$ultima" } },
        { $sort: { currentPlayers: -1 } },
        { $limit: limite },
        { $lookup: { from: "games", localField: "gameId", foreignField: "_id", as: "juego" } },
        { $unwind: "$juego" }
    ]);

    return resultados.map((r) => ({
        juego: { id: r.juego._id, name: r.juego.name, headerImage: r.juego.headerImage },
        currentPlayers: r.currentPlayers,
        price: r.price,
        discountPercent: r.discountPercent,
        currency: r.currency,
        recordedAt: r.recordedAt
    }));
}

module.exports = { sincronizar, historial, trending };