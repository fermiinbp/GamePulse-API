const Game = require("../models/Game");
const GameStat = require("../models/GameStat");
const steam = require("./steam.service");

async function registrarSnapshot(juego) {
    const datos = await steam.obtenerDatos(juego.steamAppId);
    return GameStat.create({ gameId: juego._id, ...datos });
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

function iniciarSincronizacionAutomatica(minutos) {
    if (!minutos || minutos <= 0) {
        console.log("Sincronización automática con Steam desactivada");
        return;
    }

    const intervalo = minutos * 60 * 1000;
    let enMarcha = false;

    async function vuelta() {
        if (enMarcha) return;
        enMarcha = true;
        try {
            const ultima = await GameStat.findOne().sort({ recordedAt: -1 });
            if (ultima && Date.now() - ultima.recordedAt < intervalo / 2) {
                return;
            }
            const resultado = await sincronizar();
            console.log(`Steam sincronizado: ${resultado.correctos}/${resultado.total} juegos`);
        } catch (err) {
            console.error("Error sincronizando con Steam:", err.message);
        } finally {
            enMarcha = false;
        }
    }

    vuelta();
    setInterval(vuelta, intervalo);
    console.log(`Sincronización automática con Steam cada ${minutos} min`);
}

async function historial(gameId, limite = 30) {
    return GameStat.find({ gameId }).sort({ recordedAt: -1 }).limit(limite);
}

async function ultimasDe(gameIds) {
    const resultados = await GameStat.aggregate([
        { $match: { gameId: { $in: gameIds } } },
        { $sort: { recordedAt: -1 } },
        { $group: { _id: "$gameId", ultima: { $first: "$$ROOT" } } }
    ]);

    const mapa = {};
    for (const r of resultados) {
        const { currentPlayers, price, discountPercent, currency, source, recordedAt } = r.ultima;
        mapa[r._id.toString()] = { currentPlayers, price, discountPercent, currency, source, recordedAt };
    }
    return mapa;
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
        source: r.source,
        recordedAt: r.recordedAt
    }));
}

module.exports = { registrarSnapshot, sincronizar, iniciarSincronizacionAutomatica, historial, ultimasDe, trending };
