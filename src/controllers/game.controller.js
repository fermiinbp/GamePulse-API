const gamesService = require("../services/game.service");
const statsService = require("../services/stats.service");

async function conUltimaStat(juegos) {
    const ultimas = await statsService.ultimasDe(juegos.map((g) => g._id));
    return juegos.map((g) => ({ ...g.resumen(), ultimaStat: ultimas[g.id] || null }));
}

async function listar(req, res) {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const { genero, buscar, gratis, desarrollador, orden } = req.query;

    const { data, total } = await gamesService.listar({ genero, buscar, gratis, desarrollador, orden, page, limit });

    res.json({
        data: await conUltimaStat(data),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    });
}

async function generos(req, res) {
    res.json(await gamesService.generos());
}

async function obtener(req, res) {
    const game = await gamesService.buscarPorId(req.params.id);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    const [conStat] = await conUltimaStat([game]);
    res.json(conStat);
}

async function crear(req, res) {
    const game = await gamesService.crear(req.body);
    try {
        await statsService.registrarSnapshot(game);
    } catch (err) {
        console.error(`Sin datos de Steam para ${game.name}:`, err.message);
    }
    const [conStat] = await conUltimaStat([game]);
    res.status(201).json(conStat);
}

async function actualizar(req, res) {
    const game = await gamesService.actualizar(req.params.id, req.body);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json(game.resumen());
}

async function eliminar(req, res) {
    const game = await gamesService.eliminar(req.params.id);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.status(204).end();
}

module.exports = {
    listar,
    generos,
    obtener,
    crear,
    actualizar,
    eliminar
};