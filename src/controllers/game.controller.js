const gamesService = require("../services/game.service")

// GET /api/games?page=1&limit=10&genero=RPG&buscar=elden&gratis=true&desarrollador=FromSoftware&orden=-releaseDate
async function listar(req, res) {
    // page mínimo 1; limit entre 1 y 50 (10 por defecto)
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const { genero, buscar, gratis, desarrollador, orden } = req.query;

    const { data, total } = await gamesService.listar({ genero, buscar, gratis, desarrollador, orden, page, limit });

    res.json({
        data: data.map(g => g.resumen()),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    });
}

// GET /api/games/genres
async function generos(req, res) {
    res.json(await gamesService.generos());
}

async function obtener(req, res) {
    const game = await gamesService.buscarPorId(req.params.id);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json(game.resumen());
}

async function crear(req, res) {
    const game = await gamesService.crear(req.body);
    res.status(201).json(game.resumen());
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